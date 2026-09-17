/* ==========================================================================
   js/report-header.js — ② 리포트 머리말 (이름 / 학교명 / 시험) + 저장 파일 이름
   --------------------------------------------------------------------------
   · 목록에서 고른 학생이면: 명단 정보로 자동으로 채우고, 직접 고칠 수 없습니다.
     (이름·학교를 고치려면 관리자 페이지 /admin 에서 명단을 수정하세요)
     이름 뒤의 구분용 영문자는 떼고 넣습니다.  예) 명단 "홍길동A" → 머리말 "홍길동"
   · 빈 체크리스트(명단에 없는 이름으로 로그인)면: 이름·학교명을 직접 입력합니다.
   · 브라우저 탭 제목(document.title)도 함께 바꿉니다.
     → 이 제목이 PDF 저장 때 기본 파일 이름, 이미지 저장 때 파일 이름이 됩니다.
       예) [네이처과학] 홍길동학생_예시중_중2과학_1학기 기말고사_완벽내신_체크리스트

   스타일: css/report-header.css
   ========================================================================== */

// 지금 상태(학생 · 빈 체크리스트 · 시험)에 맞게 머리말 칸과 탭 제목을 채운다.
function fillReportHeader() {
  const nameInput = document.getElementById("student-name");
  const schoolInput = document.getElementById("school-name");
  if (!isBlankChecklist) {
    nameInput.value = currentStudent ? splitStudentName(currentStudent.name).base : "";
    schoolInput.value = currentStudent ? currentStudent.school || "" : "";
  }
  // 빈 체크리스트일 때만 직접 입력할 수 있게
  [nameInput, schoolInput].forEach((input) => {
    input.readOnly = !isBlankChecklist;
    input.tabIndex = isBlankChecklist ? 0 : -1;
  });
  document.getElementById("exam-type").value = currentExam;
  updateTitle();
}

// 빈 체크리스트에서 이름·학교명을 입력할 때 (index.html 의 oninput): 탭 제목만 바꿈
function onHeaderInput() {
  if (isBlankChecklist) updateTitle();
}

// 이름·학교·학년·시험으로 브라우저 탭 제목(= 저장 파일 이름)을 만든다.
// 학생도 빈 체크리스트도 아니면(로그인 전) 기본 제목을 쓴다.
function updateTitle() {
  if (!currentStudent && !isBlankChecklist) {
    document.title = "네이처과학학원 완벽내신 CHECKLIST";
    return;
  }
  const sName =
    document.getElementById("student-name").value.trim() || "미입력";
  const sSchool =
    document.getElementById("school-name").value.trim() || "학원";
  const sExam = document.getElementById("exam-type").value; // 시험을 안 골랐으면 "" → 제목에서 빠짐
  const parts = [`${sName}학생`, sSchool, `${gradeLabel(currentGrade)}과학`, sExam, "완벽내신", "체크리스트"];
  document.title = `[네이처과학] ${parts.filter(Boolean).join("_")}`;
}
