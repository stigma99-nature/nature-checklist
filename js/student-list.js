/* ==========================================================================
   js/student-list.js — ① 왼쪽 "담당 학생" 목록 · 시험 선택 · 체크리스트 열기
   --------------------------------------------------------------------------
   · 목록은 로그인할 때 저장소에서 받은 명단(관리자가 /admin 에서 등록)으로 만들어집니다.
     명단 순서(CSV 줄 순서) 그대로, 반(className)별로 묶어서 보여 줍니다.
   · 학생을 누르면 → 그 학생 · 선택한 시험의 체크리스트를 저장소에서 불러와 가운데에 엽니다.
                     (한 번도 저장된 적이 없으면 새 체크리스트로 시작)
   · 시험을 바꾸면 → 목록의 A/B/C 개수와 열린 체크리스트가 그 시험 것으로 바뀝니다.
   · 시험이 공란이면 → 왼쪽 위 시험 선택 칸만 밝게, 나머지 화면은 어둡게 안내 (updateExamSpotlight)
   · 로그인하면 마지막으로 열었던 학생(없으면 첫 번째 학생)의 체크리스트가 자동으로 열립니다.
   · 명단에 없는 이름으로 로그인하면 → "빈 체크리스트" (이름·학교 직접 입력, 저장 안 함)
   · 목록 아래 "＋ 학생 추가"       → 새 학생을 이 선생님 명단에 바로 등록
               "✏️ 이름·학교 수정" → 지금 열린 학생의 이름 · 학교명 고치기 (submitStudentForm)

   스타일: css/sidebar.css · 저장소: js/db/db.js 의 DB
   ========================================================================== */

const EXAM_KEY = "nature_exam"; // 이 탭에서만 기억하는 "고른 시험" (새로고침하면 유지, 새로 접속하면 공란)
const LAST_STUDENT_KEY = "nature_last_student"; // 이 브라우저에 기억하는 "마지막으로 연 학생 id"
const BLANK_GRADE_KEY = "nature_blank_grade"; // 이 브라우저에 기억하는 "빈 체크리스트에서 마지막으로 고른 학년"

let teacherStudents = []; // 로그인한 선생님의 담당 학생 [{ id, name, school, grade, className, summary }]
let openRequestNo = 0; // 학생을 빠르게 여러 번 누르면 마지막으로 누른 학생만 열리도록 매기는 번호
let blankInitialTable = null; // 빈 체크리스트를 처음 열었을 때의 표 내용 (작성했는지 비교용)

/* ── 담당 학생 목록 ────────────────────────────────────────────── */

// 저장소에서 선생님의 담당 학생 목록(+ 선택한 시험의 A/B/C 개수)을 받아 온다.
// 시험을 아직 고르지 않았으면 체크리스트는 읽지 않는다 (summary: null).
async function fetchTeacherStudents(teacher) {
  const students = await DB.listStudentsByTeacher(teacher);
  const reports = currentExam && students.length ? await DB.getReports(students, currentExam) : {};
  return students.map((student) => ({
    ...student,
    summary: summarize(reports[student.id], student.grade),
  }));
}

// 체크리스트에서 A/B/C 개수만 뽑는다 → { A: 3, B: 1, C: 0, updatedAt } (체크리스트가 없으면 null)
// grade: 학생의 학년 코드 (예: "mid2")
function summarize(report, grade) {
  if (!report) return null;
  return { ...countGrades(report, grade), updatedAt: report.updatedAt || null };
}

// 저장된 체크리스트(state)의 A/B/C 개수 → { A, B, C }
// 가운데 진행 현황("평가 3/20개 완료 · A 1 / B 1 / C 1")과 같은 기준으로 셉니다.
//   · 단원 설정에서 켠 중단원이 있는 대단원만
//   · 간단히 대단원은 대단원 평가 1개, 자세히 대단원은 켠 중단원들의 평가
function countGrades(state, grade) {
  const counts = { A: 0, B: 0, C: 0 };
  const grades = state.activeGrades || {};
  const scope = state.scopeSelections || {};
  const detailUnits = resolveDetailUnits(state, grade);
  const units = hasGradeData(grade) ? CURRICULUM_DATA[grade] : [];
  const gradeOf = (key) =>
    Object.prototype.hasOwnProperty.call(grades, key) ? grades[key] : "";
  units.forEach((unit, idx) => {
    const unitKey = unitKeyOf(unit, idx, grade);
    const shownSubs = unit.sub.filter((s) => scope[s.id] === true);
    if (!shownSubs.length) return;
    const keys = detailUnits[unitKey] ? shownSubs.map((s) => s.id) : [unitKey];
    keys.forEach((key) => {
      const g = gradeOf(key);
      if (g === "A" || g === "B" || g === "C") counts[g]++;
    });
  });
  return counts;
}

// 목록을 바꾸고 다시 그린다.
function setTeacherStudents(list) {
  teacherStudents = list;
  renderStudentList();
}

// 왼쪽 학생 목록을 그린다. 반별로 묶고, 지금 열린 학생은 강조(.active)한다.
//   중2A반_수 7:30                5명
//   [중2] 홍길동 A               평가 전
//         예시중
function renderStudentList() {
  updateStudentActions(); // 목록 아래 "이름·학교 수정" 버튼 잠금 · 수정 폼 닫기
  const root = document.getElementById("student-list");
  document.getElementById("student-count").textContent = teacherStudents.length;
  root.innerHTML = "";
  if (!teacherStudents.length) {
    root.innerHTML = isBlankChecklist
      ? '<div class="student-empty">명단에 없는 이름이라 담당 학생이 없어요.<br>가운데 <b>빈 체크리스트</b>에 이름·학교를 직접 입력해 쓸 수 있어요.<br>(작성한 내용은 저장되지 않아요)<br>저장하려면 아래 <b>＋ 학생 추가</b>로 학생을 등록해 주세요.</div>'
      : '<div class="student-empty">담당 학생이 없습니다.<br>아래 <b>＋ 학생 추가</b>로 등록할 수 있어요.</div>';
    return;
  }
  groupByClass(teacherStudents).forEach(({ className, students }) => {
    if (className !== null) {
      const title = document.createElement("div");
      title.className = "class-title";
      title.innerHTML = `<span>${escapeHtml(className || "반 미지정")}</span><b>${students.length}명</b>`;
      root.appendChild(title);
    }
    students.forEach((student) => root.appendChild(studentItem(student)));
  });
}

// 반(className)별로 묶는다. 명단 순서를 지키고, 반은 처음 나온 순서대로 놓는다.
// 반 정보가 있는 학생이 한 명도 없으면 제목 없이 한 묶음(className: null)으로 돌려준다.
function groupByClass(students) {
  if (!students.some((s) => s.className)) return [{ className: null, students }];
  const groups = new Map();
  students.forEach((student) => {
    const key = student.className || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(student);
  });
  return [...groups].map(([className, list]) => ({ className, students: list }));
}

// 목록의 학생 한 줄 (버튼)
function studentItem(student) {
  const { base, tag } = splitStudentName(student.name);
  const item = document.createElement("button");
  item.type = "button";
  item.className = "student-item";
  if (currentStudent && currentStudent.id === student.id) item.classList.add("active");
  item.innerHTML =
    `<span class="si-grade si-grade-${escapeHtml(student.grade)}">${escapeHtml(gradeLabel(student.grade))}</span>` +
    `<span class="si-main">` +
    `<span class="si-name">${escapeHtml(base)}${tag ? `<span class="si-tag">${escapeHtml(tag)}</span>` : ""}</span>` +
    `<span class="si-school">${escapeHtml(student.school || "학교 미입력")}</span>` +
    `</span>` +
    `<span class="si-progress">${progressHtml(student.summary)}</span>`;
  item.addEventListener("click", () => {
    // 이미 열려 있는 학생을 다시 누르면 아무것도 하지 않음
    if (currentStudent && currentStudent.id === student.id && !isLoadingReport) return;
    openChecklist(student.id);
  });
  return item;
}

// 목록 오른쪽의 평가 개수 표시.  예) "A3 B1 C0" / 아직 평가 안 했으면 "평가 전"
function progressHtml(summary) {
  if (!summary || summary.A + summary.B + summary.C === 0) {
    return '<span class="p-none">평가 전</span>';
  }
  return (
    `<span class="p-a">A${summary.A}</span>` +
    `<span class="p-b">B${summary.B}</span>` +
    `<span class="p-c">C${summary.C}</span>`
  );
}

// 저장에 성공하면 목록의 A/B/C 개수도 바로 바꾼다 (storage.js 의 saveNow 에서 호출)
// data: 방금 저장한 체크리스트 내용 (buildStateObj 가 만든 것)
function updateStudentSummary(studentId, exam, data, updatedAt) {
  if (exam !== currentExam) return;
  const student = teacherStudents.find((s) => s.id === studentId);
  if (!student) return;
  student.summary = { ...countGrades(data, student.grade), updatedAt };
  renderStudentList();
}

/* ── 학생 추가 · 이름·학교 수정 (목록 아래 버튼 → 입력 폼) ──────────────
   두 버튼이 폼 하나(#student-form)를 함께 씁니다. studentFormMode 로 어느 쪽인지 구분합니다.

   ＋ 학생 추가
   · 명단에 없는 학생(새로 들어온 학생 등)을 로그인한 선생님의 명단에 바로 등록합니다.
     관리자 페이지(/admin)에서 한 명 추가하는 것과 똑같이 저장소에 저장됩니다.
   · 반은 입력받지 않습니다 (반 없이 등록 → 목록이 반별로 묶여 있으면 맨 아래 "반 미지정" 묶음).
   · 추가하면 그 학생의 체크리스트가 열립니다. 시험을 아직 고르지 않았으면 시험을 고를 때 열립니다.
   · 빈 체크리스트(명단에 없는 이름으로 로그인)에서 추가하면 그때부터 저장되는 일반 화면으로 바뀝니다.

   ✏️ 이름·학교 수정
   · 지금 체크리스트가 열린 학생의 이름 · 학교명만 고칩니다 (열린 학생이 없으면 버튼이 잠김).
   · 고치면 목록 · 머리말(인쇄물) · 탭 제목에 바로 반영되고, 작성한 체크리스트는 그대로 남습니다.
   · 수정 폼을 연 채로 다른 학생을 열면 폼이 닫힙니다 (엉뚱한 학생을 고치지 않게).

   학년 · 반 변경과 학생 삭제는 관리자 페이지에서 합니다.
   모양: css/sidebar.css 의 .student-actions · .student-form
   ─────────────────────────────────────────────────────────── */

let studentFormMode = null; // 열린 폼: "add"(학생 추가) | "edit"(이름·학교 수정) | null(닫힘)
let editingStudentId = null; // 이름·학교를 고치는 학생 id

// "＋ 학생 추가" 버튼: 폼을 비워서 연다.
// 학년은 지금 열린 학생(빈 체크리스트면 고른 학년)의 학년으로 미리 골라 둔다
function openAddStudentForm() {
  document.getElementById("student-form-grade").value = hasGradeData(currentGrade)
    ? currentGrade
    : Object.keys(CURRICULUM_DATA)[0];
  openStudentForm("add", "새 학생 추가", "추가", { name: "", school: "" });
}

// "✏️ 이름·학교 수정" 버튼: 지금 열린 학생의 이름·학교를 채워서 연다.
function openEditStudentForm() {
  if (!currentStudent) return;
  editingStudentId = currentStudent.id;
  openStudentForm("edit", `${currentStudent.name} 학생 정보 수정`, "저장", {
    name: currentStudent.name,
    school: currentStudent.school || "",
  });
}

// 폼을 연다 (학년 칸은 추가할 때만 보임). 폼이 열린 동안 아래 버튼 두 개는 숨긴다.
function openStudentForm(mode, title, submitText, { name, school }) {
  studentFormMode = mode;
  document.getElementById("student-form-title").textContent = title;
  document.getElementById("student-form-submit").textContent = submitText;
  document.getElementById("student-form-name").value = name;
  document.getElementById("student-form-school").value = school;
  document.getElementById("student-form-grade-field").hidden = mode !== "add";
  setStudentFormMessage("");
  const form = document.getElementById("student-form");
  form.hidden = false;
  document.getElementById("student-actions").hidden = true;
  form.scrollIntoView({ block: "nearest" });
  document.getElementById("student-form-name").focus();
}

// 취소 버튼 · 저장을 마쳤을 때 · 로그아웃할 때 (js/login.js)
function closeStudentForm() {
  studentFormMode = null;
  editingStudentId = null;
  document.getElementById("student-form").hidden = true;
  document.getElementById("student-actions").hidden = false;
}

// 목록을 다시 그릴 때마다 (renderStudentList): 열린 학생이 없으면 수정 버튼을 잠그고,
// 수정 폼을 연 채로 다른 학생으로 바뀌었으면 폼을 닫는다.
function updateStudentActions() {
  document.getElementById("edit-student-open").disabled = !currentStudent;
  if (studentFormMode === "edit" && (!currentStudent || currentStudent.id !== editingStudentId)) {
    closeStudentForm();
  }
}

// 폼 아래 오류 문구 (줄바꿈 \n 가능). 다시 입력하기 시작하면 지움 (index.html 의 oninput)
function setStudentFormMessage(message) {
  document.getElementById("student-form-message").textContent = message;
}

// "추가" · "저장" 버튼 (index.html 의 onsubmit)
async function submitStudentForm(event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게
  const name = document.getElementById("student-form-name").value.trim();
  const school = document.getElementById("student-form-school").value.trim();
  if (!name || !school) {
    setStudentFormMessage("이름과 학교명을 입력해 주세요.");
    document.getElementById(name ? "student-form-school" : "student-form-name").focus();
    return;
  }
  if (studentFormMode === "add") await addStudentFromForm(name, school);
  else if (studentFormMode === "edit") await editStudentFromForm(name, school);
}

// 같은 이름 · 학교 · 학년 학생이 이미 목록에 있으면 한 번 물어본다. 계속하면 true
function confirmNotDuplicate({ name, school, grade }, exceptId, question) {
  const duplicate = teacherStudents.some(
    (s) => s.id !== exceptId && s.name === name && s.school === school && s.grade === grade,
  );
  return (
    !duplicate ||
    confirm(`${name}(${school}, ${gradeLabel(grade)}) 학생이 이미 목록에 있습니다.\n${question}`)
  );
}

// 저장소에 보내는 동안 폼 버튼을 잠근다. 실패하면 폼 아래에 오류 문구를 보여 주고 null 을 돌려준다.
async function runStudentFormTask(busyText, failText, task) {
  const button = document.getElementById("student-form-submit");
  const label = button.textContent;
  button.disabled = true;
  button.textContent = busyText;
  setStudentFormMessage("");
  try {
    return await task();
  } catch (error) {
    setStudentFormMessage(`${failText}\n${error.message}`);
    return null;
  } finally {
    button.disabled = false;
    button.textContent = label;
  }
}

// 학생 추가: 명단에 등록하고 그 학생의 체크리스트를 연다
async function addStudentFromForm(name, school) {
  const student = {
    teacher: currentTeacher,
    name,
    school,
    grade: document.getElementById("student-form-grade").value,
  };
  if (!confirmNotDuplicate(student, null, "그래도 추가할까요?")) return;
  const result = await runStudentFormTask("추가 중…", "추가하지 못했습니다.", () =>
    DB.addStudents([student]),
  );
  if (!result || currentTeacher !== student.teacher) return; // 실패 · 저장하는 사이 로그아웃
  const [created] = result;

  teacherStudents.push({ ...created, summary: null });
  if (studentFormMode === "add") closeStudentForm();
  renderStudentList();
  showToast(`✅ ${created.name} 학생을 추가했어요`);

  // 시험을 고르기 전이면 기억만 해 두고, 시험을 고를 때 이 학생이 열리게 한다
  safeStorage.set(LAST_STUDENT_KEY, created.id);
  if (currentExam) {
    await openChecklist(created.id);
  } else if (isBlankChecklist && (await confirmLeave())) {
    // 빈 체크리스트였다면 이제 담당 학생이 생겼으니 시험 선택 안내 화면으로
    await openInitialStudent();
  }
}

// 이름·학교 수정: 명단을 고치고 목록 · 머리말에 바로 반영한다 (학년 · 반은 그대로)
async function editStudentFromForm(name, school) {
  const student = teacherStudents.find((s) => s.id === editingStudentId);
  if (!student || (name === student.name && school === student.school)) {
    closeStudentForm(); // 바뀐 것이 없으면 그냥 닫기
    return;
  }
  if (!confirmNotDuplicate({ name, school, grade: student.grade }, student.id, "그래도 바꿀까요?")) {
    return;
  }
  const changed = await runStudentFormTask("저장 중…", "수정하지 못했습니다.", () =>
    DB.updateStudent(student.id, {
      teacher: student.teacher,
      name,
      school,
      grade: student.grade,
      className: student.className,
    }),
  );
  if (!changed || currentTeacher !== student.teacher) return; // 실패 · 저장하는 사이 로그아웃

  Object.assign(student, changed);
  if (currentStudent && currentStudent.id === student.id) {
    Object.assign(currentStudent, changed);
    fillReportHeader(); // 머리말 이름·학교 칸과 탭 제목(저장 파일 이름)도 새 정보로
  }
  if (studentFormMode === "edit") closeStudentForm();
  renderStudentList();
  showToast(`✅ ${student.name} 학생 정보를 고쳤어요`);
}

/* ── 시험 · 학년 선택 ─────────────────────────────────────────── */

// 페이지를 열 때: 시험 선택을 준비하고, 머리말의 시험 칸에도 같은 목록을 복사한다.
//   · 기본값은 공란. 같은 탭에서 새로고침한 경우에만 고른 시험을 되살린다.
//   · 시험 종류 목록은 index.html 의 <select id="exam-select"> 한 곳에서만 고치면 됩니다.
// 빈 체크리스트 · 학생 추가 폼의 학년 선택 목록도 여기서 채운다 (js/data/curriculum.js 의 학년 전부).
function initExamSelect() {
  const select = document.getElementById("exam-select");
  const saved = safeSession.get(EXAM_KEY);
  select.value =
    saved && Array.from(select.options).some((o) => o.value === saved) ? saved : "";
  currentExam = select.value;
  // 머리말 시험 칸: 선택지는 같게, 공란 항목은 글자 없이 (인쇄물에 "시험 선택"이 찍히지 않도록)
  const headerExam = document.getElementById("exam-type");
  headerExam.innerHTML = select.innerHTML;
  headerExam.querySelectorAll('option[value=""]').forEach((o) => (o.textContent = ""));
  headerExam.value = currentExam;
  updateExamHint();

  const gradeOptions = Object.keys(CURRICULUM_DATA)
    .map((g) => `<option value="${escapeHtml(g)}">${escapeHtml(gradeLabel(g))}</option>`)
    .join("");
  document.getElementById("blank-grade-select").innerHTML = gradeOptions;
  document.getElementById("student-form-grade").innerHTML = gradeOptions;
}

// 시험을 아직 고르지 않았으면(공란) 왼쪽 시험 칸을 눈에 띄게 표시한다.
function updateExamHint() {
  document.getElementById("exam-select").classList.toggle("is-empty", !currentExam);
  updateExamSpotlight();
}

/* ── ⑥ 시험 선택 안내 (스포트라이트) ────────────────────────────
   로그인했는데 시험이 공란이면 왼쪽 위 시험 선택 칸만 밝게 두고 나머지 화면을 어둡게 해서,
   접속한 선생님이 어디부터 눌러야 하는지 바로 보이게 합니다. 시험을 고르면 사라집니다.
   · 로그인 화면이 떠 있을 때, 빈 체크리스트(명단에 없는 이름 — 시험 없이도 씀)에서는 띄우지 않습니다.
   · 어둡게 칠한 부분도 클릭은 됩니다 (학생을 누르면 "먼저 왼쪽 위에서 시험을 선택해 주세요" 알림).
   · 부르는 곳: updateExamHint · setBlankMode (이 파일), loginAs · showLoginScreen (js/login.js)
   모양: css/sidebar.css 의 .exam-spotlight · .exam-spotlight-tip
   ─────────────────────────────────────────────────────────── */
let spotlightFrame = null; // 시험 선택 칸 위치를 따라가는 중이면 애니메이션 프레임 번호, 아니면 null
let spotlightLastKey = ""; // 마지막으로 맞춘 위치 (같으면 다시 옮기지 않음)

// 지금 상태를 보고 안내를 보이거나 숨긴다.
function updateExamSpotlight() {
  const spotlight = document.getElementById("exam-spotlight");
  const tip = document.getElementById("exam-spotlight-tip");
  const show =
    Boolean(currentTeacher) &&
    !currentExam &&
    !isBlankChecklist &&
    !document.getElementById("login-screen").classList.contains("open");
  spotlight.hidden = !show;
  tip.hidden = !show;
  if (show && !spotlightFrame) {
    // 시험 칸이 화면 밖이면(모바일에서 아래로 스크롤해 둔 경우 등) 맨 위로 올려서 보이게
    document.querySelector(".sidebar").scrollTop = 0;
    const r = examPickerElement().getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) window.scrollTo({ top: 0 });
    spotlightLastKey = "";
    followExamSpotlight();
  }
}

// 밝게 남길 영역 = 왼쪽 위 "시험 [선택 칸]" 한 줄
function examPickerElement() {
  return document.getElementById("exam-select").closest(".exam-picker");
}

// 안내가 떠 있는 동안 화면이 바뀔 때마다 시험 선택 칸의 위치를 따라가 밝은 네모와 말풍선을 옮긴다.
// (창 크기 변경 · 스크롤 · 목록이 그려지며 위치가 바뀌어도 어긋나지 않게)
function followExamSpotlight() {
  const spotlight = document.getElementById("exam-spotlight");
  const tip = document.getElementById("exam-spotlight-tip");
  if (spotlight.hidden) {
    spotlightFrame = null;
    return;
  }
  const pad = 8; // 시험 선택 칸 둘레에 남길 밝은 여백
  const gap = 18; // 밝은 네모와 말풍선 사이 간격
  const r = examPickerElement().getBoundingClientRect();
  const pageWidth = document.documentElement.clientWidth;
  const key = [r.left, r.top, r.width, r.height, pageWidth, tip.offsetWidth, tip.offsetHeight].join(",");
  if (key !== spotlightLastKey) {
    spotlightLastKey = key;
    spotlight.style.left = `${r.left - pad}px`;
    spotlight.style.top = `${r.top - pad}px`;
    spotlight.style.width = `${r.width + pad * 2}px`;
    spotlight.style.height = `${r.height + pad * 2}px`;
    // 말풍선: 오른쪽에 자리가 있으면 오른쪽(꼬리가 왼쪽을 가리킴), 좁은 화면이면 아래(꼬리가 위를 가리킴)
    const fitsRight = r.right + pad + gap + tip.offsetWidth <= pageWidth - 12;
    tip.classList.toggle("is-below", !fitsRight);
    tip.style.left = fitsRight ? `${r.right + pad + gap}px` : `${Math.max(12, r.left - pad)}px`;
    tip.style.top = fitsRight
      ? `${r.top + r.height / 2 - tip.offsetHeight / 2}px`
      : `${r.bottom + pad + gap}px`;
  }
  spotlightFrame = requestAnimationFrame(followExamSpotlight);
}

// 시험 선택을 바꿨을 때 (index.html 의 onchange)
async function onExamSelectChange() {
  const select = document.getElementById("exam-select");
  const nextExam = select.value;

  // 빈 체크리스트는 저장된 것이 없으므로 시험 이름만 바꾸고 내용은 그대로 둔다
  if (isBlankChecklist) {
    currentExam = nextExam;
    safeSession.set(EXAM_KEY, nextExam);
    updateExamHint();
    fillReportHeader();
    return;
  }

  if (!(await confirmLeave())) {
    select.value = currentExam; // 이동 취소 → 원래 시험으로 되돌림
    return;
  }
  beginLoading("체크리스트를 불러오는 중…");
  currentExam = nextExam;
  safeSession.set(EXAM_KEY, nextExam);
  updateExamHint();
  try {
    setTeacherStudents(await fetchTeacherStudents(currentTeacher));
  } catch (error) {
    showToast(`학생 목록을 새로 불러오지 못했습니다. ${error.message}`);
  }
  const stillThere =
    currentStudent && teacherStudents.find((s) => s.id === currentStudent.id);
  if (stillThere && currentExam) await openChecklist(stillThere.id, { skipLeaveCheck: true });
  else await openInitialStudent();
}

/* ── 체크리스트 열기 / 닫기 ────────────────────────────────────── */

// 학생·시험을 바꾸거나 로그아웃하기 전에 지금 체크리스트를 저장한다.
// 저장에 실패했거나(학생) 저장되지 않는 내용이 있으면(빈 체크리스트) 이동할지 물어본다.
async function confirmLeave() {
  if (isBlankChecklist) {
    return (
      !hasBlankEdits({ includeHeader: true }) ||
      confirm("빈 체크리스트에 작성한 내용은 저장되지 않습니다.\n그래도 이동할까요?")
    );
  }
  if (!currentStudent || isLoadingReport) return true;
  if (await flushSave()) return true;
  return confirm(
    "방금 입력한 내용을 저장하지 못했습니다.\n그래도 이동할까요? (저장하지 못한 내용은 사라집니다)",
  );
}

// 로그인 직후 · 시험을 고른 직후: 마지막으로 열었던(또는 눌렀던) 학생, 없으면 첫 번째 학생의 체크리스트를 연다.
// 시험이 공란이면 체크리스트를 열지 않고 시험 선택을 안내한다.
async function openInitialStudent() {
  if (!currentExam) {
    closeChecklist("왼쪽 위에서 시험을 먼저 선택하면\n학생의 체크리스트가 열립니다.");
    return;
  }
  const lastId = safeStorage.get(LAST_STUDENT_KEY);
  const first =
    teacherStudents.find((s) => s.id === lastId) || teacherStudents[0];
  if (first) await openChecklist(first.id, { skipLeaveCheck: true });
  else closeChecklist("담당 학생이 없습니다.");
}

// 학생의 체크리스트를 연다.
//   1) 지금 체크리스트 저장  2) 머리말을 새 학생 정보로  3) 저장소에서 불러오기
//   4) 표·단원 설정을 그 학생의 학년으로 다시 그리고 내용 채우기
async function openChecklist(studentId, { skipLeaveCheck = false } = {}) {
  const student = teacherStudents.find((s) => s.id === studentId);
  if (!student) return;
  if (!currentExam) {
    // 시험을 고르기 전: 누른 학생을 기억해 두고 시험 선택을 안내 → 시험을 고르면 이 학생이 열림
    safeStorage.set(LAST_STUDENT_KEY, student.id);
    showToast("먼저 왼쪽 위에서 시험을 선택해 주세요");
    document.getElementById("exam-select").focus();
    return;
  }
  if (!skipLeaveCheck && !(await confirmLeave())) return;

  const requestNo = ++openRequestNo;
  setBlankMode(false);
  currentStudent = student;
  currentGrade = student.grade;
  safeStorage.set(LAST_STUDENT_KEY, student.id);
  renderStudentList();
  fillReportHeader();
  beginLoading("체크리스트를 불러오는 중…");

  if (!hasGradeData(student.grade)) {
    showReportMessage(
      `'${gradeLabel(student.grade)}' 학년의 단원 데이터가 없습니다.\njs/data/curriculum.js 를 확인하거나 관리자 페이지에서 학년을 고쳐 주세요.`,
    );
    setSaveState("idle");
    return;
  }

  let report;
  try {
    report = await fetchReport(student, currentExam);
  } catch (error) {
    if (requestNo !== openRequestNo) return;
    showReportMessage(`체크리스트를 불러오지 못했습니다.\n${error.message}`, { retry: true });
    setSaveState("error");
    return;
  }
  if (requestNo !== openRequestNo) return; // 그사이 다른 학생을 눌렀으면 이 결과는 버림

  // 저장소에 없으면 이 브라우저의 예전 저장본을 찾아본다 (js/legacy-import.js)
  let imported = false;
  if (!report) {
    report = await findLegacyReport(student, currentExam);
    if (requestNo !== openRequestNo) return;
    imported = Boolean(report);
  }

  renderScopeWidget();
  renderReportTables();
  document.getElementById("opinion-textarea").innerHTML = DEFAULT_OPINION;
  // 저장본이 있으면 채우고, 없으면 "단원 체크 = 표 표시" 규칙대로 (처음엔 모두 꺼짐 → 숨김)
  if (report) applyStateObj(report);
  else restoreScopeSelections({});
  updateStatus();
  isLoadingReport = false;

  if (imported) {
    markAsUnsaved();
    if (await persistCurrentReport()) {
      showToast("📥 이 브라우저에 있던 예전 작성 내용을 서버로 옮겼어요");
    }
  } else {
    markAsSaved(report && report.updatedAt);
  }
}

// 체크리스트를 불러오는 동안: 저장을 멈추고 표 자리에 안내 문구를 보여 준다.
function beginLoading(message) {
  isLoadingReport = true;
  if (saveTimer) {
    clearTimeout(saveTimer); // 이전 체크리스트의 저장 예약(재시도 포함)이 남아 있으면 취소
    saveTimer = null;
  }
  hideMacroPopover();
  document.getElementById("opinion-textarea").innerHTML = DEFAULT_OPINION;
  showReportMessage(message);
  setSaveState("loading");
}

// 표 자리에 안내 문구를 보여 준다 (학생 선택 전 · 불러오는 중 · 오류).
// retry: true 면 "다시 시도" 버튼도 보여 준다.
function showReportMessage(message, { retry = false } = {}) {
  document.getElementById("scope-widget-root").innerHTML = "";
  document.getElementById("report-table-root").innerHTML =
    `<div class="table-message">${escapeHtml(message).replace(/\n/g, "<br>")}` +
    (retry
      ? '<br><button type="button" class="table-message-retry" onclick="retryOpenChecklist()">다시 시도</button>'
      : "") +
    "</div>";
  updateStatus();
}

// "다시 시도" 버튼
function retryOpenChecklist() {
  if (currentStudent) openChecklist(currentStudent.id, { skipLeaveCheck: true });
}

// 열린 체크리스트를 닫고 안내 문구를 보여 준다 (페이지를 처음 열 때 · 로그아웃할 때).
function closeChecklist(message) {
  openRequestNo++; // 불러오던 체크리스트가 있으면 무시하도록
  setBlankMode(false);
  currentStudent = null;
  isLoadingReport = false;
  hideMacroPopover();
  document.getElementById("opinion-textarea").innerHTML = DEFAULT_OPINION;
  fillReportHeader();
  showReportMessage(message);
  renderStudentList();
  markAsSaved(null);
}

/* ── 빈 체크리스트 (명단에 없는 이름으로 로그인했을 때) ──────────────
   · 이름·학교명을 머리말에 직접 입력하고, 왼쪽 "학년"에서 학년을 고릅니다.
   · 저장소에 저장하지 않습니다. 인쇄 · 이미지 저장/복사는 그대로 쓸 수 있습니다.
   · 작성한 내용이 있는데 창을 닫거나 로그아웃하면 한 번 더 물어봅니다.
   ─────────────────────────────────────────────────────────── */

// 빈 체크리스트를 연다.
//   grade: 보여 줄 학년 (없으면 마지막으로 고른 학년, 처음이면 첫 번째 학년)
//   keepHeader: 학년만 바꿀 때 입력해 둔 이름·학교명 유지
function openBlankChecklist(grade, { keepHeader = false } = {}) {
  openRequestNo++;
  setBlankMode(true);
  currentStudent = null;
  isLoadingReport = false;
  const wanted = grade || safeStorage.get(BLANK_GRADE_KEY);
  currentGrade = hasGradeData(wanted) ? wanted : Object.keys(CURRICULUM_DATA)[0];
  document.getElementById("blank-grade-select").value = currentGrade;
  hideMacroPopover();
  if (!keepHeader) {
    document.getElementById("student-name").value = "";
    document.getElementById("school-name").value = "";
  }
  fillReportHeader();
  renderScopeWidget();
  renderReportTables();
  document.getElementById("opinion-textarea").innerHTML = DEFAULT_OPINION;
  restoreScopeSelections({});
  updateStatus();
  renderStudentList();
  blankInitialTable = JSON.stringify(buildStateObj());
  setSaveState("blank");
}

// 빈 체크리스트 모드 켜기/끄기 (왼쪽 학년 선택을 보이거나 숨김)
function setBlankMode(on) {
  isBlankChecklist = on;
  document.getElementById("blank-grade-picker").hidden = !on;
  if (!on) blankInitialTable = null;
  updateExamSpotlight(); // 빈 체크리스트는 시험 없이도 쓰므로 시험 선택 안내를 숨김
}

// 빈 체크리스트에 뭔가 작성했는지. includeHeader 면 머리말의 이름·학교 입력도 포함
function hasBlankEdits({ includeHeader = false } = {}) {
  if (!isBlankChecklist) return false;
  const headerTyped =
    document.getElementById("student-name").value.trim() ||
    document.getElementById("school-name").value.trim();
  return (
    JSON.stringify(buildStateObj()) !== blankInitialTable ||
    Boolean(includeHeader && headerTyped)
  );
}

// 빈 체크리스트의 학년을 바꿨을 때 (index.html 의 onchange): 표를 그 학년으로 새로 그림
function onBlankGradeChange() {
  const select = document.getElementById("blank-grade-select");
  if (hasBlankEdits() && !confirm("학년을 바꾸면 표에 작성한 내용이 지워집니다.\n계속할까요?")) {
    select.value = currentGrade;
    return;
  }
  safeStorage.set(BLANK_GRADE_KEY, select.value);
  openBlankChecklist(select.value, { keepHeader: true });
}
