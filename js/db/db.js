/* ==========================================================================
   js/db/db.js — 💾 저장소(DB): 어느 저장소를 쓸지 고르기 + 입력값 검사
   --------------------------------------------------------------------------
   체크리스트 화면과 관리자 페이지는 저장소를 직접 부르지 않고 항상 이 파일의 DB 를 씁니다.
     예)  const students = await DB.listStudentsByTeacher("김선생");
          await DB.saveReport(student, "1학기 기말고사", data);

   어느 저장소를 쓸지 (페이지를 열 때 한 번 정함 → DB.mode)
     · js/firebase-config.js 가 채워져 있으면      → "firebase"    js/db/firebase-db.js
     · 비어 있고 내 컴퓨터(localhost)에서 열었으면  → "test"        js/db/test-db.js (이 브라우저에만 저장)
     · 비어 있는데 배포한 사이트에서 열었으면       → "unavailable" (모든 요청이 설정 안내 오류)

   DB 함수 (모두 Promise → await 로 결과 받기. 실패하면 화면에 보여 줄 문구가 담긴 오류를 던짐)
     connect()                        연결 준비 (Firebase: 프로그램 불러오기)
     listStudents()                   전체 명단                          → [학생, …]
     listStudentsByTeacher(선생님)     그 선생님의 담당 학생               → [학생, …]
     addStudents([학생, …])            여러 명 추가 (보낸 순서 = 명단 순서)  → [만든 학생, …]
     updateStudent(id, 학생)           학생 정보 수정                      → 바뀐 칸 { …, updatedAt }
     deleteStudent(id)                학생 + 그 학생의 체크리스트 삭제     → 지운 체크리스트 수
     getReport(학생, 시험)             체크리스트 하나                    → 내용 또는 null
     getReports([학생, …], 시험)       여러 학생의 체크리스트             → { 학생id: 내용 또는 null }
     saveReport(학생, 시험, 내용)       체크리스트 저장 (통째로 덮어씀)      → 저장 시각(밀리초)
     (학생 = { id, teacher, name, school, grade, className, … })

   Firestore 데이터 구조 (컬렉션 이름은 js/db/firebase-db.js 의 STUDENTS_COLLECTION · REPORTS_COLLECTION)
     checklist-students/{자동 id}            학생 명단 한 줄
       { teacher: "김선생", name: "홍길동A", school: "예시중", grade: "mid2",
         className: "중2A반_수 7:30", order, createdAt, updatedAt }   ← order: 등록(CSV 줄) 순서
     checklist-report/{학생id__학년__시험}    체크리스트 하나   예) "a1B2…__mid2__1학기 기말고사"
       { studentId, teacher, studentName, schoolName, grade, examType,
         opinion, customEdits, activeGrades, scopeSelections, gradeNotes, detailUnits, updatedAt }

   ⚠️ 이 파일은 firebase-db.js · test-db.js 보다 "뒤에" 불러와야 합니다 (index.html 순서).
   ⚠️ 검사 규칙(글자 수 · 학년 모양 등)을 바꾸면 firestore.rules 도 함께 맞춰 주세요.
   ========================================================================== */

/* ── 공통 도우미 (두 저장소가 함께 씀) ─────────────────────────────── */

// 학생 한 명 · 시험 하나의 체크리스트 문서 id.  예) "a1B2c3…__mid2__1학기 기말고사"
function reportId(student, exam) {
  return `${student.id}__${student.grade}__${exam}`;
}

// 등록 순서 값. order 가 없는 학생(콘솔에서 직접 넣은 학생 등)은 등록 시각으로 대신한다.
function orderOf(student) {
  return typeof student.order === "number" ? student.order : (student.createdAt || 0) * 1000;
}

// 선생님(가나다순) → 등록 순서(CSV 줄 순서) → 이름 순으로 정렬
function sortStudents(list) {
  return list.sort(
    (a, b) =>
      String(a.teacher).localeCompare(String(b.teacher), "ko") ||
      orderOf(a) - orderOf(b) ||
      String(a.name).localeCompare(String(b.name), "ko"),
  );
}

// 저장할 체크리스트 문서. 누구의 어떤 체크리스트인지도 함께 적어 둔다 (Firestore 콘솔에서 알아보기 쉽게).
function reportDocument(student, exam, data, updatedAt) {
  return {
    studentId: student.id,
    teacher: student.teacher || "",
    studentName: student.name || "",
    schoolName: student.school || "",
    grade: student.grade,
    examType: exam,
    ...data,
    updatedAt,
  };
}

// 화면에 그대로 보여 줄 문구가 담긴 오류
//   code      : 오류 종류 (예: "invalid-input", "permission-denied")
//   retryable : 인터넷 문제처럼 잠시 뒤 다시 하면 될 수도 있는지 (자동 저장이 다시 시도)
function dbError(message, { code = "error", retryable = false, cause } = {}) {
  const error = new Error(message);
  error.code = code;
  error.retryable = retryable;
  error.friendly = true;
  if (cause) error.cause = cause;
  return error;
}

const PERMISSION_DENIED_MESSAGE =
  "저장소 규칙이 요청을 막았습니다. 명단에서 학생이 지워졌거나 학년이 바뀌었을 수 있으니 새로고침해 주세요. (계속되면 Firebase 콘솔의 Firestore 규칙에 firestore.rules 의 체크리스트 부분을 추가했는지 확인)";
const NOT_FOUND_MESSAGE = "대상을 찾을 수 없습니다. 이미 삭제되었을 수 있으니 새로고침해 주세요.";

/* ── 입력값 검사 ─────────────────────────────────────────────────
   저장소에 보내기 전에 한 번 더 확인합니다. (Firestore 규칙도 같은 내용을 넉넉하게 검사)
   ─────────────────────────────────────────────────────────── */

const MAX_ADD_STUDENTS = 500; // 한 번에 추가할 수 있는 최대 인원
const REPORT_TEXT_MAX = 20000; // 체크리스트 칸 하나(HTML 포함)의 최대 글자 수
const REPORT_KEYS_MAX = 500; // 항목(중단원) 최대 개수
const GRADE_NOTE_TEXT_MAX = 100; // 진단평가 메모 최대 글자 수 (화면에서는 더 짧게 막음)

const inputError = (message) => dbError(message, { code: "invalid-input" });

// 글자 입력값 정리: 앞뒤 공백 제거 + 비었는지 · 너무 긴지 검사
function cleanText(value, label, { max = 40, required = true, noSlash = false } = {}) {
  const text = String(value ?? "").trim();
  if (required && !text) throw inputError(`${label}을(를) 입력해 주세요.`);
  if (text.length > max) throw inputError(`${label}은(는) ${max}자 이하로 입력해 주세요.`);
  if (noSlash && text.includes("/")) throw inputError(`${label}에는 / 를 쓸 수 없습니다.`);
  return text;
}

// 명단 한 줄 검사 → 저장할 칸만 돌려준다.
// grade 는 js/data/curriculum.js 의 학년 코드 (mid1, mid2 …), className(반 이름)은 비워도 됨
function cleanStudent(input) {
  const item = input || {};
  const grade = String(item.grade ?? "").trim();
  if (!/^[a-z][a-z0-9_]{0,19}$/.test(grade)) {
    throw inputError(`학년 값이 올바르지 않습니다: ${grade || "(비어 있음)"}`);
  }
  return {
    teacher: cleanText(item.teacher, "선생님 이름", { max: 30 }),
    name: cleanText(item.name, "학생 이름", { max: 30 }),
    school: cleanText(item.school, "학교명", { max: 40 }),
    grade,
    className: cleanText(item.className, "반 이름", { max: 60, required: false }),
  };
}

// 시험 종류 (예: "1학기 기말고사") — 체크리스트 문서 id 에 들어가므로 / 금지
function cleanExam(value) {
  return cleanText(value, "시험 종류", { max: 30, noSlash: true });
}

// 체크리스트 내용 (js/storage.js 의 buildStateObj 가 만든 것)에서 필요한 칸만 골라 검사한다.
function cleanReportData(data) {
  if (!data || typeof data !== "object") throw inputError("저장할 내용이 없습니다.");
  const out = {
    opinion: limitText(data.opinion), // 종합 의견 HTML
    customEdits: {}, // { "m1-3-1_content": "<ul>…</ul>", "m1-3-1_sol": "-", "m1-3_sol": "-" }
    activeGrades: {}, // { "m1-3": "B", "m1-3-1": "A" }  (대단원 id = 간단히, 중단원 id = 자세히)
    scopeSelections: {}, // { "m1-3-1": true }
    gradeNotes: {}, // { "m1-3": "18/20" }  진단평가 메모 (적은 항목만)
    detailUnits: {}, // { "m1-3": true }  대단원마다 "진단평가 자세히"를 켰는지
  };
  for (const [key, value] of entriesOf(data.customEdits)) {
    out.customEdits[safeKey(key)] = limitText(value);
  }
  for (const [key, value] of entriesOf(data.activeGrades)) {
    if (["A", "B", "C"].includes(value)) out.activeGrades[safeKey(key)] = value;
  }
  for (const [key, value] of entriesOf(data.scopeSelections)) {
    out.scopeSelections[safeKey(key)] = value === true;
  }
  for (const [key, value] of entriesOf(data.gradeNotes)) {
    const note = String(value ?? "").trim();
    if (note.length > GRADE_NOTE_TEXT_MAX) throw inputError("진단평가 메모가 너무 깁니다.");
    if (note) out.gradeNotes[safeKey(key)] = note;
  }
  for (const [key, value] of entriesOf(data.detailUnits)) {
    out.detailUnits[safeKey(key)] = value === true;
  }
  return out;
}

function entriesOf(obj) {
  const entries = obj && typeof obj === "object" ? Object.entries(obj) : [];
  if (entries.length > REPORT_KEYS_MAX) throw inputError("저장할 항목이 너무 많습니다.");
  return entries;
}

function limitText(value) {
  const text = String(value ?? "");
  if (text.length > REPORT_TEXT_MAX) throw inputError("한 칸의 내용이 너무 깁니다.");
  return text;
}

// 항목 이름은 "m1-3-1_content" 같은 영문 · 숫자 · - · _ 만 허용
function safeKey(key) {
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(key)) throw inputError("잘못된 항목 이름입니다.");
  return key;
}

/* ── 저장소 고르기 ─────────────────────────────────────────────── */

// js/firebase-config.js 에 프로젝트 정보가 들어 있는지
function hasFirebaseConfig() {
  return (
    typeof firebaseConfig === "object" &&
    firebaseConfig !== null &&
    String(firebaseConfig.projectId || "").trim() !== "" &&
    String(firebaseConfig.apiKey || "").trim() !== ""
  );
}

// 내 컴퓨터에서 연 페이지인지 (테스트 모드는 여기서만 허용 → 배포 사이트가 실수로 테스트 모드가 되지 않게)
function isLocalComputer() {
  return (
    location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)
  );
}

// 쓸 수 없는 저장소: 어떤 함수를 불러도 같은 안내 오류
function createUnavailableDB(message) {
  const fail = async () => {
    throw dbError(message, { code: "config" });
  };
  return {
    mode: "unavailable",
    connect: fail,
    listStudents: fail,
    listStudentsByTeacher: fail,
    addStudents: fail,
    updateStudent: fail,
    deleteStudent: fail,
    getReport: fail,
    getReports: fail,
    saveReport: fail,
  };
}

function pickStore() {
  if (typeof firebaseConfig === "undefined") {
    return createUnavailableDB(
      "js/firebase-config.js 파일을 읽지 못했습니다. 붙여넣은 내용에 빠진 쉼표 · 따옴표 · 괄호가 없는지, import 줄을 함께 붙여넣지 않았는지 확인해 주세요.",
    );
  }
  if (hasFirebaseConfig()) return createFirebaseDB(firebaseConfig);
  if (isLocalComputer()) return createTestDB();
  return createUnavailableDB(
    "Firebase 연결 정보(js/firebase-config.js)가 비어 있습니다. README 의 '배포' 순서대로 설정값을 붙여넣어 주세요.",
  );
}

// 화면 코드가 쓰는 저장소. 입력값을 검사한 뒤 고른 저장소에 전달한다.
const DB = (() => {
  const store = pickStore();
  return {
    mode: store.mode, // "firebase" | "test" | "unavailable"
    connect: () => store.connect(),
    listStudents: () => store.listStudents(),
    listStudentsByTeacher: async (teacher) =>
      store.listStudentsByTeacher(cleanText(teacher, "선생님 이름", { max: 30 })),
    addStudents: async (items) => {
      if (!Array.isArray(items) || !items.length) throw inputError("추가할 학생이 없습니다.");
      if (items.length > MAX_ADD_STUDENTS) {
        throw inputError(`한 번에 ${MAX_ADD_STUDENTS}명까지 추가할 수 있습니다.`);
      }
      return store.addStudents(items.map(cleanStudent));
    },
    updateStudent: async (id, fields) =>
      store.updateStudent(cleanText(id, "학생 id", { max: 100, noSlash: true }), cleanStudent(fields)),
    deleteStudent: async (id) =>
      store.deleteStudent(cleanText(id, "학생 id", { max: 100, noSlash: true })),
    getReport: async (student, exam) => store.getReport(student, cleanExam(exam)),
    getReports: async (students, exam) => store.getReports(students, cleanExam(exam)),
    saveReport: async (student, exam, data) =>
      store.saveReport(student, cleanExam(exam), cleanReportData(data), Date.now()),
  };
})();

// 테스트 모드일 때 화면 맨 위에 작은 안내 띠를 띄운다 (js/main.js · admin/admin.js 에서 호출)
// 모양: css/base.css 의 .test-mode-banner
function showTestModeBanner() {
  if (DB.mode !== "test" || document.getElementById("test-mode-banner")) return;
  const banner = document.createElement("div");
  banner.id = "test-mode-banner";
  banner.className = "test-mode-banner no-print";
  banner.textContent =
    "🧪 테스트 모드 — Firebase 설정(js/firebase-config.js)이 비어 있어 이 브라우저에만 저장됩니다";
  document.body.appendChild(banner);
}
