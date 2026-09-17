/* ==========================================================================
   js/export.js — 🖨️ 출력: 인쇄 / PDF, 이미지 저장, 이미지 복사
   --------------------------------------------------------------------------
   오른쪽 위 버튼 3개가 부르는 함수들입니다.
     🖨️ 인쇄 / PDF   → printReport()
     📸 이미지 저장   → saveAsImageFile()
     📋 이미지 복사   → copyImageToClipboard()

   출력 전 공통 검사 (ensureReadyForOutput) — 하나라도 걸리면 출력하지 않음
     0) 학생을 골랐거나 빈 체크리스트이고, 체크리스트를 다 불러왔는가
     1) 보이는 모든 줄에 A/B/C 평가를 했는가
     2) 보이는 모든 줄에 SOLUTION 이 있는가 (기본값 "-" 공란도 입력으로 인정 → 칸을 비워 둔 경우만 걸림)
     3) 머리말에 학생 이름 · 학교명이 있는가 (빈 체크리스트는 직접 입력)
     (진단평가 메모 칸은 적지 않아도 됨 — 비어 있으면 인쇄·이미지에 나오지 않음)

   · 인쇄 모양은 css/print.css 가 정합니다.
   · 이미지는 html2canvas(-pro) 라이브러리로 리포트 용지를 그림으로 찍어서 만듭니다.
   ========================================================================== */

/* ── 출력 전 검사 ─────────────────────────────────────────────── */

// 화면에 보이는(단원 설정에서 숨기지 않은) 표의 줄들
function getVisibleRows() {
  return Array.from(document.querySelectorAll(".check-row")).filter(
    (row) => row.style.display !== "none",
  );
}

// 보이는 줄 중 A/B/C 를 아직 고르지 않은 줄들
function getUngradedRows() {
  return getVisibleRows().filter(
    (row) => !row.querySelector(".active-a, .active-b, .active-c"),
  );
}

// 보이는 줄 중 SOLUTION 이 비어 있는 줄들
// ("-" 는 '해당 없음'을 일부러 고른 값이므로 입력된 것으로 본다)
function getEmptySolutionRows() {
  return getVisibleRows().filter((row) => {
    const sol = getTextFromElement(row.querySelector(".solution-td"));
    return sol === "";
  });
}

// 줄의 이름표(첫 번째 칸 = 중단원 이름). 경고창에 목록으로 보여 줄 때 사용
function rowLabel(row) {
  return getTextFromElement(row.querySelector("td"));
}

// 인쇄/이미지 저장 전 필수 입력 검사. 통과하면 true.
// 걸리면 경고창을 띄우고 문제 위치로 스크롤·커서를 옮긴 뒤 false.
// actionLabel: 경고 문구에 들어갈 동작 이름 (예: "인쇄/PDF 저장")
function ensureReadyForOutput(actionLabel) {
  // 0) 학생 선택(또는 빈 체크리스트) · 불러오기 완료
  if (!currentStudent && !isBlankChecklist) {
    alert(
      currentTeacher && !currentExam
        ? `왼쪽 위에서 시험을 먼저 선택해야 ${actionLabel}할 수 있습니다.`
        : `왼쪽 목록에서 학생을 먼저 선택해야 ${actionLabel}할 수 있습니다.`,
    );
    return false;
  }
  if (isLoadingReport) {
    alert("체크리스트를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
    return false;
  }
  // 1) 진단평가(A/B/C) 미선택 항목
  const ungraded = getUngradedRows();
  if (ungraded.length) {
    const preview = ungraded.slice(0, 5).map(rowLabel).join(", ");
    const suffix =
      ungraded.length > 5 ? ` 외 ${ungraded.length - 5}개` : "";
    alert(
      `진단평가(A/B/C)를 선택하지 않은 항목이 ${ungraded.length}개 있습니다.\n${preview}${suffix}\n\n모든 항목을 평가해야 ${actionLabel}할 수 있습니다.`,
    );
    ungraded[0].scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  // 2) SOLUTION 미입력 항목
  const noSol = getEmptySolutionRows();
  if (noSol.length) {
    const preview = noSol.slice(0, 5).map(rowLabel).join(", ");
    const suffix = noSol.length > 5 ? ` 외 ${noSol.length - 5}개` : "";
    alert(
      `SOLUTION이 비어 있는 항목이 ${noSol.length}개 있습니다.\n${preview}${suffix}\n\n모든 항목의 SOLUTION을 입력해야 ${actionLabel}할 수 있습니다.`,
    );
    noSol[0].scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  // 3) 학생 이름·학교명
  //    학생 체크리스트: 명단에서 채워지므로 비어 있으면 관리자 페이지에서 고쳐야 함
  //    빈 체크리스트: 머리말에 직접 입력해야 함
  const nameEl = document.getElementById("student-name");
  const schoolEl = document.getElementById("school-name");
  const name = nameEl.value.trim();
  const school = schoolEl.value.trim();
  const missing = [];
  if (!name) missing.push("학생 이름");
  if (!school) missing.push("학교명");
  if (missing.length) {
    if (isBlankChecklist) {
      alert(`머리말에 ${missing.join(", ")}을(를) 입력해야 ${actionLabel}할 수 있습니다.`);
      (name ? schoolEl : nameEl).focus();
    } else {
      alert(
        `명단에 ${missing.join(", ")}이(가) 비어 있어 ${actionLabel}할 수 없습니다.\n관리자 페이지(/admin)에서 학생 명단을 수정해 주세요.`,
      );
    }
    return false;
  }
  return true;
}

/* ── 🖨️ 인쇄 / PDF ─────────────────────────────────────────────── */

// 검사 → 이름·학교 확인창 → 브라우저 인쇄 창 열기
// (PDF 는 인쇄 창에서 "PDF로 저장"을 고르면 됨. 기본 파일 이름 = 탭 제목, updateTitle 참고)
function printReport() {
  if (!ensureReadyForOutput("인쇄/PDF 저장")) return;

  // 모든 필수 항목이 채워진 상태 — 이름·학교명이 맞는지 한 번 더 확인
  const name = document.getElementById("student-name").value.trim();
  const school = document.getElementById("school-name").value.trim();
  if (
    !confirm(
      `아래 정보가 맞는지 확인해 주세요.\n\n· 학생 이름 : ${name}\n· 학교명 : ${school}\n\n이대로 인쇄/PDF 저장을 진행할까요?`,
    )
  ) {
    return;
  }

  window.print();
}

// 인쇄물 맨 아래 푸터의 "발급일 2026. 06. 27" 을 오늘 날짜로 채운다 (페이지를 열 때 main.js 에서 호출)
function setPrintDate() {
  const el = document.getElementById("print-date");
  if (!el) return;
  const now = new Date();
  el.textContent = `발급일 ${now.getFullYear()}. ${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}. ${String(now.getDate()).padStart(2, "0")}`;
}

/* ── 📸 이미지 만들기 (html2canvas) ────────────────────────────── */

// html2canvas 는 input/select 안의 글자를 위로 잘리게 그리는 버그가 있다.
// 캡처하는 순간에만 입력칸을 같은 글자의 일반 <span> 으로 바꿔 정확히 그려지게 하고,
// 원래대로 되돌리는 함수를 돌려준다.
function swapMetaFieldsForCapture() {
  const ctrls = [
    document.getElementById("student-name"),
    document.getElementById("school-name"),
    document.getElementById("exam-type"),
  ].filter(Boolean);
  const created = [];
  ctrls.forEach((ctrl) => {
    const text =
      ctrl.tagName === "SELECT"
        ? (ctrl.options[ctrl.selectedIndex] || {}).text || ""
        : ctrl.value || "";
    const cs = getComputedStyle(ctrl);
    const span = document.createElement("span");
    span.className = "capture-meta-text";
    span.textContent = text;
    span.style.color = "#ffffff";
    span.style.fontSize = cs.fontSize;
    span.style.fontWeight = cs.fontWeight;
    span.style.fontFamily = cs.fontFamily;
    span.style.letterSpacing = cs.letterSpacing;
    span.style.whiteSpace = "nowrap";
    span.style.lineHeight = "1.5";
    span.style.padding = "2px 4px";
    span.style.borderBottom =
      cs.borderBottomWidth +
      " " +
      cs.borderBottomStyle +
      " " +
      cs.borderBottomColor;
    ctrl.style.display = "none";
    ctrl.parentNode.insertBefore(span, ctrl);
    created.push({ ctrl, span });
  });
  return () => {
    created.forEach(({ ctrl, span }) => {
      if (span.parentNode) span.parentNode.removeChild(span);
      ctrl.style.display = "";
    });
  };
}

// 리포트 용지를 이미지(canvas)로 찍는다. (이미지 저장·복사 공용)
//   1) 찍기 전: A/B/C 버튼·"수정 가능" 태그·용지 안의 .no-print 요소를 숨기고,
//      평가한 줄은 A/B/C 배지를 보이게 함 (인쇄물과 같은 모습)
//      진단평가 메모 칸: 비어 있으면 숨기고(안내 글자 "점수 등"이 찍히지 않게),
//      용지에 .is-capturing 을 붙여 적은 칸은 테두리 없이 글자만
//   2) html2canvas 로 2배 해상도로 캡처
//   3) 성공·실패와 관계없이 화면을 원래대로 되돌림
// 반환: canvas 를 주는 Promise
function captureReportCanvas() {
  const btnGroups = document.querySelectorAll(".btn-group");
  const badges = document.querySelectorAll(".print-only-badge");
  const tags = document.querySelectorAll(".editable-tag");
  const emptyNotes = Array.from(document.querySelectorAll(".grade-note")).filter(
    (note) => !note.textContent.trim(),
  );
  const captureOnlyControls = document.querySelectorAll(
    "#capture-target-paper .no-print",
  );
  const target =
    document.getElementById("capture-target-paper") ||
    document.querySelector(".report-paper");

  const restoreMetaFields = swapMetaFieldsForCapture();
  const restoreCaptureChrome = () => {
    restoreMetaFields();
    target.classList.remove("is-capturing");
    btnGroups.forEach((g) => (g.style.display = "flex"));
    tags.forEach((t) => (t.style.display = "inline-block"));
    emptyNotes.forEach((n) => (n.style.display = ""));
    captureOnlyControls.forEach((el) => (el.style.display = ""));
    badges.forEach((b) => (b.style.display = "none"));
  };
  target.classList.add("is-capturing");
  btnGroups.forEach((g) => (g.style.display = "none"));
  tags.forEach((t) => (t.style.display = "none"));
  // (CSS :empty 로 숨기면 html2canvas 가 안내 글자를 진짜 글자로 복사해 찍어 버려서 직접 숨김)
  emptyNotes.forEach((n) => (n.style.display = "none"));
  captureOnlyControls.forEach((el) => (el.style.display = "none"));
  badges.forEach((b) => {
    if (b.innerText !== "-") b.style.display = "inline-block";
  });

  return html2canvas(target, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  }).finally(restoreCaptureChrome);
}

// 📸 이미지 저장: 검사 → 캡처 → PNG 파일 다운로드 (파일 이름 = 탭 제목)
function saveAsImageFile() {
  if (!ensureReadyForOutput("이미지 저장")) return;
  hideMacroPopover();

  const statusText = document.getElementById("report-status");
  const previousStatus = statusText ? statusText.textContent : "";
  if (statusText) statusText.textContent = "이미지 저장 준비 중...";

  captureReportCanvas()
    .then((canvas) => {
      const link = document.createElement("a");
      link.download = document.title + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      if (statusText) statusText.textContent = previousStatus;
      updateStatus();
    })
    .catch((err) => {
      console.warn("이미지 저장 실패", err);
      if (statusText)
        statusText.textContent =
          "이미지 저장에 실패했습니다. 다시 시도해 주세요.";
      setTimeout(() => {
        if (statusText) statusText.textContent = previousStatus;
        updateStatus();
      }, 2200);
    });
}

// 📋 이미지 복사: 검사 → 캡처 → 클립보드에 PNG 복사 (시트·메신저에 Ctrl+V)
// 이미지 클립보드 복사를 지원하지 않는 브라우저에서는 안내 토스트만 띄운다.
function copyImageToClipboard() {
  if (!ensureReadyForOutput("이미지 복사")) return;

  if (
    typeof ClipboardItem === "undefined" ||
    !navigator.clipboard ||
    !navigator.clipboard.write
  ) {
    showToast(
      "이 브라우저는 이미지 클립보드 복사를 지원하지 않아요. '이미지 저장'을 이용해 주세요.",
    );
    return;
  }

  hideMacroPopover();

  const statusText = document.getElementById("report-status");
  const previousStatus = statusText ? statusText.textContent : "";
  if (statusText) statusText.textContent = "이미지 복사 준비 중...";

  // ClipboardItem에 Promise<Blob>를 직접 넘기면 Safari 등에서도 비동기 캡처가 허용된다.
  const blobPromise = captureReportCanvas().then(
    (canvas) =>
      new Promise((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("이미지 생성 실패")),
          "image/png",
        ),
      ),
  );

  navigator.clipboard
    .write([new ClipboardItem({ "image/png": blobPromise })])
    .then(() => {
      if (statusText) statusText.textContent = previousStatus;
      updateStatus();
      showToast("📋 이미지를 클립보드에 복사했어요. 시트에 Ctrl+V!");
    })
    .catch((err) => {
      console.warn("이미지 복사 실패", err);
      if (statusText)
        statusText.textContent =
          "이미지 복사에 실패했습니다. 다시 시도해 주세요.";
      setTimeout(() => {
        if (statusText) statusText.textContent = previousStatus;
        updateStatus();
      }, 2200);
    });
}

/* ── ⚠️ 지금은 사용하지 않는 함수 ──────────────────────────────────
   ensureReadyForOutput() 이전에 쓰던 검사 함수로, 지금은 어디에서도 호출하지 않습니다.
   필요 없다면 지워도 동작에 영향이 없습니다.
   ─────────────────────────────────────────────────────────── */
function ensureAllRowsGraded(actionLabel) {
  const ungradedRows = getUngradedRows();
  if (!ungradedRows.length) return true;

  const preview = ungradedRows
    .slice(0, 5)
    .map((row) => getTextFromElement(row.querySelector("td")))
    .join(", ");
  const suffix =
    ungradedRows.length > 5 ? ` 외 ${ungradedRows.length - 5}개` : "";
  alert(
    `아직 평가하지 않은 항목이 ${ungradedRows.length}개 있습니다.\n${preview}${suffix}\n\n${actionLabel} 전에 A/B/C 평가를 모두 선택해 주세요.`,
  );
  return false;
}
