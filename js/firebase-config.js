/* ==========================================================================
   js/firebase-config.js — 🔑 Firebase 연결 정보 (배포 전에 한 번만 채우기)
   --------------------------------------------------------------------------
   Firebase 콘솔 → ⚙️ 프로젝트 설정 → 일반 → 내 앱 → 웹 앱(</>) 의
   "SDK 설정 및 구성" 에 보이는  const firebaseConfig = { … };  부분만 복사해서
   아래  const firebaseConfig = { … };  를 통째로 바꿔 넣으세요.
   (그 위아래에 있는 import … 줄이나 initializeApp(…) 줄은 복사하지 않습니다)

   · 이 값은 비밀번호가 아니라 "어느 Firebase 프로젝트에 연결할지" 알려 주는 주소 같은 것이라
     GitHub 에 올려도 괜찮습니다. 데이터를 지키는 일은 Firestore 규칙(firestore.rules)이 맡습니다.
   · 비어 있으면 "테스트 모드"로 동작합니다 → 내 컴퓨터(localhost)에서만, 이 브라우저 안에만 저장.
     (배포한 사이트에서 비어 있으면 "연결 정보가 비어 있다"는 안내가 뜹니다)
   ========================================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyBfItZPdONr1DSpQItptlJT1rGxW8o3y7o",
  authDomain: "nature-teacher-dashboard.firebaseapp.com",
  projectId: "nature-teacher-dashboard",
  storageBucket: "nature-teacher-dashboard.firebasestorage.app",
  messagingSenderId: "945841668643",
  appId: "1:945841668643:web:874ab60e0cad61bea3e796",
};
