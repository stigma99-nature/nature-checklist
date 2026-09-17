/* ==========================================================================
   js/icons.js — 🔣 버튼 · 칸에 쓰는 아이콘 (lucide)
   --------------------------------------------------------------------------
   아이콘 모양은 lucide (https://lucide.dev, lucide-static v1.46.0, ISC 라이선스) 의
   SVG 를 그대로 옮겨 둔 것입니다. 인터넷에서 따로 불러오지 않으므로 이 파일만 있으면 됩니다.

   쓰는 법
     · HTML  : <span data-icon="printer"></span>  → 페이지를 열 때 renderIcons() 가 아이콘으로 채움
     · JS    : `${icon("pencil")} 수정`            → 아이콘 <svg> 글자를 바로 만들어 넣음
   아이콘 추가: https://lucide.dev 에서 이름을 찾아
     https://cdn.jsdelivr.net/npm/lucide-static@1.46.0/icons/이름.svg 를 열고,
     <svg …> 와 </svg> 사이의 내용을 아래 ICONS 에 "이름": '…' 한 줄로 붙여 넣습니다.
   크기 · 색: 아이콘은 글자색(currentColor)을 따르고, 크기는 css/base.css 의 .icon 에서 정합니다.
   ※ 관리자 페이지(admin/index.html)도 이 파일을 함께 씁니다.
   ========================================================================== */

const ICONS = {
  // 위쪽 막대 · 인쇄 / PDF
  "printer": '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  // 위쪽 막대 · 이미지 저장
  "image-down": '<path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19 3 3v-5.5"/><path d="m17 22 3-3"/><circle cx="9" cy="9" r="2"/>',
  // 위쪽 막대 · 이미지 복사
  "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  // 위쪽 막대 · 로그아웃
  "log-out": '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  // 위쪽 막대 · 선생님 이름 앞
  "circle-user-round": '<path d="M17.925 20.056a6 6 0 0 0-11.851.001"/><circle cx="12" cy="11" r="4"/><circle cx="12" cy="12" r="10"/>',
  // 학생 검색 칸 · 관리자 명단 검색 칸
  "search": '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  // 학생 검색 결과 없음
  "search-x": '<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  // 단원 설정 · 전체 켜기
  "list-checks": '<path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/>',
  // 단원 설정 · 전체 끄기
  "list-x": '<path d="M16 5H3"/><path d="M11 12H3"/><path d="M16 19H3"/><path d="m15.5 9.5 5 5"/><path d="m20.5 9.5-5 5"/>',
  // 표 머리글 · 고칠 수 있는 칸 표시 · 관리자 [수정]
  "pencil": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  // SOLUTION 문구 팝오버 · 공란
  "minus": '<path d="M5 12h14"/>',
  // 다시 시도 · 다시 불러오기
  "rotate-cw": '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  // 선택 칸(시험 · 학년) 화살표
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  // 관리자 [저장] · CSV 미리보기 정상
  "check": '<path d="M20 6 9 17l-5-5"/>',
  // 관리자 [취소]
  "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  // 관리자 [추가]
  "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
  // 관리자 [삭제]
  "trash-2": '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  // 관리자 · 체크리스트 화면 열기
  "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  // 관리자 · CSV 파일 선택
  "file-up": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/>',
  // 관리자 · 학생 추가 제목
  "user-plus": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  // 관리자 · 학생 명단 제목
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
};

// 아이콘 <svg> HTML 글자를 만든다.  예) icon("printer") → '<svg class="icon" …>…</svg>'
// 없는 이름이면 빈 글자 (화면에 아무것도 안 나옴)
function icon(name) {
  const body = Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name] : "";
  if (!body) return "";
  return (
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    body +
    "</svg>"
  );
}

// root 안의 <span data-icon="이름"></span> 을 아이콘으로 채운다 (이미 채운 칸은 건너뜀)
function renderIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    if (!el.firstElementChild) el.innerHTML = icon(el.getAttribute("data-icon"));
  });
}

// 이 파일을 불러오는 순간 HTML 에 적힌 아이콘을 바로 채운다 (JS 가 나중에 그리는 칸은 icon() 사용)
renderIcons();
