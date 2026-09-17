/* ==========================================================================
   js/checklist-table.js — ② 단원별 체크리스트 표 (+ ⑦ SOLUTION 문구 팝오버)
   --------------------------------------------------------------------------
   · 표 그리기           : renderReportTables()
   · 진단평가 방식       : 대단원마다 "간단히"(기본) ↔ "자세히" 스위치
                          간단히 = 대단원 하나에 진단평가 · SOLUTION 1개 (오른쪽 두 칸을 세로로 합침)
                          자세히 = 중단원 줄마다 진단평가 · SOLUTION
                          setUnitDetail() · setAllDetail() → layoutUnitEval()
   · A/B/C 평가 버튼      : selectGradeBtn() → applyGradeState()
   · 진단평가 메모 칸     : A/B/C 버튼 아래 한 줄 입력 (시험 점수 등) → onGradeNoteInput() 등
   · 진행 현황 숫자       : updateStatus()  (평가할 항목 목록: getEvalItems())
   · SOLUTION 칸         : 기본값 "-"(공란). 칸에 들어가면 문구 팝오버
                          showMacroPopover() → injectMacro() / setBlankSolution()

   표 안 요소의 id 규칙
     중단원 id 가 "m1-3-1" 일 때 (자세히)
       m1-3-1-row        표의 한 줄 <tr>
       m1-3-1-content    "주요 내용" 칸
       m1-3-1-grade      "진단평가" 칸 (A/B/C 버튼 + 배지 + 메모 칸이 들어 있음)
       m1-3-1-solution   "SOLUTION" 칸
       m1-3-1-badge      인쇄·이미지용 A/B/C 배지
       m1-3-1-note       진단평가 메모 칸 (A/B/C 버튼 아래)
     대단원 id 가 "m1-3" 일 때 (간단히 — 대단원 하나에 1개)
       m1-3-grade · m1-3-solution · m1-3-badge · m1-3-note   (-row · -content 는 없음)
     mid1-unit-idx-2   대단원 블록 (학년 + 대단원 순서 0, 1, 2 …), data-unit="m1-3"
   다른 파일(storage.js, scope-panel.js 등)도 이 id 로 표 안의 요소를 찾습니다.

   스타일: css/checklist-table.css
   ========================================================================== */

/* ── 표 그리기 ─────────────────────────────────────────────────── */

const BLANK_SOLUTION = "-"; // SOLUTION 칸 기본값 = 공란(해당 없음). 인쇄물에도 "-" 로 나옴
const GRADE_NOTE_MAX = 30; // 진단평가 메모 칸에 쓸 수 있는 최대 글자 수
const DETAIL_DEFAULT = false; // 새 체크리스트의 진단평가 방식: false = 대단원별 1개(간단히), true = 중단원별(자세히)

// 현재 학년(currentGrade)의 대단원마다 제목 탭 + 표를 만들어 #report-table-root 에 넣는다.
// 데이터: js/data/curriculum.js 의 CURRICULUM_DATA
// ⚠️ 다시 그리면 표 안의 입력·평가가 모두 초기화되므로,
//    저장본을 보여 주려면 그 뒤에 applyStateObj() 로 다시 채워야 한다.
function renderReportTables() {
  const root = document.getElementById("report-table-root");
  root.innerHTML = "";
  const currentUnits = CURRICULUM_DATA[currentGrade];

  currentUnits.forEach((unit, idx) => {
    const unitKey = unitKeyOf(unit, idx);

    // 대단원 블록 <div> — 단원 설정에서 대단원을 끄면 이 블록이 통째로 숨겨짐
    // "자세히"로 보고 있으면 is-detail 클래스가 붙음
    const blockDiv = document.createElement("div");
    blockDiv.className = `unit-block ${currentGrade}-block-${idx}`;
    blockDiv.classList.toggle("is-detail", DETAIL_DEFAULT);
    blockDiv.id = `${currentGrade}-unit-idx-${idx}`;
    blockDiv.dataset.unit = unitKey;
    blockDiv.style.setProperty("--unit-color", unitColor(idx));

    let rowsHtml = "";
    unit.sub.forEach((subUnit) => {
      // "주요 내용" 칸의 기본 목록 → <ul><li>…</li></ul>
      let listHtml = `<ul class="content-list">`;
      subUnit.list.forEach((li) => {
        listHtml += `<li>${li}</li>`;
      });
      listHtml += `</ul>`;

      // 중단원 한 줄(tr): [중단원 이름] [주요 내용] [진단평가 (자세히)] [SOLUTION (자세히)]
      rowsHtml += `
                  <tr class="check-row" id="${subUnit.id}-row">
                      <td class="text-center" data-label="중단원" style="font-weight:700; width:22%;">${subUnit.name}</td>
                      <td class="content-td" data-label="주요 내용" contenteditable="true" id="${subUnit.id}-content" oninput="saveCurrentState()">${listHtml}</td>
                      ${gradeCellHtml(subUnit.id, "sub-eval", "진단평가")}
                      ${solutionCellHtml(subUnit.id, "sub-eval", "SOLUTION")}
                  </tr>
              `;
    });

    // 대단원 평가 칸 2개 (간단히). 처음에는 표 맨 아래 숨긴 줄에 두고,
    // layoutUnitEval() 이 첫 번째 보이는 줄로 옮겨 세로로 합친다 (모바일에서는 이 줄에 그대로 = 카드 한 장)
    rowsHtml += `
                  <tr class="unit-eval-row" style="display: none;">
                      ${gradeCellHtml(unitKey, "unit-eval", "대단원 진단평가")}
                      ${solutionCellHtml(unitKey, "unit-eval", "대단원 SOLUTION")}
                  </tr>
              `;

    // 대단원 제목 탭 + "진단평가 자세히" 스위치(화면에서만) + 표 (머리글 + 위에서 만든 줄들)
    blockDiv.innerHTML = `
              <div class="unit-title-row">
                  <div class="table-title">${unit.title}</div>
                  <label class="detail-toggle no-print" title="켜면 중단원마다 진단평가 · SOLUTION 을 따로 적어요">
                      <input type="checkbox" class="detail-toggle-input" onchange="setUnitDetail('${unitKey}', this.checked)"${DETAIL_DEFAULT ? " checked" : ""}>
                      <span class="detail-toggle-switch" aria-hidden="true"></span>
                      <span class="detail-toggle-text">진단평가 자세히</span>
                  </label>
              </div>
              <table class="checklist-table">
                  <thead>
                      <tr><th>중단원</th><th>주요 내용 <span class="editable-tag">수정 가능</span></th><th>진단평가</th><th>SOLUTION <span class="editable-tag">수정 가능</span></th></tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
              </table>
          `;
    root.appendChild(blockDiv);
    layoutUnitEval(blockDiv);
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

// 진단평가 칸 <td> 하나: [A/B/C 버튼] [인쇄·이미지용 배지] [메모 칸]
//   key: 중단원 id(자세히) 또는 대단원 id(간단히) · kind: "sub-eval" | "unit-eval" · label: 모바일 카드의 칸 이름
function gradeCellHtml(key, kind, label) {
  return `<td class="grade-td ${kind}" data-label="${label}" id="${key}-grade">
                          <div class="btn-group">
                              <button type="button" class="btn-grade" data-grade="A" onclick="selectGradeBtn(this, 'A', '${key}')">A</button>
                              <button type="button" class="btn-grade" data-grade="B" onclick="selectGradeBtn(this, 'B', '${key}')">B</button>
                              <button type="button" class="btn-grade" data-grade="C" onclick="selectGradeBtn(this, 'C', '${key}')">C</button>
                          </div>
                          <span class="print-only-badge" id="${key}-badge">-</span>
                          <div class="grade-note" id="${key}-note" contenteditable="true" data-placeholder="코멘트" onkeydown="onGradeNoteKeydown(event)" onbeforeinput="onGradeNoteBeforeInput(event)" onpaste="onGradeNotePaste(event)" oninput="onGradeNoteInput(this, event)"></div>
                      </td>`;
}

// SOLUTION 칸 <td> 하나 (기본값 "-"). key · kind · label 은 gradeCellHtml 과 같음
function solutionCellHtml(key, kind, label) {
  return `<td class="solution-td ${kind}" data-label="${label}" contenteditable="true" id="${key}-solution" onfocus="onSolutionFocus(this, event)" onblur="onSolutionBlur(this)" oninput="saveCurrentState()">${BLANK_SOLUTION}</td>`;
}

// 대단원의 id (저장할 때 쓰는 열쇠).  예) unitKeyOf({ id: "m2-1", … }, 0) → "m2-1"
// curriculum.js 에 대단원 id 가 없으면 "학년-u순서" (예: "mid2-u1") 로 대신한다.
function unitKeyOf(unit, idx, grade = currentGrade) {
  return unit.id || `${grade}-u${idx + 1}`;
}

/* ── 진단평가 방식: 간단히(대단원별 1개) ↔ 자세히(중단원별) ─────────────
   · 기본은 간단히 (DETAIL_DEFAULT). 대단원 제목 오른쪽 "진단평가 자세히" 스위치로 대단원마다 바꾸고,
     단원 설정 패널의 [모두 자세히] [모두 간단히] 버튼으로 한꺼번에 바꿉니다.
   · 어느 쪽으로 보고 있는지는 체크리스트와 함께 저장됩니다 (storage.js 의 detailUnits).
   · 다른 방식에 적어 둔 평가·SOLUTION 은 지워지지 않고 숨겨지기만 합니다 (다시 바꾸면 그대로 보임).
   · 인쇄 · 이미지에는 스위치가 나오지 않고, 지금 보고 있는 방식의 칸만 나옵니다.
   ─────────────────────────────────────────────────────────── */

// 폭 860px 이하 화면(모바일 카드 모양)인지. 인쇄는 "print" 라서 여기에 해당하지 않음 (항상 표 모양)
const CARD_LAYOUT_QUERY = window.matchMedia("screen and (max-width: 860px)");
let isPrintingReport = false; // 인쇄 창을 준비하는 동안 true (그동안은 무조건 표 모양으로 배치)

// 대단원 하나(unitKey)를 자세히(on = true) / 간단히(false)로 바꾼다.
// save: false 면 저장·진행 현황 갱신을 하지 않음 (저장본을 불러올 때)
function setUnitDetail(unitKey, on, { save = true } = {}) {
  const block = document.querySelector(`.unit-block[data-unit="${unitKey}"]`);
  if (!block) return;
  block.classList.toggle("is-detail", Boolean(on));
  const toggle = block.querySelector(".detail-toggle-input");
  if (toggle) toggle.checked = Boolean(on);
  layoutUnitEval(block);
  if (save) {
    saveCurrentState();
    updateStatus();
  }
}

// [모두 자세히](true) / [모두 간단히](false) 버튼 (index.html 의 단원 설정 패널)
function setAllDetail(on) {
  document.querySelectorAll(".unit-block").forEach((block) => {
    setUnitDetail(block.dataset.unit, on, { save: false });
  });
  saveCurrentState();
  updateStatus();
}

// 대단원 평가 칸(간단히용 두 칸)을 알맞은 자리로 옮긴다.
//   · 간단히 + 넓은 화면 · 인쇄 : 첫 번째 "보이는" 중단원 줄 끝에 붙이고, 아래 줄까지 세로로 합침(rowSpan)
//   · 간단히 + 모바일          : 표 맨 아래 따로 된 줄(.unit-eval-row)에 둠 → 중단원 카드들 아래 카드 한 장
//   · 자세히                  : 맨 아래 줄에 넣고 그 줄을 숨김
// 단원 설정에서 줄을 켜고 끌 때 · 방식을 바꿀 때 · 화면 폭이 바뀔 때마다 불러야 한다 (layoutAllUnitEval).
function layoutUnitEval(block) {
  const gradeCell = block.querySelector(".grade-td.unit-eval");
  const solutionCell = block.querySelector(".solution-td.unit-eval");
  const evalRow = block.querySelector(".unit-eval-row");
  if (!gradeCell || !solutionCell || !evalRow) return;
  const rows = Array.from(block.querySelectorAll(".check-row"));
  const firstVisible = rows.find((row) => row.style.display !== "none");
  const simple = !block.classList.contains("is-detail") && Boolean(firstVisible);
  const merge = simple && (isPrintingReport || !CARD_LAYOUT_QUERY.matches);

  const target = merge ? firstVisible : evalRow;
  if (gradeCell.parentElement !== target) target.append(gradeCell, solutionCell);
  // 합칠 줄 수 = 첫 번째 보이는 줄부터 마지막 줄까지 (중간의 숨긴 줄은 브라우저가 알아서 건너뜀)
  const span = merge ? rows.length - rows.indexOf(firstVisible) : 1;
  gradeCell.rowSpan = span;
  solutionCell.rowSpan = span;
  evalRow.style.display = simple && !merge ? "" : "none";
}

// 표 전체의 대단원 평가 칸 자리를 다시 맞춘다.
function layoutAllUnitEval() {
  document.querySelectorAll(".unit-block").forEach(layoutUnitEval);
}

// 화면 폭이 모바일 ↔ PC 로 바뀌거나, 인쇄를 시작 · 끝낼 때 자리를 다시 맞춘다.
CARD_LAYOUT_QUERY.addEventListener("change", layoutAllUnitEval);
window.addEventListener("beforeprint", () => {
  isPrintingReport = true;
  layoutAllUnitEval();
});
window.addEventListener("afterprint", () => {
  isPrintingReport = false;
  layoutAllUnitEval();
});

// 단원 설정 패널의 [모두 자세히] [모두 간단히] 버튼 중 지금 상태에 맞는 버튼을 강조한다 (updateStatus 에서 호출)
function updateDetailControls() {
  const blocks = Array.from(document.querySelectorAll(".unit-block"));
  const detailCount = blocks.filter((b) => b.classList.contains("is-detail")).length;
  const allOn = document.getElementById("detail-all-on");
  const allOff = document.getElementById("detail-all-off");
  if (allOn) allOn.classList.toggle("is-active", blocks.length > 0 && detailCount === blocks.length);
  if (allOff) allOff.classList.toggle("is-active", blocks.length > 0 && detailCount === 0);
}

/* ── A / B / C 평가 ─────────────────────────────────────────────── */

// 평가 항목 하나(key = 중단원 id 또는 대단원 id)를 grade("A" | "B" | "C") 평가로 표시한다.
//   · 누른 버튼만 선택 색으로
//   · 인쇄·이미지용 배지에 글자와 색 넣기
//   · 배경색: 중단원 평가는 그 줄(tr)에 grade-a/b/c 클래스,
//            대단원 평가는 대단원 블록에 data-unit-grade="A" 등 → 그 대단원의 줄 전체 (css/checklist-table.css)
// (SOLUTION 칸은 평가와 상관없이 건드리지 않는다)
function applyGradeState(key, grade) {
  const cell = document.getElementById(`${key}-grade`);
  if (!cell || !Object.prototype.hasOwnProperty.call(GRADE_META, grade)) return;
  const meta = GRADE_META[grade];

  cell.querySelectorAll(".btn-grade").forEach((s) => {
    s.classList.remove("active-a", "active-b", "active-c");
    if (s.dataset.grade === grade) s.classList.add(meta.className);
  });

  const printBadge = document.getElementById(`${key}-badge`);
  printBadge.innerHTML = grade;
  printBadge.style.cssText = meta.style;

  const row = document.getElementById(`${key}-row`);
  if (row) {
    row.classList.remove("grade-a", "grade-b", "grade-c");
    row.classList.add(meta.rowClass);
  } else {
    cell.closest(".unit-block").dataset.unitGrade = grade;
  }
}

// A/B/C 버튼 클릭 (gradeCellHtml 이 만든 버튼의 onclick)
// key: 중단원 id 또는 대단원 id
function selectGradeBtn(btn, grade, key) {
  applyGradeState(key, grade);
  saveCurrentState();
  updateStatus();
}

// 평가 항목(key)에서 선택된 평가를 읽는다: "A" | "B" | "C" | 아직 안 골랐으면 "-"
function getActiveGrade(key) {
  const cell = document.getElementById(`${key}-grade`);
  if (!cell) return "-";
  if (cell.querySelector(".active-a")) return "A";
  if (cell.querySelector(".active-b")) return "B";
  if (cell.querySelector(".active-c")) return "C";
  return "-";
}

/* ── 진단평가 메모 칸 (A/B/C 버튼 아래 · 시험 점수 등 한 줄) ─────────
   · 비어 있으면 흐린 "코멘트" 안내 글자가 보이고, 인쇄 · 이미지에는 적은 글자만 나옵니다.
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
  if (
    event.inputType === "insertParagraph" ||
    event.inputType === "insertLineBreak"
  ) {
    event.preventDefault();
  }
}

// 붙여넣기는 서식 없이 글자만 (줄바꿈은 띄어쓰기로)
function onGradeNotePaste(event) {
  event.preventDefault();
  const text = (
    event.clipboardData ? event.clipboardData.getData("text/plain") : ""
  ).replace(/\s+/g, " ");
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

// 지금 화면에서 평가해야 하는 항목들 (단원 설정에서 숨긴 단원·줄은 빠짐)
//   · 간단히 대단원: 대단원 하나에 1개   { key: "m2-1",   label: "1. 물질의 특성", element: 대단원 평가 칸 }
//   · 자세히 대단원: 보이는 중단원 줄마다 { key: "m2-1-1", label: "물질의 특성",    element: 그 줄 <tr> }
// 진행 현황(updateStatus)과 출력 전 검사(js/export.js)가 함께 씁니다.
function getEvalItems() {
  const items = [];
  document.querySelectorAll(".unit-block").forEach((block) => {
    if (block.style.display === "none") return;
    const rows = Array.from(block.querySelectorAll(".check-row")).filter(
      (row) => row.style.display !== "none",
    );
    if (!rows.length) return;
    if (block.classList.contains("is-detail")) {
      rows.forEach((row) => {
        items.push({
          key: row.id.replace(/-row$/, ""),
          label: getTextFromElement(row.querySelector("td")),
          element: row,
        });
      });
    } else {
      items.push({
        key: block.dataset.unit,
        label: getTextFromElement(block.querySelector(".table-title")),
        element: document.getElementById(`${block.dataset.unit}-grade`),
      });
    }
  });
  return items;
}

// 오른쪽 위 "평가 3/20개 완료 · A 1 / B 1 / C 1" 과
// 사이드바 "표시 단원 5/7" 숫자를 다시 계산한다. (숨긴 줄·단원은 세지 않음)
// 간단히 대단원은 대단원 하나를 1개로, 자세히 대단원은 보이는 중단원 줄 수만큼 센다.
function updateStatus() {
  const rows = Array.from(document.querySelectorAll(".check-row"));
  const visibleRows = rows.filter((row) => row.style.display !== "none");
  const items = getEvalItems();
  const grades = items.map((item) => getActiveGrade(item.key));
  const count = (g) => grades.filter((x) => x === g).length;
  const graded = grades.filter((x) => x !== "-").length;
  const visibleGroups = Array.from(
    document.querySelectorAll(".group-header-checkbox"),
  ).filter((cb) => cb.checked).length;
  const totalGroups = document.querySelectorAll(
    ".group-header-checkbox",
  ).length;
  const reportStatus = document.getElementById("report-status");
  const scopeStatus = document.getElementById("scope-status");

  if (reportStatus)
    reportStatus.textContent = `평가 ${graded}/${items.length}개 완료 · A ${count("A")} / B ${count("B")} / C ${count("C")}`;
  if (scopeStatus)
    scopeStatus.textContent = `표시 단원 ${visibleGroups}/${totalGroups}`;

  // 표는 그려져 있는데 켜 둔 단원이 하나도 없으면 안내 문구를 보여 준다
  const hint = document.getElementById("scope-empty-hint");
  if (hint) hint.hidden = !(rows.length && !visibleRows.length);

  updateDetailControls();
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
  cell.addEventListener("mouseup", () => selectBlankSolution(cell), {
    once: true,
  });
}

// 칸이 공란("-")이면 글자 전체를 선택한다 (브라우저가 커서를 놓은 "뒤에" 하도록 한 박자 늦춤)
function selectBlankSolution(cell) {
  setTimeout(() => {
    if (
      document.activeElement !== cell ||
      getTextFromElement(cell) !== BLANK_SOLUTION
    )
      return;
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
  document.getElementById("solution-macro-popover").style.display = "none";
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
    targetSolutionCell.classList.remove("sol-c");
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

    if (isDangerColor) {
      targetSolutionCell.classList.add("sol-c");
    }

    saveCurrentState();
    updateStatus();
    hideMacroPopover(); // 항목 하나 선택하면 팝오버 자동 닫기
  }
}
