/* ==========================================================================
   js/login.js — 👤 선생님 이름 로그인 / 로그아웃
   --------------------------------------------------------------------------
   · 처음 접속하면 로그인 화면(#login-screen)이 뜹니다.
   · 선생님 이름을 입력하면 저장소(js/db/db.js 의 DB)에서 담당 학생 명단을 받아
     왼쪽 목록을 만들고(js/student-list.js) 체크리스트를 엽니다.
   · 명단에 없는 이름이면 담당 학생 없이 "빈 체크리스트"로 시작합니다 (저장되지 않음).
   · 로그인한 이름은 이 브라우저에 기억해 두었다가, 다음에 접속하면 자동으로 로그인합니다.
   · 명단(선생님·학생)은 관리자 페이지(/admin)에서 등록합니다.

   ※ 비밀번호 없이 이름만 확인하는 간단한 로그인입니다.
   스타일: css/login.css
   ========================================================================== */

const TEACHER_KEY = "nature_teacher"; // 이 브라우저에 기억하는 "로그인한 선생님 이름"

// 페이지를 열 때 (main.js): 기억된 이름이 있으면 자동 로그인, 없으면 로그인 화면만 보여 줌
async function initLogin() {
  showLoginScreen();
  const remembered = safeStorage.get(TEACHER_KEY);
  if (!remembered) return;
  document.getElementById("login-name").value = remembered;
  await loginAs(remembered);
}

// 로그인 폼 제출 (index.html 의 onsubmit)
function submitLogin(event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게
  const name = document.getElementById("login-name").value.trim();
  if (!name) {
    setLoginMessage("선생님 이름을 입력해 주세요.");
    return;
  }
  loginAs(name);
}

// 이름으로 로그인
//   명단에 담당 학생이 있으면 → 학생 목록 + 마지막(또는 첫 번째) 학생 체크리스트
//   명단에 없는 이름이면     → 빈 체크리스트
async function loginAs(name) {
  setLoginBusy(true);
  setLoginMessage("");
  try {
    const students = await fetchTeacherStudents(name);
    currentTeacher = name;
    safeStorage.set(TEACHER_KEY, name);
    document.getElementById("teacher-name").textContent = `${name} 선생님`;
    setTeacherStudents(students);
    hideLoginScreen();
    if (students.length) {
      await openInitialStudent();
    } else {
      openBlankChecklist(); // 마지막으로 고른 학년 (처음이면 중1)
      showToast("명단에 없는 이름이라 빈 체크리스트로 시작해요 (저장되지 않아요)");
    }
    updateExamSpotlight(); // 시험이 공란이면 왼쪽 위 시험 선택만 밝게 (js/student-list.js)
  } catch (error) {
    setLoginMessage(`로그인하지 못했습니다.\n${error.message}`);
  } finally {
    setLoginBusy(false);
  }
}

// 로그아웃 버튼 (index.html): 지금 체크리스트를 저장한 뒤 로그인 화면으로
async function logout() {
  if (!(await confirmLeave())) return;
  safeStorage.remove(TEACHER_KEY);
  safeStorage.remove(LAST_STUDENT_KEY);
  currentTeacher = null;
  teacherStudents = [];
  closeStudentForm(); // 학생 추가 · 수정 폼이 열려 있었으면 닫기 (js/student-list.js)
  closeChecklist("로그인하면 담당 학생의 체크리스트가 열립니다.");
  document.getElementById("teacher-name").textContent = "";
  document.getElementById("login-name").value = "";
  setLoginMessage("");
  showLoginScreen();
}

/* ── 로그인 화면 표시 ──────────────────────────────────────────── */

function showLoginScreen() {
  document.getElementById("login-screen").classList.add("open");
  updateExamSpotlight(); // 로그인 화면이 뜨면 시험 선택 안내는 숨김
  setTimeout(() => document.getElementById("login-name").focus(), 0);
}

function hideLoginScreen() {
  document.getElementById("login-screen").classList.remove("open");
}

// 로그인 카드 아래 안내·오류 문구 (줄바꿈 \n 가능)
function setLoginMessage(message) {
  document.getElementById("login-message").textContent = message;
}

// 명단을 확인하는 동안 버튼을 잠근다
function setLoginBusy(busy) {
  const button = document.getElementById("login-submit");
  button.disabled = busy;
  button.textContent = busy ? "확인 중…" : "시작하기";
}
