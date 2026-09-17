/* ==========================================================================
   admin/admin.js — 🗂️ 관리자 페이지 동작: 학생 명단 관리
   --------------------------------------------------------------------------
   · 페이지를 열면 비밀번호 없이 바로 전체 명단을 불러옵니다 (loadRoster).
   · 명단 조회 · 추가 · 수정 · 삭제는 저장소(js/db/db.js 의 DB)에 바로 요청합니다.
   · 여기서 등록한 "선생님 이름"으로 선생님이 체크리스트 화면에 로그인하면,
     그 선생님의 학생들이 왼쪽 목록에 반별로 묶여 나타납니다.
   · 여러 명 추가: CSV 파일 선택 · 끌어다 놓기 · 엑셀 표 붙여넣기

   ⚠️ 비밀번호가 없으므로 이 페이지 주소(/admin)를 아는 사람은 누구나 명단을 고칠 수 있습니다.

   함께 쓰는 파일
     /js/data/curriculum.js  학년 목록 (CURRICULUM_DATA 의 mid1, mid2 …)
     /js/config.js           학년 이름표 (gradeLabel), hasGradeData
     /js/utils.js            escapeHtml
     /js/db/db.js            저장소 DB, 등록 순서 orderOf
   ========================================================================== */

let roster = []; // 전체 학생 명단 [{ id, teacher, name, school, grade, className, order }]
let rosterStatus = "loading"; // 명단 상태: "loading"(불러오는 중) | "ready"(불러옴) | "error"(실패)
let rosterError = ""; // 불러오기 실패 문구
let editingId = null; // 지금 수정 중인 학생 id (없으면 null)
let bulkRows = []; // "여러 명 한 번에 추가" 미리보기 결과
let bulkColumnInfo = ""; // 미리보기 위에 보여 줄 "열을 어떻게 읽었는지" 안내
let noticeTimer = null; // 알림을 감추는 타이머

/* ── 명단 불러오기 ─────────────────────────────────────────────── */

// 저장소에서 전체 명단을 새로 불러와 화면을 다시 그린다.
async function loadRoster() {
  rosterStatus = "loading";
  renderRoster();
  try {
    roster = await DB.listStudents();
    rosterStatus = "ready";
    rosterError = "";
  } catch (error) {
    rosterStatus = "error";
    rosterError = error.message;
  }
  renderAll();
  previewBulk(); // 붙여넣어 둔 글이 있으면 "이미 명단에 있음" 표시를 새 명단 기준으로
}

// 명단을 아직 못 불러왔으면 안내하고 false (중복 확인을 못 하므로 추가를 막음)
function ensureRosterReady() {
  if (rosterStatus === "ready") return true;
  notify(
    rosterStatus === "loading"
      ? "명단을 불러오는 중입니다. 잠시 후 다시 시도해 주세요."
      : "명단을 불러오지 못해 추가할 수 없습니다. 아래 '다시 불러오기'를 눌러 주세요.",
    true,
  );
  return false;
}

// 저장 요청 실패 처리: 알림을 띄우고, 입력값 문제가 아니면 명단을 다시 불러와
// 실제 저장소 상태와 화면을 맞춘다 (일부만 저장됐거나 다른 사람이 이미 지운 경우 등).
function handleError(error, prefix) {
  notify(`${prefix}: ${error.message}`, true);
  if (error.code !== "invalid-input") loadRoster();
}

/* ── 학년 ─────────────────────────────────────────────────────── */

// 학년 선택 목록 HTML (js/data/curriculum.js 에 있는 학년 전부)
// 명단의 학년이 목록에 없으면(데이터에서 지운 학년) 그 값도 넣어서 실수로 바뀌지 않게 한다.
function gradeOptionsHtml(selected) {
  const grades = Object.keys(CURRICULUM_DATA);
  if (selected && !grades.includes(selected)) grades.push(selected);
  return grades
    .map(
      (g) =>
        `<option value="${escapeHtml(g)}"${g === selected ? " selected" : ""}>${escapeHtml(gradeLabel(g))}</option>`,
    )
    .join("");
}

// "2학년", "중2", "2", "중학교2학년", "mid2" 같은 글자를 학년 코드로 바꾼다. 모르면 null.
function parseGrade(text) {
  const t = String(text || "").replace(/\s+/g, "");
  if (!t) return null;
  if (hasGradeData(t)) return t;
  const byLabel = Object.keys(CURRICULUM_DATA).find(
    (g) => gradeLabel(g).replace(/\s+/g, "") === t,
  );
  if (byLabel) return byLabel;
  const match = t.match(/^(?:중(?:학교)?)?([1-3])(?:학년)?$/);
  if (match && hasGradeData(`mid${match[1]}`)) return `mid${match[1]}`;
  return null;
}

/* ── 학생 한 명 추가 ───────────────────────────────────────────── */

// 추가 폼 제출 (index.html 의 onsubmit)
async function submitAddStudent(event) {
  event.preventDefault();
  if (!ensureRosterReady()) return;
  const student = {
    teacher: inputValue("add-teacher"),
    name: inputValue("add-name"),
    school: inputValue("add-school"),
    grade: document.getElementById("add-grade").value,
    className: inputValue("add-class"),
  };
  if (!student.teacher || !student.name || !student.school) {
    notify("선생님 이름 · 학생 이름 · 학교명을 모두 입력해 주세요.", true);
    return;
  }
  if (
    isDuplicate(student) &&
    !confirm(
      `${student.teacher} 선생님 명단에 ${student.name}(${student.school}, ${gradeLabel(student.grade)}) 학생이 이미 있습니다.\n그래도 추가할까요?`,
    )
  ) {
    return;
  }
  const button = document.getElementById("add-submit");
  button.disabled = true;
  try {
    const created = await DB.addStudents([student]);
    roster.push(...created);
    renderAll();
    // 같은 선생님·학교·학년·반으로 다음 학생을 바로 입력할 수 있게 이름 칸만 비움
    document.getElementById("add-name").value = "";
    document.getElementById("add-name").focus();
    notify(`✅ ${student.name} 학생을 ${student.teacher} 선생님 명단에 추가했어요`);
  } catch (error) {
    handleError(error, "추가하지 못했습니다");
  } finally {
    button.disabled = false;
  }
}

function inputValue(id) {
  return document.getElementById(id).value.trim();
}

// 선생님·이름·학교·학년이 모두 같은 학생이 이미 있는지 (exceptId 는 비교에서 뺄 학생)
function isDuplicate(student, exceptId) {
  return roster.some(
    (s) =>
      s.id !== exceptId &&
      s.teacher === student.teacher &&
      s.name === student.name &&
      s.school === student.school &&
      s.grade === student.grade,
  );
}

/* ── 여러 명 한 번에 추가 (CSV 파일 · 엑셀 붙여넣기) ────────────────
   · CSV 파일: 엑셀에서 저장한 CSV 는 보통 한글이 EUC-KR 로 들어 있는데, UTF-8 파일도 함께 읽습니다.
   · 엑셀·시트에서 복사해 붙여넣으면 칸 사이가 탭(\t)으로 들어옵니다.
   · 첫 줄에 제목(이름 · 학년 · 중학교 · 반명 · 선생님 …)이 있으면 제목으로 열 위치를 찾고,
     없으면 [선생님, 학생 이름, 학교명, 학년, 반] 순서로 읽습니다.
   · 제목에 없는 열(예: 일정, 시험범위)은 읽지 않습니다.
   ─────────────────────────────────────────────────────────── */

// 제목 칸 글자 → 명단 항목 (띄어쓰기를 뺀 글자로 비교)
const HEADER_NAMES = {
  teacher: ["선생님", "담당선생님", "담당", "교사", "강사", "선생님이름"],
  name: ["이름", "학생", "학생이름", "학생명", "성명"],
  school: ["중학교", "학교", "학교명", "학교이름"],
  grade: ["학년"],
  className: ["반명", "반", "반이름", "수업", "수업명", "클래스"],
};
const FIELD_LABELS = { teacher: "선생님", name: "학생 이름", school: "학교명", grade: "학년", className: "반" };
const DEFAULT_COLUMNS = { teacher: 0, name: 1, school: 2, grade: 3, className: 4 };

// 파일 선택 (index.html 의 onchange)
function onBulkFileSelected(input) {
  const file = input.files && input.files[0];
  if (file) loadBulkFile(file);
  input.value = ""; // 같은 파일을 다시 골라도 동작하도록
}

// 파일을 읽어 붙여넣기 칸에 넣고 미리보기를 만든다
async function loadBulkFile(file) {
  try {
    const text = decodeText(await file.arrayBuffer());
    document.getElementById("bulk-text").value = text.replace(/\r\n?/g, "\n").trim();
    document.getElementById("bulk-file-name").textContent = `📄 ${file.name}`;
    document.getElementById("bulk-section").open = true;
    previewBulk();
  } catch (error) {
    notify(`파일을 읽지 못했습니다: ${error.message}`, true);
  }
}

// 파일 내용(바이트)을 글자로 바꾼다. UTF-8 로 읽어 보고, 깨지면 EUC-KR(엑셀 한글 기본)로 읽는다.
function decodeText(buffer) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch (e) {
    return new TextDecoder("euc-kr").decode(buffer);
  }
}

// CSV · 탭 글을 표(줄 × 칸)로 나눈다. 큰따옴표로 감싼 칸 안의 쉼표 · 줄바꿈도 처리한다.
//   예) 홍길동A,2학년,"6,7*"  →  ["홍길동A", "2학년", "6,7*"]
function parseTable(text) {
  const firstLine = text.split("\n").find((line) => line.trim()) || "";
  const delimiter = firstLine.includes("\t") ? "\t" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'; // "" 는 글자 " 하나
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"' && cell.trim() === "") {
      quoted = true;
      cell = "";
    } else if (ch === delimiter) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some((c) => c));
}

// 첫 줄이 제목 줄이면 { 항목: 열 번호 } 를, 아니면 null 을 돌려준다.
// (선생님 · 학생 이름 열을 둘 다 찾아야 제목 줄로 인정)
function detectColumns(firstRow) {
  const columns = {};
  firstRow.forEach((cell, index) => {
    const text = cell.replace(/\s+/g, "");
    for (const [field, names] of Object.entries(HEADER_NAMES)) {
      if (columns[field] === undefined && names.includes(text)) columns[field] = index;
    }
  });
  return columns.teacher !== undefined && columns.name !== undefined ? columns : null;
}

// 붙여넣은 글(또는 불러온 파일)을 읽어 미리보기를 만든다 (입력할 때마다 실행)
function previewBulk() {
  const table = parseTable(document.getElementById("bulk-text").value);
  const header = table.length ? detectColumns(table[0]) : null;
  const columns = header || DEFAULT_COLUMNS;
  const body = header ? table.slice(1) : table;

  bulkColumnInfo = !table.length
    ? ""
    : header
      ? "첫 줄 제목으로 열을 찾았어요 → " +
        Object.keys(FIELD_LABELS)
          .map((f) => `${FIELD_LABELS[f]}: ${header[f] === undefined ? "없음" : `${header[f] + 1}번째 열`}`)
          .join(" · ")
      : "제목 줄이 없어 선생님 · 학생 이름 · 학교명 · 학년 · 반 순서로 읽었어요.";

  const seen = new Set();
  bulkRows = body.map((cells) => {
    const cellOf = (field) =>
      columns[field] === undefined ? "" : String(cells[columns[field]] || "").trim();
    const row = {
      teacher: cellOf("teacher"),
      name: cellOf("name"),
      school: cellOf("school"),
      gradeText: cellOf("grade"),
      className: cellOf("className"),
    };
    row.grade = parseGrade(row.gradeText);
    const key = [row.teacher, row.name, row.school, row.grade].join("|");
    if (!row.teacher || !row.name || !row.school) row.error = "빈 칸이 있습니다";
    else if (!row.grade) row.error = `학년을 알 수 없습니다: "${row.gradeText}"`;
    else if (row.teacher.length > 30 || row.name.length > 30 || row.school.length > 40 || row.className.length > 60) {
      row.error = "글자 수가 너무 깁니다";
    } else if (isDuplicate(row)) row.error = "이미 명단에 있습니다";
    else if (seen.has(key)) row.error = "파일 안에서 중복된 줄";
    else row.error = "";
    seen.add(key);
    return row;
  });
  renderBulkPreview();
}

// 미리보기 표와 등록 버튼 글자를 그린다
function renderBulkPreview() {
  const box = document.getElementById("bulk-preview");
  const button = document.getElementById("bulk-submit");
  const valid = bulkRows.filter((r) => !r.error);
  button.disabled = !valid.length;
  button.textContent = valid.length ? `${valid.length}명 등록` : "등록할 학생 없음";
  if (!bulkRows.length) {
    box.innerHTML = bulkColumnInfo ? `<p class="card-help">${escapeHtml(bulkColumnInfo)}</p>` : "";
    return;
  }
  const skipped = bulkRows.length - valid.length;
  box.innerHTML =
    `<p class="bulk-summary">총 ${bulkRows.length}줄 · <span class="ok-text">등록 가능 ${valid.length}명</span>` +
    (skipped ? ` · <span class="error-text">제외 ${skipped}줄</span>` : "") +
    "</p>" +
    `<p class="card-help bulk-columns">${escapeHtml(bulkColumnInfo)}</p>` +
    '<div class="table-wrap bulk-table"><table class="roster-table"><thead><tr>' +
    "<th>선생님</th><th>반</th><th>학생 이름</th><th>학교명</th><th>학년</th><th>확인</th>" +
    "</tr></thead><tbody>" +
    bulkRows
      .map(
        (r) =>
          `<tr class="${r.error ? "row-error" : ""}">` +
          `<td>${escapeHtml(r.teacher)}</td><td class="col-class">${escapeHtml(r.className)}</td>` +
          `<td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.school)}</td>` +
          `<td>${escapeHtml(r.grade ? gradeLabel(r.grade) : r.gradeText)}</td>` +
          `<td>${r.error ? `<span class="error-text">${escapeHtml(r.error)}</span>` : '<span class="ok-text">✓</span>'}</td>` +
          "</tr>",
      )
      .join("") +
    "</tbody></table></div>";
}

// "N명 등록" 버튼: 오류 없는 줄만, 파일 순서 그대로 등록한다
async function submitBulk() {
  if (!ensureRosterReady()) return;
  const valid = bulkRows.filter((r) => !r.error);
  if (!valid.length) return;
  if (!confirm(`${valid.length}명을 명단에 등록할까요?`)) return;
  const button = document.getElementById("bulk-submit");
  button.disabled = true;
  try {
    const created = await DB.addStudents(
      valid.map(({ teacher, name, school, grade, className }) => ({
        teacher,
        name,
        school,
        grade,
        className,
      })),
    );
    roster.push(...created);
    document.getElementById("bulk-text").value = "";
    document.getElementById("bulk-file-name").textContent = "";
    bulkRows = [];
    bulkColumnInfo = "";
    renderAll();
    notify(`✅ ${created.length}명을 등록했어요`);
  } catch (error) {
    handleError(error, "등록하지 못했습니다");
  } finally {
    renderBulkPreview();
  }
}

/* ── 명단 표 ───────────────────────────────────────────────────── */

function renderAll() {
  renderTeacherControls();
  renderRoster();
}

// 선생님별 학생 수 [["김선생", 5], …] (가나다순)
function teacherCounts() {
  const counts = new Map();
  roster.forEach((s) => counts.set(s.teacher, (counts.get(s.teacher) || 0) + 1));
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"));
}

// 선생님·반 이름 자동완성 · 선생님 거르기 선택 · 선생님 칩을 다시 그린다
function renderTeacherControls() {
  const counts = teacherCounts();
  document.getElementById("teacher-options").innerHTML = counts
    .map(([teacher]) => `<option value="${escapeHtml(teacher)}"></option>`)
    .join("");
  const classNames = [...new Set(roster.map((s) => s.className).filter(Boolean))];
  document.getElementById("class-options").innerHTML = classNames
    .map((className) => `<option value="${escapeHtml(className)}"></option>`)
    .join("");

  const select = document.getElementById("filter-teacher");
  const selected = select.value;
  select.innerHTML =
    '<option value="">전체 선생님</option>' +
    counts
      .map(([teacher, n]) => `<option value="${escapeHtml(teacher)}">${escapeHtml(teacher)} (${n}명)</option>`)
      .join("");
  select.value = counts.some(([teacher]) => teacher === selected) ? selected : "";

  document.getElementById("teacher-chips").innerHTML = counts
    .map(
      ([teacher, n]) =>
        `<button type="button" class="teacher-chip" data-teacher="${escapeHtml(teacher)}">${escapeHtml(teacher)}<b>${n}</b></button>`,
    )
    .join("");
}

// 거르기·검색 조건에 맞는 학생을 표로 그린다 (선생님 → 등록 순서, 수정 중인 줄은 입력칸으로)
function renderRoster() {
  const body = document.getElementById("roster-body");
  const countEl = document.getElementById("roster-count");

  // 불러오는 중 · 실패
  if (rosterStatus !== "ready") {
    countEl.textContent = "";
    body.innerHTML =
      rosterStatus === "loading"
        ? '<tr><td colspan="6" class="roster-empty">명단을 불러오는 중…</td></tr>'
        : `<tr><td colspan="6" class="roster-empty roster-error">명단을 불러오지 못했습니다.<br>${escapeHtml(rosterError)}` +
          '<br><button type="button" class="btn-small" data-action="reload">다시 불러오기</button></td></tr>';
    return;
  }

  const teacher = document.getElementById("filter-teacher").value;
  const query = document.getElementById("filter-text").value.trim().toLowerCase();
  document.querySelectorAll(".teacher-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.teacher === teacher);
  });

  const list = roster
    .filter((s) => !teacher || s.teacher === teacher)
    .filter((s) => !query || `${s.name} ${s.school} ${s.className || ""}`.toLowerCase().includes(query))
    .sort(
      (a, b) =>
        a.teacher.localeCompare(b.teacher, "ko") ||
        orderOf(a) - orderOf(b) ||
        a.name.localeCompare(b.name, "ko"),
    );

  countEl.textContent =
    list.length === roster.length ? `${roster.length}명` : `${list.length}명 / 전체 ${roster.length}명`;

  if (!list.length) {
    body.innerHTML = `<tr><td colspan="6" class="roster-empty">${
      roster.length
        ? "조건에 맞는 학생이 없습니다."
        : "아직 등록된 학생이 없습니다. 위에서 학생을 추가하거나 CSV 파일을 불러와 주세요."
    }</td></tr>`;
    return;
  }
  body.innerHTML = list.map((s) => (s.id === editingId ? editRowHtml(s) : rowHtml(s))).join("");
}

// 보기용 한 줄
function rowHtml(s) {
  return (
    `<tr data-id="${escapeHtml(s.id)}">` +
    `<td>${escapeHtml(s.teacher)}</td>` +
    `<td class="col-class">${escapeHtml(s.className || "")}</td>` +
    `<td>${escapeHtml(s.name)}</td>` +
    `<td>${escapeHtml(s.school)}</td>` +
    `<td><span class="grade-badge g-${escapeHtml(s.grade)}">${escapeHtml(gradeLabel(s.grade))}</span></td>` +
    '<td><div class="row-actions">' +
    '<button type="button" class="btn-small" data-action="edit">수정</button>' +
    '<button type="button" class="btn-small danger" data-action="delete">삭제</button>' +
    "</div></td></tr>"
  );
}

// 수정용 한 줄 (Enter = 저장, Esc = 취소)
function editRowHtml(s) {
  return (
    `<tr data-id="${escapeHtml(s.id)}">` +
    `<td><input class="edit-input" data-field="teacher" value="${escapeHtml(s.teacher)}" maxlength="30" list="teacher-options" /></td>` +
    `<td><input class="edit-input" data-field="className" value="${escapeHtml(s.className || "")}" maxlength="60" list="class-options" /></td>` +
    `<td><input class="edit-input" data-field="name" value="${escapeHtml(s.name)}" maxlength="30" /></td>` +
    `<td><input class="edit-input" data-field="school" value="${escapeHtml(s.school)}" maxlength="40" /></td>` +
    `<td><select class="edit-input" data-field="grade">${gradeOptionsHtml(s.grade)}</select></td>` +
    '<td><div class="row-actions">' +
    '<button type="button" class="btn-small save" data-action="save">저장</button>' +
    '<button type="button" class="btn-small" data-action="cancel">취소</button>' +
    "</div></td></tr>"
  );
}

// 수정한 줄 저장
async function saveEdit(id) {
  const row = document.querySelector(`#roster-body tr[data-id="${CSS.escape(id)}"]`);
  const field = (name) => row.querySelector(`[data-field="${name}"]`).value.trim();
  const updated = {
    teacher: field("teacher"),
    name: field("name"),
    school: field("school"),
    grade: field("grade"),
    className: field("className"),
  };
  if (!updated.teacher || !updated.name || !updated.school) {
    notify("선생님 · 학생 이름 · 학교명 칸을 채워 주세요.", true);
    return;
  }
  const before = roster.find((s) => s.id === id);
  if (
    before.grade !== updated.grade &&
    !confirm(
      `학년을 ${gradeLabel(before.grade)} → ${gradeLabel(updated.grade)}(으)로 바꿉니다.\n이 학생은 새 학년 체크리스트로 새로 시작하고, 이전 학년 기록은 보관됩니다. 계속할까요?`,
    )
  ) {
    return;
  }
  if (
    before.teacher !== updated.teacher &&
    !confirm(
      `담당 선생님을 ${before.teacher} → ${updated.teacher}(으)로 바꿉니다.\n이미 작성된 체크리스트도 새 선생님 화면에 함께 보입니다. 계속할까요?`,
    )
  ) {
    return;
  }
  try {
    const changed = await DB.updateStudent(id, updated);
    const student = { ...before, ...changed };
    roster = roster.map((s) => (s.id === id ? student : s));
    editingId = null;
    renderAll();
    notify(`✅ ${student.name} 학생 정보를 수정했어요`);
  } catch (error) {
    handleError(error, "수정하지 못했습니다");
  }
}

// 학생 삭제 (체크리스트 기록도 함께 삭제)
async function deleteStudent(id) {
  const s = roster.find((x) => x.id === id);
  if (!s) return;
  const ok = confirm(
    `${s.teacher} 선생님의 '${s.name}'(${s.school}, ${gradeLabel(s.grade)}) 학생을 명단에서 삭제할까요?\n\n⚠️ 이 학생의 체크리스트 기록도 모두 함께 삭제되며 되돌릴 수 없습니다.`,
  );
  if (!ok) return;
  try {
    const deletedReports = await DB.deleteStudent(id);
    roster = roster.filter((x) => x.id !== id);
    if (editingId === id) editingId = null;
    renderAll();
    notify(`🗑 ${s.name} 학생을 삭제했어요${deletedReports ? ` (체크리스트 ${deletedReports}개 함께 삭제)` : ""}`);
  } catch (error) {
    handleError(error, "삭제하지 못했습니다");
  }
}

/* ── 알림 ─────────────────────────────────────────────────────── */

// 화면 아래에 잠깐 알림을 띄운다 (isError 면 빨간색으로 조금 더 오래)
function notify(message, isError = false) {
  const el = document.getElementById("admin-toast");
  el.textContent = message;
  el.classList.toggle("error", isError);
  el.classList.add("show");
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => el.classList.remove("show"), isError ? 4000 : 2500);
}

/* ── 시작 ─────────────────────────────────────────────────────── */

function initAdmin() {
  showTestModeBanner(); // Firebase 설정이 비어 있으면 "테스트 모드" 안내 (js/db/db.js)
  document.getElementById("add-grade").innerHTML = gradeOptionsHtml("mid1");

  // CSV 파일을 붙여넣기 칸에 끌어다 놓기
  const bulkText = document.getElementById("bulk-text");
  bulkText.addEventListener("dragover", (event) => {
    event.preventDefault();
    bulkText.classList.add("drag-over");
  });
  bulkText.addEventListener("dragleave", () => bulkText.classList.remove("drag-over"));
  bulkText.addEventListener("drop", (event) => {
    event.preventDefault();
    bulkText.classList.remove("drag-over");
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) loadBulkFile(file);
  });

  // 선생님 칩 클릭: 그 선생님만 보기 (한 번 더 누르면 전체 보기)
  document.getElementById("teacher-chips").addEventListener("click", (event) => {
    const chip = event.target.closest(".teacher-chip");
    if (!chip) return;
    const select = document.getElementById("filter-teacher");
    select.value = select.value === chip.dataset.teacher ? "" : chip.dataset.teacher;
    renderRoster();
  });

  // 명단 표의 수정 · 삭제 · 저장 · 취소 · 다시 불러오기 버튼
  const body = document.getElementById("roster-body");
  body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "reload") {
      loadRoster();
      return;
    }
    const id = button.closest("tr").dataset.id;
    if (action === "edit") {
      editingId = id;
      renderRoster();
      body.querySelector(`tr[data-id="${CSS.escape(id)}"] .edit-input`).focus();
    } else if (action === "cancel") {
      editingId = null;
      renderRoster();
    } else if (action === "save") {
      saveEdit(id);
    } else if (action === "delete") {
      deleteStudent(id);
    }
  });
  body.addEventListener("keydown", (event) => {
    if (!event.target.classList.contains("edit-input")) return;
    const id = event.target.closest("tr").dataset.id;
    if (event.key === "Enter") saveEdit(id);
    if (event.key === "Escape") {
      editingId = null;
      renderRoster();
    }
  });

  loadRoster();
}

initAdmin();
