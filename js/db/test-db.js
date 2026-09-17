/* ==========================================================================
   js/db/test-db.js — 🧪 테스트 모드 저장소 (Firebase 설정이 비어 있을 때)
   --------------------------------------------------------------------------
   js/firebase-config.js 를 아직 채우지 않았을 때 내 컴퓨터(localhost)에서 화면을 미리 써 볼 수
   있도록, "이 브라우저 안(localStorage)"에만 저장합니다. js/db/db.js 가 이 저장소를 고릅니다.

   · 다른 컴퓨터 · 다른 브라우저와 공유되지 않고, 브라우저 데이터를 지우면 사라집니다.
   · 데이터 구조는 Firebase 와 똑같고, Firestore 규칙의 주요 검사
     (명단에 있는 학생이고 학년이 같아야 체크리스트 저장)도 똑같이 흉내 냅니다.
   · 테스트 데이터 전체 지우기: 개발자 도구(F12) 콘솔에서  localStorage.removeItem("nature_test_db")
   ========================================================================== */

const TEST_DB_KEY = "nature_test_db"; // localStorage 에 저장하는 이름
const TEST_DB_DELAY_MS = 120; // 진짜 서버처럼 아주 잠깐 기다림 ("불러오는 중" 화면도 확인할 수 있게)

function createTestDB() {
  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem(TEST_DB_KEY));
      if (data && data.students && data.reports) return data;
    } catch (e) {
      // 읽을 수 없으면 빈 저장소로 시작
    }
    return { students: {}, reports: {} };
  };
  const save = (data) => {
    try {
      localStorage.setItem(TEST_DB_KEY, JSON.stringify(data));
    } catch (e) {
      throw dbError("브라우저 저장 공간에 쓰지 못했습니다. (용량 부족 또는 사생활 보호 모드)", {
        cause: e,
      });
    }
  };
  const copy = (value) => (value == null ? null : JSON.parse(JSON.stringify(value)));
  const wait = () => new Promise((resolve) => setTimeout(resolve, TEST_DB_DELAY_MS));
  const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const newId = () =>
    Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => ID_CHARS[b % ID_CHARS.length]).join("");
  const allStudents = (data) => Object.entries(data.students).map(([id, s]) => ({ id, ...s }));

  return {
    mode: "test",
    connect: async () => {},

    async listStudents() {
      await wait();
      return sortStudents(allStudents(load()));
    },

    async listStudentsByTeacher(teacher) {
      await wait();
      return sortStudents(allStudents(load()).filter((s) => s.teacher === teacher));
    },

    async addStudents(items) {
      await wait();
      const data = load();
      const now = Date.now();
      const created = items.map((item, index) => {
        const id = newId();
        data.students[id] = { ...item, order: now * 1000 + index, createdAt: now, updatedAt: now };
        return { id, ...data.students[id] };
      });
      save(data);
      return created;
    },

    async updateStudent(id, fields) {
      await wait();
      const data = load();
      if (!data.students[id]) throw dbError(NOT_FOUND_MESSAGE, { code: "not-found" });
      const changed = { ...fields, updatedAt: Date.now() };
      data.students[id] = { ...data.students[id], ...changed };
      save(data);
      return changed;
    },

    async deleteStudent(id) {
      await wait();
      const data = load();
      let count = 0;
      for (const [key, report] of Object.entries(data.reports)) {
        if (report.studentId === id) {
          delete data.reports[key];
          count++;
        }
      }
      delete data.students[id];
      save(data);
      return count;
    },

    async getReport(student, exam) {
      await wait();
      return copy(load().reports[reportId(student, exam)]);
    },

    async getReports(students, exam) {
      await wait();
      const data = load();
      return Object.fromEntries(
        students.map((s) => [s.id, copy(data.reports[reportId(s, exam)])]),
      );
    },

    async saveReport(student, exam, report, updatedAt) {
      await wait();
      const data = load();
      // Firestore 규칙과 같은 검사: 명단에 있는 학생이고 학년이 같아야 저장됨
      const saved = data.students[student.id];
      if (!saved || saved.grade !== student.grade) {
        throw dbError(PERMISSION_DENIED_MESSAGE, { code: "permission-denied" });
      }
      data.reports[reportId(student, exam)] = reportDocument(student, exam, report, updatedAt);
      save(data);
      return updatedAt;
    },
  };
}
