/* ==========================================================================
   js/db/firebase-db.js — ☁️ Firebase 저장소 (Cloud Firestore)
   --------------------------------------------------------------------------
   js/firebase-config.js 가 채워져 있으면 js/db/db.js 가 이 저장소를 고릅니다.
   화면 코드는 이 파일을 직접 부르지 않고 db.js 의 DB 를 씁니다.

   · Firebase 프로그램(SDK)은 처음 쓸 때 인터넷(www.gstatic.com)에서 불러옵니다. 설치는 필요 없습니다.
   · 컬렉션 이름 앞에 checklist- 를 붙여, 같은 Firebase 프로젝트의 다른 데이터와 섞이지 않게 했습니다.
       학생 명단  → checklist-students
       체크리스트 → checklist-report
   · 로그인(Firebase Authentication)은 쓰지 않습니다. 누가 읽고 쓸 수 있는지는
     Firestore 규칙(firestore.rules)이 정합니다.
   · Firestore "Lite" 버전을 씁니다. 요청하면 바로 서버에서 읽고 쓰는 가벼운 버전이라,
     인터넷이 끊기면 기다리지 않고 바로 오류가 납니다 (자동 저장은 잠시 뒤 다시 시도).
   · Firebase 오류는 friendlyFirebaseError() 가 알아보기 쉬운 문구로 바꿉니다.

   공통 도우미 reportId · sortStudents · reportDocument · dbError 는 js/db/db.js 에 있습니다.
   ========================================================================== */

// Firebase 프로그램 주소 (버전을 올릴 때는 숫자만 바꾸기)
const FIREBASE_SDK_URL = "https://www.gstatic.com/firebasejs/12.19.0";

// Firestore 컬렉션 이름 — ⚠️ 바꾸면 firestore.rules 의 match 경로도 똑같이 바꿔야 합니다.
const STUDENTS_COLLECTION = "checklist-students";
const REPORTS_COLLECTION = "checklist-report";

const FIRESTORE_BATCH_LIMIT = 400; // 한 번에 묶어서 쓰는(추가·삭제) 문서 수 (Firestore 최대 500)
const FIRESTORE_IN_LIMIT = 30; // "id 가 이 목록 중 하나" 조건에 한 번에 넣을 수 있는 최대 개수

function createFirebaseDB(config) {
  let connecting = null; // 연결 작업 (한 번만 실행하고, 동시에 여러 번 불러도 같은 작업을 기다림)
  let db = null; // Firestore
  let fs = null; // Firestore 함수 모음 (collection, doc, getDoc …)

  // Firebase 프로그램을 불러와 Firestore 를 준비한다.
  // 실패하면 다음에 부를 때 처음부터 다시 시도하도록 비워 둔다.
  function connect() {
    if (!connecting) {
      connecting = (async () => {
        const [appSdk, firestoreSdk] = await Promise.all([
          import(`${FIREBASE_SDK_URL}/firebase-app.js`),
          import(`${FIREBASE_SDK_URL}/firebase-firestore-lite.js`),
        ]);
        const app = appSdk.getApps()[0] || appSdk.initializeApp(config);
        db = firestoreSdk.getFirestore(app);
        fs = firestoreSdk;
      })().catch((error) => {
        connecting = null;
        throw friendlyFirebaseError(error);
      });
    }
    return connecting;
  }

  // 연결을 기다린 뒤 Firestore 작업(task)을 실행한다. 실패하면 알아보기 쉬운 오류로 바꿔 던진다.
  async function run(task) {
    await connect();
    try {
      return await task();
    } catch (error) {
      throw friendlyFirebaseError(error);
    }
  }

  const studentsRef = () => fs.collection(db, STUDENTS_COLLECTION);
  const reportsRef = () => fs.collection(db, REPORTS_COLLECTION);
  const toStudent = (snap) => ({ id: snap.id, ...snap.data() });

  // 문서 여러 개를 FIRESTORE_BATCH_LIMIT 개씩 묶어서 지운다
  async function deleteAll(refs) {
    for (let i = 0; i < refs.length; i += FIRESTORE_BATCH_LIMIT) {
      const batch = fs.writeBatch(db);
      refs.slice(i, i + FIRESTORE_BATCH_LIMIT).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  }

  return {
    mode: "firebase",
    connect,

    listStudents: () =>
      run(async () => {
        const snap = await fs.getDocs(studentsRef());
        return sortStudents(snap.docs.map(toStudent));
      }),

    listStudentsByTeacher: (teacher) =>
      run(async () => {
        const snap = await fs.getDocs(
          fs.query(studentsRef(), fs.where("teacher", "==", teacher)),
        );
        return sortStudents(snap.docs.map(toStudent));
      }),

    // 보낸 순서대로 등록 순서(order)를 붙여 추가한다
    addStudents: (items) =>
      run(async () => {
        const now = Date.now();
        const created = [];
        for (let i = 0; i < items.length; i += FIRESTORE_BATCH_LIMIT) {
          const batch = fs.writeBatch(db);
          items.slice(i, i + FIRESTORE_BATCH_LIMIT).forEach((item, j) => {
            const ref = fs.doc(studentsRef()); // 새 자동 id
            const data = { ...item, order: now * 1000 + i + j, createdAt: now, updatedAt: now };
            batch.set(ref, data);
            created.push({ id: ref.id, ...data });
          });
          await batch.commit();
        }
        return created;
      }),

    // 이미 지워진 학생이면 not-found 오류
    updateStudent: (id, fields) =>
      run(async () => {
        const changed = { ...fields, updatedAt: Date.now() };
        await fs.updateDoc(fs.doc(studentsRef(), id), changed);
        return changed;
      }),

    // 학생과 그 학생의 체크리스트를 모두 지우고, 지운 체크리스트 수를 돌려준다
    deleteStudent: (id) =>
      run(async () => {
        const snap = await fs.getDocs(
          fs.query(reportsRef(), fs.where("studentId", "==", id)),
        );
        await deleteAll([...snap.docs.map((d) => d.ref), fs.doc(studentsRef(), id)]);
        return snap.size;
      }),

    getReport: (student, exam) =>
      run(async () => {
        const snap = await fs.getDoc(fs.doc(reportsRef(), reportId(student, exam)));
        return snap.exists() ? snap.data() : null;
      }),

    // 여러 학생의 체크리스트를 30개씩 나눠 한꺼번에 읽는다 → { 학생id: 내용 또는 null }
    getReports: (students, exam) =>
      run(async () => {
        const out = {};
        const studentIdOf = new Map(); // 체크리스트 문서 id → 학생 id
        students.forEach((s) => {
          out[s.id] = null;
          studentIdOf.set(reportId(s, exam), s.id);
        });
        const ids = [...studentIdOf.keys()];
        const parts = [];
        for (let i = 0; i < ids.length; i += FIRESTORE_IN_LIMIT) {
          parts.push(ids.slice(i, i + FIRESTORE_IN_LIMIT));
        }
        const snaps = await Promise.all(
          parts.map((part) =>
            fs.getDocs(fs.query(reportsRef(), fs.where(fs.documentId(), "in", part))),
          ),
        );
        snaps.forEach((snap) =>
          snap.docs.forEach((d) => {
            if (studentIdOf.has(d.id)) out[studentIdOf.get(d.id)] = d.data();
          }),
        );
        return out;
      }),

    // 체크리스트를 통째로 덮어써서 저장한다 (마지막에 저장한 내용이 남음)
    saveReport: (student, exam, data, updatedAt) =>
      run(async () => {
        await fs.setDoc(
          fs.doc(reportsRef(), reportId(student, exam)),
          reportDocument(student, exam, data, updatedAt),
        );
        return updatedAt;
      }),
  };
}

// Firebase 오류 → 화면에 보여 줄 문구. (원래 오류는 개발자 도구 콘솔과 error.cause 에 남김)
// retryable: 인터넷 문제처럼 잠시 뒤 다시 하면 될 수도 있는 오류
function friendlyFirebaseError(error) {
  if (error && error.friendly) return error;
  console.warn("Firebase 오류", error);
  const code = String((error && error.code) || "");
  const raw = String((error && error.message) || error || "");
  const make = (message, retryable = false) =>
    dbError(message, { code: code || "firebase", retryable, cause: error });

  if (
    code === "unavailable" ||
    code === "deadline-exceeded" ||
    // Firebase 프로그램(SDK)을 불러오지 못함 · 요청이 끊김 (브라우저마다 문구가 다름)
    (error instanceof TypeError && /fetch|network|import|module script|load failed/i.test(raw))
  ) {
    return make(
      "인터넷 연결이 불안정해 Firebase 에 연결하지 못했습니다. 연결을 확인해 주세요.",
      true,
    );
  }
  if (/api key not valid|API_KEY_INVALID/i.test(raw)) {
    return make(
      "js/firebase-config.js 의 Firebase 설정값이 올바르지 않습니다. Firebase 콘솔에서 다시 복사해 붙여넣어 주세요.",
    );
  }
  if (/referer|referrer/i.test(raw)) {
    return make(
      "Firebase API 키가 다른 사이트 주소에서만 쓰도록 제한돼 있습니다. Google Cloud 콘솔 → API 및 서비스 → 사용자 인증 정보에서 이 사이트 주소를 허용해 주세요.",
    );
  }
  if (/app ?check/i.test(raw)) {
    return make(
      "이 Firebase 프로젝트는 App Check 가 켜져 있어 요청이 막혔습니다. Firebase 콘솔 → App Check 에서 Firestore 적용 상태를 확인해 주세요.",
    );
  }
  if (code === "permission-denied") {
    if (/API has not been used|is disabled/i.test(raw)) {
      return make(
        "Firestore 가 아직 준비되지 않았습니다. Firebase 콘솔 → Firestore Database 에서 데이터베이스를 만들어 주세요.",
      );
    }
    return make(PERMISSION_DENIED_MESSAGE);
  }
  if (code === "not-found") {
    // 데이터베이스가 없을 때: "The database (default) does not exist for project …"
    // 문서가 없을 때:       "No document to update: projects/…/databases/(default)/documents/…"
    return make(
      /database.*does not exist/i.test(raw)
        ? "Firestore 데이터베이스가 없습니다. Firebase 콘솔 → Firestore Database 에서 데이터베이스를 만들어 주세요. (데이터베이스 ID 는 (default))"
        : NOT_FOUND_MESSAGE,
    );
  }
  if (code === "resource-exhausted") {
    return make(
      "Firebase 사용량 한도를 넘었습니다. 잠시 뒤 다시 시도해 주세요. (계속되면 Firebase 콘솔에서 사용량 확인)",
      true,
    );
  }
  if (code === "invalid-argument") {
    return make("저장할 수 없는 값이 있습니다. (내용이 너무 크거나 잘못된 값)");
  }
  if (["aborted", "internal", "unknown", "cancelled"].includes(code)) {
    return make(`Firebase 요청이 잠시 실패했습니다. 다시 시도해 주세요. (${code})`, true);
  }
  return make(`Firebase 오류: ${raw}`);
}
