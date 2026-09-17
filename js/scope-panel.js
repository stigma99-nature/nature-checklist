/* ==========================================================================
   js/scope-panel.js — ① 사이드바의 "단원 설정" 패널 (넓은 PC 화면에서는 오른쪽에 보임)
   --------------------------------------------------------------------------
   · 단원 설정 체크박스를 켜고 끄면 → 가운데 표에서 해당 단원·줄을 보이거나 숨김
   · 체크 상태는 체크리스트와 함께 저장됩니다 (js/storage.js 의 scopeSelections)

   체크박스 ↔ 표 연결 방법 (id 규칙)
     대단원 체크박스  data-idx="2"          ↔  대단원 블록  id="mid1-unit-idx-2"
     중단원 체크박스  data-target="m1-3-1"  ↔  표의 한 줄   id="m1-3-1-row"
   숨길 때는 style.display = "none", 다시 보일 때는 "" 또는 "block" 으로 되돌립니다.
   (출력 전 검사·진행 현황도 이 display 값으로 "보이는 줄"을 판단합니다)

   스타일: css/sidebar.css
   ========================================================================== */

/* ── 단원 설정 목록 그리기 ─────────────────────────────────────── */

// 현재 학년(currentGrade)의 대단원·중단원 체크박스 목록을 새로 만든다.
// 새로 만든 체크박스는 모두 꺼진(체크 안 된) 상태로 시작하며,
// 저장된 체크리스트가 있으면 그 값으로 체크가 채워진다.
// (꺼진 단원은 표에서도 숨겨짐 → 새 체크리스트는 이번 시험 범위를 체크해야 표가 보임)
function renderScopeWidget() {
  const root = document.getElementById("scope-widget-root");
  root.innerHTML = "";
  const currentUnits = CURRICULUM_DATA[currentGrade];

  currentUnits.forEach((unit, idx) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "scope-group";
    groupDiv.style.setProperty("--unit-color", unitColor(idx));
    let subHtml = "";
    unit.sub.forEach((subUnit) => {
      subHtml += `<label class="sub-scope-label"><input type="checkbox"  class="sub-scope-checkbox" data-target="${subUnit.id}" onchange="toggleSubRow(this)"> ${subUnit.name}</label>`;
    });
    groupDiv.innerHTML = `<label class="group-header-label"><input type="checkbox"  class="group-header-checkbox" data-idx="${idx}" onchange="toggleBigBlock('${currentGrade}-${idx}', this)">${unit.title}</label><div class="sub-group-grid">${subHtml}</div>`;
    root.appendChild(groupDiv);
  });
}

/* ── 체크박스 동작 ─────────────────────────────────────────────── */

// 대단원 체크박스 클릭: 그 대단원 블록과 안의 모든 중단원 줄을 한꺼번에 보이기/숨기기
// key 예) "mid1-2" → 중1 의 대단원 순서 2 (0부터 세므로 세 번째 대단원)
function toggleBigBlock(key, checkbox) {
  const gradeKey = key.split("-")[0];
  const idx = key.split("-")[1];
  const block = document.getElementById(`${gradeKey}-unit-idx-${idx}`);
  if (block) block.style.display = checkbox.checked ? "block" : "none";
  const parent = checkbox.closest(".scope-group");
  parent.querySelectorAll(".sub-scope-checkbox").forEach((cb) => {
    cb.checked = checkbox.checked;
    const r = document.getElementById(
      `${cb.getAttribute("data-target")}-row`,
    );
    if (r) r.style.display = checkbox.checked ? "" : "none";
  });
  saveCurrentState();
  updateStatus();
}

// 중단원 체크박스 클릭: 그 줄만 보이기/숨기기.
// 같은 대단원의 중단원이 모두 꺼지면 대단원 체크도 끄고 블록을 숨기고,
// 하나라도 켜지면 대단원 체크를 켜고 블록을 보이게 한다.
function toggleSubRow(checkbox) {
  const targetId = checkbox.getAttribute("data-target");
  const row = document.getElementById(`${targetId}-row`);
  if (row) row.style.display = checkbox.checked ? "" : "none";
  const parent = checkbox.closest(".scope-group");
  const bigCb = parent.querySelector(".group-header-checkbox");
  const subCbs = parent.querySelectorAll(".sub-scope-checkbox");
  const hasAny = Array.from(subCbs).some((c) => c.checked);
  const idx = bigCb.getAttribute("data-idx");
  const block = document.getElementById(
    `${currentGrade}-unit-idx-${idx}`,
  );
  if (!hasAny) {
    bigCb.checked = false;
    if (block) block.style.display = "none";
  } else {
    if (!bigCb.checked) {
      bigCb.checked = true;
      if (block) block.style.display = "block";
    }
  }
  saveCurrentState();
  updateStatus();
}

// "✓ 전체 단원 켜기"(true) / "✕ 전체 단원 끄기"(false) 버튼 (index.html)
function setAllScopes(status) {
  document.querySelectorAll(".group-header-checkbox").forEach((cb) => {
    cb.checked = status;
    const idx = cb.getAttribute("data-idx");
    const block = document.getElementById(
      `${currentGrade}-unit-idx-${idx}`,
    );
    if (block) block.style.display = status ? "block" : "none";
  });
  document.querySelectorAll(".sub-scope-checkbox").forEach((cb) => {
    cb.checked = status;
    const r = document.getElementById(
      `${cb.getAttribute("data-target")}-row`,
    );
    if (r) r.style.display = status ? "" : "none";
  });
  saveCurrentState();
  updateStatus();
}

// 저장해 둔 중단원 체크 상태({ "m1-2-1": true, ... })를 체크박스와 표에 반영한다.
// 저장값에 없는 중단원은 지금 체크 상태를 유지하고,
// 대단원 체크·블록은 "안의 중단원이 하나라도 켜져 있는지"로 다시 계산한다.
// 사용처: 체크리스트 불러오기 (storage.js 의 applyStateObj)
function restoreScopeSelections(scopeSelections) {
  document.querySelectorAll(".sub-scope-checkbox").forEach((cb) => {
    const targetId = cb.getAttribute("data-target");
    if (Object.prototype.hasOwnProperty.call(scopeSelections, targetId)) {
      cb.checked = scopeSelections[targetId];
    }
    const row = document.getElementById(`${targetId}-row`);
    if (row) row.style.display = cb.checked ? "" : "none";
  });

  document.querySelectorAll(".scope-group").forEach((group) => {
    const groupCb = group.querySelector(".group-header-checkbox");
    const subCbs = Array.from(
      group.querySelectorAll(".sub-scope-checkbox"),
    );
    const hasAny = subCbs.some((cb) => cb.checked);
    groupCb.checked = hasAny;
    const idx = groupCb.getAttribute("data-idx");
    const block = document.getElementById(
      `${currentGrade}-unit-idx-${idx}`,
    );
    if (block) block.style.display = hasAny ? "block" : "none";
  });
}
