/* ==========================================================================
   js/checklist-table.js — ② 단원별 체크리스트 표 (+ ⑦ SOLUTION 문구 팝오버)
   --------------------------------------------------------------------------
   · 표 그리기           : renderReportTables()
   · A/B/C 평가 버튼      : selectGradeBtn() → applyGradeState()
   · 진단평가 메모 칸     : A/B/C 버튼 아래 한 줄 입력 (시험 점수 등) → onGradeNoteInput() 등
   · 진행 현황 숫자       : updateStatus()
   · SOLUTION 칸         : 기본값 "-"(공란). 칸에 들어가면 문구 팝오버
                          showMacroPopover() → injectMacro() / setBlankSolution()

   표 안 요소의 id 규칙 (중단원 id 가 "m1-3-1" 일 때)
     m1-3-1-row        표의 한 줄 <tr>
     m1-3-1-content    "주요 내용" 칸
     m1-3-1-solution   "SOLUTION" 칸
     m1-3-1-badge      인쇄·이미지용 A/B/C 배지
     m1-3-1-note       진단평가 메모 칸 (A/B/C 버튼 아래)
     mid1-unit-idx-2   대단원 블록 (학년 + 대단원 순서 0, 1, 2 …)
   다른 파일(storage.js, scope-panel.js 등)도 이 id 로 표 안의 요소를 찾습니다.

   스타일: css/checklist-table.css
   ========================================================================== */

/* ── 표 그리기 ─────────────────────────────────────────────────── */

const BLANK_SOLUTION = "-"; // SOLUTION 칸 기본값 = 공란(해당 없음). 인쇄물에도 "-" 로 나옴
const GRADE_NOTE_MAX = 30; // 진단평가 메모 칸에 쓸 수 있는 최대 글자 수

// 현재 학년(currentGrade)의 대단원마다 제목 탭 + 표를 만들어 #report-table-root 에 넣는다.
// 데이터: js/data/curriculum.js 의 CURRICULUM_DATA
// ⚠️ 다시 그리면 표 안의 입력·평가가 모두 초기화되므로,
//    저장본을 보여 주려면 그 뒤에 applyStateObj() 로 다시 채워야 한다.
function renderReportTables() {
  const root = document.getElementById("report-table-root");
  root.innerHTML = "";
  const currentUnits = CURRICULUM_DATA[currentGrade];

  currentUnits.forEach((unit, idx) => {
    // 대단원 블록 <div> — 단원 설정에서 대단원을 끄면 이 블록이 통째로 숨겨짐
    const blockDiv = document.createElement("div");
    blockDiv.className = `unit-block ${currentGrade}-block-${idx}`;
    blockDiv.id = `${currentGrade}-unit-idx-${idx}`;
    blockDiv.style.setProperty("--unit-color", unitColor(idx));

    let rowsHtml = "";
    unit.sub.forEach((subUnit) => {
      // "주요 내용" 칸의 기본 목록 → <ul><li>…</li></ul>
      let listHtml = `<ul class="content-list">`;
      subUnit.list.forEach((li) => {
        listHtml += `<li>${li}</li>`;
      });
      listHtml += `</ul>`;

      // 중단원 한 줄(tr): [중단원 이름] [주요 내용] [A/B/C 버튼 + 인쇄용 배지 + 메모 칸] [SOLUTION (기본 "-")]
      rowsHtml += `
                  <tr class="check-row" id="${subUnit.id}-row">
                      <td class="text-center" data-label="중단원" style="font-weight:700; width:22%;">${subUnit.name}</td>
                      <td class="content-td" data-label="주요 내용" contenteditable="true" id="${subUnit.id}-content" oninput="saveCurrentState()">${listHtml}</td>
                      <td class="grade-td" data-label="진단평가">
                          <div class="btn-group">
                              <button type="button" class="btn-grade" data-grade="A" onclick="selectGradeBtn(this, 'A', '${subUnit.id}')">A</button>
                              <button type="button" class="btn-grade" data-grade="B" onclick="selectGradeBtn(this, 'B', '${subUnit.id}')">B</button>
                              <button type="button" class="btn-grade" data-grade="C" onclick="selectGradeBtn(this, 'C', '${subUnit.id}')">C</button>
                          </div>
                          <span class="print-only-badge" id="${subUnit.id}-badge">-</span>
                          <div class="grade-note" id="${subUnit.id}-note" contenteditable="true" data-placeholder="점수 등" onkeydown="onGradeNoteKeydown(event)" onbeforeinput="onGradeNoteBeforeInput(event)" onpaste="onGradeNotePaste(event)" oninput="onGradeNoteInput(this, event)"></div>
                      </td>
                      <td class="solution-td" data-label="SOLUTION" contenteditable="true" id="${subUnit.id}-solution" onfocus="onSolutionFocus(this, event)" onblur="onSolutionBlur(this)" oninput="saveCurrentState()">${BLANK_SOLUTION}</td>
                  </tr>
              `;
    });

    // 대단원 제목 탭 + 표 (머리글 + 위에서 만든 줄들)
    blockDiv.innerHTML = `
              <div class="table-title">${unit.title}</div>
              <table class="checklist-table">
                  <thead>
                      <tr><th>중단원</th><th>주요 내용 <span class="editable-tag">수정 가능</span></th><th>진단평가</th><th>SOLUTION <span class="editable-tag">수정 가능</span></th></tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
              </table>
          `;
    root.appendChild(blockDiv);
  });

  // 켜 둔 단원이 하나도 없을 때 표 대신 보이는 안내 (updateStatus 가 보이기/숨기기, 인쇄·이미지에는 안 나옴)
  const hint = document.createElement("div");
  hint.id = "scope-empty-hint";
  hint.className = "table-message no-print";
  hint.hidden = true;
  hint.innerHTML =
    "<b>단원 설정</b>에서 이번 시험 범위의 단원을 체크하면<br>체크리스트 표가 나타납니다.";
  root.appendChild(hint);
}

/* ── A / B / C 평가 ─────────────────────────────────────────────── */

// 한 줄(row)을 grade("A" | "B" | "C") 평가로 표시한다.
//   · 줄 배경색 클래스(grade-a/b/c) 교체
//   · 누른 버튼만 선택 색으로
//   · 인쇄·이미지용 배지에 글자와 색 넣기
// (options 는 지금 쓰이지 않음. SOLUTION 칸은 평가와 상관없이 건드리지 않는다)
function applyGradeState(row, grade, options = {}) {
  const meta = GRADE_META[grade];
  if (!row || !meta) return;
  const btnGroup = row.querySelector(".btn-group");
  const printBadge = row.querySelector(".print-only-badge");

  row.classList.remove("grade-a", "grade-b", "grade-c");
  row.classList.add(meta.rowClass);
  btnGroup
    .querySelectorAll(".btn-grade")
    .forEach((s) =>
      s.classList.remove("active-a", "active-b", "active-c"),
    );
  const targetBtn =
    btnGroup.querySelector(`[data-grade="${grade}"]`) ||
    btnGroup.querySelector(
      `.btn-grade:nth-child(${grade === "A" ? 1 : grade === "B" ? 2 : 3})`,
    );
  if (targetBtn) targetBtn.classList.add(meta.className);

  // SOLUTION 칸은 진단평가와 독립적인 자유 입력란 — 등급 선택 시 건드리지 않는다.
  printBadge.innerHTML = grade;
  printBadge.style.cssText = meta.style;
}

// A/B/C 버튼 클릭 (renderReportTables 가 만든 버튼의 onclick)
// (subUnitId 는 지금 쓰이지 않음)
function selectGradeBtn(btn, grade, subUnitId) {
  const btnGroup = btn.parentElement;
  const row = btnGroup.closest("tr");
  applyGradeState(row, grade);
  saveCurrentState();
  updateStatus();
}

// 한 줄(row)에서 선택된 평가를 읽는다: "A" | "B" | "C" | 아직 안 골랐으면 "-"
function getActiveGrade(row) {
  if (row.querySelector(".active-a")) return "A";
  if (row.querySelector(".active-b")) return "B";
  if (row.querySelector(".active-c")) return "C";
  return "-";
}

/* ── 진단평가 메모 칸 (A/B/C 버튼 아래 · 시험 점수 등 한 줄) ─────────
   · 비어 있으면 흐린 "점수 등" 안내 글자가 보이고, 인쇄 · 이미지에는 적은 글자만 나옵니다.
   · 줄바꿈 없이 한 줄, 최대 GRADE_NOTE_MAX 글자. 입력하면 자동 저장 (gradeNotes)
   · 모양: css/checklist-table.css 의 .grade-note
   ─────────────────────────────────────────────────────────── */

// Enter 를 누르면 줄을 바꾸지 않고 입력을 마친다 (한글 조합 중에 누른 Enter 는 조합부터 끝내게 둠)
function onGradeNoteKeydown(event) {
  if ((event.key === "Enter" || event.keyCode === 13) && !event.isComposing) {
    event.preventDefault();
    event.target.blur();
  }
}

// 어떤 방법으로든 줄바꿈이 들어가려 하면 막는다 (한글 조합 중 Enter 등 keydown 으로 못 막는 경우)
function onGradeNoteBeforeInput(event) {
  if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") {
    event.preventDefault();
  }
}

// 붙여넣기는 서식 없이 글자만 (줄바꿈은 띄어쓰기로)
function onGradeNotePaste(event) {
  event.preventDefault();
  const text = (event.clipboardData ? event.clipboardData.getData("text/plain") : "").replace(/\s+/g, " ");
  document.execCommand("insertText", false, text);
}

// 입력할 때마다: 너무 길면 자르고, 다 지웠으면 칸을 완전히 비운 뒤(안내 글자가 다시 보이게) 자동 저장
// (한글 조합 중에는 자르지 않고 조합이 끝난 뒤에 확인)
function onGradeNoteInput(el, event) {
  if (!(event && event.isComposing)) {
    if (el.textContent.length > GRADE_NOTE_MAX) {
      el.textContent = el.textContent.slice(0, GRADE_NOTE_MAX);
      placeCaretAtEnd(el);
    }
    if (!el.textContent.trim()) el.innerHTML = "";
  }
  saveCurrentState();
}

// 메모 칸의 글자 (저장용: 공백 정리)
function readGradeNote(el) {
  return el.textContent.replace(/\s+/g, " ").trim();
}

// 입력 칸(el)의 커서를 글자 맨 끝으로 옮긴다
function placeCaretAtEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/* ── 진행 현황 표시 ─────────────────────────────────────────────── */

// 오른쪽 위 "평가 3/20개 완료 · A 1 / B 1 / C 1" 과
// 사이드바 "표시 단원 5/7" 숫자를 다시 계산한다. (숨긴 줄·단원은 세지 않음)
function updateStatus() {
  const rows = Array.from(document.querySelectorAll(".check-row"));
  const visibleRows = rows.filter((row) => row.style.display !== "none");
  const gradedRows = visibleRows.filter((row) =>
    row.querySelector(".active-a, .active-b, .active-c"),
  );
  const countA = visibleRows.filter((row) =>
    row.querySelector(".active-a"),
  ).length;
  const countB = visibleRows.filter((row) =>
    row.querySelector(".active-b"),
  ).length;
  const countC = visibleRows.filter((row) =>
    row.querySelector(".active-c"),
  ).length;
  const visibleGroups = Array.from(
    document.querySelectorAll(".group-header-checkbox"),
  ).filter((cb) => cb.checked).length;
  const totalGroups = document.querySelectorAll(
    ".group-header-checkbox",
  ).length;
  const reportStatus = document.getElementById("report-status");
  const scopeStatus = document.getElementById("scope-status");

  if (reportStatus)
    reportStatus.textContent = `평가 ${gradedRows.length}/${visibleRows.length}개 완료 · A ${countA} / B ${countB} / C ${countC}`;
  if (scopeStatus)
    scopeStatus.textContent = `표시 단원 ${visibleGroups}/${totalGroups}`;

  // 표는 그려져 있는데 켜 둔 단원이 하나도 없으면 안내 문구를 보여 준다
  const hint = document.getElementById("scope-empty-hint");
  if (hint) hint.hidden = !(rows.length && !visibleRows.length);
}

/* ── ⑦ SOLUTION 칸 & 문구 팝오버 ────────────────────────────────
   · SOLUTION 칸은 기본값이 "-"(공란)입니다. 그대로 두면 인쇄물에도 "-" 로 나옵니다.
   · 칸에 커서가 들어가면(onfocus) 칸 바로 아래에 자주 쓰는 문구 목록이 뜹니다.
     "-" 인 칸은 글자가 전체 선택되어, 바로 타이핑하면 "-" 가 새 글자로 바뀝니다.
   · 칸을 다 지우고 나가면(onblur) 다시 "-" 로 채웁니다.
   문구 버튼 목록은 index.html 의 #solution-macro-popover 에서 고칠 수 있습니다.
   ─────────────────────────────────────────────────────────── */

// 지금 문구를 넣을 대상 SOLUTION 칸 (팝오버를 띄울 때 기억해 둠)
let targetSolutionCell = null;

// SOLUTION 칸에 들어갔을 때: 팝오버를 띄우고, 공란("-")이면 글자를 전체 선택
function onSolutionFocus(cell, event) {
  showMacroPopover(cell, event);
  selectBlankSolution(cell);
  // 마우스로 클릭해 들어온 경우 버튼을 뗄 때 브라우저가 커서를 다시 놓을 수 있어서, 뗀 뒤에 한 번 더
  cell.addEventListener("mouseup", () => selectBlankSolution(cell), { once: true });
}

// 칸이 공란("-")이면 글자 전체를 선택한다 (브라우저가 커서를 놓은 "뒤에" 하도록 한 박자 늦춤)
function selectBlankSolution(cell) {
  setTimeout(() => {
    if (document.activeElement !== cell || getTextFromElement(cell) !== BLANK_SOLUTION) return;
    const range = document.createRange();
    range.selectNodeContents(cell);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, 0);
}

// SOLUTION 칸에서 나갈 때: 글자를 다 지웠으면 다시 공란("-")으로 채우고 저장
function onSolutionBlur(cell) {
  if (getTextFromElement(cell) !== "") return;
  cell.innerHTML = BLANK_SOLUTION;
  saveCurrentState();
}

// SOLUTION 칸(cell) 바로 아래에 팝오버를 띄운다.
function showMacroPopover(cell, event) {
  targetSolutionCell = cell;
  const popover = document.getElementById("solution-macro-popover");
  const rect = cell.getBoundingClientRect();
  popover.style.top = rect.bottom + window.scrollY + "px";
  popover.style.left = rect.left + window.scrollX + "px";
  popover.style.display = "flex";
  event.stopPropagation();
}

// 팝오버를 닫는다.
function hideMacroPopover() {
  document.getElementById("solution-macro-popover").style.display =
    "none";
}

// 팝오버나 SOLUTION 칸 "바깥"을 클릭하면 팝오버를 닫는다.
document.addEventListener("click", function (e) {
  if (
    !e.target.closest("#solution-macro-popover") &&
    !e.target.closest(".solution-td")
  ) {
    hideMacroPopover();
  }
});

// "➖ 공란 (해당 없음)" 버튼: SOLUTION 을 기본값 "-" 로 되돌린다.
// ("-" 는 일부러 비워 둔 값이라, 출력 전 검사에서 입력한 것으로 친다)
function setBlankSolution() {
  if (targetSolutionCell) {
    targetSolutionCell.innerHTML = BLANK_SOLUTION;
    targetSolutionCell.className = "solution-td";
    saveCurrentState();
    updateStatus();
    hideMacroPopover();
  }
}

// 문구 버튼 (index.html 의 injectMacro('문구', false))
// SOLUTION 칸이 비어 있거나 "-" 면 문구로 바꾸고, 이미 내용이 있으면 " + 문구" 로 이어 붙인다.
// isDangerColor 가 true 면 빨간 글씨(.sol-c) — 지금은 모든 버튼이 false 로 호출한다.
function injectMacro(text, isDangerColor) {
  if (targetSolutionCell) {
    let currentText = targetSolutionCell.innerText.trim();

    if (currentText === BLANK_SOLUTION || currentText === "") {
      targetSolutionCell.innerHTML = text;
    } else {
      targetSolutionCell.innerHTML = currentText + " + " + text;
    }

    if (isDangerColor || targetSolutionCell.classList.contains("sol-c")) {
      targetSolutionCell.className = "solution-td sol-c";
    }

    saveCurrentState();
    updateStatus();
    hideMacroPopover(); // 항목 하나 선택하면 팝오버 자동 닫기
  }
}
