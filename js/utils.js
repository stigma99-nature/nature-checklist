/* ==========================================================================
   js/utils.js — 🧰 여러 곳에서 쓰는 작은 도우미
   --------------------------------------------------------------------------
   화면 구조와 상관없는 글자 다루기 · HTML 정리 · 브라우저 저장소 도우미입니다.
   ※ 관리자 페이지(admin/admin.js)도 이 파일을 함께 씁니다.
   ========================================================================== */

// 요소(el) 안의 글자만 뽑아 공백을 한 칸으로 정리해 돌려준다. el 이 없으면 "".
// 예) <td>  과학    탐구 </td>  →  "과학 탐구"
function getTextFromElement(el) {
  return (el?.innerText || el?.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

// 글자를 HTML 안에 안전하게 넣을 수 있게 특수문자를 바꾼다.
// (명단에 입력한 이름 등에 < > 가 있어도 태그로 해석되지 않도록)
// 예) "<b>" → "&lt;b&gt;"
function escapeHtml(text) {
  return String(text).replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[ch],
  );
}

// 저장소에서 불러온 HTML(주요 내용 · SOLUTION · 종합 의견)을 화면에 넣기 전에 정리한다.
// 글자 꾸밈(굵게 · 색 · 목록 · 줄바꿈)만 남기고 스크립트 · 이미지 · 링크 · onclick 같은 속성은 지운다.
// (비밀번호 없이 쓰는 사이트라, 누가 저장소에 이상한 HTML 을 넣어도 화면에서 실행되지 않게)
// 예) '<b>좋음</b><img src=x onerror="…">'  →  '<b>좋음</b>'
const SAFE_HTML_TAGS = new Set(
  "B STRONG I EM U S STRIKE SUB SUP BR DIV P SPAN UL OL LI FONT".split(" "),
);
const DROP_HTML_TAGS = new Set(
  "SCRIPT STYLE IFRAME OBJECT EMBED TEMPLATE NOSCRIPT TEXTAREA SELECT SVG MATH TITLE META LINK".split(" "),
);

function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(`<body>${String(html ?? "")}</body>`, "text/html");
  cleanHtmlNode(doc.body);
  return doc.body.innerHTML;
}

// sanitizeHtml 의 실제 정리 작업 (안쪽 요소부터 차례로)
function cleanHtmlNode(parent) {
  Array.from(parent.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove(); // 주석 등
      return;
    }
    const tag = node.nodeName.toUpperCase();
    if (DROP_HTML_TAGS.has(tag)) {
      node.remove(); // 안의 내용까지 통째로 지움
      return;
    }
    cleanHtmlNode(node);
    if (!SAFE_HTML_TAGS.has(tag)) {
      node.replaceWith(...node.childNodes); // 태그만 벗기고 안의 글자는 남김
      return;
    }
    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const allowed =
        name === "class" ||
        name === "style" ||
        (tag === "FONT" && ["color", "size", "face"].includes(name));
      if (!allowed || /url\s*\(|expression\s*\(|javascript:/i.test(attr.value)) {
        node.removeAttribute(attr.name);
      }
    });
  });
}

// HTML 안에 실제 글자가 있는지.  예) "<br>" → false,  "<b>-</b>" → true
function htmlHasText(html) {
  return (
    typeof html === "string" &&
    html.replace(/<[^>]*>/g, "").replace(/&nbsp;|\s/g, "") !== ""
  );
}

// 명단 이름 뒤에 붙은 구분용 영문자(동명이인 구분 등)를 떼어 나눈다.
// 인쇄물·파일 이름에는 base(이름만), 선생님용 목록에는 tag 까지 함께 보여 줍니다.
// 예) "홍길동A" → { base: "홍길동", tag: "A" },  "이순신" → { base: "이순신", tag: "" }
function splitStudentName(name) {
  const text = String(name || "").trim();
  const match = text.match(/^(.*[가-힣])([A-Z]{1,2})$/);
  return match ? { base: match[1], tag: match[2] } : { base: text, tag: "" };
}

// 브라우저에 작은 값을 기억하는 도우미.
// 개인정보 보호 모드처럼 저장소를 쓸 수 없는 환경에서도 오류로 멈추지 않게 감쌌습니다.
function makeSafeStorage(getStorage) {
  return {
    get(key) {
      try {
        return getStorage().getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        getStorage().setItem(key, value);
      } catch (e) {
        // 저장하지 못해도 계속 진행
      }
    },
    remove(key) {
      try {
        getStorage().removeItem(key);
      } catch (e) {
        // 지우지 못해도 계속 진행
      }
    },
  };
}

// 브라우저를 닫아도 남는 값 (localStorage) — 로그인한 이름, 마지막 학생 등
const safeStorage = makeSafeStorage(() => localStorage);
// 이 탭에서만 남는 값 (sessionStorage) — 새로고침하면 유지, 탭을 닫으면 사라짐 (예: 고른 시험)
const safeSession = makeSafeStorage(() => sessionStorage);
