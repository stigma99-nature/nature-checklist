/* ==========================================================================
   js/legacy-import.js — 📥 예전 버전(브라우저 저장본) 가져오기
   --------------------------------------------------------------------------
   예전에는 체크리스트가 서버가 아니라 "각 브라우저"(IndexedDB)에 저장됐습니다.
   서버에 아직 체크리스트가 없는 학생을 열 때, 이 브라우저에 예전 저장본이 있으면
   그 내용을 불러와 서버에 저장해 줍니다. (예전 저장본은 지우지 않고 그대로 둡니다)

   찾는 방법: 예전 저장본의 구분 키 "학년|학생 이름|학교명|시험" 이
             명단의 학년·이름·학교 + 선택한 시험으로 만든 키와 "정확히" 같을 때
             예) "mid2|홍길동|예시중|1학기 기말고사"
             (명단 이름 뒤 구분용 영문자가 있으면 붙인 이름 "홍길동A" 와 뗀 이름 "홍길동" 둘 다 찾아봄)

   ※ 선생님들이 예전 내용을 모두 옮기고 나면 지워도 되는 파일입니다.
     (지울 때: 이 파일 + index.html 의 <script> 한 줄 + student-list.js 의 findLegacyReport 부분)
   ========================================================================== */

const LEGACY_DB_NAME = "nature_checklist_db"; // 예전 버전이 쓰던 IndexedDB 이름
const LEGACY_STORE = "reports";

// 명단의 학생 · 시험에 맞는 예전 저장본을 찾는다. 없거나 읽을 수 없으면 null.
async function findLegacyReport(student, exam) {
  try {
    if (!window.indexedDB) return null;
    // 예전 DB 가 없는 브라우저에 빈 DB 를 새로 만들지 않도록 먼저 목록을 확인
    if (indexedDB.databases) {
      const list = await indexedDB.databases();
      if (!list.some((info) => info.name === LEGACY_DB_NAME)) return null;
    }
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(LEGACY_DB_NAME);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      if (!db.objectStoreNames.contains(LEGACY_STORE)) return null;
      const fullName = String(student.name || "").trim();
      const names = [...new Set([fullName, splitStudentName(fullName).base])];
      for (const name of names) {
        const key = [student.grade, name, String(student.school || "").trim(), exam].join("|");
        const record = await readRecord(db, key);
        if (record) {
          return {
            opinion: record.opinion || "",
            customEdits: record.customEdits || {},
            activeGrades: record.activeGrades || {},
            scopeSelections: record.scopeSelections || {},
          };
        }
      }
      return null;
    } finally {
      db.close();
    }
  } catch (error) {
    console.warn("예전 저장본 확인 실패", error);
    return null;
  }
}

// 예전 DB 에서 키 하나로 저장본을 읽는다 (없으면 null)
function readRecord(db, key) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(LEGACY_STORE, "readonly")
      .objectStore(LEGACY_STORE)
      .get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}
