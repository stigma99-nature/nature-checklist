# 네이처과학학원 완벽내신 CHECKLIST

학생별로 단원 진단(A / B / C), 점수 메모, SOLUTION, 종합 의견을 작성해서
**인쇄 · PDF · 이미지**로 학부모님께 전달하는 웹 도구입니다.

- **관리자 페이지(`/admin`)** — 선생님별 담당 학생 명단을 등록합니다. (비밀번호 없음)
- **선생님 로그인** — 선생님 이름을 입력하면 담당 학생들의 체크리스트 목록이 왼쪽에 생깁니다.
- **Firebase 저장 (Cloud Firestore)** — 명단과 체크리스트가 Firebase 에 저장되어 어느 기기에서나 이어서 작성할 수 있습니다.
- **서버 코드 · 빌드 과정 없음** — HTML · CSS · JS 파일을 브라우저가 그대로 읽고, 브라우저가 Firebase 에 직접 저장합니다.
  그래서 Vercel 에는 환경변수 없이 파일만 올리면 됩니다.

> 📘 **코드를 직접 고치고 싶다면 [MANUAL.md](MANUAL.md)** — 파일별 설명, 전체 구조, 100개가 넘는 수정 예제(문구 · 시험 · 단원 · 색 · 배치 · 인쇄 · 관리자 · 데이터 칸 추가 등), 문제 해결을 정리한 설명서입니다.

---

## 1. 폴더 구조

```
nature-checklist/
├── index.html                  선생님용 체크리스트 화면 (주소: /)
├── admin/                      🗂️ 관리자 페이지 (주소: /admin)
│   ├── index.html              화면 뼈대
│   ├── admin.css               모양
│   └── admin.js                동작 (명단 추가 · CSV 올리기 · 수정 · 삭제)
│
├── css/                        🎨 선생님 화면 모양
│   ├── base.css                색상 변수 · 기본 스타일 · 전체 2단 레이아웃 · 테스트 모드 안내 띠 (관리자 페이지도 사용)
│   ├── login.css               로그인 화면
│   ├── sidebar.css             왼쪽: 선생님 · 시험 선택 · 담당 학생 목록 · 단원 설정 (넓은 PC 에서는 단원 설정이 오른쪽)
│   ├── report-header.css       가운데: A4 용지 · 머리말 (이름/학교/시험)
│   ├── checklist-table.css     가운데: 체크리스트 표 · 진단평가 메모 칸 · SOLUTION 문구 팝오버 · 안내 문구
│   ├── opinion.css             가운데 아래: 종합 의견
│   ├── action-dock.css         오른쪽 위 버튼 모음 · 저장 상태 · 토스트 알림
│   ├── responsive.css          모바일(폭 860px 이하)용 덮어쓰기
│   └── print.css               인쇄용 덮어쓰기
│
├── js/                         ⚙️ 동작
│   ├── data/
│   │   └── curriculum.js       📚 학년별 단원 · 주요 내용 데이터
│   ├── firebase-config.js      🔑 Firebase 연결 정보 (배포 전에 한 번 채우기)
│   ├── db/                     💾 저장소 (체크리스트 화면 · 관리자 페이지 공용)
│   │   ├── firebase-db.js      Firebase(Firestore) 에 읽고 쓰기 + 오류 안내 문구 · 컬렉션 이름
│   │   ├── test-db.js          테스트 모드 (설정이 비어 있을 때 이 브라우저에만 저장)
│   │   └── db.js               둘 중 하나를 골라 DB 로 사용 + 입력값 검사
│   ├── config.js               고정 설정값 (학년 이름표, 단원 색, A/B/C 표시, 자동 저장 간격)
│   ├── state.js                여러 파일이 함께 쓰는 "현재 상태" (로그인한 선생님, 열린 학생, 시험)
│   ├── utils.js                글자 다루기 · 불러온 HTML 정리 · 브라우저 저장소 도우미
│   ├── notify.js               자동 저장 상태 표시 · 토스트 알림
│   ├── storage.js              체크리스트 자동 저장 / 불러오기
│   ├── legacy-import.js        예전 버전(브라우저 저장본) 가져오기
│   ├── scope-panel.js          단원 설정 체크박스
│   ├── report-header.js        머리말 (명단 정보) · 저장 파일 이름
│   ├── checklist-table.js      체크리스트 표 · A/B/C 평가 · 진단평가 메모 · SOLUTION 칸과 문구 팝오버
│   ├── student-list.js         시험 선택 · 담당 학생 목록 · 체크리스트 열기
│   ├── login.js                선생님 로그인 / 로그아웃
│   ├── export.js               출력 전 검사 · 인쇄/PDF · 이미지 저장/복사
│   └── main.js                 🚀 시작점 (페이지를 열면 실행)
│
├── firestore.rules             🔒 Firestore 보안 규칙 (Firebase 콘솔의 규칙에 추가하는 내용)
├── dev-server.js               🧪 내 컴퓨터에서 실행해 보는 간단한 서버 (배포에는 안 씀)
├── MANUAL.md                   📘 코드 수정 설명서 (초보자용 · 수정 예제 모음)
└── README.md                   지금 보고 있는 안내서
```

## 2. 사용 흐름

```
[관리자]  /admin 접속 → 학생 명단 등록
                        (CSV 파일 올리기 · 엑셀 붙여넣기 · 한 명씩 추가)
                                          │
[선생님]  / 접속 → 선생님 이름 입력 ──────────┘
          → 왼쪽에 담당 학생 목록 (반별로 묶임 · 학년 배지 · 선택한 시험의 A/B/C 개수)
          → 왼쪽 위에서 시험 선택 (처음엔 공란)
          → 학생을 누르면 그 학생 · 그 시험의 체크리스트가 열림 (머리말에 이름·학교 자동 입력)
          → 단원 설정에서 시험 범위 체크 → A/B/C · 점수 메모 · SOLUTION · 종합 의견 입력 (자동 저장)
          → 🖨️ 인쇄 / 📸 이미지 저장 / 📋 이미지 복사

[명단에 없는 이름으로 로그인]
          → 담당 학생 없이 "빈 체크리스트" 로 시작
          → 머리말에 이름·학교를 직접 입력, 왼쪽에서 학년 선택 → 인쇄 · 이미지 가능 (저장은 안 됨)
```

- **시험 선택**(왼쪽 위)은 처음에 **공란**입니다. 시험을 골라야 학생 체크리스트가 열립니다 (공란일 때 학생을 누르면, 시험을 고르는 순간 그 학생이 열려요). 같은 탭에서 새로고침하면 고른 시험이 유지되고, 새로 접속하면 다시 공란입니다.
- 시험을 바꾸면 모든 학생이 그 시험 기준으로 바뀝니다. 체크리스트는 **학생 · 시험마다 따로** 저장됩니다.
- **단원 설정**에서 켠 단원만 표에 보이고 인쇄됩니다. 새 체크리스트는 모두 꺼진 상태로 시작합니다.
  넓은 PC 화면(창 폭 1280px 이상)에서는 단원 설정이 **화면 오른쪽**에, 그보다 좁으면 왼쪽 학생 목록 아래에 보입니다.
- **진단평가 메모 칸** — 각 줄의 A/B/C 버튼 아래에 시험 점수 같은 짧은 글(최대 30자, 한 줄)을 적을 수 있습니다.
  적은 칸만 인쇄 · 이미지에 A/B/C 배지 아래 글자로 나오고, 비워 둔 칸은 나오지 않습니다.
- **SOLUTION 칸의 기본값은 `-`(공란)** 입니다. 그대로 두면 인쇄물에도 `-` 로 나옵니다.
  칸을 누르면 `-` 가 전체 선택되어 바로 타이핑하면 바뀌고, 다 지우고 나가면 다시 `-` 로 채워집니다.
- 명단 이름 뒤의 **구분용 영문자**(예: `홍길동A` 의 `A`)는 목록에서만 작게 보이고, 머리말 · 인쇄물 · 파일 이름에는 `홍길동` 으로 들어갑니다.
- 로그인한 이름 · 마지막 학생은 브라우저가 기억해서, 다음 접속 때 바로 이어집니다.
- 비밀번호가 없는 사이트입니다 → 아래 [7. 보안 안내](#7-보안-안내-비밀번호가-없는-사이트) 를 꼭 읽어 주세요.

### 명단 CSV 파일 올리기 (관리자 페이지)

**학생 추가 → 📂 CSV 파일 · 엑셀 붙여넣기로 여러 명 한 번에 추가** 에서 파일을 고르거나 끌어다 놓습니다.

```
이름,학년,중학교,반명,일정,시험범위,선생님
홍길동A,2학년,예시중,중2A반_수 7:30,시험없음.,,김선생
이영희B,2학년,새싹중,중2A반_수 7:30,9/28~9/29,"6,7*",김선생
```

- 첫 줄 **제목**으로 열을 찾습니다 — `이름`/`학생` · `학년` · `중학교`/`학교` · `반명`/`반` · `선생님`/`담당`. 열 순서는 상관없고, 그 밖의 열(일정 · 시험범위 등)은 읽지 않습니다.
- 엑셀에서 저장한 한글 CSV(EUC-KR)와 UTF-8 CSV 모두 읽습니다.
- 등록 전에 미리보기로 확인하고, **이미 명단에 있는 학생(선생님·이름·학교·학년이 같은 학생)은 건너뜁니다.** 그래서 새 학생이 추가된 CSV 를 다시 올려도 됩니다.
- 명단 순서는 파일의 줄 순서를 따르고, 선생님 화면에서는 **반 이름별로** 묶여 보입니다. (반 이름 글자가 조금이라도 다르면 다른 반으로 묶입니다)
- 학생 개인정보가 담긴 파일이므로 **GitHub 저장소에는 넣지 마세요.** 관리자 페이지로 올리면 Firebase 에만 저장됩니다.

## 3. 화면 ↔ 파일 찾기

| 화면에서 보이는 것 | 모양 (CSS) | 동작 (JS) |
| --- | --- | --- |
| 로그인 화면 | `login.css` | `login.js` |
| 선생님 · 시험 선택 · 반별 담당 학생 목록 | `sidebar.css` | `student-list.js` |
| 빈 체크리스트 (명단에 없는 이름) | `sidebar.css`, `report-header.css` | `student-list.js`, `login.js` |
| 단원 설정 | `sidebar.css` | `scope-panel.js` |
| 머리말 (이름 / 학교 / 시험) | `report-header.css` | `report-header.js` |
| 체크리스트 표 · A/B/C · 진단평가 메모 · SOLUTION | `checklist-table.css` | `checklist-table.js` |
| 종합 의견 | `opinion.css` | `storage.js` (저장) |
| 자동 저장 · 불러오기 | `action-dock.css` (상태 표시) | `storage.js`, `notify.js` → `db/db.js` |
| 인쇄 / 이미지 버튼 | `action-dock.css`, `print.css` | `export.js` |
| 관리자 페이지 | `admin/admin.css` | `admin/admin.js` → `db/db.js` |
| 🧪 테스트 모드 안내 띠 | `base.css` | `db/db.js` |
| 모바일 화면 | `responsive.css` | – |

## 4. 자주 하는 수정

| 하고 싶은 것 | 고칠 곳 |
| --- | --- |
| 선생님 · 학생 명단 | 관리자 페이지 `/admin` (CSV 파일 올리기 · 엑셀 붙여넣기 · 한 명씩 추가) |
| CSV 제목 이름 추가로 인식하기 | `admin/admin.js` 의 `HEADER_NAMES` |
| 단원 이름 · 주요 내용 수정/추가 | `js/data/curriculum.js` (⚠️ 이미 쓰던 `id` 는 바꾸지 않기) |
| 학년 추가 (예: `mid3_22`) | `js/data/curriculum.js` 에 데이터 + `js/config.js` 의 `GRADE_LABELS` 에 이름표 |
| 시험 종류 목록 | `index.html` 의 `<select id="exam-select">` (첫 번째 빈 항목은 기본 공란용 · ⚠️ 이미 쓰던 `value` 는 바꾸지 않기) |
| SOLUTION 자주 쓰는 문구 | `index.html` ⑤ — `injectMacro('문구', false)` 와 버튼 글자 |
| SOLUTION 기본값 (`-`) | `js/checklist-table.js` 의 `BLANK_SOLUTION` |
| 진단평가 메모 안내 글자 · 최대 글자 수 | `js/checklist-table.js` 의 `data-placeholder="점수 등"` · `GRADE_NOTE_MAX` |
| 사이트 기본 색 | `css/base.css` 의 `:root` 변수 |
| 대단원별 색 | `js/config.js` 의 `UNIT_COLORS` |
| 자동 저장 간격 | `js/config.js` 의 `SAVE_DELAY_MS` |
| 인쇄 여백 · 글자 크기 | `css/print.css` |
| Firebase 프로그램 버전 | `js/db/firebase-db.js` 의 `FIREBASE_SDK_URL` |
| Firestore 컬렉션 이름 | `js/db/firebase-db.js` 의 `STUDENTS_COLLECTION` · `REPORTS_COLLECTION` (⚠️ `firestore.rules` 의 경로도 함께) |

## 5. 데이터 저장 구조 (Cloud Firestore)

같은 Firebase 프로젝트의 다른 데이터와 섞이지 않도록 컬렉션 이름 앞에 `checklist-` 를 붙였습니다.

```
checklist-students/{자동 id}                학생 명단
  { teacher: "김선생", name: "홍길동A", school: "예시중", grade: "mid2",
    className: "중2A반_수 7:30", order, createdAt, updatedAt }     ← order: 등록(CSV 줄) 순서

checklist-report/{학생id__학년__시험}        체크리스트   예) "a1B2…__mid2__1학기 기말고사"
  { studentId, teacher, studentName, schoolName, grade, examType,
    opinion,          종합 의견 (HTML)
    customEdits,      { "m2-1-1_content": 주요 내용, "m2-1-1_sol": SOLUTION ("-" = 공란) }
    activeGrades,     { "m2-1-1": "A" }          평가한 줄만
    scopeSelections,  { "m2-1-1": true }         단원 설정 체크 상태
    gradeNotes,       { "m2-1-1": "18/20" }      진단평가 메모를 적은 줄만
    updatedAt }
```

- 명단에서 **담당 선생님**을 바꾸면 작성된 체크리스트도 새 선생님에게 함께 보입니다.
- 명단에서 **학년**을 바꾸면(진급) 새 학년 체크리스트로 새로 시작하고, 이전 학년 기록은 남습니다.
- 관리자 페이지에서 **학생을 삭제**하면 그 학생의 체크리스트도 모두 함께 삭제됩니다. (되돌릴 수 없음)
- 같은 체크리스트를 두 기기에서 동시에 고치면 **마지막에 저장한 내용**이 남습니다.
- **예전 버전 저장본**: 체크리스트가 없는 학생을 열 때, 그 브라우저에 예전 방식(IndexedDB)으로
  저장된 같은 학년·이름·학교·시험의 내용이 있으면 자동으로 Firebase 로 옮깁니다 (`js/legacy-import.js`).

## 6. 배포 (Firebase + Vercel) — 처음 한 번

서버 설정 · 환경변수 · 비밀 키 · 로그인 설정이 **필요 없습니다.** Firebase 콘솔에서 아래 3가지만 하면 됩니다.

### ① Firebase 웹 앱 설정값 → `js/firebase-config.js`

1. [Firebase 콘솔](https://console.firebase.google.com) → 쓸 프로젝트 선택 (다른 앱과 같은 프로젝트를 써도 됩니다)
2. **⚙️ 프로젝트 설정 → 일반 → 내 앱 → 웹(`</>`)** 앱의 설정값 확인 (웹 앱이 없으면 새로 등록)
3. `const firebaseConfig = { … };` 부분만 복사해서 `js/firebase-config.js` 의 같은 부분에 통째로 붙여넣기
   - 위아래의 `import …` 줄이나 `initializeApp(…)` 줄은 복사하지 않습니다.
   - 이 값(apiKey 등)은 비밀번호가 아니라 공개돼도 되는 연결 주소입니다. GitHub 에 올라가도 괜찮습니다.

### ② Firestore 데이터베이스 확인

**빌드 → Firestore Database** 에 데이터베이스가 이미 있으면 그대로 씁니다. 없으면 **데이터베이스 만들기**
(데이터베이스 ID `(default)` 그대로 · 위치 `asia-northeast3 (서울)` 권장 · 프로덕션 모드).

체크리스트는 `checklist-students` · `checklist-report` 두 컬렉션만 쓰므로 다른 데이터와 섞이지 않습니다.

### ③ 보안 규칙에 체크리스트 부분 추가

**Firestore Database → 규칙(Rules) 탭**

> ⚠️ **기존 규칙을 지우지 마세요.** 같은 프로젝트의 다른 앱이 쓰는 규칙이 사라지면 그 앱이 멈춥니다.

1. 이 저장소의 `firestore.rules` 에서 `// ▼ 체크리스트 시작` 부터 `// ▲ 체크리스트 끝` 까지 복사
2. 기존 규칙의 `match /databases/{database}/documents {` 블록 안, **맨 아래 닫는 괄호 `}` 바로 위**에 붙여넣기

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {

       … 원래 있던 규칙들 (그대로 둠) …

       // ▼ 체크리스트 시작
       … 붙여넣은 부분 …
       // ▲ 체크리스트 끝
     }
   }
   ```

3. **게시(Publish)** — 문법 오류가 있으면 콘솔이 빨간 표시로 알려 줍니다.

- 규칙이 비어 있는 새 프로젝트라면 `firestore.rules` 파일 전체를 붙여넣어도 됩니다.
- `firestore.rules` 를 고치면 자동으로 반영되지 않습니다. 고칠 때마다 콘솔에서 같은 부분을 바꿔 주세요.
- 이 사이트는 Firebase 로그인(Authentication)을 쓰지 않습니다. 이 사이트 때문에 **익명 로그인**을 켜 두었다면 꺼도 됩니다
  (다른 앱의 규칙이 "로그인한 사람은 모두 허용" 이면, 익명 로그인을 켜 두는 것만으로 그 데이터가 노출될 수 있습니다).

### ④ Vercel 에 올리기

GitHub 에 올리면(push) 연결된 Vercel 프로젝트가 자동으로 배포합니다. **환경변수는 필요 없습니다.**
(예전 AI 기능 · 서버 저장용으로 넣어 두었던 `OPENAI_KEY`, `FIREBASE_SERVICE_ACCOUNT`, `ADMIN_PASSWORD` 같은 환경변수가 있다면 지워도 됩니다)

배포 주소의 `/admin` 에서 명단을 등록하고, `/` 에서 선생님 이름으로 로그인해 확인하세요.

### 이런 안내가 뜨면

| 화면의 안내 | 할 일 |
| --- | --- |
| 저장소 규칙이 요청을 막았습니다 | ③ 체크리스트 규칙을 추가 · 게시했는지 확인. 명단에서 학생이 지워졌거나 학년이 바뀐 경우라면 새로고침. (프로젝트에 App Check 가 켜져 있어도 이렇게 막힐 수 있음) |
| Firestore 데이터베이스가 없습니다 / Firestore 가 아직 준비되지 않았습니다 | ② 데이터베이스 만들기 (ID 는 `(default)`) |
| Firebase API 키가 다른 사이트 주소에서만 쓰도록 제한돼 있습니다 | Google Cloud 콘솔 → API 및 서비스 → 사용자 인증 정보 → 그 API 키의 웹사이트 제한에 배포 주소 추가 |
| Firebase 설정값이 올바르지 않습니다 / firebase-config.js 파일을 읽지 못했습니다 | ① 설정값을 다시 복사해 붙여넣기 (쉼표 · 따옴표 · 괄호 확인) |
| Firebase 연결 정보(js/firebase-config.js)가 비어 있습니다 | ① 을 하지 않은 채 배포됨 |
| 인터넷 연결이 불안정해… | 인터넷 확인 (자동 저장은 5초 뒤 다시 시도) |

## 7. 보안 안내 (비밀번호가 없는 사이트)

- 선생님 화면은 **이름만**, 관리자 페이지는 **아무것도 없이** 들어갈 수 있습니다.
  그래서 **사이트 주소를 아는 사람은 누구나** 학생 명단(이름 · 학교 · 반)과 체크리스트를 보고, 고치고, 지울 수 있습니다.
- 사이트 주소, 특히 **`/admin` 주소는 외부에 공유하지 마세요.** 학생 삭제는 되돌릴 수 없습니다.
- `firestore.rules` 의 체크리스트 규칙은 "정해진 모양의 데이터인지"만 확인하고 사람을 구분하지는 못합니다.
  대신 `checklist-students` · `checklist-report` 두 컬렉션에만 적용되어, 같은 프로젝트의 다른 데이터 권한은 넓히지 않습니다.
- 누군가 저장소에 이상한 HTML 을 넣어도 화면에서 실행되지 않도록, 불러온 내용은 정리한 뒤 보여 줍니다 (`js/utils.js` 의 `sanitizeHtml`).
- 나중에 보호가 더 필요해지면 Firebase Authentication(이메일/비밀번호 등) 로그인을 붙이고 규칙을 좁히는 방식으로 바꿀 수 있습니다.

## 8. 내 컴퓨터에서 실행해 보기

```bash
node dev-server.js
```

- 체크리스트: http://localhost:5600 · 관리자 페이지: http://localhost:5600/admin (설치할 패키지 없음)
- `js/firebase-config.js` 가 **채워져 있으면** 실제 Firebase 에 저장됩니다. (배포 사이트와 같은 데이터)
- **비어 있으면 🧪 테스트 모드** — 화면 맨 위에 노란 안내 띠가 뜨고, 이 브라우저 안(localStorage)에만 저장됩니다.
  테스트 데이터 지우기: 개발자 도구(F12) 콘솔에서 `localStorage.removeItem("nature_test_db")`
- 테스트 모드는 내 컴퓨터(localhost)에서만 켜집니다. 배포 사이트에서 설정이 비어 있으면 안내 문구만 뜹니다.

> `index.html` 을 더블클릭해서 열면(`file://`) 관리자 페이지 등이 제대로 열리지 않으니 위 서버를 쓰세요.

## 9. 코드 읽기 팁

- **JS 파일끼리 전역 공유** — `import/export` 모듈이 아니라 일반 `<script>` 로 불러오기 때문에,
  한 파일의 함수·변수를 다른 파일에서 그대로 부를 수 있습니다.
  - 그래서 `index.html` 맨 아래의 **불러오는 순서**가 중요하고, `main.js` 는 항상 마지막입니다.
  - 다른 파일에 이미 있는 이름으로 `let` / `const` 를 또 만들면 오류가 납니다.
- **HTML 에서 바로 함수 호출** — `onclick="printReport()"` 처럼 적혀 있으면 그 이름으로
  프로젝트 전체를 검색(VS Code: `Ctrl + Shift + F`)하면 함수가 있는 파일이 나옵니다.
- **표는 JS 가 그립니다** — 체크리스트 표는 `index.html` 에 없고
  `checklist-table.js` 의 `renderReportTables()` 가 `js/data/curriculum.js` 를 읽어 만듭니다.
  표 안의 요소는 중단원 `id` 로 찾습니다.

  | id 예시 | 가리키는 것 |
  | --- | --- |
  | `m1-3-1-row` | 표의 한 줄 (`<tr>`) |
  | `m1-3-1-content` | 주요 내용 칸 |
  | `m1-3-1-solution` | SOLUTION 칸 |
  | `m1-3-1-badge` | 인쇄·이미지용 A/B/C 배지 |
  | `m1-3-1-note` | 진단평가 메모 칸 (A/B/C 버튼 아래) |
  | `mid1-unit-idx-2` | 중1 의 세 번째 대단원 블록 (0부터 셈) |

- **저장 흐름** — 화면 코드(`storage.js` · `student-list.js` · `admin/admin.js`) → `js/db/db.js` 의 `DB`
  (입력값 검사) → `js/db/firebase-db.js` (Firestore) 또는 `js/db/test-db.js` (테스트 모드).
  저장 방식을 바꾸려면 `js/db/` 폴더만 고치면 됩니다. 데이터 모양을 바꾸면 `firestore.rules` 도 함께 고치세요.
- **CSS 적용 순서** — 같은 우선순위의 스타일이 겹치면 나중에 불러온 파일이 이깁니다.
  `responsive.css` → `print.css` 는 항상 맨 마지막에 두세요.
