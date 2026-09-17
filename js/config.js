/* ==========================================================================
   js/config.js — ⚙️ 고정 설정값
   --------------------------------------------------------------------------
   프로그램이 실행되는 동안 바뀌지 않는 값들입니다.
   이름표·색·저장 간격을 바꾸고 싶을 때 여기를 고치세요.
   (실행 중에 바뀌는 값은 js/state.js 에 있습니다)
   ※ 관리자 페이지(admin/index.html)도 이 파일을 함께 씁니다.
   ========================================================================== */

/* ── 학년 이름표 ────────────────────────────────────────────────
   학년 코드(js/data/curriculum.js 의 mid1, mid2 …)를 화면에 보여 줄 이름입니다.
   학생 목록 · 관리자 페이지 · 저장 파일 이름에 쓰입니다.
   curriculum.js 에 학년을 새로 추가했다면(예: mid3_22) 여기에도 한 줄 추가하세요.
   (없으면 "mid3_22" 처럼 코드 이름이 그대로 보입니다)
   ─────────────────────────────────────────────────────────── */
const GRADE_LABELS = {
  mid1: "중1",
  mid2: "중2",
  mid3: "중3",
};

// 학년 코드 → 이름표.  예) gradeLabel("mid2") → "중2"
function gradeLabel(grade) {
  return Object.prototype.hasOwnProperty.call(GRADE_LABELS, grade) ? GRADE_LABELS[grade] : grade;
}

// 그 학년의 단원 데이터가 js/data/curriculum.js 에 있는지.  예) hasGradeData("mid2") → true
// (명단의 학년 값이 "constructor" 같은 이상한 글자여도 잘못 인식하지 않도록 hasOwnProperty 로 확인)
function hasGradeData(grade) {
  return Object.prototype.hasOwnProperty.call(CURRICULUM_DATA, grade);
}

/* ── 대단원별 구분 색 ──────────────────────────────────────────
   대단원 순서대로 이 색을 씁니다 (표 제목 탭·표 윗선·단원 설정 카드의 띠).
   대단원이 8개보다 많으면 처음 색부터 다시 반복합니다.
   흰 글씨가 잘 보이도록 진한 톤으로 골랐습니다.
   ─────────────────────────────────────────────────────────── */
const UNIT_COLORS = [
  "#2f6f73", // teal
  "#34568b", // indigo
  "#2e7d5b", // emerald
  "#9a6a25", // amber
  "#9c5560", // terracotta
  "#4a5aa0", // periwinkle
  "#2b7d77", // deep aqua
  "#6a4f86", // plum
];

// 몇 번째 대단원(idx, 0부터 시작)인지 넣으면 그 색을 돌려준다.
// 예) unitColor(0) → "#2f6f73",  unitColor(8) → 다시 "#2f6f73"
const unitColor = (idx) => UNIT_COLORS[idx % UNIT_COLORS.length];

/* ── A / B / C 평가별 표시 정보 ────────────────────────────────
   className : 선택된 A/B/C 버튼에 붙는 클래스 (css/checklist-table.css)
   rowClass  : 표의 그 줄(tr)에 붙는 배경색 클래스
   style     : 인쇄·이미지용 배지(.print-only-badge)에 직접 넣는 스타일
   ─────────────────────────────────────────────────────────── */
const GRADE_META = {
  A: {
    className: "active-a",
    rowClass: "grade-a",
    style:
      "background-color: #e3f0fc; color: #1565c0; border:1px solid #1565c0; display:inline-block;",
  },
  B: {
    className: "active-b",
    rowClass: "grade-b",
    style:
      "background-color: #fff6cc; color: #a87900; border:1px solid #e0a800; display:inline-block;",
  },
  C: {
    className: "active-c",
    rowClass: "grade-c",
    style:
      "background-color: #ffe1e1; color: #c62828; border:1px solid #c62828; display:inline-block;",
  },
};

/* ── 자동 저장 대기 시간 ───────────────────────────────────────
   마지막으로 입력한 뒤 이 시간(밀리초, 1000 = 1초)이 지나면 저장소(Firebase)에 저장합니다.
   너무 짧으면 저장 요청이 많아지고(Firestore 사용량 증가), 너무 길면 저장이 늦어집니다.
   ─────────────────────────────────────────────────────────── */
const SAVE_DELAY_MS = 1200;
