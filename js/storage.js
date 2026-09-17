/* ==========================================================================
   js/storage.js — 💾 체크리스트 자동 저장 / 불러오기
   --------------------------------------------------------------------------
   학생 한 명 · 시험 하나마다 체크리스트가 저장소(Firebase)에 하나씩 저장됩니다.
   (저장소: js/db/db.js 의 DB → Firebase 는 js/db/firebase-db.js)

   저장 흐름
     입력 · 클릭 → saveCurrentState() → scheduleSave()  (SAVE_DELAY_MS 만큼 기다림)
               → persistCurrentReport() → buildStateObj() 로 화면 내용을 모아 DB.saveReport()
     · 마지막으로 저장한 내용과 똑같으면 다시 보내지 않습니다.
     · 저장 요청은 겹치지 않게 한 번에 하나씩 차례로 보냅니다.
     · 인터넷 문제로 실패하면 5초 뒤 다시 시도합니다.
     · 저장하지 못한 내용이 있는데 창을 닫으려 하면 경고창을 띄웁니다.

   불러오기 흐름 (js/student-list.js 의 openChecklist)
     fetchReport() → 표를 새로 그림 → applyStateObj() 로 버튼·체크박스·입력칸에 채움
   ========================================================================== */

let saveTimer = null; // 자동 저장 대기 타이머
let savingChain = Promise.resolve(); // 저장 요청을 한 줄로 세우는 줄
let lastSavedJson = null; // 저장소에 저장돼 있는 내용(JSON 글자). 화면 내용과 같으면 저장할 필요 없음
let lastSavedAt = null; // 마지막으로 저장된 시각 (밀리초)
let isLoadingReport = false; // 체크리스트를 불러오는 동안에는 저장하지 않음

const RETRY_DELAY_MS = 5000; // 저장 실패 후 다시 시도할 때까지 기다리는 시간

/* ── 화면 내용 ↔ 저장용 객체 ───────────────────────────────────── */

// 지금 화면의 체크리스트 내용을 저장용 객체로 만든다.
// 반환 예)
//   {
//     opinion: "<종합 의견 HTML>",
//     customEdits:     { "m1-2-1_content": "<주요 내용 HTML>", "m1-2-1_sol": "<SOLUTION HTML>" },
//     activeGrades:    { "m1-2-1": "A", "m1-2-2": "C" },     ← 평가한 줄만 들어감
//     scopeSelections: { "m1-2-1": true, "m1-2-2": false },  ← 단원 설정 체크 상태
//     gradeNotes:      { "m1-2-1": "18/20" },                ← 진단평가 메모를 적은 줄만 들어감
//   }
// (학생 이름·학교·학년·시험은 DB.saveReport 가 명단 정보로 함께 저장합니다)
function buildStateObj() {
  const stateObj = {
    opinion: document.getElementById("opinion-textarea").innerHTML,
    customEdits: {},
    activeGrades: {},
    scopeSelections: {},
    gradeNotes: {},
  };
  document.querySelectorAll(".sub-scope-checkbox").forEach((cb) => {
    stateObj.scopeSelections[cb.getAttribute("data-target")] = cb.checked;
  });
  (CURRICULUM_DATA[currentGrade] || []).forEach((unit) => {
    unit.sub.forEach((s) => {
      const contentEl = document.getElementById(`${s.id}-content`);
      const solEl = document.getElementById(`${s.id}-solution`);
      const noteEl = document.getElementById(`${s.id}-note`);
      if (contentEl)
        stateObj.customEdits[s.id + "_content"] = contentEl.innerHTML;
      if (solEl) stateObj.customEdits[s.id + "_sol"] = solEl.innerHTML;
      const note = noteEl ? readGradeNote(noteEl) : "";
      if (note) stateObj.gradeNotes[s.id] = note;
      const row = document.getElementById(`${s.id}-row`);
      if (row) {
        if (row.querySelector(".active-a"))
          stateObj.activeGrades[s.id] = "A";
        else if (row.querySelector(".active-b"))
          stateObj.activeGrades[s.id] = "B";
        else if (row.querySelector(".active-c"))
          stateObj.activeGrades[s.id] = "C";
      }
    });
  });
  return stateObj;
}

// 저장된 내용(state)을 지금 그려진 표에 채워 넣는다.
// ⚠️ 부르기 전에 그 학년의 표가 이미 그려져 있어야 한다 (renderReportTables).
// 저장된 HTML 은 sanitizeHtml(js/utils.js)로 정리한 뒤 넣는다.
function applyStateObj(state) {
  document.getElementById("opinion-textarea").innerHTML = state.opinion
    ? sanitizeHtml(state.opinion)
    : DEFAULT_OPINION;
  restoreScopeSelections(state.scopeSelections || {});

  const edits = state.customEdits || {};
  const grades = state.activeGrades || {};
  const notes = state.gradeNotes || {};
  (CURRICULUM_DATA[currentGrade] || []).forEach((unit) => {
    unit.sub.forEach((s) => {
      const contentEl = document.getElementById(`${s.id}-content`);
      if (contentEl && edits[s.id + "_content"]) {
        contentEl.innerHTML = sanitizeHtml(edits[s.id + "_content"]);
      }
      // SOLUTION: 저장된 글자가 없으면(빈 칸) 기본값 "-"(공란)를 그대로 둔다
      const solEl = document.getElementById(`${s.id}-solution`);
      if (solEl && htmlHasText(edits[s.id + "_sol"])) {
        solEl.innerHTML = sanitizeHtml(edits[s.id + "_sol"]);
      }
      const noteEl = document.getElementById(`${s.id}-note`);
      if (noteEl) noteEl.textContent = typeof notes[s.id] === "string" ? notes[s.id] : "";
      const row = document.getElementById(`${s.id}-row`);
      if (row && grades[s.id]) applyGradeState(row, grades[s.id]);
    });
  });
  updateStatus();
}

/* ── 저장소에서 불러오기 ───────────────────────────────────────── */

// 학생 한 명 · 시험 하나의 체크리스트를 받아 온다 → 내용 (한 번도 저장된 적 없으면 null)
function fetchReport(student, exam) {
  return DB.getReport(student, exam);
}

// 방금 불러온 화면 내용을 "저장소와 같은 상태"로 기억한다 (이후 바뀐 내용만 저장하려고).
function markAsSaved(updatedAt) {
  lastSavedJson = JSON.stringify(buildStateObj());
  lastSavedAt = updatedAt || null;
  setSaveState(lastSavedAt ? "saved" : "idle", lastSavedAt);
}

// 지금 화면 내용이 저장소에 아직 없다고 표시한다 (예전 브라우저 저장본을 가져왔을 때 바로 저장하려고).
function markAsUnsaved() {
  lastSavedJson = null;
}

/* ── 자동 저장 ─────────────────────────────────────────────────── */

// 입력칸·버튼 등에서 부르는 저장 함수 (index.html 의 oninput 등). 실제로는 저장을 "예약"만 한다.
function saveCurrentState() {
  scheduleSave();
}

// SAVE_DELAY_MS 뒤에 저장하도록 예약한다.
// 그 사이에 또 입력하면 예약을 취소하고 다시 기다린다 (연속 입력은 마지막에 한 번만 저장).
function scheduleSave(delay = SAVE_DELAY_MS) {
  if (!currentStudent || !currentExam || isLoadingReport) return;
  if (saveTimer) clearTimeout(saveTimer);
  setSaveState("saving");
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistCurrentReport();
  }, delay);
}

// 예약을 기다리지 않고 바로 저장한다. 학생·시험을 바꾸거나 로그아웃하기 전에 부른다.
// 저장에 성공했거나 저장할 내용이 없으면 true, 실패하면 false 를 돌려주는 Promise.
function flushSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  return persistCurrentReport();
}

// 저장을 줄 세워 실행한다 (앞의 저장이 끝난 뒤에 다음 저장).
function persistCurrentReport() {
  savingChain = savingChain.then(saveNow, saveNow);
  return savingChain;
}

// 실제 저장: 저장소와 다른 내용이 있으면 DB.saveReport
async function saveNow() {
  if (!currentStudent || !currentExam || isLoadingReport) return true;
  const student = currentStudent;
  const exam = currentExam;
  const data = buildStateObj();
  const json = JSON.stringify(data);
  if (json === lastSavedJson) {
    if (!saveTimer) setSaveState(lastSavedAt ? "saved" : "idle", lastSavedAt);
    return true;
  }
  try {
    const updatedAt = await DB.saveReport(student, exam, data);
    if (currentStudent === student && currentExam === exam) {
      lastSavedJson = json;
      lastSavedAt = updatedAt;
      if (!saveTimer) setSaveState("saved", updatedAt);
    }
    updateStudentSummary(student.id, exam, data.activeGrades, updatedAt);
    return true;
  } catch (error) {
    console.warn("자동 저장 실패", error);
    if (currentStudent === student && currentExam === exam) {
      setSaveState("error");
      // 인터넷 문제면 잠시 뒤 다시 시도. 권한·내용 문제는 다시 해도 같으므로 시도하지 않고 알림
      if (error.retryable) {
        if (!saveTimer) {
          scheduleSave(RETRY_DELAY_MS);
          setSaveState("error");
        }
      } else {
        showToast(`저장하지 못했습니다: ${error.message}`);
      }
    }
    return false;
  }
}

// 창을 닫거나 새로고침할 때 저장하지 못한 내용이 있으면: 바로 저장을 시도하고 경고창을 띄운다.
// (경고창에서 "취소"를 누르고 머무르면 그사이 저장이 끝납니다)
// 빈 체크리스트는 저장되지 않으므로, 작성한 내용이 있으면 경고창만 띄운다.
window.addEventListener("beforeunload", (event) => {
  if (isBlankChecklist) {
    if (hasBlankEdits({ includeHeader: true })) {
      event.preventDefault();
      event.returnValue = "";
    }
    return;
  }
  if (!currentStudent || !currentExam || isLoadingReport) return;
  if (JSON.stringify(buildStateObj()) === lastSavedJson) return;
  flushSave();
  event.preventDefault();
  event.returnValue = "";
});
