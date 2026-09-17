/* ==========================================================================
   js/main.js — 🚀 시작점: 페이지를 열었을 때 실행되는 코드
   --------------------------------------------------------------------------
   index.html 이 모든 CSS·JS 파일을 불러온 뒤(window.onload) 아래 순서로 실행됩니다.
     1) 종합 의견 칸의 처음 내용을 DEFAULT_OPINION 에 기억 (새 체크리스트의 기본값)
     2) 인쇄 푸터에 오늘 날짜 넣기                                → export.js
     3) 시험 선택 준비 (같은 탭에서 고른 시험 복원)                  → student-list.js
     4) 학생을 고르기 전 안내 문구 표시                            → student-list.js
     5) 테스트 모드면 안내 띠 표시, 저장소 연결을 미리 시작          → db/db.js
     6) 로그인 (기억된 선생님이면 자동 로그인 → 학생 목록 → 체크리스트) → login.js

   📌 JS 파일을 불러오는 순서 (index.html 맨 아래)
     데이터 → 설정·상태 → 도우미 → 저장소 → 저장 → 화면 기능들 → 로그인 → 출력 → main.js (항상 마지막)
   ========================================================================== */

window.onload = async function () {
  DEFAULT_OPINION = document.getElementById("opinion-textarea").innerHTML;
  setPrintDate();
  initExamSelect();
  closeChecklist("로그인하면 담당 학생의 체크리스트가 열립니다.");
  showTestModeBanner();
  // 선생님이 이름을 입력하는 동안 Firebase 연결(프로그램 불러오기)을 미리 해 둔다.
  // 여기서 난 오류는 무시하고, 로그인할 때 다시 시도해서 안내한다.
  DB.connect().catch(() => {});
  await initLogin();
};
