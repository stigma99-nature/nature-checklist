# 📘 네이처과학 완벽내신 CHECKLIST — 코드 수정 설명서

> 코드를 처음 보는 사람도 **"어디를 · 어떻게 · 왜"** 고치면 되는지 따라 할 수 있도록 만든 설명서입니다.
> 프로젝트 소개와 배포 순서는 [README.md](README.md) 에 있고, 이 문서는 **코드를 고치는 법**에 집중합니다.

---

## 목차

- [0. 이 설명서 읽는 법](#0-이-설명서-읽는-법)
- [1. 준비물과 작업 환경](#1-준비물과-작업-환경)
- [2. 초보자를 위한 용어 사전](#2-초보자를-위한-용어-사전)
- [3. 빠른 찾기표 — "이걸 바꾸고 싶어요"](#3-빠른-찾기표--이걸-바꾸고-싶어요)
- [4. 전체 구조 (아키텍처)](#4-전체-구조-아키텍처)
- [5. 파일별 상세 설명](#5-파일별-상세-설명)
- [6. 수정 예제 모음 (레시피)](#6-수정-예제-모음-레시피)
  - [A. 글자 · 문구](#a-글자--문구)
  - [B. 시험 종류](#b-시험-종류)
  - [C. 단원 데이터 (교육과정)](#c-단원-데이터-교육과정)
  - [D. A/B/C 진단평가](#d-abc-진단평가)
  - [E. 진단평가 메모 칸](#e-진단평가-메모-칸)
  - [F. SOLUTION 칸과 문구 버튼](#f-solution-칸과-문구-버튼)
  - [G. 종합 의견](#g-종합-의견)
  - [H. 머리말 · 파일 이름](#h-머리말--파일-이름)
  - [I. 색 · 글꼴 · 디자인](#i-색--글꼴--디자인)
  - [J. 화면 배치](#j-화면-배치)
  - [K. 인쇄 · PDF · 이미지](#k-인쇄--pdf--이미지)
  - [L. 자동 저장](#l-자동-저장)
  - [M. 왼쪽 학생 목록](#m-왼쪽-학생-목록)
  - [N. 로그인](#n-로그인)
  - [O. 관리자 페이지](#o-관리자-페이지)
  - [P. 저장소 · Firebase · 새 데이터 칸](#p-저장소--firebase--새-데이터-칸)
  - [Q. 보안을 더 강하게 하고 싶을 때 (로드맵)](#q-보안을-더-강하게-하고-싶을-때-로드맵)
- [7. 저장 · 배포 · 되돌리기 (Git + Vercel)](#7-저장--배포--되돌리기-git--vercel)
- [8. 문제 해결](#8-문제-해결)
- [9. 고친 뒤 확인 체크리스트](#9-고친-뒤-확인-체크리스트)
- [10. 부록 — 색인](#10-부록--색인)

---

## 0. 이 설명서 읽는 법

### 0-1. 표시 약속

| 표시 | 뜻 |
| --- | --- |
| 📁 `파일 경로` | 고칠 파일. 프로젝트 폴더 기준 경로입니다. (예: `js/config.js`) |
| 🔎 `찾을 글자` | 그 파일에서 **Ctrl + F** 로 검색하면 바로 나오는 글자입니다. |
| ✏️ 바꾸기 전 / 바꾼 후 | 실제로 고치는 코드. "바꾸기 전" 과 똑같은 부분을 찾아 "바꾼 후" 로 바꾸면 됩니다. |
| ✅ 확인 | 고친 뒤 화면에서 확인할 내용 |
| ⚠️ 주의 | 실수하기 쉬운 점, 함께 고쳐야 하는 곳 |
| ⭐ ~ ⭐⭐⭐ | 난이도. ⭐ 글자만 바꾸기 / ⭐⭐ 여러 곳 수정 / ⭐⭐⭐ 기능 추가 |

> 💡 설명서에는 줄 번호를 적지 않았습니다. 코드를 고치다 보면 줄 번호가 금방 바뀌기 때문입니다.
> 대신 🔎 **찾을 글자**로 검색하세요. 검색 글자는 실제 코드에 그대로 들어 있는 글자입니다.

### 0-2. 모든 수정의 기본 순서 (5단계)

1. **찾기** — 이 설명서의 [빠른 찾기표](#3-빠른-찾기표--이걸-바꾸고-싶어요) 나 레시피에서 파일과 🔎 찾을 글자를 확인합니다.
2. **안전장치** — 고치기 전에 지금 상태를 Git 으로 저장(커밋)해 두면, 망가져도 되돌릴 수 있습니다. ([7장](#7-저장--배포--되돌리기-git--vercel))
3. **고치기** — VS Code 에서 파일을 열고 바꿉니다. 한 번에 한 가지씩만 고치는 것이 좋습니다.
4. **확인하기** — `node dev-server.js` 로 켠 화면을 새로고침(**Ctrl + Shift + R**)해서 확인합니다.
   화면이 이상하면 **F12 → Console(콘솔)** 에 빨간 오류가 있는지 봅니다. ([8장](#8-문제-해결))
5. **저장 · 배포** — 잘 되면 커밋하고 GitHub 에 올립니다(push). Vercel 이 자동으로 사이트에 반영합니다.

### 0-3. 가장 중요한 규칙 5가지

1. **이미 쓰고 있는 "열쇠 값"은 바꾸지 않는다.**
   단원 `id`(예: 중단원 `m2-1-1`, 대단원 `m2-1`), 시험 `value`(예: `1학기 중간고사`), 학년 코드(예: `mid2`)는
   저장된 체크리스트와 연결되는 값입니다. 바꾸면 기존 기록이 화면에서 사라집니다(지워지지는 않음).
2. **따옴표 · 쉼표 · 괄호 짝을 맞춘다.** JS 파일에서 하나만 빠져도 그 파일 전체가 동작하지 않습니다.
3. **같은 이름을 두 번 만들지 않는다.** 모든 JS 파일이 이름을 함께 쓰기 때문에(4-3장), 다른 파일에 있는 이름으로
   `const` / `let` 을 또 만들면 오류가 납니다.
4. **데이터 모양을 바꾸면 세 곳을 함께 고친다.** 화면 코드 → `js/db/db.js`(검사) → `firestore.rules`(규칙, 콘솔에 다시 게시).
5. **실제 데이터로 연습하지 않는다.** 지금 `js/firebase-config.js` 가 채워져 있어서, 내 컴퓨터에서 켜도 **실제 Firebase 에 저장**됩니다.
   연습할 때는 [1-4. 연습용 테스트 모드](#1-4-연습용-테스트-모드-실제-데이터를-건드리지-않기) 를 쓰세요.

---

## 1. 준비물과 작업 환경

### 1-1. 필요한 프로그램

| 프로그램 | 용도 | 비고 |
| --- | --- | --- |
| **VS Code** | 코드 편집 | 무료. 폴더 열기: 파일 → 폴더 열기 → `nature-checklist` |
| **Node.js** (22 이상 권장) | 내 컴퓨터에서 사이트 켜기 (`node dev-server.js`) | 설치할 패키지는 없습니다 |
| **Git** | 수정 기록 저장 · GitHub 에 올리기 | VS Code 왼쪽 "소스 제어" 메뉴로도 쓸 수 있습니다 |
| **Chrome** (또는 Edge) | 화면 확인 · 개발자 도구(F12) | 인쇄 · 이미지 복사도 Chrome 기준으로 만들었습니다 |

### 1-2. 내 컴퓨터에서 켜 보기

VS Code 에서 **터미널 → 새 터미널** 을 열고:

```bash
node dev-server.js
```

- 체크리스트 화면: <http://localhost:5600>
- 관리자 페이지: <http://localhost:5600/admin>
- 끄기: 터미널에서 **Ctrl + C**

> 💡 `index.html` 을 더블클릭해서 열면(주소가 `file://…`) 관리자 페이지 등이 제대로 열리지 않습니다. 꼭 위 주소로 여세요.

### 1-3. 고친 내용 확인하기

| 고친 파일 | 확인 방법 |
| --- | --- |
| HTML · CSS · JS | 브라우저에서 **Ctrl + Shift + R** (강력 새로고침). 서버를 다시 켤 필요 없음 |
| `dev-server.js` | 터미널에서 Ctrl + C 로 끄고 `node dev-server.js` 로 다시 켜기 |
| `firestore.rules` | 파일을 고쳐도 반영되지 않음 → **Firebase 콘솔의 규칙 탭에 다시 붙여넣고 게시** |

**개발자 도구 (F12)** 에서 자주 쓰는 탭

- **Console(콘솔)**: 빨간 글씨 = 오류. 파일 이름과 줄 번호가 함께 나옵니다 (클릭하면 그 줄로 이동).
- **Elements(요소)**: 화면의 요소를 클릭해 어떤 HTML · CSS 가 적용됐는지 확인. 왼쪽 위 화살표 아이콘으로 화면을 찍어 고르면 됩니다.
- **Application(애플리케이션) → Local Storage**: 브라우저가 기억하는 값(로그인 이름 등) 확인 · 삭제.
- **기기 모양 아이콘 (Ctrl + Shift + M)**: 모바일 화면 흉내.

### 1-4. 연습용 테스트 모드 (실제 데이터를 건드리지 않기)

`js/firebase-config.js` 의 값이 비어 있으면, 내 컴퓨터(localhost)에서는 **테스트 모드**로 동작합니다.
테스트 모드는 명단 · 체크리스트를 **이 브라우저 안(localStorage)에만** 저장하고, 화면 맨 위에 노란 안내 띠가 뜹니다.

**켜는 법**

📁 `js/firebase-config.js` 🔎 `projectId:`

✏️ 바꾸기 전

```js
  projectId: "nature-teacher-dashboard",
```

✏️ 바꾼 후 (값을 잠시 비움 — **원래 값은 다른 곳에 적어 두세요**)

```js
  projectId: "",
```

✅ 새로고침하면 화면 맨 위에 `🧪 테스트 모드 — …` 띠가 보입니다. 관리자 페이지에서 가짜 학생을 마음껏 등록해도 실제 데이터에는 영향이 없습니다.

**끄는 법** — `projectId` 를 원래 값으로 되돌립니다.

> ⚠️ **테스트 모드 상태로 커밋 · 배포하면 실제 사이트가 동작하지 않습니다.** (배포 사이트에서는 "연결 정보가 비어 있다"는 안내만 뜸)
> 커밋 전에 VS Code 소스 제어 화면에서 `js/firebase-config.js` 가 바뀌어 있지 않은지 꼭 확인하세요.

**테스트 데이터 지우기** — F12 → Console 에 입력 후 Enter:

```js
localStorage.removeItem("nature_test_db")
```

### 1-5. 되돌리기

| 상황 | 방법 |
| --- | --- |
| 방금 입력한 것만 취소 | VS Code 에서 **Ctrl + Z** |
| 파일 하나를 마지막 커밋 상태로 | VS Code 소스 제어 → 파일 오른쪽 ↶(변경 내용 취소), 또는 `git restore 파일경로` |
| 무엇을 바꿨는지 보기 | VS Code 소스 제어에서 파일 클릭(왼쪽 = 전, 오른쪽 = 후), 또는 `git diff` |

### 1-6. 코드에서 찾는 법

| 하고 싶은 것 | 단축키 |
| --- | --- |
| 이 파일 안에서 글자 찾기 | **Ctrl + F** |
| 프로젝트 전체에서 글자 찾기 | **Ctrl + Shift + F** (함수 이름 · id · 문구 찾을 때 가장 유용) |
| 파일 이름으로 열기 | **Ctrl + P** 후 파일 이름 입력 (예: `export`) |
| 함수가 정의된 곳으로 이동 | 함수 이름 위에서 **F12** 또는 Ctrl + 클릭 |

> 💡 화면에 보이는 **문구**로 전체 검색하면, 그 문구를 만드는 파일이 바로 나옵니다.
> 예) 화면의 "평가 전" → Ctrl + Shift + F 로 `평가 전` 검색 → `js/student-list.js` 의 `progressHtml` 함수.

---

## 2. 초보자를 위한 용어 사전

### 2-1. 웹 페이지의 세 가지 재료

| 용어 | 쉬운 설명 | 이 프로젝트에서 |
| --- | --- | --- |
| **HTML** | 화면에 "무엇이 있는지" (뼈대) | `index.html`, `admin/index.html` |
| **CSS** | "어떻게 보이는지" (색 · 크기 · 배치) | `css/*.css`, `admin/admin.css` |
| **JavaScript (JS)** | "어떻게 움직이는지" (클릭 · 저장 · 계산) | `js/*.js`, `admin/admin.js` |

### 2-2. HTML 용어

| 용어 | 설명 | 예 |
| --- | --- | --- |
| 태그 | `<이름>` 으로 여는 화면 조각 | `<button>인쇄</button>` |
| 속성 | 태그에 붙는 추가 정보 | `<input maxlength="30">` 의 `maxlength` |
| `id` | 페이지에서 **하나뿐인** 이름표. JS 가 요소를 찾을 때 씀 | `id="exam-select"` → JS: `document.getElementById("exam-select")` |
| `class` | 모양을 입히는 **그룹 이름표**. 여러 요소가 같은 class 를 가질 수 있음 | `class="btn-master btn-master-all"` (두 개) |
| `onclick="함수()"` | 클릭하면 그 JS 함수를 실행 | `onclick="printReport()"` |
| `oninput` / `onchange` / `onsubmit` | 입력할 때 / 선택을 바꿀 때 / 폼을 제출할 때 실행 | `onchange="onExamSelectChange()"` |
| `hidden` | 붙어 있으면 숨김 | `<label id="blank-grade-picker" hidden>` |
| `contenteditable="true"` | 클릭해서 글자를 직접 고칠 수 있는 칸 | SOLUTION 칸, 종합 의견 칸 |
| 주석 `<!-- … -->` | 화면에 안 나오는 메모 | 파일 곳곳의 설명 |

### 2-3. CSS 용어

| 용어 | 설명 | 예 |
| --- | --- | --- |
| 선택자 | 어떤 요소에 스타일을 줄지 고르는 글자 | `.btn-grade` (class), `#save-state` (id), `button` (태그) |
| 속성 : 값 | 바꿀 모양과 값 | `color: #1565c0;` `font-size: 13px;` |
| 변수 `var(--이름)` | 한곳에 정해 둔 값을 가져다 씀 | `color: var(--brand);` (base.css 의 `--brand`) |
| `:hover` · `:focus` | 마우스를 올렸을 때 · 입력 중일 때 | `.macro-btn:hover` |
| `::before` | 요소 앞에 글자 · 모양을 덧붙임 | `.teacher-name::before { content: "👤 "; }` |
| 미디어 쿼리 `@media` | 조건(화면 폭 · 인쇄)일 때만 적용 | `@media (max-width: 860px) { … }`, `@media print { … }` |
| `!important` | 다른 규칙보다 무조건 우선 | 인쇄용 print.css 에 많음 |
| 색 표기 | `#rrggbb`(16진수) · `rgba(빨,초,파,투명도)` | `#183153`, `rgba(24, 49, 83, 0.97)` |

**우선순위 (같은 요소에 규칙이 겹칠 때)**: `!important` > id 선택자 > class 선택자 > 태그 선택자.
우선순위가 같으면 **나중에 적힌(나중에 불러온 파일의) 규칙**이 이깁니다.

### 2-4. JavaScript 용어

| 용어 | 설명 | 예 |
| --- | --- | --- |
| 변수 `const` | 바뀌지 않는 값 | `const SAVE_DELAY_MS = 1200;` |
| 변수 `let` | 바뀌는 값 | `let currentExam = "";` |
| 함수 `function` | 이름 붙인 동작 묶음 | `function printReport() { … }` |
| 매개변수 | 함수에 넘기는 값 | `gradeLabel("mid2")` 의 `"mid2"` |
| 문자열 | 글자. `"…"` 또는 `'…'` | `"저장 중…"` |
| 템플릿 문자열 | 백틱(`` ` ``)으로 감싸고 `${값}` 을 끼워 넣음 | `` `${name}학생` `` |
| 배열 `[ ]` | 순서 있는 목록 | `["A", "B", "C"]` |
| 객체 `{ }` | 이름: 값 묶음 | `{ mid1: "중1", mid2: "중2" }` |
| `if (조건) { … }` | 조건이 맞을 때만 실행 | `if (!currentExam) { … }` |
| `return` | 함수를 끝내고 값을 돌려줌 | `return true;` |
| `document.getElementById("id")` | HTML 에서 id 로 요소 찾기 | |
| `document.querySelectorAll(".class")` | CSS 선택자로 요소 여러 개 찾기 | |
| `요소.textContent` / `.innerHTML` / `.value` | 요소의 글자 / HTML / 입력칸 값 | |
| `async` / `await` | 시간이 걸리는 일(저장 · 불러오기)을 기다림 | `await DB.saveReport(…)` |
| `alert` / `confirm` | 경고창 / 확인·취소 창 | |
| 주석 `//` · `/* … */` | 실행되지 않는 메모 | |
| `localStorage` | 브라우저를 닫아도 남는 작은 저장 공간 | 로그인한 선생님 이름 |
| `sessionStorage` | 탭을 닫으면 사라지는 저장 공간 | 고른 시험 |

### 2-5. Firebase · 배포 용어

| 용어 | 설명 |
| --- | --- |
| **Firebase** | Google 의 앱 서버 서비스. 이 프로젝트는 그중 **Firestore(데이터베이스)** 만 씁니다. |
| **Firestore** | 인터넷에 있는 데이터베이스. 브라우저가 직접 읽고 씁니다. |
| **컬렉션** | 문서들을 담는 폴더. `checklist-students`(명단), `checklist-report`(체크리스트) |
| **문서** | 데이터 한 건. 학생 한 명 = 문서 하나, 체크리스트 하나 = 문서 하나 |
| **필드** | 문서 안의 칸. 예) `teacher`, `name`, `grade` |
| **보안 규칙 (Rules)** | 누가 어떤 데이터를 읽고 쓸 수 있는지 정하는 Firebase 설정. `firestore.rules` 파일 내용을 콘솔에 붙여넣어 적용 |
| **SDK** | Firebase 를 쓰기 위한 JS 프로그램. 이 프로젝트는 인터넷(gstatic.com)에서 바로 불러옵니다 |
| **Git · 커밋** | 코드 수정 기록 · 한 번의 저장 단위 |
| **GitHub · push** | 코드를 올려 두는 사이트 · 올리기 |
| **Vercel · 배포** | 사이트를 인터넷에 공개해 주는 서비스 · 공개하기. GitHub 에 올리면 자동으로 배포됩니다 |

---

## 3. 빠른 찾기표 — "이걸 바꾸고 싶어요"

| 바꾸고 싶은 것 | 파일 | 레시피 |
| --- | --- | --- |
| 브라우저 탭 제목 · 저장 파일 이름 | `index.html`, `js/report-header.js` | [A-1](#a-1-브라우저-탭-제목-바꾸기) · [H-1](#h-1-저장-파일-이름-형식-바꾸기) |
| 리포트 머리말 로고 · 제목 글자 | `index.html` | [A-2](#a-2-리포트로그인-화면의-로고제목-글자-바꾸기) |
| 로그인 화면 문구(안내 문단 다시 넣기) · 버튼 글자 | `index.html`, `js/login.js` | [A-3](#a-3-로그인-화면-안내-문구버튼-글자-바꾸기) |
| 자동 저장 상태 문구 | `js/notify.js` | [A-4](#a-4-자동-저장-상태-문구-바꾸기) |
| 토스트(잠깐 뜨는 알림) 문구 · 시간 | 문구가 있는 각 JS, `js/notify.js` | [A-5](#a-5-토스트-알림-문구시간-바꾸기) |
| 인쇄 전 경고창 문구 | `js/export.js` | [A-6](#a-6-출력-전-경고창-문구-바꾸기) |
| 표 머리글 (중단원 · 주요 내용 · 진단평가 · SOLUTION) | `js/checklist-table.js` | [A-7](#a-7-표-머리글-이름-바꾸기) |
| 표 자리 안내 문구 | `js/main.js`, `js/student-list.js`, `js/checklist-table.js` | [A-8](#a-8-표-자리에-뜨는-안내-문구-바꾸기) |
| 인쇄 푸터 · 발급일 | `index.html`, `js/export.js` | [A-9](#a-9-인쇄-푸터-문구발급일-형식-바꾸기) |
| 관리자 페이지 문구 | `admin/index.html` | [A-10](#a-10-관리자-페이지-문구-바꾸기) |
| 시험 종류 추가 · 삭제 · 기본 선택 | `index.html`, `js/student-list.js` | [B-1 ~ B-4](#b-시험-종류) |
| 시험 선택 안내 (나머지 화면 어둡게) 문구 · 어둡기 · 끄기 | `index.html`, `css/sidebar.css`, `js/student-list.js` | [A-11](#a-11-시험-선택-안내-말풍선-문구-바꾸기) · [J-7](#j-7-시험-선택-안내의-어둡기--반짝임-바꾸기--끄기) |
| 단원 · 주요 내용 · 학년 · 처음 단원 켜짐 | `js/data/curriculum.js`, `js/config.js`, `js/student-list.js` | [C-1 ~ C-10](#c-단원-데이터-교육과정) |
| A/B/C 색 · 글자 · 등급 추가 | `css/checklist-table.css`, `js/config.js` 외 | [D-1 ~ D-5](#d-abc-진단평가) |
| 진단평가 간단히(대단원별 1개) ↔ 자세히(중단원별) — 기본값 · 스위치 글자 · 한 방식으로 고정 | `js/checklist-table.js`, `index.html`, `css/checklist-table.css` | [D-6 ~ D-8](#d-6-새-체크리스트의-진단평가-방식-기본값-바꾸기) · 구조 [4-11](#4-11-진단평가-간단히--자세히-대단원별-평가) |
| 진단평가 메모 칸 (점수 · 코멘트) | `js/checklist-table.js`, `css/checklist-table.css` | [E-1 ~ E-6](#e-진단평가-메모-칸) |
| SOLUTION 문구 버튼 · 기본값 "-" | `index.html`, `js/checklist-table.js` | [F-1 ~ F-7](#f-solution-칸과-문구-버튼) |
| 종합 의견 기본 문장 · 제목 · 크기 | `index.html`, `css/opinion.css` | [G-1 ~ G-4](#g-종합-의견) |
| 머리말 칸 추가 · 이름 뒤 영문자 규칙 | `index.html`, `js/report-header.js`, `js/utils.js` | [H-2 ~ H-3](#h-2-머리말에-칸-추가하기-담당-선생님) |
| 사이트 색 · 대단원 색 · 학년 배지 색 · 글꼴 | `css/base.css`, `js/config.js`, `css/sidebar.css` | [I-1 ~ I-8](#i-색--글꼴--디자인) |
| 단원 설정 오른쪽 배치 · 사이드바 폭 · 모바일 기준 | `css/responsive.css`, `css/base.css` | [J-1 ~ J-6](#j-화면-배치) |
| 인쇄 여백 · 글자 크기 · 이미지 해상도 | `css/print.css`, `js/export.js` | [K-1 ~ K-8](#k-인쇄--pdf--이미지) |
| 자동 저장 간격 | `js/config.js`, `js/storage.js` | [L-1 ~ L-3](#l-자동-저장) |
| 학생 목록 정렬 · 반 묶기 · 표시 정보 | `js/db/db.js`, `js/student-list.js` | [M-1 ~ M-7](#m-왼쪽-학생-목록) |
| 자동 로그인 · 명단에 없는 이름 처리 | `js/login.js`, `js/student-list.js` | [N-1 ~ N-4](#n-로그인) |
| CSV 제목 · 학년 인식 · 중복 기준 · 명단 표 열 | `admin/admin.js`, `admin/index.html` | [O-1 ~ O-9](#o-관리자-페이지) |
| Firebase 프로젝트 · 컬렉션 이름 · 새 저장 칸 | `js/firebase-config.js`, `js/db/*`, `firestore.rules` | [P-1 ~ P-8](#p-저장소--firebase--새-데이터-칸) |

---

## 4. 전체 구조 (아키텍처)

### 4-1. 한 장으로 보는 전체 그림

```
                          ┌───────────────────────────────┐
                          │  Vercel (사이트 파일 보관·전달)  │  ← 서버 코드 없음, 환경변수 없음
                          │  index.html · css · js · admin │
                          └───────────────┬───────────────┘
                                          │ ① 파일 내려받기 (처음 열 때)
                ┌─────────────────────────┴─────────────────────────┐
                ▼                                                   ▼
  ┌───────────────────────────┐                     ┌───────────────────────────┐
  │ 선생님 브라우저  (주소: /)   │                     │ 관리자 브라우저 (주소: /admin) │
  │ index.html                │                     │ admin/index.html          │
  │  · 로그인(이름)             │                     │  · 명단 추가/CSV/수정/삭제   │
  │  · 학생 목록 · 체크리스트    │                     │                           │
  │  · 인쇄 · 이미지            │                     │                           │
  └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                │ ② 읽기 · 쓰기 (js/db/firebase-db.js)                │
                └──────────────────────┬──────────────────────────────┘
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │  Firebase · Cloud Firestore (데이터베이스)  │
                  │   checklist-students  ← 학생 명단          │
                  │   checklist-report    ← 체크리스트          │
                  │  🔒 firestore.rules 가 "데이터 모양"을 검사  │
                  └──────────────────────────────────────────┘
```

핵심 요약

- **서버 프로그램이 없습니다.** Vercel 은 파일만 전달하고, **브라우저가 Firebase 에 직접** 읽고 씁니다.
- **빌드 과정이 없습니다.** 고친 파일이 그대로 브라우저에서 실행됩니다. (설치 · 컴파일 필요 없음)
- **비밀번호가 없습니다.** 선생님은 이름만, 관리자 페이지는 주소만 알면 들어갑니다. ([README 7장](README.md))
- **Firebase 프로그램(SDK)** 은 인터넷(`www.gstatic.com`)에서 처음 쓸 때 불러옵니다.
- **html2canvas-pro** (이미지 저장용), **Pretendard** (글꼴) 도 인터넷(jsdelivr)에서 불러옵니다.

### 4-2. 폴더 구조와 역할

```
nature-checklist/
├── index.html              선생님 화면 뼈대 (주소 /)
├── admin/
│   ├── index.html          관리자 화면 뼈대 (주소 /admin)
│   ├── admin.css           관리자 화면 모양
│   └── admin.js            관리자 화면 동작
├── css/                    선생님 화면 모양 (9개, 불러오는 순서 중요)
├── js/
│   ├── data/curriculum.js  단원 데이터
│   ├── firebase-config.js  Firebase 연결 정보
│   ├── db/                 저장소 (firebase-db.js · test-db.js · db.js)
│   └── *.js                선생님 화면 동작 (13개)
├── firestore.rules         Firestore 보안 규칙 (콘솔에 붙여넣는 원본)
├── dev-server.js           내 컴퓨터용 간단한 서버
├── README.md               소개 · 배포 안내
└── MANUAL.md               이 설명서
```

두 화면이 **함께 쓰는 파일** (한 번 고치면 두 화면에 모두 반영)

| 파일 | 선생님 화면 | 관리자 화면 | 함께 쓰는 이유 |
| --- | :---: | :---: | --- |
| `css/base.css` | ✅ | ✅ | 색상 변수 · 기본 글꼴 · 테스트 모드 띠 |
| `js/data/curriculum.js` | ✅ | ✅ | 학년 목록 (관리자: 학년 선택지) |
| `js/config.js` | ✅ | ✅ | 학년 이름표 (`gradeLabel`) |
| `js/utils.js` | ✅ | ✅ | `escapeHtml` 등 |
| `js/firebase-config.js` | ✅ | ✅ | Firebase 연결 정보 |
| `js/db/firebase-db.js` · `test-db.js` · `db.js` | ✅ | ✅ | 저장소 (`DB`) |

### 4-3. JS 파일을 불러오는 순서와 "전역 공유"

이 프로젝트의 JS 는 `import/export` 를 쓰는 "모듈"이 아니라, **일반 `<script>` 태그**로 불러옵니다.
그래서 **모든 JS 파일이 하나의 큰 공간(전역)을 함께 씁니다.**

```
index.html 맨 아래 (위에서부터 차례대로 실행)
  1  js/data/curriculum.js     const CURRICULUM_DATA 가 만들어짐
  2  js/config.js              const GRADE_LABELS, function gradeLabel … 
  3  js/state.js               let currentTeacher, currentStudent …
  4  js/utils.js               function escapeHtml, sanitizeHtml …
  5  js/firebase-config.js     const firebaseConfig
  6  js/db/firebase-db.js      function createFirebaseDB …
  7  js/db/test-db.js          function createTestDB …
  8  js/db/db.js               const DB = …  ← 여기서 5~7 을 사용하므로 반드시 그 뒤
  9  js/notify.js
 10  js/storage.js
 11  js/legacy-import.js
 12  js/scope-panel.js
 13  js/report-header.js
 14  js/checklist-table.js
 15  js/student-list.js
 16  js/login.js
 17  js/export.js
 18  js/main.js                window.onload = … ← 페이지가 다 준비되면 실행 (반드시 마지막)
```

이게 무슨 뜻이냐면:

- `js/export.js` 안에서 `js/checklist-table.js` 에 있는 `hideMacroPopover()` 를 **import 없이 그냥 부를 수 있습니다.**
- HTML 의 `onclick="printReport()"` 도 전역에 있는 함수를 부르는 것입니다.
- 대신 **같은 이름을 두 파일에서 `const` / `let` 으로 만들면** 두 번째 파일이 실행되지 않습니다.
  (콘솔 오류: `Identifier '이름' has already been declared`)
- **파일을 불러올 때 바로 실행되는 코드**(함수 밖의 코드)는 앞 파일의 값만 쓸 수 있습니다.
  예) `js/db/db.js` 의 `const DB = (() => { … pickStore() … })()` 는 불러오는 순간 실행되므로
  `createFirebaseDB`(6번 파일) 가 이미 있어야 합니다. 함수 **안**의 코드는 나중에(클릭 등) 실행되므로 순서 영향이 적습니다.

> 💡 **새 JS 파일을 추가할 때**: `js/새파일.js` 를 만들고 `index.html` 맨 아래 `<script>` 목록에서
> 그 파일이 쓰는 파일들보다 **뒤**, `js/main.js` 보다 **앞**에 `<script src="js/새파일.js"></script>` 한 줄을 넣습니다.

### 4-4. CSS 파일을 불러오는 순서와 "덮어쓰기"

```
index.html <head> (위 → 아래, 아래 파일이 이김)
  base.css → login.css → sidebar.css → report-header.css → checklist-table.css
  → opinion.css → action-dock.css → responsive.css → print.css
```

- `responsive.css` 는 화면 폭에 따라 앞 파일들을 **덮어씁니다**. (넓은 PC · 모바일)
- `print.css` 는 인쇄할 때만 앞 파일들을 **덮어씁니다**. 그래서 항상 **맨 마지막**이어야 합니다.
- ⚠️ A4 인쇄 폭(약 794px)은 모바일 기준(860px)보다 좁아서, **인쇄할 때도 모바일 규칙이 적용**됩니다.
  그래서 `print.css` 가 표 모양을 다시 원래대로 되돌리는 규칙을 많이 갖고 있습니다.

### 4-5. 화면 구성과 화면 폭별 배치

선생님 화면(`index.html`)의 번호 (코드 주석에도 같은 번호를 씁니다)

| 번호 | 이름 | HTML 위치 | 모양 | 동작 |
| --- | --- | --- | --- | --- |
| ⓪ | 로그인 화면 | `#login-screen` | `css/login.css` | `js/login.js` |
| ① | 왼쪽 사이드바 (선생님 · 시험 · 학생 목록 · 단원 설정 + 진단평가 모두 자세히/간단히) | `<aside class="sidebar">` | `css/sidebar.css` | `js/student-list.js`, `js/scope-panel.js`, `js/checklist-table.js` |
| ② | 가운데 A4 리포트 (머리말 · 표 + 대단원마다 "진단평가 자세히" 스위치 · 종합 의견 · 인쇄 푸터) | `#capture-target-paper` | `css/report-header.css`, `css/checklist-table.css`, `css/opinion.css` | `js/report-header.js`, `js/checklist-table.js`, `js/storage.js` |
| ③ | 오른쪽 위 버튼 모음 (인쇄 · 이미지 · 저장 상태) | `.action-dock` | `css/action-dock.css` | `js/export.js`, `js/notify.js` |
| ④ | 토스트 알림 | `#app-toast` | `css/action-dock.css` | `js/notify.js` 의 `showToast` |
| ⑤ | SOLUTION 문구 팝오버 | `#solution-macro-popover` | `css/checklist-table.css` | `js/checklist-table.js` |
| ⑥ | 시험 선택 안내 (시험이 공란이면 시험 선택 칸만 밝게, 나머지는 어둡게 + 말풍선) | `#exam-spotlight` · `#exam-spotlight-tip` | `css/sidebar.css` | `js/student-list.js` 의 `updateExamSpotlight` |

화면 폭에 따른 배치 (`css/responsive.css`)

```
[넓은 PC · 폭 1280px 이상]
┌──────────┬──────────────────────────────┬─────────────┐
│ 선생님     │                              │ ③ 버튼 모음  │ ← 화면에 고정
│ 시험 선택  │        ② A4 리포트            ├─────────────┤
│ 학생 목록  │                              │ 단원 설정    │ ← 화면에 고정, 넘치면 안에서 스크롤
│  (260px)  │                              │  (240px)    │
└──────────┴──────────────────────────────┴─────────────┘

[보통 · 폭 861 ~ 1279px]  ← 기본 배치 (css/base.css)
┌──────────┬───────────────────────────────────────────┐
│ 선생님     │                         ③ 버튼 모음(고정)   │
│ 시험 선택  │        ② A4 리포트                          │
│ 학생 목록  │                                           │
│ 단원 설정  │                                           │
│  (300px)  │                                           │
└──────────┴───────────────────────────────────────────┘

[모바일 · 폭 860px 이하]
┌──────────────────────┐
│ 선생님 · 시험 · 학생 목록 │
│ 단원 설정               │
│ ② A4 리포트 (표는 카드) │
├──────────────────────┤
│ ③ 버튼 모음 (맨 아래 고정)│
└──────────────────────┘
```

> 💡 단원 설정 패널은 HTML 에서는 **항상 왼쪽 사이드바 안**에 있습니다.
> 넓은 PC 에서만 CSS 가 `position: fixed` 로 오른쪽에 "붙여서" 보여 줍니다. 그래서 창을 좁히면 저절로 왼쪽으로 돌아갑니다.

### 4-6. 동작 흐름 (무엇이 무엇을 부르는지)

#### (1) 페이지를 열 때 — `js/main.js`

```
window.onload
 ├─ DEFAULT_OPINION = 종합 의견 칸의 처음 내용            (새 체크리스트 기본값으로 기억)
 ├─ setPrintDate()           export.js      인쇄 푸터에 오늘 날짜
 ├─ initExamSelect()         student-list.js 시험 선택 준비 (같은 탭 새로고침이면 고른 시험 복원)
 ├─ closeChecklist("로그인하면 …")  student-list.js 표 자리에 안내 문구
 ├─ showTestModeBanner()     db/db.js       테스트 모드면 노란 띠
 ├─ DB.connect()             db/db.js       Firebase 프로그램 미리 불러오기 (오류는 무시)
 └─ initLogin()              login.js       기억된 이름이 있으면 자동 로그인
```

#### (2) 로그인 — `js/login.js`

```
[시작하기] 버튼 → submitLogin(event) → loginAs(이름)
 ├─ fetchTeacherStudents(이름)         student-list.js
 │    ├─ DB.listStudentsByTeacher(이름)  → Firestore: checklist-students 에서 teacher == 이름
 │    └─ (시험을 골랐으면) DB.getReports(학생들, 시험) → 각 학생의 A/B/C 개수 계산 (summarize)
 ├─ 이름 기억 (localStorage: nature_teacher)
 ├─ setTeacherStudents(목록) → renderStudentList()   왼쪽 목록 그리기 (반별로 묶음)
 ├─ 학생이 있으면 openInitialStudent()   /   없으면 openBlankChecklist() (빈 체크리스트)
 └─ updateExamSpotlight()               student-list.js: 시험이 공란이면 시험 선택 칸만 밝게, 나머지 화면은 어둡게
```

#### (3) 시험 선택 — `js/student-list.js`

```
시험 <select> 변경 → onExamSelectChange()
 ├─ (빈 체크리스트면) 시험 이름만 바꾸고 끝
 ├─ confirmLeave()          지금 체크리스트 먼저 저장 (실패하면 이동할지 물어봄)
 ├─ currentExam = 새 시험, sessionStorage(nature_exam) 에 기억
 ├─ updateExamHint() → updateExamSpotlight()  시험을 골랐으면 어두운 안내가 사라짐 (공란으로 되돌리면 다시 뜸)
 ├─ fetchTeacherStudents()  새 시험 기준 A/B/C 개수로 목록 다시 그림
 └─ 열려 있던 학생을 새 시험으로 다시 열기 (없으면 openInitialStudent)
```

#### (4) 학생 체크리스트 열기 — `openChecklist(학생id)` (`js/student-list.js`)

```
 1. 시험이 공란이면 → 학생만 기억하고 "시험을 선택해 주세요" 토스트 후 끝
 2. confirmLeave()                     지금 체크리스트 저장
 3. currentStudent · currentGrade 바꾸기, 목록 강조, fillReportHeader() (머리말 이름·학교)
 4. beginLoading()                     저장 멈춤 + "불러오는 중…" 표시
 5. fetchReport(학생, 시험)             storage.js → DB.getReport → Firestore 문서 하나 읽기
 6. (저장본이 없으면) findLegacyReport()  legacy-import.js: 이 브라우저의 예전 저장본 찾기
 7. renderScopeWidget()                scope-panel.js: 단원 설정 체크박스 새로 그림
 8. renderReportTables()               checklist-table.js: 표 새로 그림 (모든 대단원 "간단히", SOLUTION "-", 메모 칸 비어 있음)
 9. 저장본이 있으면 applyStateObj(저장본)  storage.js: 대단원마다 간단히/자세히 · 평가 · 메모 · SOLUTION · 의견 · 단원 체크 채우기
    없으면 restoreScopeSelections({})    모든 단원 꺼짐 → 표 숨김 → 안내 문구
10. markAsSaved() (또는 예전 저장본이면 바로 저장)
```

#### (5) 입력 → 자동 저장 — `js/storage.js`

```
A/B/C 클릭 · 메모 입력 · SOLUTION 입력 · 의견 입력 · 단원 체크 · "진단평가 자세히" 스위치
 → saveCurrentState() → scheduleSave()              "저장 중…" 표시, 1.2초(SAVE_DELAY_MS) 기다림
    (그 사이 또 입력하면 다시 1.2초 기다림 = 연속 입력은 마지막에 한 번만 저장)
 → persistCurrentReport() → saveNow()
     ├─ buildStateObj()          화면 내용 → 저장용 객체
     ├─ 마지막 저장 내용과 같으면 끝
     ├─ DB.saveReport(학생, 시험, 내용) → db.js 검사 → firebase-db.js → Firestore 문서 덮어쓰기
     ├─ 성공: "14:05 저장됨", 목록의 A/B/C 개수 갱신 (updateStudentSummary)
     └─ 실패: "저장 실패" · 인터넷 문제면 5초(RETRY_DELAY_MS) 뒤 다시 시도, 규칙 문제면 토스트로 안내
창을 닫을 때 저장 안 된 내용이 있으면 → 바로 저장 시도 + "나가시겠습니까?" 경고창
```

#### (6) 단원 설정 — `js/scope-panel.js`

```
대단원 체크 → toggleBigBlock()   그 대단원 표 블록 + 안의 중단원 줄 전부 보이기/숨기기
중단원 체크 → toggleSubRow()     그 줄만 보이기/숨기기 (대단원 체크도 자동 계산)
전체 켜기/끄기 → setAllScopes(true/false)
→ 모두 layoutAllUnitEval() (checklist-table.js: 대단원 평가 칸을 첫 번째 보이는 줄로 다시 옮김)
  + saveCurrentState() + updateStatus() (진행 현황 숫자)
※ 숨긴 줄은 style.display = "none". 인쇄 · 이미지 · 출력 전 검사도 이 값으로 "보이는 줄"을 판단합니다.

진단평가 방식 (checklist-table.js — 자세한 구조는 4-11장)
대단원 제목 옆 "진단평가 자세히" 스위치 → setUnitDetail(대단원id, 켬/끔)
[모두 자세히] · [모두 간단히] 버튼         → setAllDetail(true/false)
→ 대단원 블록에 is-detail 클래스 붙이기/떼기 → layoutUnitEval() → saveCurrentState() + updateStatus()
```

#### (7) 인쇄 · 이미지 — `js/export.js`

```
🖨️ printReport()          → ensureReadyForOutput() → 이름·학교 확인창 → window.print()  (모양: print.css)
📸 saveAsImageFile()      → ensureReadyForOutput() → captureReportCanvas() → PNG 파일 다운로드
📋 copyImageToClipboard() → ensureReadyForOutput() → captureReportCanvas() → 클립보드에 PNG

ensureReadyForOutput() 검사 순서
 0) 학생을 골랐는지(또는 빈 체크리스트) · 불러오는 중이 아닌지
 1) 보이는 모든 평가 항목에 A/B/C 를 골랐는지
 2) 보이는 모든 평가 항목에 SOLUTION 이 있는지 ("-" 도 인정)
 3) 머리말에 학생 이름 · 학교명이 있는지
 ※ 평가 항목 = getEvalItems() (checklist-table.js): 간단히 대단원은 대단원마다 1개, 자세히 대단원은 보이는 중단원 줄마다 1개

captureReportCanvas()
 · 버튼 · "수정 가능" 태그 · 빈 메모 칸 · "진단평가 자세히" 스위치(no-print) 숨기기, 평가 배지 보이기, 입력칸을 글자로 바꾸기
 · html2canvas 로 #capture-target-paper 를 2배 해상도로 찍기
 · 끝나면 모두 원래대로
```

#### (8) 빈 체크리스트 — 명단에 없는 이름으로 로그인했을 때

```
openBlankChecklist(학년)  student-list.js
 · isBlankChecklist = true → 머리말 이름·학교를 직접 입력, 왼쪽에 "학년" 선택이 나타남
 · 저장소에 저장하지 않음 (saveCurrentState 가 아무것도 안 함)
 · 작성한 내용이 있는데 이동 · 창 닫기 → 한 번 더 물어봄 (hasBlankEdits)
```

#### (9) 관리자 페이지 — `admin/admin.js`

```
페이지 열림 → initAdmin() → loadRoster() → DB.listStudents() → renderAll() (칩 · 표)
학생 추가   → submitAddStudent() → DB.addStudents([학생])
CSV/붙여넣기 → loadBulkFile()/previewBulk() (미리보기 · 중복 검사) → submitBulk() → DB.addStudents([…])
수정        → [수정] → editRowHtml → [저장] saveEdit() → DB.updateStudent(id, 학생)
삭제        → deleteStudent() → DB.deleteStudent(id)  (그 학생의 체크리스트도 모두 삭제)
실패하면    → handleError() → 알림 + (입력값 문제가 아니면) 명단 다시 불러오기
```

### 4-7. 저장소 계층 — 화면은 `DB` 만 부른다

```
화면 코드 (storage.js · student-list.js · admin.js)
        │   DB.saveReport(학생, 시험, 내용)
        ▼
js/db/db.js ─────────────── 입력값 검사 (cleanStudent · cleanExam · cleanReportData)
        │                   "어느 저장소를 쓸지" 페이지를 열 때 한 번 결정 (DB.mode)
        ├──────────────► js/db/firebase-db.js ──► Firestore (인터넷)         DB.mode = "firebase"
        ├──────────────► js/db/test-db.js ─────► localStorage (이 브라우저)   DB.mode = "test"
        └──────────────► 사용 불가 (모든 요청이 안내 오류)                       DB.mode = "unavailable"
```

`DB.mode` 가 정해지는 규칙 (`js/db/db.js` 의 `pickStore`)

| `js/firebase-config.js` | 연 주소 | 결과 |
| --- | --- | --- |
| `projectId` · `apiKey` 가 채워져 있음 | 어디든 | `"firebase"` — 실제 Firebase |
| 비어 있음 | `localhost` · `127.0.0.1` | `"test"` — 테스트 모드 |
| 비어 있음 | 배포 사이트 | `"unavailable"` — "연결 정보가 비어 있다" 안내 |
| 파일에 문법 오류 (붙여넣기 실수) | 어디든 | `"unavailable"` — "firebase-config.js 파일을 읽지 못했다" 안내 |

`DB` 함수 목록

| 함수 | 하는 일 | 돌려주는 값 |
| --- | --- | --- |
| `DB.connect()` | 연결 준비 (Firebase 프로그램 불러오기) | 없음 |
| `DB.listStudents()` | 전체 명단 | `[학생, …]` (선생님 → 등록 순서 → 이름 순) |
| `DB.listStudentsByTeacher(선생님)` | 그 선생님의 학생 | `[학생, …]` |
| `DB.addStudents([학생, …])` | 여러 명 추가 (보낸 순서 = 명단 순서) | `[만든 학생, …]` |
| `DB.updateStudent(id, 학생)` | 학생 정보 수정 | 바뀐 칸 `{ …, updatedAt }` |
| `DB.deleteStudent(id)` | 학생 + 그 학생의 체크리스트 삭제 | 지운 체크리스트 수 |
| `DB.getReport(학생, 시험)` | 체크리스트 하나 | 내용 또는 `null` |
| `DB.getReports([학생, …], 시험)` | 여러 학생의 체크리스트 | `{ 학생id: 내용 또는 null }` |
| `DB.saveReport(학생, 시험, 내용)` | 체크리스트 저장 (통째로 덮어씀) | 저장 시각(밀리초) |

실패하면 화면에 그대로 보여 줄 문구가 담긴 오류를 던집니다 (`error.message`).
`error.code` 는 종류(`"invalid-input"`, `"permission-denied"`, `"not-found"` …), `error.retryable` 은 "잠시 뒤 다시 하면 될 수도 있는지" 입니다.

### 4-8. 데이터 구조 (Firestore)

#### 학생 명단 — 컬렉션 `checklist-students`, 문서 id = 자동 생성

```js
// checklist-students/aB3dE9xYz01234567890
{
  teacher: "김선생",          // 선생님이 로그인할 때 입력하는 이름과 "똑같아야" 함 (최대 30자)
  name: "홍길동A",            // 학생 이름. 뒤의 대문자는 동명이인 구분용 (최대 30자)
  school: "예시중",           // 학교명 (최대 40자)
  grade: "mid2",             // 학년 코드 = js/data/curriculum.js 의 키 (mid1, mid2, mid3, mid3_22 …)
  className: "중2A반_수 7:30", // 반 이름 (비워도 됨, 최대 60자). 같은 글자끼리 목록에서 묶임
  order: 1789123456789000,   // 등록 순서 (CSV 줄 순서를 지키려고 등록 시각 × 1000 + 줄 번호)
  createdAt: 1789123456789,  // 등록 시각 (밀리초)
  updatedAt: 1789123456789,  // 마지막 수정 시각 (밀리초)
}
```

#### 체크리스트 — 컬렉션 `checklist-report`, 문서 id = `학생id__학년__시험`

```js
// checklist-report/aB3dE9xYz01234567890__mid2__1학기 기말고사
{
  studentId: "aB3dE9xYz01234567890",
  teacher: "김선생",            // 참고용 (콘솔에서 알아보기 쉽게)
  studentName: "홍길동A",        // 참고용
  schoolName: "예시중",          // 참고용
  grade: "mid2",
  examType: "1학기 기말고사",     // index.html 시험 <option> 의 value

  opinion: "<b>꾸준히</b> 잘하고 있어요",          // 종합 의견 (HTML)
  customEdits: {                                    // 표에서 고친 칸 (HTML)
    "m2-1-1_content": "<ul class=\"content-list\"><li>…</li></ul>",  // 주요 내용 (중단원마다)
    "m2-1_sol": "🚨 재학습 + 보강 필참",             // SOLUTION — 대단원 하나에 1개 (간단히) ("-" = 공란)
    "m2-2-1_sol": "💡 심화 문제 풀이 유지",          // SOLUTION — 중단원 줄마다 (자세히)
  },
  activeGrades: { "m2-1": "B", "m2-2-1": "A", "m2-2-2": "C" },  // 평가한 항목만 (대단원 id = 간단히, 중단원 id = 자세히)
  scopeSelections: { "m2-1-1": true, "m2-1-2": false }, // 단원 설정 체크 상태 (모든 중단원)
  gradeNotes: { "m2-1": "18/20" },                 // 진단평가 메모를 적은 항목만
  detailUnits: { "m2-1": false, "m2-2": true },    // 대단원마다 "진단평가 자세히"를 켰는지 (false = 간단히)
  updatedAt: 1789123456789,
}
```

기억할 점

- **평가 항목의 열쇠**는 두 종류입니다. 간단히(대단원별 1개)는 **대단원 id**(`m2-1`), 자세히(중단원별)는 **중단원 id**(`m2-1-1`).
  두 방식에 적은 내용이 **모두 함께 저장**되고, 화면 · 인쇄 · 개수에는 `detailUnits` 에 맞는 쪽만 쓰입니다. ([4-11장](#4-11-진단평가-간단히--자세히-대단원별-평가))
- `detailUnits` 가 **없는** 문서는 이 기능이 생기기 전에 저장된 체크리스트입니다. 불러올 때 중단원 평가 · 메모 · SOLUTION 을 적어 둔 대단원만 자세히로 열어 줍니다.
- **시험마다 따로** 저장됩니다. (문서 id 에 시험이 들어감)
- **학년이 바뀌면 새 체크리스트**로 시작합니다. (문서 id 에 학년이 들어감 → 예전 학년 기록은 남아 있음)
- **담당 선생님을 바꿔도** 문서 id 는 그대로라서 기존 체크리스트가 새 선생님 화면에 보입니다.
- 관리자 페이지에서 **학생을 삭제**하면 `studentId` 가 같은 체크리스트도 모두 지웁니다.

### 4-9. 브라우저가 기억하는 값

| 이름 | 저장 위치 | 만드는 파일 | 내용 | 지우면 |
| --- | --- | --- | --- | --- |
| `nature_teacher` | localStorage | `js/login.js` | 로그인한 선생님 이름 | 다음 접속 때 로그인 화면이 뜸 |
| `nature_last_student` | localStorage | `js/student-list.js` | 마지막으로 연 학생 id | 첫 번째 학생이 열림 |
| `nature_blank_grade` | localStorage | `js/student-list.js` | 빈 체크리스트에서 고른 학년 | 첫 번째 학년 |
| `nature_exam` | sessionStorage | `js/student-list.js` | 고른 시험 (같은 탭 새로고침용) | 시험 선택이 공란 |
| `nature_test_db` | localStorage | `js/db/test-db.js` | 테스트 모드의 명단 · 체크리스트 전체 | 테스트 데이터 초기화 |
| `nature_checklist_db` | IndexedDB | (예전 버전) | 예전 방식 저장본 — `js/legacy-import.js` 가 읽기만 함 | 예전 저장본 가져오기 불가 |

### 4-10. 표 안 요소의 id 규칙

표는 `js/checklist-table.js` 의 `renderReportTables()` 가 `js/data/curriculum.js` 를 읽어서 만듭니다.
중단원 `id` 가 `m2-1-1` 일 때 만들어지는 요소 (자세히):

| 만들어지는 id | 요소 | 쓰는 곳 |
| --- | --- | --- |
| `m2-1-1-row` | 표의 한 줄 `<tr class="check-row">` | 단원 설정(보이기/숨기기), 줄 배경색, 출력 검사 |
| `m2-1-1-content` | 주요 내용 칸 | 저장 (`customEdits["m2-1-1_content"]`) |
| `m2-1-1-grade` | 진단평가 칸 `<td class="grade-td sub-eval">` (A/B/C 버튼 · 배지 · 메모 칸이 들어 있음) | `applyGradeState` · `getActiveGrade` |
| `m2-1-1-badge` | 인쇄·이미지용 A/B/C 배지 | `applyGradeState` |
| `m2-1-1-note` | 진단평가 메모 칸 | 저장 (`gradeNotes["m2-1-1"]`) |
| `m2-1-1-solution` | SOLUTION 칸 | 저장 (`customEdits["m2-1-1_sol"]`) |

대단원 `id` 가 `m2-1` 일 때 만들어지는 요소 (간단히 — 대단원 하나에 1개. `-row` · `-content` 는 없음):

| 만들어지는 id · 속성 | 요소 | 쓰는 곳 |
| --- | --- | --- |
| `mid2-unit-idx-0` · `data-unit="m2-1"` | 대단원 블록 `<div class="unit-block">` (학년 + 대단원 순서, 0부터). 자세히면 `is-detail` 클래스, 간단히 평가를 고르면 `data-unit-grade="A"` 등 | 단원 설정의 대단원 체크, 방식 바꾸기, 줄 배경색 |
| `m2-1-grade` | 대단원 진단평가 칸 `<td class="grade-td unit-eval">` | `applyGradeState` · `getActiveGrade` |
| `m2-1-badge` · `m2-1-note` | 대단원 평가의 배지 · 메모 칸 | 저장 (`gradeNotes["m2-1"]`) |
| `m2-1-solution` | 대단원 SOLUTION 칸 `<td class="solution-td unit-eval">` | 저장 (`customEdits["m2-1_sol"]`) |

단원 설정 체크박스는 `data-target="m2-1-1"`(중단원) · `data-idx="0"`(대단원) 속성으로 표와 연결됩니다.

### 4-11. 진단평가 간단히 · 자세히 (대단원별 평가)

**무엇인가요?** 진단평가(A/B/C · 메모)와 SOLUTION 을 **대단원 하나에 1개**(간단히, 기본)로 쓸지, **중단원 줄마다**(자세히) 쓸지 대단원마다 고르는 기능입니다.

```
[간단히 — 기본]                                        [자세히 — 스위치를 켠 대단원]
┌───────────┬───────────┬─────────┬──────────┐           ┌───────────┬───────────┬─────────┬──────────┐
│ 물질의 특성  │ 주요 내용   │         │          │           │ 물질의 특성  │ 주요 내용   │ [A][B][C] │    -     │
├───────────┼───────────┤ [A][B][C] │    -     │           ├───────────┼───────────┼─────────┼──────────┤
│ 혼합물 분리1 │ 주요 내용   │ [코멘트] │          │           │ 혼합물 분리1 │ 주요 내용   │ [A][B][C] │    -     │
├───────────┼───────────┤         │          │           ├───────────┼───────────┼─────────┼──────────┤
│ 혼합물 분리2 │ 주요 내용   │         │          │           │ 혼합물 분리2 │ 주요 내용   │ [A][B][C] │    -     │
└───────────┴───────────┴─────────┴──────────┘           └───────────┴───────────┴─────────┴──────────┘
  오른쪽 두 칸을 세로로 합친 1개                               줄마다 따로
```

**바꾸는 곳** — 대단원 제목 오른쪽 **"진단평가 자세히" 스위치**(그 대단원만), 단원 설정 패널의 **[모두 자세히] [모두 간단히]**(전체).
스위치는 화면에서만 보이고 인쇄 · 이미지에는 나오지 않습니다(`no-print`). 새 체크리스트의 기본값은 `DETAIL_DEFAULT` ([D-6](#d-6-새-체크리스트의-진단평가-방식-기본값-바꾸기)).

**HTML 구조** — 한 대단원의 표에는 두 방식의 칸이 **모두 들어 있고**, CSS 가 지금 방식이 아닌 칸을 숨깁니다.

```
<div class="unit-block [is-detail]" data-unit="m2-1" data-unit-grade="B">
  <div class="unit-title-row"> 제목 탭 + <label class="detail-toggle no-print"> 스위치 </div>
  <table>
    <tr class="check-row" id="m2-1-1-row">  중단원 이름 · 주요 내용 · [자세히용 평가 칸 .sub-eval] · [자세히용 SOLUTION .sub-eval]
                                             · [간단히용 대단원 평가 칸 .unit-eval ← 여기로 옮겨져 rowSpan 으로 아래 줄까지 합쳐짐]
    <tr class="check-row" id="m2-1-2-row">  …
    <tr class="unit-eval-row">              간단히용 칸의 "대기 자리" (모바일 간단히에서는 여기서 카드 한 장으로 보임)
```

| CSS 규칙 (`css/checklist-table.css`) | 뜻 |
| --- | --- |
| `.unit-block:not(.is-detail) .sub-eval` · `.unit-block.is-detail .unit-eval` → `display: none !important` | 지금 방식이 아닌 칸 숨기기 (인쇄 · 모바일에서도) |
| `.unit-eval { position: relative; }` | 합친 칸이 이미지 저장(html2canvas)에서 아래 줄 배경에 가려지지 않게 |
| `.unit-block.is-detail .check-row.grade-a` · `.unit-block:not(.is-detail)[data-unit-grade="A"] .check-row` | 배경색: 자세히는 그 줄만, 간단히는 대단원의 줄 전체 |

**대단원 평가 칸의 자리 (`layoutUnitEval`)** — 단원 설정으로 줄을 숨기거나, 방식을 바꾸거나, 화면 폭이 바뀔 때마다 다시 맞춥니다.

| 상황 | 대단원 평가 칸이 있는 곳 |
| --- | --- |
| 간단히 + PC 화면 · 인쇄 | **첫 번째 보이는 중단원 줄** 끝, `rowSpan` = 그 줄부터 마지막 줄까지 (중간의 숨긴 줄은 브라우저가 건너뜀) |
| 간단히 + 모바일(폭 860px 이하 화면) | 표 맨 아래 `.unit-eval-row` → 중단원 카드들 **아래에 카드 한 장** |
| 자세히 | `.unit-eval-row` 안에 넣고 그 줄을 숨김 |

인쇄는 `beforeprint` · `afterprint` 때 표 모양 자리로 옮겼다가 되돌립니다 (`isPrintingReport`). 첫 번째 줄을 단원 설정에서 끄면 칸이 다음 보이는 줄로 옮겨 갑니다.

**저장 · 불러오기 (`js/storage.js`)**

- `buildStateObj()` — 대단원마다 `detailUnits[대단원id]` 와 대단원 평가(`activeGrades` · `gradeNotes` · `customEdits[대단원id_sol]`), 중단원마다 중단원 평가를 **모두** 담습니다.
- `applyStateObj(state)` — `resolveDetailUnits(state, 학년)` 로 대단원마다 방식을 정한 뒤 `setUnitDetail(…, { save: false })`, 두 방식의 칸을 모두 채웁니다.
- `resolveDetailUnits` — 저장본에 `detailUnits` 가 있으면 그 값. **없으면(예전 저장본)** 중단원 평가 · 메모 · SOLUTION(`-` 제외)을 적어 둔 대단원만 자세히, 나머지는 `DETAIL_DEFAULT`.

**세는 기준** — 오른쪽 위 "평가 N/M개 완료"(`updateStatus`) · 출력 전 검사(`js/export.js`) · 왼쪽 목록 A/B/C 개수(`countGrades`, `js/student-list.js`)가 모두 같은 기준입니다.

| 대단원 방식 | 평가 항목 수 |
| --- | --- |
| 간단히 | 켠 중단원이 하나라도 있으면 **1개** (이름표 = 대단원 제목, 예: "1. 물질의 특성") |
| 자세히 | 켠 중단원 **줄 수만큼** (이름표 = 중단원 이름) |

> ⚠️ `detailUnits` 는 이 기능과 함께 새로 생긴 저장 칸이라 **`firestore.rules` 의 `hasOnly([…])` 에 `'detailUnits'` 가 있어야** 저장됩니다.
> 규칙 파일을 콘솔에 다시 게시하지 않으면 모든 저장이 "저장소 규칙이 요청을 막았습니다" 로 실패합니다. ([5-23](#5-23-firestorerules--firestore-보안-규칙))

---

## 5. 파일별 상세 설명

각 파일마다 **① 하는 일 → ② 안에 있는 것 → ③ 자주 고치는 곳 → ④ 주의** 순서로 설명합니다.
함수 표의 "부르는 곳"은 그 함수를 실행시키는 곳입니다. (HTML 의 `onclick` 등도 포함)

---

### 5-1. `index.html` — 선생님 화면 뼈대

**① 하는 일** — 선생님 화면에 "무엇이 있는지"만 적은 파일입니다. 모양은 CSS, 동작은 JS 가 맡습니다.

**② 안에 있는 것 (위에서부터)**

```
<head>
  <title>                          브라우저 탭 기본 제목 (학생을 열면 JS 가 바꿈)
  Pretendard 글꼴 <link>
  CSS 9개 <link>                    순서 중요 (4-4장)
  html2canvas-pro <script>          이미지 저장용 프로그램
<body>
  ⓪ #login-screen                   로그인 화면 (이름 입력 폼)
  .app-shell
    ① <aside class="sidebar">
         .teacher-panel             선생님 이름 · 로그아웃 · 시험 선택 · (빈 체크리스트용) 학년 선택
         .student-panel             담당 학생 N명 · #student-list
         .scope-selector-panel      단원 설정 + 진단평가 [모두 자세히] [모두 간단히] (넓은 PC 에서는 오른쪽에 보임)
    ② <main class="report-workspace">
         #capture-target-paper      A4 용지 = 인쇄 · 이미지로 나가는 영역
           .header-section          로고 문구 · 제목 · 이름/학교명/시험 칸
           #report-table-root       표 (JS 가 채움)
           .opinion-section         종합 의견 칸
           .print-footer            인쇄할 때만 보이는 푸터 (발급일)
  ③ .action-dock                    인쇄 · 이미지 저장 · 이미지 복사 버튼 + 진행 현황 + 저장 상태
  ④ #app-toast                      토스트 알림
  ⑤ #solution-macro-popover         SOLUTION 문구 버튼 목록
  ⑥ #exam-spotlight · #exam-spotlight-tip   시험 선택 안내 (시험이 공란이면 나머지 화면을 어둡게 + 말풍선)
  JS 18개 <script>                  순서 중요 (4-3장)
```

**id 와 그 id 를 쓰는 JS 파일**

| id | 무엇 | 쓰는 파일 |
| --- | --- | --- |
| `login-screen` · `login-name` · `login-submit` · `login-message` | 로그인 화면 · 이름 칸 · 버튼 · 오류 문구 | `js/login.js` |
| `teacher-name` | 사이드바의 "👤 김선생 선생님" | `js/login.js` |
| `exam-select` | 왼쪽 시험 선택 | `js/student-list.js` |
| `blank-grade-picker` · `blank-grade-select` | 빈 체크리스트용 학년 선택 | `js/student-list.js` |
| `student-count` · `student-list` | 담당 학생 수 · 목록 | `js/student-list.js` |
| `scope-status` | "표시 단원 3/7" | `js/checklist-table.js` (`updateStatus`) |
| `scope-widget-root` | 단원 체크박스 목록 자리 | `js/scope-panel.js`, `js/student-list.js` |
| `detail-all-on` · `detail-all-off` | 진단평가 [모두 자세히] · [모두 간단히] 버튼 (지금 상태와 같으면 강조) | `js/checklist-table.js` (`updateDetailControls`) |
| `capture-target-paper` | A4 용지 (이미지로 찍는 영역) | `js/export.js` |
| `student-name` · `school-name` · `exam-type` | 머리말 칸 | `js/report-header.js`, `js/export.js`, `js/student-list.js` |
| `report-table-root` | 표 자리 | `js/checklist-table.js`, `js/student-list.js` |
| `opinion-textarea` | 종합 의견 칸 | `js/main.js`, `js/storage.js`, `js/student-list.js` |
| `print-date` | 인쇄 푸터 발급일 | `js/export.js` |
| `report-status` | "평가 3/20개 완료 · A 1 / B 1 / C 1" | `js/checklist-table.js`, `js/export.js` |
| `save-state` | "● 14:05 저장됨" | `js/notify.js` |
| `app-toast` | 토스트 | `js/notify.js` |
| `solution-macro-popover` | 문구 팝오버 | `js/checklist-table.js` |
| `exam-spotlight` · `exam-spotlight-tip` | 시험 선택 안내 (어두운 막 · 말풍선) | `js/student-list.js` |

**③ 자주 고치는 곳**

| 고칠 것 | 🔎 찾을 글자 | 레시피 |
| --- | --- | --- |
| 탭 제목 | `<title>` | [A-1](#a-1-브라우저-탭-제목-바꾸기) |
| 로그인 화면 문구 · 버튼 | `id="login-submit"` | [A-3](#a-3-로그인-화면-안내-문구버튼-글자-바꾸기) |
| 진단평가 모두 자세히/간단히 버튼 글자 | `모두 자세히` | [D-7](#d-7-진단평가-자세히-스위치--버튼-글자-바꾸기) |
| 시험 종류 | `id="exam-select"` | [B-1](#b-1-시험-종류-추가하기) |
| 머리말 로고 · 제목 | `logo-area` · `main-title` | [A-2](#a-2-리포트로그인-화면의-로고제목-글자-바꾸기) |
| 종합 의견 기본 문장 | `id="opinion-textarea"` | [G-1](#g-1-새-체크리스트의-종합-의견-기본-문장-넣기) |
| 인쇄 푸터 문구 | `pf-brand` | [A-9](#a-9-인쇄-푸터-문구발급일-형식-바꾸기) |
| SOLUTION 문구 버튼 | `injectMacro(` | [F-1](#f-1-solution-문구-버튼-추가하기) |

**④ 주의**

- **id 를 바꾸면** 위 표의 JS 파일에서 같은 id 를 모두 찾아 함께 바꿔야 합니다.
- `class="no-print"` 가 붙은 요소는 인쇄 · 이미지에 나오지 않습니다. A4 용지 안에 화면 전용 요소를 넣을 때 붙이세요.
- 종합 의견 칸(`#opinion-textarea`) 안의 `<!-- … -->` 는 예전 예시 문장을 **주석으로 꺼 둔 것**입니다. 이 칸의 처음 내용이 새 체크리스트의 기본값이 됩니다.

---

### 5-2. `admin/index.html` — 관리자 화면 뼈대

**① 하는 일** — 학생 명단을 등록 · 수정 · 삭제하는 화면의 뼈대입니다. 주소는 `/admin` 입니다.

**② 안에 있는 것**

```
<head>  제목 · Pretendard · /css/base.css · /admin/admin.css
<body class="admin-body">
  #admin-app
    <header class="admin-header">     제목 · 설명 · 🔓 주의 문구 · "체크리스트 화면 열기"
    <section class="admin-card">      학생 추가
       form.add-form                  선생님 · 학생 이름 · 학교명 · 학년 · 반 · [추가]
       datalist #teacher-options · #class-options   (자동완성 목록, JS 가 채움)
       details#bulk-section           CSV 파일 · 붙여넣기로 여러 명 추가 (미리보기 · [N명 등록])
    <section class="admin-card">      학생 명단 표 (선생님 거르기 · 검색 · 선생님 칩 · 표)
  #admin-toast                        알림
  JS 8개 (curriculum → config → utils → firebase-config → db 3개 → admin.js)
```

**id 목록** (모두 `admin/admin.js` 가 씀)

| id | 무엇 |
| --- | --- |
| `add-teacher` · `add-name` · `add-school` · `add-grade` · `add-class` · `add-submit` | 학생 추가 폼 칸과 버튼 |
| `teacher-options` · `class-options` | 선생님 · 반 이름 자동완성 목록 |
| `bulk-section` · `bulk-file` · `bulk-file-name` · `bulk-text` · `bulk-preview` · `bulk-submit` | 여러 명 추가 영역 |
| `roster-count` · `filter-teacher` · `filter-text` · `teacher-chips` · `roster-body` | 명단 표 영역 |
| `admin-toast` | 알림 |

**④ 주의**

- CSS · JS 경로가 `/css/base.css` 처럼 **`/` 로 시작**합니다. `/admin` 과 `/admin/` 어느 주소로 열어도 파일을 찾게 하려는 것이니 그대로 두세요.
- 명단 표의 열(`<th>`) 개수를 바꾸면 `admin/admin.js` 의 `colspan="6"` (여러 곳)과 이 파일의 "명단을 불러오는 중…" 줄의 `colspan="6"` 도 함께 바꿉니다. ([O-6](#o-6-명단-표에-등록일-열-추가하기))

---

### 5-3. `js/data/curriculum.js` — 단원 데이터

**① 하는 일** — 학년별 대단원 · 중단원 · 주요 내용 목록. **표와 단원 설정 체크박스가 모두 이 데이터로 만들어집니다.**

**② 구조**

```js
const CURRICULUM_DATA = {
  mid1: [                                   // 학년 코드 (키)
    {
      id: "m1-1",                           // 대단원 고유 id (간단히 = 대단원별 진단평가의 열쇠!)
      title: "1. 과학과 인류의 지속가능한 삶",  // 대단원 이름 (표 제목 탭 · 단원 설정)
      sub: [
        {
          id: "m1-1-1",                     // 중단원 고유 id (저장 데이터의 열쇠!)
          name: "과학과 인류의 지속가능한 삶", // 표 1열 이름
          list: [                           // 표 2열 "주요 내용" 기본 목록
            "과학적 탐구 과정과 탐구 방법 이해",
            "…",
          ],
        },
      ],
    },
  ],
  mid2: [ … ],
  mid3: [ … ],
  mid3_22: [ … ],   // 현재 파일에 있는 학년: mid1 · mid2 · mid3 · mid3_22
};
```

**③ 자주 고치는 곳** — [C. 단원 데이터](#c-단원-데이터-교육과정) 레시피 전체

**④ 주의**

- `id` 는 **같은 학년 안에서** 겹치면 안 됩니다. (다른 학년끼리는 같아도 됨 — 저장이 학년별로 따로이기 때문. 실제로 `mid3` 와 `mid3_22` 는 같은 id 를 씁니다)
  **대단원 id**(`m1-1`)와 **중단원 id**(`m1-1-1`)도 서로 겹치면 안 됩니다. 지금 규칙: 대단원 = 첫 중단원 id 에서 마지막 `-숫자` 를 뗀 값.
- 이미 쓰던 `id` 를 바꾸거나 지우면, 그 줄(대단원 id 면 그 대단원의 간단히 평가)의 저장된 평가 · 메모 · SOLUTION 이 화면에 나오지 않습니다.
- 대단원 `id` 를 빠뜨려도 동작은 하지만 `학년-u순서`(예: `mid1-u3`)로 대신 저장되어, **대단원 순서를 바꾸면 간단히 평가가 다른 대단원으로 옮겨 갑니다.** 꼭 붙여 주세요.
- `list` 는 **새 체크리스트의 기본값**입니다. 한 번 저장된 체크리스트는 저장 당시의 주요 내용을 그대로 씁니다.
- 대단원 색은 배열 순서대로 `js/config.js` 의 `UNIT_COLORS` 를 씁니다.
- 학년을 추가하면 `js/config.js` 의 `GRADE_LABELS` 에 이름표도 추가합니다. ([C-7](#c-7-새-학년-추가하기-예-고1))
- ⚠️ 지금 `mid3_22` 는 이름표가 없어서 화면에 `mid3_22` 그대로 보입니다. ([C-8](#c-8-mid3_22-에-이름표-붙이기))

---

### 5-4. `js/config.js` — 고정 설정값

**① 하는 일** — 실행 중에 바뀌지 않는 설정값 모음. (두 화면 공용)

**② 안에 있는 것**

| 이름 | 종류 | 내용 |
| --- | --- | --- |
| `GRADE_LABELS` | 상수(객체) | 학년 코드 → 이름표. `{ mid1: "중1", mid2: "중2", mid3: "중3" }` |
| `gradeLabel(grade)` | 함수 | 이름표 돌려주기. 없으면 코드 그대로. 예) `gradeLabel("mid2")` → `"중2"` |
| `hasGradeData(grade)` | 함수 | 그 학년의 단원 데이터가 있는지 (`true`/`false`) |
| `UNIT_COLORS` | 상수(배열) | 대단원 색 8개 (순서대로 반복) |
| `unitColor(idx)` | 함수 | 몇 번째 대단원의 색 |
| `GRADE_META` | 상수(객체) | A/B/C 별 버튼 class · 줄 배경 class · 인쇄 배지 스타일 |
| `SAVE_DELAY_MS` | 상수 | 자동 저장 대기 시간 (1200 = 1.2초) |

**③ 자주 고치는 곳** — 학년 이름표([C-8](#c-8-mid3_22-에-이름표-붙이기)), 대단원 색([I-2](#i-2-대단원-색-바꾸기)), 인쇄 배지 색([D-1](#d-1-abc-색-바꾸기)), 저장 간격([L-1](#l-1-자동-저장-대기-시간-바꾸기))

---

### 5-5. `js/state.js` — 현재 상태 변수

**① 하는 일** — 여러 파일이 함께 읽고 쓰는 "지금 상태".

| 변수 | 뜻 | 바꾸는 파일 |
| --- | --- | --- |
| `currentTeacher` | 로그인한 선생님 이름 (로그인 전 `null`) | `js/login.js` |
| `currentStudent` | 지금 열린 학생 `{ id, teacher, name, school, grade, className, summary, … }` | `js/student-list.js` |
| `isBlankChecklist` | 빈 체크리스트 모드인지 (`true` 면 저장 안 함) | `js/student-list.js` |
| `currentExam` | 고른 시험 (`""` = 공란) | `js/student-list.js` |
| `currentGrade` | 지금 표의 학년 코드 | `js/student-list.js` |
| `DEFAULT_OPINION` | 종합 의견 칸의 처음 내용 | `js/main.js` |

**④ 주의** — 이 변수들은 화면과 저장이 맞물려 있어서, 다른 파일에서 직접 값을 바꾸기보다 해당 파일의 함수(`openChecklist` 등)를 부르는 것이 안전합니다.

---

### 5-6. `js/utils.js` — 작은 도우미 (두 화면 공용)

| 이름 | 하는 일 | 예 |
| --- | --- | --- |
| `getTextFromElement(el)` | 요소 안의 글자만, 공백 정리해서 | `<td>  과학   탐구 </td>` → `"과학 탐구"` |
| `escapeHtml(text)` | 글자를 HTML 에 안전하게 넣도록 `< > & " '` 바꾸기 | `"<b>"` → `"&lt;b&gt;"` |
| `SAFE_HTML_TAGS` · `DROP_HTML_TAGS` | 불러온 HTML 에서 남길 태그 · 통째로 지울 태그 목록 | |
| `sanitizeHtml(html)` | 불러온 HTML 에서 위험한 것(스크립트 · 이미지 · 링크 · onclick 등) 지우기 | `'<b>좋음</b><img onerror=…>'` → `'<b>좋음</b>'` |
| `cleanHtmlNode(parent)` | `sanitizeHtml` 의 실제 작업 | |
| `htmlHasText(html)` | HTML 안에 실제 글자가 있는지 | `"<br>"` → `false` |
| `splitStudentName(name)` | 이름 뒤 구분용 대문자 떼기 | `"홍길동A"` → `{ base: "홍길동", tag: "A" }` |
| `makeSafeStorage(getStorage)` | 저장소를 못 쓰는 환경에서도 오류 안 나게 감싸기 | |
| `safeStorage` · `safeSession` | `localStorage` · `sessionStorage` 를 안전하게 쓰는 도구 (`get` · `set` · `remove`) | `safeStorage.get("nature_teacher")` |

**③ 자주 고치는 곳** — 이름 뒤 영문자 규칙([H-3](#h-3-이름-뒤-구분용-영문자-규칙-바꾸기)), 허용할 HTML 태그(`SAFE_HTML_TAGS`)

**④ 주의** — `sanitizeHtml` 은 누가 저장소에 이상한 HTML 을 넣어도 화면에서 실행되지 않게 막는 **보안 장치**입니다. 지우지 마세요.

---

### 5-7. `js/firebase-config.js` — Firebase 연결 정보

**① 하는 일** — 어느 Firebase 프로젝트에 연결할지 적는 곳. `const firebaseConfig = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId }`

**④ 주의**

- 이 값은 비밀번호가 아니라 **공개돼도 되는 주소 정보**입니다. (데이터 보호는 `firestore.rules`)
- Firebase 콘솔에서 복사할 때 `const firebaseConfig = { … };` **부분만** 붙여넣습니다. `import …` 줄을 함께 넣으면 문법 오류가 납니다.
- `projectId` 를 비우면 내 컴퓨터에서 테스트 모드가 됩니다. ([1-4](#1-4-연습용-테스트-모드-실제-데이터를-건드리지-않기))

---

### 5-8. `js/db/db.js` — 저장소 고르기 + 입력값 검사 (두 화면 공용)

**① 하는 일** — 화면 코드가 쓰는 `DB` 를 만듭니다. 저장하기 전에 입력값을 검사하고, 설정에 따라 Firebase / 테스트 모드를 고릅니다.

**② 안에 있는 것**

| 이름 | 종류 | 하는 일 |
| --- | --- | --- |
| `reportId(student, exam)` | 함수 | 체크리스트 문서 id 만들기 `학생id__학년__시험` |
| `orderOf(student)` | 함수 | 등록 순서 값 (없으면 등록 시각으로) |
| `sortStudents(list)` | 함수 | 선생님(가나다) → 등록 순서 → 이름 순 정렬 |
| `reportDocument(student, exam, data, updatedAt)` | 함수 | 저장할 체크리스트 문서 모양 만들기 |
| `dbError(message, {code, retryable, cause})` | 함수 | 화면에 보여 줄 오류 만들기 |
| `PERMISSION_DENIED_MESSAGE` · `NOT_FOUND_MESSAGE` | 상수 | 자주 쓰는 오류 문구 |
| `MAX_ADD_STUDENTS` | 상수 (500) | 한 번에 추가할 수 있는 최대 인원 |
| `REPORT_TEXT_MAX` | 상수 (20000) | 체크리스트 칸 하나의 최대 글자 수 |
| `REPORT_KEYS_MAX` | 상수 (500) | 항목(중단원) 최대 개수 |
| `GRADE_NOTE_TEXT_MAX` | 상수 (100) | 진단평가 메모 최대 글자 수 (저장소 기준) |
| `inputError(message)` | 함수 | 입력값 오류 만들기 (`code: "invalid-input"`) |
| `cleanText(value, label, {max, required, noSlash})` | 함수 | 글자 검사: 앞뒤 공백 제거 · 필수 · 최대 길이 · `/` 금지 |
| `cleanStudent(input)` | 함수 | 학생 한 명 검사 (선생님 30 · 이름 30 · 학교 40 · 반 60자, 학년 코드 모양) |
| `cleanExam(value)` | 함수 | 시험 이름 검사 (30자, `/` 금지) |
| `cleanReportData(data)` | 함수 | 체크리스트 내용에서 **알려진 칸만** 골라 검사 |
| `entriesOf` · `limitText` · `safeKey` | 함수 | `cleanReportData` 의 도우미 |
| `hasFirebaseConfig()` · `isLocalComputer()` · `createUnavailableDB()` · `pickStore()` | 함수 | 저장소 고르기 |
| `DB` | 상수(객체) | 화면 코드가 쓰는 저장소 ([4-7장](#4-7-저장소-계층--화면은-db-만-부른다) 함수 목록) |
| `showTestModeBanner()` | 함수 | 테스트 모드 안내 띠 |

**④ 주의** — ⚠️ **`cleanReportData` 는 알려진 칸만 통과시킵니다.** (`opinion` · `customEdits` · `activeGrades` · `scopeSelections` · `gradeNotes` · `detailUnits`)
체크리스트에 새 칸을 추가하면 여기에도 추가해야 저장됩니다. ([P-4](#p-4-체크리스트에-새-저장-칸-추가하기-예-숙제-메모))

---

### 5-9. `js/db/firebase-db.js` — Firebase(Firestore) 저장소

**② 안에 있는 것**

| 이름 | 내용 |
| --- | --- |
| `FIREBASE_SDK_URL` | Firebase 프로그램 주소 (버전 `12.19.0`) |
| `STUDENTS_COLLECTION` | `"checklist-students"` |
| `REPORTS_COLLECTION` | `"checklist-report"` |
| `FIRESTORE_BATCH_LIMIT` (400) · `FIRESTORE_IN_LIMIT` (30) | 한 번에 묶어 쓰는 수 · 한 번에 읽는 id 수 |
| `createFirebaseDB(config)` | `connect` 와 `DB` 함수들의 실제 Firestore 버전 |
| `friendlyFirebaseError(error)` | Firebase 오류 → 알아보기 쉬운 한국어 문구 |

**동작 요약** — `connect()` 에서 `firebase-app.js` · `firebase-firestore-lite.js` 를 인터넷에서 불러오고,
각 함수가 `getDocs` · `getDoc` · `setDoc` · `updateDoc` · `writeBatch` 로 읽고 씁니다. 로그인(Authentication)은 쓰지 않습니다.

**④ 주의** — 컬렉션 이름을 바꾸면 `firestore.rules` 의 경로(두 군데 + `get(…)` 안)도 바꿔야 합니다. ([P-2](#p-2-firestore-컬렉션-이름-바꾸기))

---

### 5-10. `js/db/test-db.js` — 테스트 모드 저장소

**① 하는 일** — Firebase 설정이 비어 있을 때 내 컴퓨터에서 쓰는 가짜 저장소. `localStorage` 의 `nature_test_db` 한 곳에 명단 · 체크리스트를 JSON 으로 저장합니다.

| 이름 | 내용 |
| --- | --- |
| `TEST_DB_KEY` | `"nature_test_db"` |
| `TEST_DB_DELAY_MS` | 120 — 진짜 서버처럼 잠깐 기다림 ("불러오는 중" 화면 확인용) |
| `createTestDB()` | Firebase 저장소와 **똑같은 함수 이름**으로 만든 테스트 저장소 |

**④ 주의** — `DB` 함수를 새로 만들면 `firebase-db.js` 와 `test-db.js` **둘 다**에 만들어야 합니다. (그리고 `db.js` 의 `DB` 와 `createUnavailableDB` 에도)

---

### 5-11. `js/notify.js` — 저장 상태 표시 · 토스트

| 이름 | 하는 일 |
| --- | --- |
| `clockHM(ts)` | 시각 → `"14:05"` |
| `setSaveState(kind, ts)` | 오른쪽 위 저장 상태 문구·색 바꾸기. `kind`: `idle` · `loading` · `saving` · `saved` · `error` · `blank` |
| `toastTimer` · `showToast(msg)` | 화면 아래 알림을 2.2초 동안 보여 줌 |

**③ 자주 고치는 곳** — 저장 상태 문구([A-4](#a-4-자동-저장-상태-문구-바꾸기)), 토스트 시간([A-5](#a-5-토스트-알림-문구시간-바꾸기))

---

### 5-12. `js/storage.js` — 체크리스트 자동 저장 / 불러오기

| 이름 | 종류 | 하는 일 |
| --- | --- | --- |
| `saveTimer` | 변수 | 자동 저장 예약 타이머 |
| `savingChain` | 변수 | 저장을 한 줄로 세우는 줄 (겹치지 않게) |
| `lastSavedJson` · `lastSavedAt` | 변수 | 마지막으로 저장된 내용 · 시각 |
| `isLoadingReport` | 변수 | 불러오는 중이면 `true` (그동안 저장 안 함) |
| `RETRY_DELAY_MS` | 상수 (5000) | 저장 실패 후 다시 시도까지 기다리는 시간 |
| `buildStateObj()` | 함수 | **화면 → 저장용 객체** (의견 · 주요 내용 · SOLUTION · 평가 · 단원 체크 · 메모 · 대단원별 간단히/자세히). 간단히 · 자세히 두 방식의 칸을 모두 담음 |
| `applyStateObj(state)` | 함수 | **저장용 객체 → 화면** (대단원마다 방식을 먼저 정하고 두 방식의 칸을 모두 채움. HTML 은 `sanitizeHtml` 로 정리해서 넣음) |
| `resolveDetailUnits(state, grade)` | 함수 | 대단원마다 "자세히"를 켤지 → `{ "m2-1": false, … }`. 저장본에 `detailUnits` 가 없으면(예전 저장본) 중단원 평가를 적어 둔 대단원만 자세히 ([4-11장](#4-11-진단평가-간단히--자세히-대단원별-평가)) |
| `fetchReport(student, exam)` | 함수 | `DB.getReport` 부르기 |
| `markAsSaved(updatedAt)` · `markAsUnsaved()` | 함수 | "지금 화면 = 저장된 상태" 기억 / 잊기 |
| `saveCurrentState()` | 함수 | 입력칸 · 버튼이 부르는 저장 함수 (실제로는 예약) |
| `scheduleSave(delay)` · `flushSave()` · `persistCurrentReport()` · `saveNow()` | 함수 | 예약 · 즉시 저장 · 줄 세우기 · 실제 저장 |
| `beforeunload` 리스너 | 코드 | 창을 닫을 때 저장 안 된 내용이 있으면 경고 |

**④ 주의** — 화면에 새 입력칸을 만들어 저장하려면 `buildStateObj` 와 `applyStateObj` 를 **짝으로** 고칩니다. ([P-4](#p-4-체크리스트에-새-저장-칸-추가하기-예-숙제-메모))

---

### 5-13. `js/legacy-import.js` — 예전 버전 저장본 가져오기

**① 하는 일** — 예전에는 체크리스트가 각 브라우저(IndexedDB `nature_checklist_db`)에 저장됐습니다.
저장소에 체크리스트가 없는 학생을 열 때, 그 브라우저에 같은 `학년|이름|학교|시험` 의 예전 저장본이 있으면 가져와서 저장합니다.

| 이름 | 하는 일 |
| --- | --- |
| `LEGACY_DB_NAME` · `LEGACY_STORE` | 예전 IndexedDB 이름 `"nature_checklist_db"` · `"reports"` |
| `findLegacyReport(student, exam)` | 예전 저장본 찾기 (없으면 `null`) |
| `readRecord(db, key)` | 키 하나 읽기 |

**④ 주의** — 선생님들이 예전 내용을 모두 옮긴 뒤에는 지워도 됩니다.
지울 때: 이 파일 + `index.html` 의 `<script src="js/legacy-import.js">` 한 줄 + `js/student-list.js` 의 `findLegacyReport` 를 쓰는 부분.

---

### 5-14. `js/scope-panel.js` — 단원 설정 체크박스

| 이름 | 부르는 곳 | 하는 일 |
| --- | --- | --- |
| `renderScopeWidget()` | `student-list.js` | 현재 학년의 대단원 · 중단원 체크박스 목록 새로 그리기 (모두 꺼진 상태) |
| `toggleBigBlock(key, checkbox)` | 대단원 체크박스 `onchange` | 대단원 블록 + 안의 중단원 줄 전부 보이기/숨기기 |
| `toggleSubRow(checkbox)` | 중단원 체크박스 `onchange` | 그 줄만 보이기/숨기기 (대단원 체크 자동 계산) |
| `setAllScopes(status)` | "전체 단원 켜기/끄기" 버튼 | 모두 켜기(`true`) / 끄기(`false`) |
| `restoreScopeSelections(scopeSelections)` | `storage.js`, `student-list.js` | 저장된 체크 상태를 체크박스 · 표에 반영 |

**④ 주의** — 새 체크리스트는 모든 단원이 **꺼진** 상태로 시작합니다(표가 숨겨짐). "처음부터 모두 켜기"로 바꾸려면 [C-10](#c-10-새-체크리스트를-모든-단원-켜진-상태로-시작하기) 참고.
줄을 보이거나 숨기는 코드를 새로 만들면, 끝에 `layoutAllUnitEval()` 을 불러 대단원 평가 칸(간단히)을 첫 번째 보이는 줄로 옮겨 주세요. (안 부르면 첫 줄을 숨겼을 때 대단원 평가 칸도 같이 사라져 보입니다)

---

### 5-15. `js/report-header.js` — 머리말 · 저장 파일 이름

| 이름 | 하는 일 |
| --- | --- |
| `fillReportHeader()` | 학생 정보로 이름 · 학교명 칸 채우기 (학생이면 읽기 전용, 빈 체크리스트면 직접 입력), 시험 칸, 탭 제목 |
| `onHeaderInput()` | 빈 체크리스트에서 이름 · 학교 입력할 때 탭 제목만 다시 만들기 |
| `updateTitle()` | 탭 제목 만들기 = PDF · 이미지 파일 이름. 예) `[네이처과학] 홍길동학생_예시중_중2과학_1학기 기말고사_완벽내신_체크리스트` |

---

### 5-16. `js/checklist-table.js` — 체크리스트 표 · 간단히/자세히 · A/B/C · 메모 · SOLUTION

평가 칸을 가리키는 **key** 는 중단원 id(자세히, 예: `m2-1-1`) 또는 대단원 id(간단히, 예: `m2-1`) 입니다.

| 이름 | 부르는 곳 | 하는 일 |
| --- | --- | --- |
| `BLANK_SOLUTION` | 상수 `"-"` | SOLUTION 기본값(공란) |
| `GRADE_NOTE_MAX` | 상수 `30` | 진단평가 메모 최대 글자 수 (화면 기준) |
| `DETAIL_DEFAULT` | 상수 `false` | 새 체크리스트의 진단평가 방식 (`false` = 대단원별 1개 간단히, `true` = 중단원별 자세히) |
| `renderReportTables()` | `student-list.js` | 표 전체를 새로 그림 (**표 HTML 모양이 여기 있음**) |
| `gradeCellHtml(key, kind, label)` · `solutionCellHtml(key, kind, label)` | `renderReportTables` | 진단평가 칸(A/B/C 버튼 · 배지 · 메모) · SOLUTION 칸 HTML. 간단히 · 자세히 칸이 **같은 함수**로 만들어짐 |
| `unitKeyOf(unit, idx, grade)` | 여러 곳 | 대단원 id (`curriculum.js` 의 `id`, 없으면 `학년-u순서`) |
| `CARD_LAYOUT_QUERY` · `isPrintingReport` | 상수 · 변수 | 모바일 카드 모양 화면인지 · 인쇄 준비 중인지 |
| `setUnitDetail(unitKey, on, {save})` | "진단평가 자세히" 스위치 `onchange`, `storage.js` | 대단원 하나를 자세히/간단히로 바꾸기 |
| `setAllDetail(on)` | [모두 자세히] · [모두 간단히] 버튼 | 모든 대단원을 한꺼번에 |
| `layoutUnitEval(block)` · `layoutAllUnitEval()` | 방식 바꿀 때 · `scope-panel.js` · 화면 폭 변경 · 인쇄 전후 | 대단원 평가 칸을 첫 번째 보이는 줄로 옮겨 세로로 합치기 (모바일은 카드 한 장) |
| `updateDetailControls()` | `updateStatus` | [모두 자세히] · [모두 간단히] 중 지금 상태와 같은 버튼 강조 |
| `applyGradeState(key, grade)` | `selectGradeBtn`, `storage.js` | 평가 항목 하나를 A/B/C 로 표시 (버튼 색 · 인쇄 배지 · 배경색: 중단원은 그 줄, 대단원은 `data-unit-grade`) |
| `selectGradeBtn(btn, grade, key)` | A/B/C 버튼 `onclick` | 평가 선택 → 저장 예약 → 진행 현황 |
| `getActiveGrade(key)` | `storage.js`, `export.js`, `updateStatus` | 평가 항목의 평가 읽기 `"A"`·`"B"`·`"C"`·`"-"` |
| `getEvalItems()` | `updateStatus`, `export.js` | 지금 평가해야 하는 항목 목록 `[{ key, label, element }]` (간단히 = 대단원마다 1개, 자세히 = 보이는 줄마다) |
| `onGradeNoteKeydown` · `onGradeNoteBeforeInput` · `onGradeNotePaste` · `onGradeNoteInput` | 메모 칸 이벤트 | Enter 막기 · 줄바꿈 막기 · 서식 없이 붙여넣기 · 글자 수 제한 + 저장 |
| `readGradeNote(el)` | `storage.js` | 메모 칸 글자 읽기 (공백 정리) |
| `placeCaretAtEnd(el)` | `onGradeNoteInput` | 커서를 맨 끝으로 |
| `updateStatus()` | 여러 곳 | "평가 N/M개 완료 · A/B/C 개수"(평가 항목 기준) · "표시 단원 N/M" · 단원 안내 문구 · 모두 자세히/간단히 버튼 강조 |
| `targetSolutionCell` | 변수 | 문구를 넣을 SOLUTION 칸 |
| `onSolutionFocus` · `selectBlankSolution` · `onSolutionBlur` | SOLUTION 칸 이벤트 | 팝오버 띄우기 · "-" 전체 선택 · 비우면 "-" 로 |
| `showMacroPopover` · `hideMacroPopover` | | 문구 팝오버 보이기 · 숨기기 |
| `setBlankSolution()` | "➖ 공란" 버튼 | SOLUTION 을 "-" 로 |
| `injectMacro(text, isDangerColor)` | 문구 버튼 | 문구 넣기 (비었거나 "-" 면 바꾸고, 내용이 있으면 " + 문구" 로 이어 붙임) |

대단원 하나의 HTML (`renderReportTables` 안, 간단히 줄인 모양)

```html
<div class="unit-block mid2-block-0" id="mid2-unit-idx-0" data-unit="m2-1">   <!-- 자세히면 class 에 is-detail -->
  <div class="unit-title-row">
    <div class="table-title">1. 물질의 특성</div>
    <label class="detail-toggle no-print"> <input type="checkbox" class="detail-toggle-input" onchange="setUnitDetail('m2-1', this.checked)"> … 진단평가 자세히 </label>
  </div>
  <table class="checklist-table">
    <thead> 중단원 · 주요 내용 · 진단평가 · SOLUTION </thead>
    <tr class="check-row" id="m2-1-1-row">
      <td class="text-center" data-label="중단원">물질의 특성</td>
      <td class="content-td" data-label="주요 내용" contenteditable="true" id="m2-1-1-content">
        <ul class="content-list"><li>…</li></ul>
      </td>
      <!-- gradeCellHtml("m2-1-1", "sub-eval", "진단평가") — 자세히일 때 보임 -->
      <td class="grade-td sub-eval" data-label="진단평가" id="m2-1-1-grade">
        <div class="btn-group"> [A] [B] [C] 버튼 </div>
        <span class="print-only-badge" id="m2-1-1-badge">-</span>
        <div class="grade-note" id="m2-1-1-note" contenteditable="true" data-placeholder="코멘트"></div>
      </td>
      <!-- solutionCellHtml("m2-1-1", "sub-eval", "SOLUTION") -->
      <td class="solution-td sub-eval" data-label="SOLUTION" contenteditable="true" id="m2-1-1-solution">-</td>
      <!-- 간단히일 때: layoutUnitEval 이 아래 두 칸을 이 줄 끝으로 옮기고 rowspan 으로 합침 -->
      <td class="grade-td unit-eval" data-label="대단원 진단평가" id="m2-1-grade" rowspan="3"> … </td>
      <td class="solution-td unit-eval" data-label="대단원 SOLUTION" id="m2-1-solution" rowspan="3">-</td>
    </tr>
    <tr class="check-row" id="m2-1-2-row"> … </tr>
    <tr class="check-row" id="m2-1-3-row"> … </tr>
    <tr class="unit-eval-row" style="display: none;"></tr>   <!-- 대단원 평가 칸의 대기 자리 (모바일 간단히 · 자세히) -->
  </table>
</div>
```

> `data-label` 은 모바일 카드 모양에서 칸 앞에 붙는 작은 이름표입니다 (`css/responsive.css`).
> 구조 · 저장 · 세는 기준은 [4-11장](#4-11-진단평가-간단히--자세히-대단원별-평가) 에 자세히 있습니다.

---

### 5-17. `js/student-list.js` — 시험 선택 · 학생 목록 · 체크리스트 열기 · 빈 체크리스트

| 이름 | 종류 | 하는 일 |
| --- | --- | --- |
| `EXAM_KEY` · `LAST_STUDENT_KEY` · `BLANK_GRADE_KEY` | 상수 | 브라우저 기억 이름 ([4-9장](#4-9-브라우저가-기억하는-값)) |
| `teacherStudents` | 변수 | 로그인한 선생님의 학생 목록 |
| `openRequestNo` | 변수 | 학생을 빠르게 여러 번 누를 때 마지막 것만 열리게 하는 번호 |
| `blankInitialTable` | 변수 | 빈 체크리스트 처음 내용 (작성 여부 비교용) |
| `fetchTeacherStudents(teacher)` | 함수 | 학생 목록 + 시험별 A/B/C 개수 가져오기 |
| `summarize(report, grade)` | 함수 | 체크리스트 → `{ A, B, C, updatedAt }` |
| `countGrades(state, grade)` | 함수 | A/B/C 개수 세기 — 가운데 진행 현황과 같은 기준 (켠 단원만 · 간단히 대단원은 1개 · 자세히 대단원은 켠 줄마다) |
| `setTeacherStudents(list)` · `renderStudentList()` | 함수 | 목록 바꾸기 · 그리기 |
| `groupByClass(students)` | 함수 | 반 이름별로 묶기 |
| `studentItem(student)` | 함수 | 목록의 학생 한 줄(버튼) HTML |
| `progressHtml(summary)` | 함수 | "A3 B1 C0" / "평가 전" |
| `updateStudentSummary(studentId, exam, data, updatedAt)` | 함수 | 저장 후 목록 개수 갱신 (`data` = 방금 저장한 내용) |
| `initExamSelect()` · `updateExamHint()` · `onExamSelectChange()` | 함수 | 시험 선택 준비 · 공란 강조 · 바꿨을 때 |
| `updateExamSpotlight()` | 함수 | 시험 선택 안내 보이기/숨기기 — 로그인했고 · 시험이 공란이고 · 빈 체크리스트가 아니고 · 로그인 화면이 닫혀 있으면 보임 |
| `examPickerElement()` · `followExamSpotlight()` | 함수 | 밝게 남길 "시험 [선택 칸]" 줄 · 그 위치를 화면마다 따라가며 밝은 네모와 말풍선 옮기기 |
| `spotlightFrame` · `spotlightLastKey` | 변수 | 위치 따라가기 중인지 · 마지막으로 맞춘 위치 |
| `confirmLeave()` | 함수 | 이동 전 저장 (실패 · 빈 체크리스트면 물어봄) |
| `openInitialStudent()` | 함수 | 마지막(또는 첫 번째) 학생 열기 |
| `openChecklist(studentId, {skipLeaveCheck})` | 함수 | 학생 체크리스트 열기 ([4-6장 (4)](#4-6-동작-흐름-무엇이-무엇을-부르는지)) |
| `beginLoading(message)` · `showReportMessage(message, {retry})` · `retryOpenChecklist()` · `closeChecklist(message)` | 함수 | 불러오는 중 · 안내 문구 · 다시 시도 · 닫기 |
| `openBlankChecklist(grade, {keepHeader})` · `setBlankMode(on)` · `hasBlankEdits({includeHeader})` · `onBlankGradeChange()` | 함수 | 빈 체크리스트 |

---

### 5-18. `js/login.js` — 선생님 로그인 / 로그아웃

| 이름 | 하는 일 |
| --- | --- |
| `TEACHER_KEY` | `"nature_teacher"` (로그인한 이름 기억) |
| `initLogin()` | 페이지를 열 때: 기억된 이름이 있으면 자동 로그인 |
| `submitLogin(event)` | 로그인 폼 제출 → 이름 확인 → `loginAs` |
| `loginAs(name)` | 학생 목록 가져오기 → 목록 · 체크리스트 (없으면 빈 체크리스트) |
| `logout()` | 저장 후 로그인 화면으로 (기억한 이름 · 마지막 학생 지움) |
| `showLoginScreen` · `hideLoginScreen` · `setLoginMessage` · `setLoginBusy` | 로그인 화면 표시 도우미 |

> `loginAs` 끝과 `showLoginScreen` 에서 `updateExamSpotlight()`(js/student-list.js)를 불러, 로그인 직후 시험이 공란이면 시험 선택 안내를 띄우고 로그인 화면이 뜨면 숨깁니다.

---

### 5-19. `js/export.js` — 출력 전 검사 · 인쇄 · 이미지

| 이름 | 하는 일 |
| --- | --- |
| `getUngradedItems()` · `getEmptySolutionItems()` · `itemLabel(item)` | 검사용: 평가 안 한 항목 · SOLUTION 빈 항목 · 항목 이름 (항목 목록은 `checklist-table.js` 의 `getEvalItems`) |
| `ensureReadyForOutput(actionLabel)` | 출력 전 검사 (0~3단계) — 통과하면 `true` |
| `printReport()` | 🖨️ 검사 → 확인창 → `window.print()` |
| `setPrintDate()` | 인쇄 푸터 발급일 채우기 |
| `swapMetaFieldsForCapture()` | 이미지로 찍는 동안 머리말 입력칸을 글자로 바꾸기 (html2canvas 버그 우회) |
| `captureReportCanvas()` | A4 용지를 이미지(canvas)로 찍기 |
| `saveAsImageFile()` | 📸 PNG 파일 저장 |
| `copyImageToClipboard()` | 📋 클립보드 복사 |
| `ensureAllRowsGraded(actionLabel)` | ⚠️ 지금은 쓰지 않는 예전 함수 (지워도 됨) |

---

### 5-20. `js/main.js` — 시작점

`window.onload = async function () { … }` 하나뿐입니다. 순서는 [4-6장 (1)](#1-페이지를-열-때--jsmainjs) 참고.
페이지를 열자마자 무언가 하고 싶으면 여기에 한 줄 추가합니다. (예: 로그인 전에 공지 토스트 띄우기)

---

### 5-21. `admin/admin.js` — 관리자 화면 동작

| 이름 | 종류 | 하는 일 |
| --- | --- | --- |
| `roster` · `rosterStatus` · `rosterError` | 변수 | 전체 명단 · 불러오기 상태 · 실패 문구 |
| `editingId` · `bulkRows` · `bulkColumnInfo` · `noticeTimer` | 변수 | 수정 중인 학생 · CSV 미리보기 · 열 안내 · 알림 타이머 |
| `loadRoster()` | 함수 | 명단 새로 불러오기 |
| `ensureRosterReady()` | 함수 | 명단을 못 불러왔으면 추가 막기 |
| `handleError(error, prefix)` | 함수 | 실패 알림 + 명단 다시 불러오기 |
| `gradeOptionsHtml(selected)` | 함수 | 학년 선택지 HTML |
| `parseGrade(text)` | 함수 | `"2학년"` · `"중2"` · `"2"` · `"mid2"` → `"mid2"` |
| `submitAddStudent(event)` · `inputValue(id)` · `isDuplicate(student, exceptId)` | 함수 | 한 명 추가 · 입력값 · 중복 확인 |
| `HEADER_NAMES` · `FIELD_LABELS` · `DEFAULT_COLUMNS` | 상수 | CSV 제목 인식 목록 · 항목 이름 · 제목 없을 때 열 순서 |
| `onBulkFileSelected` · `loadBulkFile` · `decodeText` · `parseTable` · `detectColumns` | 함수 | CSV 읽기 (UTF-8/EUC-KR, 따옴표 처리, 제목 줄 찾기) |
| `previewBulk()` · `renderBulkPreview()` · `submitBulk()` | 함수 | 미리보기 · 표 그리기 · 등록 |
| `renderAll()` · `teacherCounts()` · `renderTeacherControls()` · `renderRoster()` | 함수 | 화면 그리기 |
| `rowHtml(s)` · `editRowHtml(s)` · `saveEdit(id)` · `deleteStudent(id)` | 함수 | 명단 표 한 줄 · 수정 줄 · 저장 · 삭제 |
| `notify(message, isError)` | 함수 | 알림 (2.5초, 오류 4초) |
| `initAdmin()` | 함수 | 시작: 이벤트 연결 + `loadRoster()` |

---

### 5-22. CSS 파일들

| 파일 | 담당 | 대표 선택자 |
| --- | --- | --- |
| `css/base.css` | 색상 변수 `:root`, 기본 글꼴 · 버튼, 2단 레이아웃, 테스트 모드 띠 | `:root`, `body`, `.app-shell`, `.sidebar`, `.report-workspace`, `.test-mode-banner` |
| `css/login.css` | 로그인 화면 | `.login-screen`, `.login-card`, `.login-submit`, `.login-help` (안내 문단 모양 — 지금 HTML 에서는 안 씀, [A-3](#a-3-로그인-화면-안내-문구버튼-글자-바꾸기)) |
| `css/sidebar.css` | 선생님 패널 · 시험 선택 · 시험 선택 안내 · 학생 목록 · 단원 설정 · 진단평가 모두 자세히/간단히 | `.teacher-panel`, `.exam-select`, `.exam-spotlight`, `.exam-spotlight-tip`, `.student-item`, `.si-grade-mid1`, `.p-a`, `.scope-selector-panel`, `.sub-scope-label`, `.detail-control-row`, `.btn-detail` |
| `css/report-header.css` | A4 용지 · 머리말 | `.report-paper`, `.header-section`, `.logo-area`, `.main-title`, `.student-meta-grid`, `.meta-input` |
| `css/checklist-table.css` | 표 · "진단평가 자세히" 스위치 · 간단히/자세히 칸 고르기 · A/B/C 버튼 · 메모 칸 · SOLUTION · 팝오버 · 안내 문구 | `.unit-title-row`, `.table-title`, `.detail-toggle`, `.sub-eval`, `.unit-eval`, `.checklist-table`, `.unit-block.is-detail .check-row.grade-a`, `.btn-grade.active-a`, `.grade-note`, `.solution-td`, `.macro-btn` |
| `css/opinion.css` | 종합 의견 | `.opinion-section`, `.opinion-box` |
| `css/action-dock.css` | 버튼 모음 · 저장 상태 · 토스트 | `.action-dock`, `.btn-action-print`, `.action-dock-save.is-saved`, `.app-toast` |
| `css/responsive.css` | 넓은 PC(1280px↑) · 모바일(860px↓) 배치 (모바일 간단히: 대단원 평가 카드 `.unit-eval-row`) | `@media (min-width: 1280px)`, `@media (max-width: 860px)`, `.unit-eval-row` |
| `css/print.css` | 인쇄 전용 | `@media print`, `@page`, `.print-only-badge`, `.print-footer` |
| `admin/admin.css` | 관리자 화면 | `.admin-header`, `.add-form`, `.bulk`, `.roster-table`, `.grade-badge.g-mid1`, `.admin-toast` |

`css/base.css` 의 색상 변수 (여기만 바꾸면 여러 곳이 함께 바뀜)

| 변수 | 값 | 쓰이는 곳 |
| --- | --- | --- |
| `--ink` | `#172033` | 기본 글자색 |
| `--ink-soft` | `#40506a` | 설명 · 보조 글자 |
| `--brand` | `#183153` | 남색: 머리말 배경, 주요 버튼, 선생님 패널 |
| `--brand-2` | `#2f6f73` | 청록: 강조, 선택 표시, "수정 가능" 태그 |
| `--gold` | `#d6a83d` | 금색: 머리말 밑줄, 인쇄 버튼, 시험 선택 테두리 |
| `--paper` | `#ffffff` | A4 용지 배경 |
| `--surface` | `#f7f9fc` | 단원 설정의 대단원 카드 배경 |
| `--line` | `#d8e0eb` | 옅은 테두리 선 |
| `--danger` | `#b23a48` | 경고 · 삭제 색 |
| `--shadow` | 그림자 | 카드 · 용지 그림자 |

---

### 5-23. `firestore.rules` — Firestore 보안 규칙

**① 하는 일** — Firebase 콘솔에 붙여넣는 규칙의 원본. 체크리스트 컬렉션 두 개의 **데이터 모양**을 검사합니다.

| 규칙 함수 | 검사 내용 |
| --- | --- |
| `checklistTextOk(value, min, max)` | 글자이고 길이가 min~max |
| `checklistMapOk(value)` | 항목 묶음(map)이고 500개 이하 |
| `checklistStudentOk(d)` | 학생: 필수 칸(teacher · name · school · grade), **허용된 칸만**, 길이, 학년 모양 |
| `checklistReportOk(reportId, d)` | 체크리스트: 필수 칸, **허용된 칸만**, 문서 id = `학생id__학년__시험`, 명단에 있는 학생이고 학년이 같은지 |

| 위치 | 읽기 · 삭제 | 만들기 · 수정 |
| --- | --- | --- |
| `match /checklist-students/{studentId}` | 누구나 | `checklistStudentOk` 통과 시 |
| `match /checklist-report/{reportId}` | 누구나 | `checklistReportOk` 통과 시 |

**④ 주의**

- 파일을 고쳐도 자동 반영되지 않습니다. **콘솔 → Firestore Database → 규칙** 에서 같은 부분을 바꾸고 **게시**하세요.
- 같은 프로젝트에 다른 앱 규칙이 있으면 **전체를 덮어쓰지 말고** `▼ 체크리스트 시작` ~ `▲ 체크리스트 끝` 부분만 바꿉니다.
- `hasOnly([…])` 목록에 없는 칸을 저장하면 **"저장소 규칙이 요청을 막았습니다"** 오류가 납니다. 새 칸을 만들면 여기에 추가하세요.
- ⚠️ 진단평가 간단히/자세히 기능으로 체크리스트에 `detailUnits` 칸이 생겼습니다 (`hasOnly` 목록 + `(!('detailUnits' in d) || checklistMapOk(d.detailUnits))` 줄).
  **이 버전을 배포하기 전에 규칙을 콘솔에 다시 게시**해야 저장이 됩니다. (게시 전에는 모든 저장이 거절됨)

---

### 5-24. 그 밖의 파일

| 파일 | 내용 |
| --- | --- |
| `dev-server.js` | 내 컴퓨터용 서버 (`node dev-server.js`, 포트 5600). 폴더 주소는 그 안의 `index.html` 을 보여 줌. `.env` · `.git` 등은 보여 주지 않음 |
| `.claude/launch.json` | Claude Code 미리보기용 서버 설정 (직접 쓸 일 없음) |
| `.gitignore` | GitHub 에 올리지 않을 파일 (`.env`) |
| `.env` | 예전 AI 기능용 비밀 값 (지금 코드는 쓰지 않음, GitHub 에 올라가지 않음) |
| `README.md` | 프로젝트 소개 · 사용 흐름 · 배포 순서 |

---

## 6. 수정 예제 모음 (레시피)

각 예제는 **📁 파일 · 🔎 찾을 글자 → ✏️ 바꾸기 전/후 → ✅ 확인 → ⚠️ 주의** 순서입니다.
"바꾸기 전" 코드는 실제 파일의 들여쓰기(앞 공백)를 줄여서 보여 줄 수 있습니다. 🔎 찾을 글자로 검색해서 위치를 찾으세요.

---

### A. 글자 · 문구

#### A-1. 브라우저 탭 제목 바꾸기

난이도 ⭐

탭 제목은 **두 곳**에서 정합니다. 페이지를 처음 열었을 때(HTML)와, 로그인 전 · 로그아웃 후(JS)입니다.
(학생을 열면 [H-1](#h-1-저장-파일-이름-형식-바꾸기) 의 형식으로 바뀝니다)

📁 `index.html` · 🔎 `<title>네이처과학학원 완벽내신 CHECKLIST</title>`

```html
<!-- ✏️ 바꾸기 전 -->
<title>네이처과학학원 완벽내신 CHECKLIST</title>
<!-- ✏️ 바꾼 후 -->
<title>네이처과학학원 학습 진단표</title>
```

📁 `js/report-header.js` · 🔎 `document.title = "네이처과학학원 완벽내신 CHECKLIST";`

```js
// ✏️ 바꾸기 전
    document.title = "네이처과학학원 완벽내신 CHECKLIST";
// ✏️ 바꾼 후
    document.title = "네이처과학학원 학습 진단표";
```

관리자 페이지 탭 제목은 📁 `admin/index.html` · 🔎 `<title>관리자 · 네이처과학학원 완벽내신 CHECKLIST</title>`

✅ 새로고침 후 브라우저 탭 글자 확인.

#### A-2. 리포트·로그인 화면의 로고·제목 글자 바꾸기

난이도 ⭐

| 위치 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| A4 리포트 머리말 작은 글자 | `index.html` | `<div class="logo-area">nature science</div>` |
| A4 리포트 머리말 큰 제목 | `index.html` | `<h1 class="main-title">완벽내신 CHECKLIST</h1>` |
| 로그인 카드 작은 글자 | `index.html` | `<div class="login-logo">nature science</div>` |
| 로그인 카드 큰 제목 | `index.html` | `<h1 class="login-title">완벽내신 CHECKLIST</h1>` |
| 인쇄 푸터 왼쪽 글자 | `index.html` | `<span class="pf-brand">nature science · 완벽내신 CHECKLIST</span>` |
| 관리자 머리말 작은 글자 | `admin/index.html` | `<div class="ah-logo">nature science · 관리자</div>` |

📁 `index.html` · 🔎 `<h1 class="main-title">완벽내신 CHECKLIST</h1>`

```html
<!-- ✏️ 바꾸기 전 -->
<div class="logo-area">nature science</div>
<h1 class="main-title">완벽내신 CHECKLIST</h1>
<!-- ✏️ 바꾼 후 -->
<div class="logo-area">NATURE SCIENCE ACADEMY</div>
<h1 class="main-title">2학기 기말 대비 학습 진단표</h1>
```

✅ 학생을 열고 A4 용지 맨 위 남색 머리말 확인. 인쇄 미리보기 · 이미지 저장에도 같은 글자가 나옵니다.

⚠️ 제목 글자가 길면 줄이 바뀝니다. 크기는 📁 `css/report-header.css` · 🔎 `.main-title {` 의 `font-size: 25px;` (인쇄용은 📁 `css/print.css` 의 `.main-title` → `font-size: 20px;`)

#### A-3. 로그인 화면 안내 문구·버튼 글자 바꾸기

난이도 ⭐

로그인 카드는 위에서부터 **작은 로고 글자 → 큰 제목 → "선생님 이름" 라벨 → 입력칸 → "시작하기" 버튼 → 오류 문구 자리** 순서입니다.
(로고 · 제목 글자는 [A-2](#a-2-리포트로그인-화면의-로고제목-글자-바꾸기))

**안내 문단을 다시 넣고 싶을 때** — 지금은 입력칸 아래에 설명 문단이 없습니다. 버튼 바로 위에 문단 하나를 넣으면 됩니다.
작은 회색 글자 모양은 📁 `css/login.css` · 🔎 `.login-help {` 에 남아 있어서 `class="login-help"` 만 붙이면 됩니다.

📁 `index.html` · 🔎 `<button type="submit" class="login-submit" id="login-submit">`

```html
<!-- ✏️ 바꾸기 전 -->
<button type="submit" class="login-submit" id="login-submit">
<!-- ✏️ 바꾼 후 (버튼 바로 위에 안내 문단 추가) -->
<p class="login-help">
  관리자 페이지에 등록된 선생님 이름을 띄어쓰기까지 똑같이 입력하세요.<br />
  등록되지 않은 이름이면 저장되지 않는 빈 체크리스트가 열립니다.
</p>
<button type="submit" class="login-submit" id="login-submit">
```

**"시작하기" 버튼 글자**는 HTML 과 JS **두 곳**에 있습니다. (확인 중에는 JS 가 "확인 중…" 으로 바꿨다가 되돌림)

📁 `index.html` · 🔎 `id="login-submit"` — 버튼 안의 `시작하기` 를 바꾸고,

📁 `js/login.js` · 🔎 `button.textContent = busy ? "확인 중…" : "시작하기";`

```js
// ✏️ 바꾼 후 (HTML 버튼 글자와 똑같이)
  button.textContent = busy ? "명단 확인 중…" : "체크리스트 열기";
```

⚠️ 두 곳의 글자가 다르면, 로그인 한 번 뒤에 버튼 글자가 바뀌어 보입니다.

**"선생님 이름" 라벨**: 📁 `index.html` · 🔎 `<label class="login-label" for="login-name">선생님 이름</label>`
**입력칸 흐린 글자**: 📁 `index.html` · 🔎 `placeholder="이름을 입력하세요"`

#### A-4. 자동 저장 상태 문구 바꾸기

난이도 ⭐

오른쪽 위 버튼 모음 맨 아래 "● 14:05 저장됨" 문구입니다.

📁 `js/notify.js` · 🔎 `function setSaveState(kind, ts)`

| 상태 (`kind`) | 🔎 지금 문구 |
| --- | --- |
| `blank` | `el.textContent = "명단에 없는 이름 · 저장되지 않아요";` |
| `loading` | `el.textContent = "불러오는 중…";` |
| `saving` | `el.textContent = "저장 중…";` |
| `saved` | ``el.textContent = `${clockHM(ts)} 저장됨`;`` |
| `error` | `el.textContent = "저장 실패 — 다시 시도해 주세요";` |
| 그 밖 (`idle`) | `el.textContent = "입력하면 자동 저장됩니다";` |

📁 `js/notify.js` · 🔎 ``el.textContent = `${clockHM(ts)} 저장됨`;``

```js
// ✏️ 바꾸기 전
    el.textContent = `${clockHM(ts)} 저장됨`;
// ✏️ 바꾼 후  → "✔ 오후 2:05 에 저장했어요"
    el.textContent = `✔ ${new Date(ts).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" })} 에 저장했어요`;
```

⚠️ `idle` 문구는 📁 `index.html` · 🔎 `id="save-state"` 안에도 처음 글자로 적혀 있습니다. 함께 바꾸세요.
색은 📁 `css/action-dock.css` · 🔎 `.action-dock-save.is-saved {` 등.

#### A-5. 토스트 알림 문구·시간 바꾸기

난이도 ⭐

토스트는 화면 아래 가운데에 잠깐 떴다 사라지는 알림입니다. 문구는 **부르는 곳마다** 적혀 있습니다.

| 언제 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 명단에 없는 이름으로 로그인 | `js/login.js` | `명단에 없는 이름이라 빈 체크리스트로 시작해요` |
| 시험을 고르기 전에 학생을 누름 | `js/student-list.js` | `먼저 왼쪽 위에서 시험을 선택해 주세요` |
| 이미지 복사 성공 | `js/export.js` | `이미지를 클립보드에 복사했어요` |
| 이미지 복사를 지원하지 않는 브라우저 | `js/export.js` | `이미지 클립보드 복사를 지원하지 않아요` |
| 예전 저장본 옮김 | `js/student-list.js` | `이 브라우저에 있던 예전 작성 내용을 서버로 옮겼어요` |
| 저장 실패 (규칙 등) | `js/storage.js` | `저장하지 못했습니다:` |

**보이는 시간** (지금 2.2초): 📁 `js/notify.js` · 🔎 `toastTimer = setTimeout(() => el.classList.remove("show"), 2200);`

```js
// ✏️ 바꾼 후 (4초)
  toastTimer = setTimeout(() => el.classList.remove("show"), 4000);
```

**새 토스트 띄우기** — 아무 JS 함수 안에서 `showToast("보여 줄 문구");` 한 줄이면 됩니다.

#### A-6. 출력 전 경고창 문구 바꾸기

난이도 ⭐

📁 `js/export.js` · 🔎 `function ensureReadyForOutput(actionLabel)`

| 검사 | 🔎 찾을 글자 |
| --- | --- |
| 시험 안 고름 | `왼쪽 위에서 시험을 먼저 선택해야` |
| 학생 안 고름 | `왼쪽 목록에서 학생을 먼저 선택해야` |
| 불러오는 중 | `체크리스트를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.` |
| A/B/C 안 고른 줄 | `진단평가(A/B/C)를 선택하지 않은 항목이` |
| SOLUTION 빈 줄 | `SOLUTION이 비어 있는 항목이` |
| 빈 체크리스트 이름·학교 | `머리말에 ${missing.join(", ")}을(를) 입력해야` |
| 명단 이름·학교 빈 값 | `관리자 페이지(/admin)에서 학생 명단을 수정해 주세요.` |

인쇄 전 확인창: 📁 `js/export.js` · 🔎 `아래 정보가 맞는지 확인해 주세요.`

```js
// ✏️ 바꾸기 전 (일부)
      `아래 정보가 맞는지 확인해 주세요.\n\n· 학생 이름 : ${name}\n· 학교명 : ${school}\n\n이대로 인쇄/PDF 저장을 진행할까요?`,
// ✏️ 바꾼 후
      `${name} 학생(${school}) 체크리스트를 인쇄할까요?`,
```

💡 `\n` 은 줄바꿈입니다. `${actionLabel}` 자리에는 "인쇄/PDF 저장" · "이미지 저장" · "이미지 복사" 가 들어갑니다.
확인창 자체를 없애려면 [K-6](#k-6-인쇄-전-확인창-없애기).

#### A-7. 표 머리글 이름 바꾸기

난이도 ⭐

머리글은 **PC 표의 `<th>`** 와 **모바일 카드의 `data-label`** 두 곳에 있습니다.

📁 `js/checklist-table.js` · 🔎 `<tr><th>중단원</th>`

```js
// ✏️ 바꾸기 전
<tr><th>중단원</th><th>주요 내용 <span class="editable-tag">수정 가능</span></th><th>진단평가</th><th>SOLUTION <span class="editable-tag">수정 가능</span></th></tr>
// ✏️ 바꾼 후 ("SOLUTION" → "처방", "진단평가" → "평가")
<tr><th>중단원</th><th>주요 내용 <span class="editable-tag">수정 가능</span></th><th>평가</th><th>처방 <span class="editable-tag">수정 가능</span></th></tr>
```

같은 파일에서 **모바일 카드의 이름표**도 바꿉니다. 진단평가 · SOLUTION 칸은 `gradeCellHtml` · `solutionCellHtml` 함수에 이름표 글자를 넘겨서 만듭니다 (마지막 `"…"` 가 이름표).

| 칸 | 🔎 찾을 글자 | 바꾼 후 예 |
| --- | --- | --- |
| 중단원 줄의 진단평가 (자세히) | `${gradeCellHtml(subUnit.id, "sub-eval", "진단평가")}` | `"평가"` |
| 중단원 줄의 SOLUTION (자세히) | `${solutionCellHtml(subUnit.id, "sub-eval", "SOLUTION")}` | `"처방"` |
| 대단원 평가 카드 (간단히) | `${gradeCellHtml(unitKey, "unit-eval", "대단원 진단평가")}` | `"대단원 평가"` |
| 대단원 SOLUTION 카드 (간단히) | `${solutionCellHtml(unitKey, "unit-eval", "대단원 SOLUTION")}` | `"대단원 처방"` |

```js
// ✏️ 바꾸기 전
                      ${gradeCellHtml(subUnit.id, "sub-eval", "진단평가")}
// ✏️ 바꾼 후 — 두 번째 "sub-eval" 은 그대로 두고 마지막 글자만
                      ${gradeCellHtml(subUnit.id, "sub-eval", "평가")}
```

✅ PC 에서 표 머리글, 휴대폰 크기(F12 → Ctrl+Shift+M)에서 카드의 작은 이름표 확인.

⚠️ 경고창 문구([A-6](#a-6-출력-전-경고창-문구-바꾸기))와 팝오버 설명에도 같은 이름이 있으니 필요하면 함께 바꾸세요.
"수정 가능" 작은 배지를 없애려면 `<span class="editable-tag">수정 가능</span>` 부분을 지웁니다.

#### A-8. 표 자리에 뜨는 안내 문구 바꾸기

난이도 ⭐

| 언제 보이나 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 로그인 전 · 로그아웃 후 | `js/main.js`, `js/login.js` | `closeChecklist("로그인하면 담당 학생의 체크리스트가 열립니다.");` |
| 시험을 고르기 전 | `js/student-list.js` | `왼쪽 위에서 시험을 먼저 선택하면\n학생의 체크리스트가 열립니다.` |
| 담당 학생 0명 | `js/student-list.js` | `closeChecklist("담당 학생이 없습니다.");` |
| 불러오는 중 | `js/student-list.js` | `beginLoading("체크리스트를 불러오는 중…");` |
| 단원을 하나도 안 켬 | `js/checklist-table.js` | `에서 이번 시험 범위의 단원을 체크하면` |
| 학년 데이터 없음 | `js/student-list.js` | `학년의 단원 데이터가 없습니다.` |
| 왼쪽 목록이 빈 선생님 | `js/student-list.js` | `담당 학생이 없습니다.</div>` |
| 명단에 없는 이름 (왼쪽 목록) | `js/student-list.js` | `명단에 없는 이름이라 담당 학생이 없어요.` |

💡 `\n` 은 줄바꿈입니다. `closeChecklist` · `showReportMessage` 는 `\n` 을 줄바꿈으로 바꿔서 보여 줍니다.

#### A-9. 인쇄 푸터 문구·발급일 형식 바꾸기

난이도 ⭐

인쇄할 때만 A4 맨 아래에 `nature science · 완벽내신 CHECKLIST ··········· 발급일 2026. 09. 17` 이 나옵니다.

- 왼쪽 글자: 📁 `index.html` · 🔎 `<span class="pf-brand">nature science · 완벽내신 CHECKLIST</span>`
- 날짜 형식: 📁 `js/export.js` · 🔎 `` el.textContent = `발급일 ${now.getFullYear()}. ${String( ``

```js
// ✏️ 바꾸기 전
  el.textContent = `발급일 ${now.getFullYear()}. ${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}. ${String(now.getDate()).padStart(2, "0")}`;
// ✏️ 바꾼 후 → "작성일 2026년 9월 17일"
  el.textContent = `작성일 ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
```

✅ 🖨️ 인쇄 → 미리보기 맨 아래 확인. (화면에는 보이지 않는 것이 정상)

⚠️ 발급일은 **페이지를 연 날짜**입니다(`main.js` 에서 한 번 채움). 푸터를 아예 없애려면 📁 `css/print.css` · 🔎 `.print-footer {` (인쇄용, `display: flex !important;`) 를 `display: none !important;` 로.

#### A-10. 관리자 페이지 문구 바꾸기

난이도 ⭐

| 위치 | 📁 `admin/index.html` 🔎 찾을 글자 |
| --- | --- |
| 큰 제목 | `<h1 class="ah-title">학생 명단 관리</h1>` |
| 설명 | `<p class="ah-desc">` |
| 🔓 주의 문구 | `<p class="ah-warn">` |
| 학생 추가 도움말 | `선생님 이름은 선생님이 로그인할 때 입력하는 이름과 띄어쓰기까지` |
| CSV 안내 | `<summary>📂 CSV 파일 · 엑셀 붙여넣기로 여러 명 한 번에 추가</summary>` |
| 명단 표 아래 도움말 | `학년을 바꾸면(진급) 그 학생은 새 학년 체크리스트로 새로 시작합니다.` |

알림 문구는 📁 `admin/admin.js` 에서 `notify(` 로 검색하면 모두 나옵니다. (예: 🔎 `학생을 ${student.teacher} 선생님 명단에 추가했어요`)

#### A-11. 시험 선택 안내 말풍선 문구 바꾸기

난이도 ⭐

로그인했는데 시험이 공란이면 화면이 어두워지면서 왼쪽 위 시험 선택 칸 옆(좁은 화면은 아래)에 뜨는 말풍선입니다.

📁 `index.html` · 🔎 `<b>먼저 시험을 선택해 주세요</b>`

```html
<!-- ✏️ 바꾸기 전 -->
<div class="exam-spotlight-tip no-print" id="exam-spotlight-tip" hidden>
  <b>먼저 시험을 선택해 주세요</b>
  <span>시험을 고르면 학생의 체크리스트가 열려요.</span>
</div>
<!-- ✏️ 바꾼 후 -->
<div class="exam-spotlight-tip no-print" id="exam-spotlight-tip" hidden>
  <b>① 여기서 이번 시험을 고르세요</b>
  <span>고르면 담당 학생들의 체크리스트를 쓸 수 있어요.</span>
</div>
```

✅ 새 탭에서 접속(시험 공란) → 로그인하면 새 문구가 보임.

💡 둘째 줄이 필요 없으면 `<span>…</span>` 줄을 지웁니다. 말풍선 최대 폭은 📁 `css/sidebar.css` · 🔎 `max-width: min(260px, calc(100vw - 24px));`
어둡기 · 반짝임 · 안내 끄기는 [J-7](#j-7-시험-선택-안내의-어둡기--반짝임-바꾸기--끄기).

---

### B. 시험 종류

시험 목록은 **📁 `index.html` 의 `<select id="exam-select">` 한 곳**에만 있습니다.
머리말의 시험 칸은 페이지를 열 때 JS(`initExamSelect`)가 이 목록을 그대로 복사합니다.

```html
<select id="exam-select" class="exam-select" onchange="onExamSelectChange()">
  <option value="">시험 선택</option>                          ← 첫 번째 빈 항목 = 기본 공란
  <option value="1학기 중간고사">1학기 중간 대비</option>
  <option value="1학기 기말고사">1학기 기말 대비</option>
  <option value="2학기 중간고사">2학기 중간 대비</option>
  <option value="2학기 기말고사">2학기 기말 대비</option>
</select>
```

| 부분 | 어디에 쓰이나 | 바꿔도 되나 |
| --- | --- | --- |
| `value="1학기 중간고사"` | **저장 데이터의 열쇠** (체크리스트 문서 id · `examType`), 파일 이름 | ⚠️ 이미 쓰던 값은 바꾸지 않기 |
| 글자 `1학기 중간 대비` | 왼쪽 선택 목록, **머리말 · 인쇄물의 시험 칸** | ✅ 자유롭게 |

#### B-1. 시험 종류 추가하기

난이도 ⭐⭐

📁 `index.html` · 🔎 `<option value="2학기 기말고사">2학기 기말 대비</option>`

```html
<!-- ✏️ 바꾸기 전 (마지막 줄) -->
<option value="2학기 기말고사">2학기 기말 대비</option>
<!-- ✏️ 바꾼 후 (아래에 두 줄 추가) -->
<option value="2학기 기말고사">2학기 기말 대비</option>
<option value="여름방학 진단">여름방학 진단평가</option>
<option value="겨울방학 진단">겨울방학 진단평가</option>
```

✅ 새로고침 → 왼쪽 시험 선택에 새 항목 → 고르면 모든 학생이 **새 빈 체크리스트**로 열림 (시험마다 따로 저장).

⚠️ `value` 규칙: **30자 이하, `/` 금지** (`js/db/db.js` 의 `cleanExam` 검사 · 체크리스트 문서 id 에 들어가기 때문).

#### B-2. 시험 이름만 바꾸기 (기존 기록 유지)

난이도 ⭐

화면 · 인쇄물에 보이는 글자만 바꿉니다. `value` 는 그대로 둡니다.

```html
<!-- ✏️ 바꾸기 전 -->
<option value="1학기 중간고사">1학기 중간 대비</option>
<!-- ✏️ 바꾼 후 -->
<option value="1학기 중간고사">1학기 중간고사 대비 진단</option>
```

⚠️ `value` 까지 바꾸면 그 시험으로 저장했던 체크리스트가 **화면에서 안 보입니다** (Firebase 에는 남아 있고, `value` 를 되돌리면 다시 보임).
파일 이름(탭 제목)에는 `value` 가 들어갑니다.

#### B-3. 시험 종류 없애기

난이도 ⭐

해당 `<option …>…</option>` 한 줄을 지웁니다. 저장된 체크리스트는 Firebase 에 그대로 남습니다.

#### B-4. 처음부터 특정 시험이 선택되게 하기

난이도 ⭐⭐

지금은 새로 접속하면 시험이 **공란**이고, 같은 탭에서 새로고침할 때만 고른 시험이 유지됩니다.

📁 `js/student-list.js` · 🔎 `saved && Array.from(select.options).some((o) => o.value === saved) ? saved : "";`

```js
// ✏️ 바꾸기 전
  select.value =
    saved && Array.from(select.options).some((o) => o.value === saved) ? saved : "";
// ✏️ 바꾼 후 (기억된 시험이 없으면 "2학기 기말고사")
  select.value =
    saved && Array.from(select.options).some((o) => o.value === saved) ? saved : "2학기 기말고사";
```

✅ 새 탭에서 접속 → 로그인하면 바로 "2학기 기말 대비" 로 첫 학생이 열림.

⚠️ 따옴표 안 글자는 `<option>` 의 **value** 와 똑같아야 합니다. 학기가 바뀔 때마다 이 글자도 바꿔 주세요.
공란 항목(`<option value="">시험 선택</option>`)은 지우지 않는 것이 좋습니다 (JS 가 "공란" 상태를 표시할 때 씀).

---

### C. 단원 데이터 (교육과정)

모두 📁 `js/data/curriculum.js` 에서 고칩니다. 구조는 [5-3장](#5-3-jsdatacurriculumjs--단원-데이터) 참고.

#### C-1. 주요 내용 문장 고치기

난이도 ⭐

📁 `js/data/curriculum.js` · 🔎 `"물질의 특성을 구별하는 기준 이해",`

```js
// ✏️ 바꾸기 전
        {
          id: "m2-1-1",
          name: "물질의 특성",
          list: [
            "물질의 특성을 구별하는 기준 이해",
            "밀도·녹는점·끓는점·용해도 등 물질의 특성 비교",
            "물질의 특성을 이용해 물질을 구별하는 방법 적용",
          ],
        },
// ✏️ 바꾼 후 (문장 수정 + 한 줄 추가)
        {
          id: "m2-1-1",
          name: "물질의 특성",
          list: [
            "물질의 특성(밀도·녹는점·끓는점·용해도)의 뜻 이해",
            "밀도·녹는점·끓는점·용해도 등 물질의 특성 비교",
            "물질의 특성을 이용해 물질을 구별하는 방법 적용",
            "그래프를 해석해 물질의 특성 찾기",
          ],
        },
```

✅ **아직 저장하지 않은** 학생 · 시험의 체크리스트를 열면 새 문장이 보입니다.

⚠️ 이미 저장된 체크리스트는 저장 당시의 주요 내용을 그대로 보여 줍니다 (선생님이 칸에서 직접 고친 내용을 지키기 위해).
문장 끝의 **쉼표(`,`)** 와 **큰따옴표** 짝을 꼭 확인하세요. 문장 안에 큰따옴표를 쓰려면 `\"` 로 적습니다.

#### C-2. 중단원 이름 바꾸기

난이도 ⭐

`name` 만 바꿉니다. 저장 데이터와 상관없어서 **모든 체크리스트에 바로 반영**됩니다.

```js
// ✏️ 바꾸기 전
          name: "혼합물의 분리(1)",
// ✏️ 바꾼 후
          name: "혼합물의 분리 ① 밀도·거름",
```

#### C-3. 중단원 추가하기

난이도 ⭐⭐

같은 대단원의 `sub: [ … ]` 안에 `{ … },` 묶음을 하나 더 넣고, **같은 학년에서 쓰지 않은 새 id** 를 붙입니다.

📁 `js/data/curriculum.js` · 🔎 `id: "m2-1-3",`

```js
// ✏️ 바꾼 후 — m2-1-3 묶음 바로 뒤에 추가
        {
          id: "m2-1-3",
          name: "혼합물의 분리(2)",
          list: [ … 그대로 … ],
        },
        {
          id: "m2-1-4",
          name: "크로마토그래피",
          list: [
            "크로마토그래피의 원리 이해",
            "크로마토그래피 결과를 해석해 성분 찾기",
          ],
        },
```

✅ 체크리스트를 열면 단원 설정과 표에 새 줄이 생깁니다. 이미 저장된 체크리스트에서는 **꺼진(숨겨진) 상태**로 나오니 단원 설정에서 켜면 됩니다.

⚠️ id 이름 규칙은 자유지만 **영문 · 숫자 · `-` · `_` 만** 쓰세요 (`js/db/db.js` 의 `safeKey` 검사, 80자 이하).
기존 규칙(`m학년-대단원-중단원`)을 따르면 헷갈리지 않습니다.

#### C-4. 중단원 순서 바꾸기

난이도 ⭐

`{ id: … }` 묶음 전체를 잘라서 원하는 위치에 붙여넣습니다. id 가 그대로라 저장 데이터에 영향이 없습니다.

#### C-5. 중단원 없애기

난이도 ⭐

`{ id: … }` 묶음을 통째로 지웁니다. 저장된 그 줄의 평가 · 메모는 Firebase 에 남지만 화면에는 나오지 않습니다.
(나중에 같은 id 로 다시 추가하면 다시 보입니다)

#### C-6. 대단원 추가 · 이름 바꾸기

난이도 ⭐⭐

```js
// ✏️ 대단원 이름만 바꾸기
      title: "1. 물질의 특성",          →        title: "Ⅰ. 물질의 특성",

// ✏️ 대단원 추가 (학년 배열 안, 원하는 위치에)
    {
      id: "m2-9",                       // 대단원 id — 같은 학년에서 쓰지 않은 값
      title: "9. 과학 탐구 프로젝트",
      sub: [
        {
          id: "m2-9-1",
          name: "탐구 보고서 작성",
          list: ["가설 설정과 변인 통제", "결과 정리와 결론 도출"],
        },
      ],
    },
```

⚠️ 대단원 색은 **순서대로** 정해져서(`UNIT_COLORS`), 중간에 대단원을 넣으면 뒤 대단원들의 색이 한 칸씩 밀립니다.
⚠️ 대단원 `id` 는 **대단원 하나로 적는 진단평가(간단히)** 의 저장 열쇠입니다. 중단원 id 와 겹치지 않게, 한 번 정하면 바꾸지 마세요. ([5-3](#5-3-jsdatacurriculumjs--단원-데이터))

#### C-7. 새 학년 추가하기 (예: 고1)

난이도 ⭐⭐⭐

**1단계 — 단원 데이터** 📁 `js/data/curriculum.js` · 🔎 `mid3_22: [`

`CURRICULUM_DATA = { … }` 의 맨 아래 학년 뒤에 새 학년을 추가합니다.

```js
  mid3_22: [
    … 그대로 …
  ],
  high1: [
    {
      id: "h1-1",
      title: "1. 물질과 규칙성",
      sub: [
        {
          id: "h1-1-1",
          name: "우주 초기 원소의 생성",
          list: ["빅뱅 우주론의 증거 이해", "우주 초기 원소 생성 과정 설명"],
        },
      ],
    },
  ],
};
```

⚠️ 학년 코드(`high1`)는 **영문 소문자로 시작, 영문 소문자 · 숫자 · `_` 만, 20자 이하** 여야 합니다
(`js/db/db.js` 의 `cleanStudent`, `firestore.rules` 의 `checklistStudentOk` 검사).

**2단계 — 이름표** 📁 `js/config.js` · 🔎 `mid3: "중3",`

```js
const GRADE_LABELS = {
  mid1: "중1",
  mid2: "중2",
  mid3: "중3",
  high1: "고1",
};
```

**3단계 — 학년 배지 색 (선택)** 없으면 회색으로 나옵니다.

📁 `css/sidebar.css` · 🔎 `.si-grade-mid3 {` 아래에 추가

```css
.si-grade-high1 {
  background: #6a4f86;
}
```

📁 `admin/admin.css` · 🔎 `.grade-badge.g-mid3 {` 아래에 추가

```css
.grade-badge.g-high1 {
  background: #6a4f86;
}
```

**4단계 — CSV 에서 "고1" 글자 알아보기 (선택)** → [O-3](#o-3-csv-학년-글자-인식-추가하기-예-고1)

✅ 관리자 페이지 → 학생 추가의 학년 선택에 "고1" → 그 학생으로 로그인하면 고1 단원 표가 열림.

#### C-8. `mid3_22` 에 이름표 붙이기

난이도 ⭐

지금 파일에 `mid3_22`(22개정 중3으로 보이는 학년) 데이터가 있는데 이름표가 없어서 학생 목록 · 관리자 페이지 · 파일 이름에 `mid3_22` 가 그대로 보입니다.

📁 `js/config.js` · 🔎 `const GRADE_LABELS = {`

```js
// ✏️ 바꾸기 전
const GRADE_LABELS = {
  mid1: "중1",
  mid2: "중2",
  mid3: "중3",
};
// ✏️ 바꾼 후
const GRADE_LABELS = {
  mid1: "중1",
  mid2: "중2",
  mid3: "중3",
  mid3_22: "중3(22개정)",
};
```

✅ 관리자 페이지 학년 선택지에 "중3(22개정)" 이 보입니다. CSV 의 학년 칸에 `중3(22개정)` 이라고 적어도 알아봅니다 (띄어쓰기 무시).

⚠️ 파일 이름은 `…_중3(22개정)과학_…` 이 됩니다. 괄호가 싫으면 `"중3-22"` 처럼 적으세요.

#### C-9. 학생들을 새 교육과정 학년으로 옮기기

난이도 ⭐

코드 수정 없이 **관리자 페이지**에서 합니다: 학생 줄의 [수정] → 학년을 새 학년으로 → [저장].

⚠️ 학년을 바꾸면 그 학생은 **새 학년 체크리스트로 새로 시작**합니다. 이전 학년 기록은 지워지지 않고, 학년을 되돌리면 다시 보입니다.

#### C-10. 새 체크리스트를 모든 단원 켜진 상태로 시작하기

난이도 ⭐⭐

지금은 새 체크리스트가 **모든 단원 꺼짐**(표 숨김)으로 시작하고, 선생님이 시험 범위만 켭니다.

📁 `js/student-list.js` · 🔎 `else restoreScopeSelections({});`

```js
// ✏️ 바꾸기 전 (openChecklist 안)
  if (report) applyStateObj(report);
  else restoreScopeSelections({});
// ✏️ 바꾼 후
  if (report) applyStateObj(report);
  else setAllScopes(true);
```

빈 체크리스트도 똑같이 하려면 같은 파일 🔎 `function openBlankChecklist` 안의

```js
  restoreScopeSelections({});
```

를 `setAllScopes(true);` 로 바꿉니다.

✅ 저장된 적 없는 학생 · 시험을 열면 모든 단원이 켜져 있음. (이 시점에는 불러오는 중이라 자동 저장이 일어나지 않습니다)

---

### D. A/B/C 진단평가

#### D-1. A/B/C 색 바꾸기

난이도 ⭐⭐

A/B/C 색은 **네 곳**에 나뉘어 있습니다. 한 등급 색을 바꿀 때 네 곳을 같은 계열로 맞추세요.

| 어디 색 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 선택된 버튼 | `css/checklist-table.css` | `.btn-grade.active-a {` |
| 줄 배경 (자세히 = 그 줄, 간단히 = 대단원의 줄 전체 — 세 줄짜리 규칙 묶음) | `css/checklist-table.css` | `.unit-block.is-detail .check-row.grade-a,` |
| 인쇄 · 이미지 배지 | `js/config.js` | `"background-color: #e3f0fc; color: #1565c0; border:1px solid #1565c0; display:inline-block;",` |
| 왼쪽 목록 개수 글자 | `css/sidebar.css` | `.p-a {` |

예) **C 를 빨강 → 주황**으로

```css
/* 📁 css/checklist-table.css — ✏️ 바꾼 후 */
.btn-grade.active-c {
  background-color: #fff0e0 !important;
  color: #e65100 !important;
  border-color: #e65100 !important;
}
.unit-block.is-detail .check-row.grade-c,
.unit-block:not(.is-detail)[data-unit-grade="C"] .check-row,
.unit-block:not(.is-detail)[data-unit-grade="C"] .unit-eval-row {
  background: #fff8f0;
}
```

💡 줄 배경 규칙의 선택자 세 줄은 그대로 두고 `background` 값만 바꾸면 됩니다 (첫 줄 = 자세히, 둘째 · 셋째 줄 = 간단히 · 모바일 대단원 카드).

```js
// 📁 js/config.js — GRADE_META 의 C — ✏️ 바꾼 후
  C: {
    className: "active-c",
    rowClass: "grade-c",
    style:
      "background-color: #fff0e0; color: #e65100; border:1px solid #e65100; display:inline-block;",
  },
```

```css
/* 📁 css/sidebar.css — ✏️ 바꾼 후 */
.p-c {
  color: #e65100;
}
```

⚠️ `GRADE_META` 의 `style` 끝의 `display:inline-block;` 은 지우지 마세요 (배지가 보이게 하는 값).

#### D-2. A/B/C 대신 "상/중/하" 로 보이게 하기

난이도 ⭐⭐

**저장 값은 A/B/C 그대로 두고 보이는 글자만** 바꾸는 방법입니다 (기존 기록과 호환).

**① 버튼 글자** 📁 `js/checklist-table.js` · 🔎 `onclick="selectGradeBtn(this, 'A', '${key}')">A</button>`
(`gradeCellHtml` 함수 안 — 간단히 · 자세히 칸이 이 버튼 3개를 함께 씁니다)

```js
// ✏️ 바꾸기 전 (버튼 3개)
<button type="button" class="btn-grade" data-grade="A" onclick="selectGradeBtn(this, 'A', '${key}')">A</button>
<button type="button" class="btn-grade" data-grade="B" onclick="selectGradeBtn(this, 'B', '${key}')">B</button>
<button type="button" class="btn-grade" data-grade="C" onclick="selectGradeBtn(this, 'C', '${key}')">C</button>
// ✏️ 바꾼 후 — 맨 끝 >A< >B< >C< 만 바꿈 (data-grade · 'A' 는 그대로!)
<button type="button" class="btn-grade" data-grade="A" onclick="selectGradeBtn(this, 'A', '${key}')">상</button>
<button type="button" class="btn-grade" data-grade="B" onclick="selectGradeBtn(this, 'B', '${key}')">중</button>
<button type="button" class="btn-grade" data-grade="C" onclick="selectGradeBtn(this, 'C', '${key}')">하</button>
```

**② 인쇄 배지 글자** — `GRADE_META` 에 `label` 을 추가하고 배지에 그 글자를 넣습니다.

📁 `js/config.js` · 🔎 `const GRADE_META = {`

```js
// ✏️ 바꾼 후 — 각 등급에 label 한 줄씩 추가
const GRADE_META = {
  A: {
    label: "상",
    className: "active-a",
    …
  },
  B: {
    label: "중",
    …
  },
  C: {
    label: "하",
    …
  },
};
```

📁 `js/checklist-table.js` · 🔎 `printBadge.innerHTML = grade;`

```js
// ✏️ 바꾼 후
  printBadge.innerHTML = meta.label || grade;
```

**③ 오른쪽 위 진행 현황** 📁 `js/checklist-table.js` · 🔎 `` · A ${count("A")} / B ${count("B")} / C ${count("C")}` ``

```js
// ✏️ 바꾼 후
    reportStatus.textContent = `평가 ${graded}/${items.length}개 완료 · 상 ${count("A")} / 중 ${count("B")} / 하 ${count("C")}`;
```

**④ 왼쪽 목록 개수** 📁 `js/student-list.js` · 🔎 `` `<span class="p-a">A${summary.A}</span>` + ``

```js
// ✏️ 바꾼 후
    `<span class="p-a">상${summary.A}</span>` +
    `<span class="p-b">중${summary.B}</span>` +
    `<span class="p-c">하${summary.C}</span>`
```

**⑤ 경고창** 📁 `js/export.js` · 🔎 `진단평가(A/B/C)를 선택하지 않은 항목이` → `진단평가(상/중/하)를 선택하지 않은 항목이`

✅ 버튼 · 인쇄 미리보기 배지 · 진행 현황 · 목록에 상/중/하 표시, 저장 후 새로고침해도 유지.

#### D-3. 등급 하나 더 추가하기 (예: D)

난이도 ⭐⭐⭐

등급 목록이 여러 파일에 흩어져 있어서 **9곳**을 고칩니다. 하나라도 빠지면 D 가 저장 · 표시되지 않습니다.
(간단히 · 자세히 칸은 같은 함수로 만들어져서 한 번만 고치면 두 방식에 모두 적용됩니다)

| # | 📁 파일 | 🔎 찾을 글자 | 할 일 |
| --- | --- | --- | --- |
| 1 | `js/checklist-table.js` | `onclick="selectGradeBtn(this, 'C', '${key}')">C</button>` | 바로 아래에 D 버튼 추가 |
| 2 | `js/config.js` | `const GRADE_META = {` | `D: { … }` 추가 |
| 3 | `js/checklist-table.js` | `s.classList.remove("active-a", "active-b", "active-c");` | `"active-d"` 추가 |
| 4 | `js/checklist-table.js` | `row.classList.remove("grade-a", "grade-b", "grade-c");` | `"grade-d"` 추가 |
| 5 | `js/checklist-table.js` | `if (cell.querySelector(".active-c")) return "C";` | D 줄 추가 |
| 6 | `js/checklist-table.js` | `` / C ${count("C")}` `` | 진행 현황에 D 개수 |
| 7 | `js/db/db.js` | `if (["A", "B", "C"].includes(value))` | `"D"` 추가 |
| 8 | `js/student-list.js` | `const counts = { A: 0, B: 0, C: 0 };` | D 개수 세기 + 목록 표시 |
| 9 | CSS 3곳 | `.btn-grade.active-c {` · `.unit-block.is-detail .check-row.grade-c,` · `.p-c {` | D 색 추가 + 열 너비 |

💡 저장(`storage.js` 의 `buildStateObj`)과 출력 전 검사(`export.js`)는 `getActiveGrade` 로 평가를 읽으므로 고칠 필요 없습니다.

**1** 📁 `js/checklist-table.js`

```js
<button type="button" class="btn-grade" data-grade="C" onclick="selectGradeBtn(this, 'C', '${key}')">C</button>
<button type="button" class="btn-grade" data-grade="D" onclick="selectGradeBtn(this, 'D', '${key}')">D</button>
```

**2** 📁 `js/config.js` — `C: { … },` 뒤에

```js
  D: {
    className: "active-d",
    rowClass: "grade-d",
    style:
      "background-color: #eceff1; color: #455a64; border:1px solid #455a64; display:inline-block;",
  },
```

**3 · 4** 📁 `js/checklist-table.js` (`applyGradeState` 안)

```js
    s.classList.remove("active-a", "active-b", "active-c", "active-d");
  …
    row.classList.remove("grade-a", "grade-b", "grade-c", "grade-d");
```

**5** 📁 `js/checklist-table.js` (`getActiveGrade` 안) — C 줄 아래에

```js
  if (cell.querySelector(".active-d")) return "D";
```

**6** 📁 `js/checklist-table.js` (`updateStatus` 안)

```js
    reportStatus.textContent = `평가 ${graded}/${items.length}개 완료 · A ${count("A")} / B ${count("B")} / C ${count("C")} / D ${count("D")}`;
```

**7** 📁 `js/db/db.js` (`cleanReportData` 안)

```js
    if (["A", "B", "C", "D"].includes(value)) out.activeGrades[safeKey(key)] = value;
```

**8** 📁 `js/student-list.js` (`countGrades` · `progressHtml`)

```js
  const counts = { A: 0, B: 0, C: 0, D: 0 };
…
      if (g === "A" || g === "B" || g === "C" || g === "D") counts[g]++;
…
  if (!summary || summary.A + summary.B + summary.C + (summary.D || 0) === 0) {
…
    `<span class="p-c">C${summary.C}</span>` +
    `<span class="p-d">D${summary.D || 0}</span>`
```

(`summarize` · `updateStudentSummary` 는 `countGrades` 를 부르므로 고칠 필요 없습니다)

**9** CSS

```css
/* 📁 css/checklist-table.css — .btn-grade.active-c 아래 */
.btn-grade.active-d {
  background-color: #eceff1 !important;
  color: #455a64 !important;
  border-color: #455a64 !important;
}
/* 줄 배경: C 규칙 묶음(.unit-block.is-detail .check-row.grade-c, …) 아래 */
.unit-block.is-detail .check-row.grade-d,
.unit-block:not(.is-detail)[data-unit-grade="D"] .check-row,
.unit-block:not(.is-detail)[data-unit-grade="D"] .unit-eval-row {
  background: #f5f7f8;
}
/* 버튼이 4개라 진단평가 열을 넓힘: .checklist-table th:nth-child(3) 의 112px → 150px,
   .grade-td 의 width: 110px → 148px */

/* 📁 css/sidebar.css — .p-c 아래 */
.p-d {
  color: #455a64;
}
```

✅ D 선택 → 저장 → 새로고침 후에도 D 유지, 진행 현황 · 목록 개수 · 인쇄 배지 확인.
💡 `firestore.rules` 는 등급 글자를 검사하지 않으므로 고칠 필요 없습니다.

#### D-4. A/B/C 를 안 골라도 인쇄되게 하기

난이도 ⭐

📁 `js/export.js` · 🔎 `// 1) 진단평가(A/B/C) 미선택 항목`

```js
// ✏️ 바꾸기 전
  // 1) 진단평가(A/B/C) 미선택 항목
  const ungraded = getUngradedItems();
  if (ungraded.length) {
    … (경고창 · 스크롤 · return false) …
  }
// ✏️ 바꾼 후 — 블록 전체를 /* */ 로 감싸서 끄기
  // 1) 진단평가(A/B/C) 미선택 항목 — 검사 안 함
  /*
  const ungraded = getUngradedItems();
  if (ungraded.length) {
    …
  }
  */
```

⚠️ `{` 와 `}` 짝이 맞게 **`if` 블록 전체**를 감싸야 합니다. 평가하지 않은 항목은 인쇄물에서 배지 칸이 비어 있습니다.

#### D-5. 인쇄 배지 모양(크기 · 모서리) 바꾸기

난이도 ⭐

📁 `css/checklist-table.css` · 🔎 `.print-only-badge {`

```css
/* ✏️ 바꾼 후 — 동그란 배지 */
.print-only-badge {
  display: none;
  font-weight: 900;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 14px;
}
```

⚠️ 첫 줄 `display: none;` 은 그대로 둡니다 (화면에서는 JS 와 print.css 가 필요할 때만 보이게 함).

#### D-6. 새 체크리스트의 진단평가 방식 기본값 바꾸기

난이도 ⭐

지금은 새 체크리스트가 **간단히 = 대단원마다 진단평가 · SOLUTION 1개** 로 시작하고, 필요한 대단원만 "진단평가 자세히" 스위치를 켭니다.
처음부터 **자세히 = 중단원 줄마다** 로 시작하게 하려면: (구조 설명은 [4-11장](#4-11-진단평가-간단히--자세히-대단원별-평가))

📁 `js/checklist-table.js` · 🔎 `const DETAIL_DEFAULT = false;`

```js
// ✏️ 바꾸기 전
const DETAIL_DEFAULT = false; // 새 체크리스트의 진단평가 방식: false = 대단원별 1개(간단히), true = 중단원별(자세히)
// ✏️ 바꾼 후
const DETAIL_DEFAULT = true; // 새 체크리스트의 진단평가 방식: false = 대단원별 1개(간단히), true = 중단원별(자세히)
```

✅ **저장된 적 없는** 학생 · 시험(또는 빈 체크리스트)을 열면 모든 대단원의 스위치가 켜져 있고, 줄마다 A/B/C 버튼이 보임.

⚠️ 이미 저장된 체크리스트는 저장 당시의 방식(`detailUnits`)대로 열립니다. 모두 바꾸려면 단원 설정 패널의 **[모두 자세히]** 를 누르세요.

#### D-7. "진단평가 자세히" 스위치 · 버튼 글자 바꾸기

난이도 ⭐

| 무엇 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 표 제목 오른쪽 스위치 글자 | `js/checklist-table.js` | `<span class="detail-toggle-text">진단평가 자세히</span>` |
| 스위치에 마우스를 올리면 뜨는 설명 | `js/checklist-table.js` | `title="켜면 중단원마다 진단평가 · SOLUTION 을 따로 적어요"` |
| 단원 설정 패널의 작은 제목 | `index.html` | `<span class="detail-control-label">진단평가</span>` |
| 전체 버튼 두 개 | `index.html` | `모두 자세히` · `모두 간단히` |
| 모바일 대단원 카드의 칸 이름 | `js/checklist-table.js` | `"대단원 진단평가"` · `"대단원 SOLUTION"` ([A-7](#a-7-표-머리글-이름-바꾸기)) |

```js
// 📁 js/checklist-table.js — ✏️ 바꾸기 전
                      <span class="detail-toggle-text">진단평가 자세히</span>
// ✏️ 바꾼 후
                      <span class="detail-toggle-text">중단원별로 평가</span>
```

```html
<!-- 📁 index.html — ✏️ 바꾼 후 (버튼 안의 글자만 바꿈) -->
              <button
                type="button"
                class="btn-detail"
                id="detail-all-on"
                onclick="setAllDetail(true)"
              >
                모두 중단원별
              </button>
              <button
                type="button"
                class="btn-detail"
                id="detail-all-off"
                onclick="setAllDetail(false)"
              >
                모두 대단원별
              </button>
```

✅ 표 제목 옆 스위치 · 단원 설정 패널 버튼 글자 확인. (인쇄 · 이미지에는 스위치가 나오지 않는 것이 정상)

💡 모양은 📁 `css/checklist-table.css` · 🔎 `.detail-toggle {` (스위치 테두리 · 글자), 🔎 `.detail-toggle-input:checked + .detail-toggle-switch {` (켰을 때 색),
📁 `css/sidebar.css` · 🔎 `.btn-detail {` (버튼) · 🔎 `.btn-detail.is-active {` (지금 상태와 같아서 강조된 버튼).
⚠️ `id="detail-all-on"` · `id="detail-all-off"` 와 `onclick` 은 바꾸지 마세요 (강조 표시 · 동작이 이 값을 씀). 스위치 글자가 길면 좁은 화면에서 제목 탭 아래 줄로 내려갑니다.

#### D-8. 스위치를 없애고 한 가지 방식으로만 쓰기

난이도 ⭐⭐

예) **항상 간단히(대단원별 1개)** 로만 쓰기 — 스위치와 전체 버튼을 숨기고, 예전에 자세히로 저장한 체크리스트도 간단히로 엽니다.

**①** 📁 `css/checklist-table.css` 맨 아래에 추가 — 표 제목 옆 스위치 숨기기

```css
/* 진단평가 방식 스위치를 쓰지 않음 */
.detail-toggle {
  display: none;
}
```

**②** 📁 `index.html` · 🔎 `<div class="detail-control-row">` — 이 `<div>` 부터 짝이 맞는 `</div>` 까지 묶음 전체(작은 제목 + 버튼 두 개)를 지웁니다.

**③** 📁 `js/storage.js` · 🔎 `setUnitDetail(unitKey, detailUnits[unitKey], { save: false });`

```js
// ✏️ 바꾸기 전
    setUnitDetail(unitKey, detailUnits[unitKey], { save: false });
// ✏️ 바꾼 후 — 저장본의 방식과 상관없이 항상 기본값(DETAIL_DEFAULT)으로 열기
    setUnitDetail(unitKey, DETAIL_DEFAULT, { save: false });
```

**④ (항상 자세히로 쓰려면)** [D-6](#d-6-새-체크리스트의-진단평가-방식-기본값-바꾸기) 처럼 `DETAIL_DEFAULT` 를 `true` 로 바꿉니다.

✅ 스위치 · 전체 버튼이 사라지고, 어떤 체크리스트를 열어도 같은 방식으로 보임.

⚠️ 다른 방식으로 적어 두었던 평가 · SOLUTION 은 지워지지 않고 숨겨지기만 합니다 (③ 을 되돌리면 다시 보임).
💡 왼쪽 목록의 A/B/C 개수는 **저장된** `detailUnits` 기준으로 셉니다(그 체크리스트를 한 번 열어 저장하면 맞춰짐). 처음부터 맞추려면
📁 `js/student-list.js` · 🔎 `const keys = detailUnits[unitKey] ? shownSubs.map((s) => s.id) : [unitKey];` 의 `detailUnits[unitKey]` 를 `DETAIL_DEFAULT` 로 바꿉니다.

---

### E. 진단평가 메모 칸

A/B/C 버튼 아래 메모 칸입니다 (비어 있으면 흐린 안내 글자 "코멘트"). 저장 이름은 `gradeNotes` 입니다.

#### E-1. 흐린 안내 글자("코멘트") 바꾸기

난이도 ⭐

📁 `js/checklist-table.js` · 🔎 `data-placeholder="코멘트"`

```js
// ✏️ 바꾸기 전
data-placeholder="코멘트"
// ✏️ 바꾼 후
data-placeholder="예) 18/20"
```

✅ 비어 있는 메모 칸에 새 안내 글자. 인쇄 · 이미지에는 나오지 않습니다.

#### E-2. 메모 최대 글자 수 바꾸기

난이도 ⭐⭐

두 곳이 있습니다. **화면 제한 ≤ 저장소 제한** 이어야 합니다.

| 📁 파일 | 🔎 찾을 글자 | 뜻 |
| --- | --- | --- |
| `js/checklist-table.js` | `const GRADE_NOTE_MAX = 30;` | 입력칸에서 자르는 길이 |
| `js/db/db.js` | `const GRADE_NOTE_TEXT_MAX = 100;` | 저장할 때 검사하는 길이 |

```js
// 📁 js/checklist-table.js — ✏️ 바꾼 후
const GRADE_NOTE_MAX = 60;
```

⚠️ 100자를 넘기려면 `GRADE_NOTE_TEXT_MAX` 도 올리세요. 진단평가 열이 좁아서(약 110px) 긴 글은 여러 줄로 보입니다.

#### E-3. 메모 칸 크기 · 글자 모양 바꾸기

난이도 ⭐

| 어디 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 화면 | `css/checklist-table.css` | `.grade-note {` (`min-height`, `font-size`, `border`) |
| 인쇄 | `css/print.css` | `.grade-note {` |
| 모바일 | `css/responsive.css` | `.grade-note {` (`max-width: 220px`) |

```css
/* 📁 css/print.css — ✏️ 인쇄물 메모를 빨간 작은 글씨로 */
  .grade-note {
    min-height: 0 !important;
    margin: 3px 0 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    color: #c62828 !important;
    font-size: 10px !important;
  }
```

#### E-4. 메모 칸 없애기

난이도 ⭐

📁 `js/checklist-table.js` · 🔎 `<div class="grade-note"`

`<div class="grade-note" … ></div>` **한 줄 전체**를 지웁니다 (`gradeCellHtml` 함수 안 — 간단히 · 자세히 칸 모두에서 사라짐). 나머지 코드는 칸이 없으면 알아서 건너뜁니다.
(이미 저장된 메모는 Firebase 에 남고, 줄을 되살리면 다시 보입니다)

#### E-5. 메모를 꼭 적어야 인쇄되게 하기

난이도 ⭐⭐

📁 `js/export.js` · 🔎 `// 2) SOLUTION 미입력 항목` — **바로 위에** 추가

```js
  // 1-2) 진단평가 메모 미입력 항목 (간단히 대단원은 대단원 메모, 자세히 대단원은 줄마다)
  const noNote = getEvalItems().filter(
    (item) => !readGradeNote(document.getElementById(`${item.key}-note`)),
  );
  if (noNote.length) {
    alert(
      `진단평가 코멘트가 비어 있는 항목이 ${noNote.length}개 있습니다.\n${noNote.slice(0, 5).map(itemLabel).join(", ")}\n\n메모를 입력해야 ${actionLabel}할 수 있습니다.`,
    );
    noNote[0].element.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
```

✅ 메모가 빈 항목이 있으면 인쇄 · 이미지 버튼이 경고창을 띄움.
⚠️ [E-4](#e-4-메모-칸-없애기) 로 메모 칸을 없앴다면 이 검사는 넣지 마세요 (칸이 없어서 항상 걸림).

#### E-6. 메모를 여러 줄로 쓰게 하기

난이도 ⭐⭐⭐

지금은 한 줄만 쓰도록 막혀 있습니다. 여러 줄을 허용하려면 **다섯 곳**을 고칩니다.

**①** 📁 `js/checklist-table.js` · 🔎 `onkeydown="onGradeNoteKeydown(event)" onbeforeinput="onGradeNoteBeforeInput(event)"` — 이 두 속성을 지웁니다.

```js
// ✏️ 바꾼 후 (gradeCellHtml 함수 안)
<div class="grade-note" id="${key}-note" contenteditable="true" data-placeholder="코멘트" onpaste="onGradeNotePaste(event)" oninput="onGradeNoteInput(this, event)"></div>
```

**②** 같은 파일 🔎 `function onGradeNotePaste(event)` — 붙여넣기에서 줄바꿈을 지키기

```js
// ✏️ 바꾸기 전
  const text = (
    event.clipboardData ? event.clipboardData.getData("text/plain") : ""
  ).replace(/\s+/g, " ");
// ✏️ 바꾼 후
  const text = event.clipboardData ? event.clipboardData.getData("text/plain") : "";
```

**③** 같은 파일 🔎 `function readGradeNote(el)` — 줄바꿈을 살려서 읽기

```js
// ✏️ 바꾸기 전
  return el.textContent.replace(/\s+/g, " ").trim();
// ✏️ 바꾼 후
  return el.innerText.replace(/ /g, " ").trim();
```

**④** 같은 파일 🔎 `function onGradeNoteInput(el, event)` — 글자 수 자르기도 innerText 기준으로

```js
// ✏️ 바꾼 후
function onGradeNoteInput(el, event) {
  if (!(event && event.isComposing)) {
    if (el.innerText.length > GRADE_NOTE_MAX) {
      el.innerText = el.innerText.slice(0, GRADE_NOTE_MAX);
      placeCaretAtEnd(el);
    }
    if (!el.textContent.trim()) el.innerHTML = "";
  }
  saveCurrentState();
}
```

**⑤** 📁 `js/storage.js` · 🔎 `if (noteEl) noteEl.textContent = typeof notes[key] === "string" ? notes[key] : "";`

```js
// ✏️ 바꾼 후 (innerText 로 넣어야 줄바꿈이 살아남)
    if (noteEl) noteEl.innerText = typeof notes[key] === "string" ? notes[key] : "";
```

✅ 메모 칸에서 Enter 로 줄바꿈 → 저장 → 새로고침해도 줄바꿈 유지, 인쇄물에도 여러 줄.

---

### F. SOLUTION 칸과 문구 버튼

#### F-1. SOLUTION 문구 버튼 추가하기

난이도 ⭐

SOLUTION 칸을 누르면 뜨는 문구 목록입니다. 📁 `index.html` · 🔎 `id="solution-macro-popover"`

```html
<!-- ✏️ 기존 버튼 하나의 모양 -->
<button
  type="button"
  class="macro-btn"
  onclick="injectMacro('💡 심화 문제 풀이 유지', false)"
>
  💡 심화 문제 풀이 유지
</button>
```

- `injectMacro('여기', false)` 의 **'여기'** = SOLUTION 칸에 실제로 들어가는 글자
- 버튼 사이의 글자 = 팝오버에 보이는 버튼 이름 (짧게 줄여 써도 됨)

**추가 예** — `✍️ 서술형 풀이과정 연습` 버튼 아래(`</div>` 바로 위)에:

```html
<button
  type="button"
  class="macro-btn"
  onclick="injectMacro('📚 개념 노트 다시 정리', false)"
>
  📚 개념 노트 다시 정리
</button>
```

✅ SOLUTION 칸 클릭 → 새 버튼 → 누르면 칸에 문구가 들어가고 자동 저장.

⚠️ 문구 안에 **작은따옴표(`'`)** 를 쓰면 안 됩니다 (onclick 의 따옴표와 섞임). 꼭 필요하면 `\'` 로 적거나 `’` 를 쓰세요.
💡 칸에 이미 글자가 있으면 `기존 + 새 문구` 로 이어 붙고, 비어 있거나 `-` 면 새 문구로 바뀝니다.

#### F-2. 문구 버튼 삭제 · 순서 바꾸기 · 구분선

난이도 ⭐

- 삭제: `<button … class="macro-btn" …> … </button>` 묶음 전체를 지웁니다.
- 순서: 묶음을 잘라서 원하는 위치에 붙입니다.
- 구분선: 버튼 사이에 아래 줄을 넣습니다 (지금 파일에 있는 것과 같은 모양).

```html
<hr
  style="
    border: 0;
    border-top: 1px dashed #cbd5e1;
    width: 100%;
    margin: 2px 0;
  "
/>
```

#### F-3. 빨간 글씨로 들어가는 문구 만들기

난이도 ⭐

`injectMacro` 의 두 번째 값을 `true` 로 하면 SOLUTION 칸 글자가 빨간색(`.sol-c`)이 됩니다.

```html
<button type="button" class="macro-btn" onclick="injectMacro('🚨 재시험 필수', true)">
  🚨 재시험 필수 (빨강)
</button>
```

⚠️ 한 번 빨간색이 된 칸은 "➖ 공란" 버튼을 누르기 전까지 빨간색이 유지됩니다.
빨간 색 값: 📁 `css/checklist-table.css` · 🔎 `.sol-c {`
⚠️ 빨간색 여부(`class`)는 저장되지 않습니다. 새로고침하면 칸 글자는 남고 색은 기본색으로 돌아옵니다.

#### F-4. SOLUTION 기본값 "-" 를 다른 글자로 바꾸기

난이도 ⭐⭐

📁 `js/checklist-table.js` · 🔎 `const BLANK_SOLUTION = "-";`

```js
// ✏️ 바꾼 후
const BLANK_SOLUTION = "해당 없음";
```

✅ 새 체크리스트의 SOLUTION 칸이 "해당 없음" 으로 시작, 칸을 누르면 전체 선택, 비우면 "해당 없음" 으로 돌아옴, "➖ 공란" 버튼도 "해당 없음".

⚠️ 이미 `-` 로 저장된 칸은 `-` 그대로 보입니다. 팝오버의 "➖ 공란 (해당 없음)" 버튼 이름도 필요하면 📁 `index.html` · 🔎 `➖ 공란 (해당 없음)` 에서 바꾸세요.

#### F-5. SOLUTION 기본값을 완전히 빈 칸으로 (인쇄도 빈 칸)

난이도 ⭐⭐

```js
// 📁 js/checklist-table.js — ✏️ 바꾼 후
const BLANK_SOLUTION = "";
```

그런데 이렇게만 하면 **인쇄 전 검사**가 "SOLUTION 이 비어 있다"며 막습니다. 빈 칸 인쇄를 허용하려면 검사도 끕니다.

📁 `js/export.js` · 🔎 `// 2) SOLUTION 미입력 항목` — [D-4](#d-4-abc-를-안-골라도-인쇄되게-하기) 처럼 그 아래 `const noSol = …` 부터 `if (noSol.length) { … }` 끝까지를 `/* */` 로 감쌉니다.

#### F-6. SOLUTION 을 안 채워도 인쇄되게 하기

난이도 ⭐

F-5 의 두 번째 단계(검사 끄기)만 하면 됩니다. 기본값 `-` 가 있어서 보통은 걸리지 않지만, 선생님이 칸을 지우고 바로 인쇄하는 경우를 허용합니다.

#### F-7. 문구 팝오버 크기 · 색 바꾸기

난이도 ⭐

📁 `css/checklist-table.css`

| 무엇 | 🔎 찾을 글자 |
| --- | --- |
| 팝오버 폭 · 테두리 · 그림자 | `#solution-macro-popover {` (`width: min(260px, calc(100vw - 24px));`) |
| 버튼 기본 모양 | `.macro-btn {` |
| 버튼에 마우스를 올렸을 때 | `.macro-btn:hover {` |
| 맨 위 "공란" 버튼 | `.macro-btn-blank {` |

```css
/* ✏️ 바꾼 후 — 팝오버를 넓게, 버튼 글자 크게 */
#solution-macro-popover {
  …
  width: min(320px, calc(100vw - 24px));
  …
}
.macro-btn {
  …
  font-size: 13.5px;
  …
}
```

---

### G. 종합 의견

#### G-1. 새 체크리스트의 종합 의견 기본 문장 넣기

난이도 ⭐

📁 `index.html` · 🔎 `id="opinion-textarea"`

```html
<!-- ✏️ 바꾸기 전 -->
<div
  id="opinion-textarea"
  class="opinion-box"
  contenteditable="true"
  oninput="saveCurrentState()"
>
  <!-- 현재 전반적인 개념 이해도는 양호하나 … (예전 예시 문장, 주석이라 안 보임) -->
</div>
<!-- ✏️ 바꾼 후 -->
<div
  id="opinion-textarea"
  class="opinion-box"
  contenteditable="true"
  oninput="saveCurrentState()"
>
  이번 시험 범위의 개념 이해도는 ○○ 수준입니다. 취약한 단원은 ○○이며, 다음 수업에서 ○○을 보완하겠습니다.
</div>
```

✅ **저장된 적 없는** 학생 · 시험을 열면 기본 문장이 들어가 있음.

⚠️ 이미 저장된 체크리스트의 의견은 바뀌지 않습니다. 예전 예시 문장을 다시 쓰려면 `<!--` 와 `-->` 만 지우면 됩니다.

#### G-2. 종합 의견 위에 제목 달기

난이도 ⭐⭐

📁 `index.html` · 🔎 `<div class="opinion-section">`

```html
<!-- ✏️ 바꾼 후 -->
<div class="opinion-section">
  <div class="opinion-title">종합 의견</div>
  <div
    id="opinion-textarea"
    …
```

📁 `css/opinion.css` 맨 아래에 추가

```css
/* 종합 의견 제목 */
.opinion-title {
  margin-bottom: 8px;
  color: var(--brand);
  font-size: 14px;
  font-weight: 900;
}
```

✅ 화면 · 인쇄 · 이미지에 제목이 보임 (A4 용지 안에 있으니 모두 나옴). 화면에만 보이게 하려면 `class="opinion-title no-print"`.

#### G-3. 종합 의견 칸 높이 · 글자 크기

난이도 ⭐

| 어디 | 📁 파일 | 🔎 찾을 글자 | 지금 값 |
| --- | --- | --- | --- |
| 화면 | `css/opinion.css` | `.opinion-box {` | `min-height: 122px;` `font-size: 13px;` |
| 인쇄 | `css/print.css` | `.opinion-box {` | `min-height: 92px;` |

```css
/* 📁 css/opinion.css — ✏️ 바꾼 후 */
.opinion-box {
  width: 100%;
  min-height: 180px;
  …
  font-size: 14px;
  line-height: 1.8;
  …
}
```

#### G-4. 종합 의견을 꼭 써야 인쇄되게 하기

난이도 ⭐⭐

📁 `js/export.js` · 🔎 `// 3) 학생 이름·학교명` — **바로 위에** 추가

```js
  // 2-2) 종합 의견 미입력
  if (!getTextFromElement(document.getElementById("opinion-textarea"))) {
    alert(`종합 의견을 입력해야 ${actionLabel}할 수 있습니다.`);
    document.getElementById("opinion-textarea").focus();
    return false;
  }
```

⚠️ [G-1](#g-1-새-체크리스트의-종합-의견-기본-문장-넣기) 로 기본 문장을 넣었다면 이 검사는 항상 통과합니다.

---

### H. 머리말 · 파일 이름

#### H-1. 저장 파일 이름 형식 바꾸기

난이도 ⭐⭐

탭 제목이 곧 **PDF 기본 파일 이름 · 이미지 파일 이름**입니다.

📁 `js/report-header.js` · 🔎 `` const parts = [`${sName}학생`, sSchool, `${gradeLabel(currentGrade)}과학`, sExam, "완벽내신", "체크리스트"]; ``

```js
// ✏️ 바꾸기 전 → [네이처과학] 홍길동학생_예시중_중2과학_1학기 기말고사_완벽내신_체크리스트
  const parts = [`${sName}학생`, sSchool, `${gradeLabel(currentGrade)}과학`, sExam, "완벽내신", "체크리스트"];
  document.title = `[네이처과학] ${parts.filter(Boolean).join("_")}`;

// ✏️ 바꾼 후 → 1학기 기말고사_중2_예시중_홍길동_2026-09-17
  const today = new Date().toLocaleDateString("sv-SE"); // "2026-09-17" 모양
  const parts = [sExam, gradeLabel(currentGrade), sSchool, sName, today];
  document.title = parts.filter(Boolean).join("_");
```

💡 `parts.filter(Boolean)` 은 빈 값(예: 시험을 안 골랐을 때)을 빼는 코드입니다.
⚠️ 파일 이름에 쓸 수 없는 글자(`\ / : * ? " < > |`)가 들어가지 않게 하세요. 이름 · 학교가 비었을 때 기본값은 같은 함수의 `"미입력"` · `"학원"` 입니다.

#### H-2. 머리말에 칸 추가하기 (담당 선생님)

난이도 ⭐⭐⭐

머리말의 [이름] [학교명] [시험] 뒤에 [담당] 칸을 추가하는 예입니다. **다섯 곳**을 고칩니다.

**①** 📁 `index.html` · 🔎 `<label>시험 :</label>` — 시험 칸 `<div class="meta-cell">…</div>` 이 끝난 **바로 뒤**에:

```html
<div class="meta-cell">
  <label>담당 :</label>
  <input
    type="text"
    id="teacher-label"
    class="meta-input"
    value=""
    readonly
    tabindex="-1"
  />
</div>
```

**②** 📁 `css/report-header.css` · 🔎 `.student-meta-grid {` — 칸을 4개로

```css
.student-meta-grid {
  display: grid;
  grid-template-columns:
    minmax(130px, 0.9fr)
    minmax(220px, 1.55fr)
    minmax(150px, 1.05fr)
    minmax(110px, 0.8fr);
  …
}
```

**③** 📁 `css/print.css` · 🔎 `.student-meta-grid {` — 인쇄용도 똑같이 4개로

```css
  .student-meta-grid {
    grid-template-columns:
      minmax(130px, 0.9fr)
      minmax(220px, 1.55fr)
      minmax(150px, 1.05fr)
      minmax(110px, 0.8fr) !important;
  }
```

**④** 📁 `js/report-header.js` · 🔎 `document.getElementById("exam-type").value = currentExam;` — 바로 아래에

```js
  document.getElementById("teacher-label").value = currentTeacher || "";
```

**⑤** 📁 `js/export.js` · 🔎 `document.getElementById("exam-type"),` — 이미지로 찍을 때도 글자가 잘리지 않게 목록에 추가

```js
  const ctrls = [
    document.getElementById("student-name"),
    document.getElementById("school-name"),
    document.getElementById("exam-type"),
    document.getElementById("teacher-label"),
  ].filter(Boolean);
```

✅ 학생을 열면 머리말에 "담당 : 김선생", 인쇄 미리보기 · 이미지에도 표시.
⚠️ 모바일은 `css/responsive.css` 가 머리말을 한 줄에 하나씩 쌓으므로 고칠 필요 없습니다.

#### H-3. 이름 뒤 구분용 영문자 규칙 바꾸기

난이도 ⭐⭐

명단 이름 `홍길동A` 의 `A` 는 목록에서만 작게 보이고, 머리말 · 인쇄물 · 파일 이름에서는 빠집니다.

📁 `js/utils.js` · 🔎 `const match = text.match(/^(.*[가-힣])([A-Z]{1,2})$/);`

```js
// ✏️ 예1) 숫자로 구분한 이름도 떼기 (홍길동2 → 홍길동)
  const match = text.match(/^(.*[가-힣])([A-Z0-9]{1,2})$/);

// ✏️ 예2) 떼지 않고 명단 이름을 그대로 쓰기 — 함수 안을 이렇게
function splitStudentName(name) {
  const text = String(name || "").trim();
  return { base: text, tag: "" };
}
```

⚠️ 이 함수는 예전 저장본 가져오기(`legacy-import.js`)에서도 씁니다.

#### H-4. 머리말 칸 이름(라벨) 바꾸기

난이도 ⭐

📁 `index.html` · 🔎 `학교명 :`

```html
<!-- ✏️ 바꾸기 전 (코드 정리 도구가 태그를 두 줄로 나눠 둔 모양 그대로) -->
<label>학교명 :</label
><input
<!-- ✏️ 바꾼 후 — "학교명" 글자만 바꿈 -->
<label>소속 :</label
><input
```

같은 방법으로 🔎 `이름 :` · `시험 :` 도 바꿀 수 있습니다.
⚠️ 경고창 문구([A-6](#a-6-출력-전-경고창-문구-바꾸기))의 "학교명" 과 인쇄 확인창의 "학교명" 도 필요하면 함께 바꾸세요.

---

### I. 색 · 글꼴 · 디자인

#### I-1. 사이트 기본 색(브랜드 색) 바꾸기

난이도 ⭐

📁 `css/base.css` · 🔎 `:root {`

```css
/* ✏️ 바꾸기 전 */
  --brand: #183153; /* 브랜드 메인 색 (남색): 머리말, 주요 버튼 */
  --brand-2: #2f6f73; /* 브랜드 보조 색 (청록): 강조, AI 버튼, 선택 표시 */
  --gold: #d6a83d; /* 포인트 금색: 선택된 학년 탭, 인쇄 버튼, 머리말 밑줄 */
/* ✏️ 바꾼 후 — 초록 계열 */
  --brand: #1b4332;
  --brand-2: #2d6a4f;
  --gold: #e9c46a;
```

✅ 머리말 · 선생님 패널 · 주요 버튼 · 선택 표시 색이 한꺼번에 바뀜 (관리자 페이지도).

⚠️ **변수를 쓰지 않고 색을 직접 적은 곳**도 있어서, 완전히 맞추려면 함께 바꾸세요.

| 📁 파일 | 🔎 찾을 글자 | 무엇 |
| --- | --- | --- |
| `css/report-header.css` | `background: linear-gradient(135deg, var(--brand), #214765);` | 머리말 그라데이션 끝 색 |
| `css/login.css` | `background: linear-gradient(135deg, var(--brand), #214765);` | 로그인 화면 배경 |
| `admin/admin.css` | `background: linear-gradient(135deg, var(--brand), #214765);` | 관리자 머리말 |
| `css/action-dock.css` | `background: rgba(24, 49, 83, 0.97);` | 버튼 모음 · 토스트 배경 (남색) |
| `css/report-header.css` · `css/sidebar.css` | `#f4d98a` | 연한 금색 글자 |

💡 VS Code 에서 색 코드 왼쪽의 작은 네모를 누르면 색 고르기 창이 열립니다.

#### I-2. 대단원 색 바꾸기

난이도 ⭐

표 제목 탭 · 표 윗선 · 단원 설정 카드 띠의 색입니다. 대단원 **순서대로** 이 목록을 씁니다.

📁 `js/config.js` · 🔎 `const UNIT_COLORS = [`

```js
// ✏️ 바꾼 후 — 파스텔 대신 진한 색 6개 (6개보다 대단원이 많으면 처음부터 반복)
const UNIT_COLORS = [
  "#1d3557", // 남색
  "#2a9d8f", // 청록
  "#e76f51", // 주황
  "#6d597a", // 보라
  "#588157", // 초록
  "#bc4749", // 빨강
];
```

⚠️ 흰 글씨가 올라가므로 **진한 색**을 고르세요. 색 코드 뒤 쉼표를 빠뜨리지 마세요.

#### I-3. 학년 배지 색 바꾸기

난이도 ⭐

| 어디 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 선생님 화면 왼쪽 목록 `[중2]` | `css/sidebar.css` | `.si-grade-mid2 {` |
| 관리자 명단 표 | `admin/admin.css` | `.grade-badge.g-mid2 {` |
| 이름표가 없는 학년의 기본 회색 | `css/sidebar.css` · `admin/admin.css` | `.si-grade {` · `.grade-badge {` 의 `background: #5b6b82;` |

```css
/* 📁 css/sidebar.css — ✏️ 바꾼 후 */
.si-grade-mid2 {
  background: #7b2cbf;
}
```

#### I-4. 글꼴 바꾸기 (예: Noto Sans KR)

난이도 ⭐⭐

**① 글꼴 불러오기** 📁 `index.html` · 🔎 `pretendard.css` — `<link … />` 를 바꿉니다. (관리자 페이지 📁 `admin/index.html` 도 똑같이)

```html
<!-- ✏️ 바꾸기 전 -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
/>
<!-- ✏️ 바꾼 후 -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap"
/>
```

**② 글꼴 이름 적용** 📁 `css/base.css` · 🔎 `font-family: "Pretendard", "Malgun Gothic", sans-serif;`

```css
  font-family: "Noto Sans KR", "Malgun Gothic", sans-serif;
```

✅ 새로고침 후 글자 모양 확인. 이미지 저장에도 같은 글꼴로 찍힙니다.

#### I-5. A4 용지의 이중 테두리 바꾸기 · 없애기

난이도 ⭐

📁 `css/report-header.css` · 🔎 `.report-paper::before {` (남색 선) · `.report-paper::after {` (금색 선)

```css
/* ✏️ 테두리를 없애려면 두 규칙 안에 한 줄씩 추가 */
.report-paper::before {
  …
  display: none;
}
.report-paper::after {
  …
  display: none;
}
```

💡 인쇄 · 모바일에서는 원래부터 테두리를 숨깁니다 (`print.css` · `responsive.css`).

#### I-6. 표 글자 크기 바꾸기

난이도 ⭐

| 어디 | 📁 파일 | 🔎 찾을 글자 | 지금 |
| --- | --- | --- | --- |
| 화면 표 전체 | `css/checklist-table.css` | `.checklist-table th,` 아래 `font-size: 13px;` | 13px |
| SOLUTION 칸 | `css/checklist-table.css` | `.solution-td {` | 12px |
| 인쇄 표 칸 | `css/print.css` | `.checklist-table td {` | 11.4px |
| 인쇄 머리글 | `css/print.css` | `.checklist-table th {` | 11.4px |

```css
/* 📁 css/print.css — ✏️ 인쇄물 표 글자 키우기 */
  .checklist-table td {
    …
    font-size: 12.5px;
  }
```

⚠️ 인쇄 글자를 키우면 A4 한 장에 들어가는 줄이 줄어 페이지가 늘어날 수 있습니다.

#### I-7. 오른쪽 위 버튼 색 · 글자 바꾸기

난이도 ⭐

| 버튼 | 글자: 📁 `index.html` 🔎 | 색: 📁 `css/action-dock.css` 🔎 |
| --- | --- | --- |
| 🖨️ 인쇄 | `onclick="printReport()"` | `.btn-action-print {` |
| 📸 이미지 저장 | `onclick="saveAsImageFile()"` | `.btn-action-image {` |
| 📋 이미지 복사 | `onclick="copyImageToClipboard()"` | `.btn-action-copy {` |

```css
/* ✏️ 바꾼 후 — 복사 버튼을 보라색으로 */
.btn-action-copy {
  background-color: #6d597a;
  color: #ffffff;
}
```

**버튼 하나 숨기기** (예: 이미지 복사) — 📁 `index.html` 에서 그 `<button …>…</button>` 을 지우면 됩니다.

#### I-8. 페이지 배경색 바꾸기

난이도 ⭐

📁 `css/base.css` · 🔎 `background: linear-gradient(`

```css
/* ✏️ 바꾼 후 — 단색 배경 */
body {
  font-family: "Pretendard", "Malgun Gothic", sans-serif;
  background: #f3f4f6;
  …
}
```

---

### J. 화면 배치

#### J-1. 단원 설정이 오른쪽에 보이는 기준 폭 바꾸기

난이도 ⭐

지금은 창 폭이 **1280px 이상**이면 오른쪽에 보입니다.

📁 `css/responsive.css` · 🔎 `@media (min-width: 1280px) {`

```css
/* ✏️ 바꾼 후 — 더 넓은 화면(1440px 이상)에서만 오른쪽에 */
@media (min-width: 1440px) {
```

✅ 창 크기를 줄였다 늘리며 확인 (F12 → 기기 모양 아이콘 → 위쪽 폭 숫자 입력).
💡 지금 내 창의 폭 확인: F12 → Console 에 `innerWidth` 입력 후 Enter.

#### J-2. 오른쪽 단원 설정 패널 폭 바꾸기

난이도 ⭐⭐

두 숫자를 **짝으로** 바꿉니다: `패널 폭 + 18 = 리포트 오른쪽 여백`.

📁 `css/responsive.css` · 🔎 `padding-right: 258px;` · `width: 240px;`

```css
/* ✏️ 바꾼 후 — 패널 280px */
  .report-workspace {
    padding-right: 298px;
  }
  .scope-selector-panel {
    position: fixed;
    top: 136px;
    right: 18px;
    width: 280px;
    max-height: calc(100vh - 154px);
    overflow-y: auto;
  }
```

⚠️ 패널이 넓어질수록 가운데 A4 용지가 좁아집니다 (1280px 창에서 특히).

#### J-3. 단원 설정을 다시 항상 왼쪽에 두기

난이도 ⭐

📁 `css/responsive.css` · 🔎 `@media (min-width: 1280px) {` — 그 `@media (min-width: 1280px) { … }` **블록 전체**(닫는 `}` 까지)를 지웁니다.
(바로 위 설명 주석도 함께 지우면 깔끔합니다)

✅ 어떤 폭에서도 단원 설정이 왼쪽 학생 목록 아래에 보임.

#### J-4. 왼쪽 사이드바 폭 바꾸기

난이도 ⭐

| 화면 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 보통 폭 (861~1279px) | `css/base.css` | `grid-template-columns: 300px minmax(0, 1fr);` |
| 넓은 PC (1280px 이상) | `css/responsive.css` | `grid-template-columns: 260px minmax(0, 1fr);` |

```css
/* 📁 css/base.css — ✏️ 바꾼 후 */
  grid-template-columns: 340px minmax(0, 1fr);
```

#### J-5. 모바일 배치로 바뀌는 기준 폭 바꾸기

난이도 ⭐⭐

📁 `css/responsive.css` · 🔎 `@media (max-width: 860px) {`

```css
/* ✏️ 바꾼 후 — 태블릿(1024px 이하)도 한 줄 배치 */
@media (max-width: 1024px) {
```

⚠️ **인쇄**할 때도 이 규칙이 적용될 수 있습니다(A4 폭 약 794px). `print.css` 가 표 모양을 되돌리므로 보통 문제없지만, 바꾼 뒤 인쇄 미리보기를 꼭 확인하세요.

#### J-6. 버튼 모음을 화면 왼쪽 아래로 옮기기

난이도 ⭐⭐⭐

**①** 📁 `css/action-dock.css` · 🔎 `.action-dock {`

```css
/* ✏️ 바꾸기 전 */
.action-dock {
  position: fixed;
  top: 18px;
  right: 18px;
  …
/* ✏️ 바꾼 후 */
.action-dock {
  position: fixed;
  bottom: 18px;
  left: 18px;
  …
```

**②** 📁 `css/base.css` · 🔎 `padding-top: 96px;` — 버튼 모음 자리를 비워 두던 위쪽 여백을 줄입니다.

```css
  padding-top: 0;
```

**③** 📁 `css/responsive.css` · 🔎 `top: 136px;` — 넓은 PC 에서 단원 설정 패널이 버튼 모음 아래에서 시작하던 것을 맨 위부터로

```css
    top: 18px;
    …
    max-height: calc(100vh - 36px);
```

⚠️ 왼쪽 아래는 학생 목록과 겹칠 수 있습니다. 모바일은 `responsive.css` 의 `.action-dock` 규칙이 따로 맨 아래 막대로 만들어 줍니다.

#### J-7. 시험 선택 안내의 어둡기 · 반짝임 바꾸기 · 끄기

난이도 ⭐⭐

로그인했는데 시험이 공란이면 왼쪽 위 시험 선택 칸만 밝게 두고 나머지 화면을 어둡게 하는 안내입니다.
(`js/student-list.js` 의 `updateExamSpotlight` · `followExamSpotlight`, 모양은 `css/sidebar.css` 의 `.exam-spotlight`)

| 바꿀 것 | 📁 파일 | 🔎 찾을 글자 |
| --- | --- | --- |
| 어두운 정도 (마지막 숫자, 0 = 투명 ~ 1 = 완전히 까맣게) | `css/sidebar.css` | `box-shadow: 0 0 0 200vmax rgba(10, 18, 34, 0.6);` |
| 반짝이는 금색 테두리의 색 · 굵기 | `css/sidebar.css` | `border: 3px solid #f4d98a;` |
| 반짝이는 빠르기 (초) | `css/sidebar.css` | `animation: exam-spotlight-pulse 1.4s ease-in-out infinite;` |
| 시험 칸 둘레 밝은 여백 · 말풍선까지 간격 | `js/student-list.js` | `const pad = 8;` · `const gap = 18;` |

```css
/* 📁 css/sidebar.css — ✏️ 바꾼 후: 더 어둡게, 반짝임 없이 */
.exam-spotlight {
  …
  box-shadow: 0 0 0 200vmax rgba(10, 18, 34, 0.75);
  …
}
.exam-spotlight::after {
  …
  animation: none;
}
```

**안내 자체를 끄기** 📁 `js/student-list.js` · 🔎 `function updateExamSpotlight()`

```js
// ✏️ 바꾸기 전
  const show =
    Boolean(currentTeacher) &&
    !currentExam &&
    !isBlankChecklist &&
    !document.getElementById("login-screen").classList.contains("open");
// ✏️ 바꾼 후
  const show = false; // 시험 선택 안내 끄기
```

✅ 새 탭에서 로그인(시험 공란) → 화면이 어두워지지 않음. 시험 칸의 금색 빛(`.exam-select.is-empty`)과 표 자리의 "왼쪽 위에서 시험을 먼저 선택하면…" 문구는 그대로 남습니다.

⚠️ 어두운 막은 **클릭을 막지 않습니다** (`.exam-spotlight` 의 `pointer-events: none;`). 이 줄을 지우면 투명한 네모가 시험 선택 칸을 덮어서 **시험을 고를 수 없게** 되니 지우지 마세요.

---

### K. 인쇄 · PDF · 이미지

#### K-1. 인쇄 여백 바꾸기

난이도 ⭐

📁 `css/print.css` · 🔎 `margin: 9mm 10mm 11mm;`

```css
/* 값 순서: 위  좌우  아래 */
  @page {
    size: A4;
    margin: 15mm 12mm 15mm;
  }
```

✅ 🖨️ 인쇄 → 미리보기에서 여백 확인. (브라우저 인쇄 창의 "여백" 설정이 "기본값" 이어야 이 값이 쓰입니다)

#### K-2. 인쇄 글자 크기 전체 바꾸기

난이도 ⭐

📁 `css/print.css` · 🔎 `font-size: 11.6px;` (문서 전체 기본), 표는 [I-6](#i-6-표-글자-크기-바꾸기).

#### K-3. 대단원이 페이지에 걸치면 잘리지 않게 / 잘려도 되게

난이도 ⭐

지금은 **대단원 블록 · 표의 한 줄 · 종합 의견**이 페이지 경계에서 쪼개지지 않게 되어 있습니다 (그래서 페이지 아래에 빈 공간이 생길 수 있음).

📁 `css/print.css` · 🔎 `page-break-inside: avoid;`

```css
/* ✏️ 바꾸기 전 */
  .unit-block,
  .opinion-section,
  .check-row,
  .table-title {
    page-break-inside: avoid;
  }
/* ✏️ 바꾼 후 — 대단원은 페이지를 넘어가도 되게 (줄 단위로만 안 쪼개짐) */
  .opinion-section,
  .check-row,
  .table-title {
    page-break-inside: avoid;
  }
```

⚠️ 📁 `css/checklist-table.css` · 🔎 `.unit-block {` 에도 `page-break-inside: avoid;` 가 있으니 함께 지웁니다.

#### K-4. 이미지 해상도 높이기

난이도 ⭐

📁 `js/export.js` · 🔎 `scale: 2,`

```js
// ✏️ 바꾼 후 — 3배 (더 선명, 파일은 더 큼)
    scale: 3,
```

⚠️ 너무 크게(4 이상) 하면 휴대폰 · 오래된 PC 에서 이미지 만들기가 실패할 수 있습니다.

#### K-5. 이미지 배경색 · 파일 이름 바꾸기

난이도 ⭐

- 배경색: 📁 `js/export.js` · 🔎 `backgroundColor: "#ffffff",`
- 파일 이름: 📁 `js/export.js` · 🔎 `link.download = document.title + ".png";`

```js
// ✏️ 바꾼 후 — 파일 이름 뒤에 "_진단표" 붙이기
      link.download = document.title + "_진단표.png";
```

(PDF 파일 이름은 탭 제목을 그대로 씁니다 → [H-1](#h-1-저장-파일-이름-형식-바꾸기))

#### K-6. 인쇄 전 확인창 없애기

난이도 ⭐

📁 `js/export.js` · 🔎 `function printReport()`

```js
// ✏️ 바꾸기 전
function printReport() {
  if (!ensureReadyForOutput("인쇄/PDF 저장")) return;

  // 모든 필수 항목이 채워진 상태 — 이름·학교명이 맞는지 한 번 더 확인
  const name = document.getElementById("student-name").value.trim();
  const school = document.getElementById("school-name").value.trim();
  if (
    !confirm(
      `아래 정보가 맞는지 확인해 주세요.\n\n· 학생 이름 : ${name}\n· 학교명 : ${school}\n\n이대로 인쇄/PDF 저장을 진행할까요?`,
    )
  ) {
    return;
  }

  window.print();
}
// ✏️ 바꾼 후
function printReport() {
  if (!ensureReadyForOutput("인쇄/PDF 저장")) return;
  window.print();
}
```

#### K-7. 이미지 저장 전에도 확인창 띄우기

난이도 ⭐⭐

📁 `js/export.js` · 🔎 `if (!ensureReadyForOutput("이미지 저장")) return;` — 바로 아래에

```js
  const name = document.getElementById("student-name").value.trim();
  if (!confirm(`${name} 학생의 체크리스트를 이미지로 저장할까요?`)) return;
```

#### K-8. 화면에는 보이지만 인쇄 · 이미지에는 안 나오게 하기

난이도 ⭐

요소에 `no-print` class 를 붙입니다.

```html
<!-- 예) A4 용지 안에 선생님용 메모를 두고 인쇄에서는 숨김 -->
<div class="teacher-only-note no-print">※ 상담 때 확인할 것</div>
```

- 인쇄: 📁 `css/print.css` 의 `.no-print { display: none !important; }` 가 숨김
- 이미지: 📁 `js/export.js` 의 `captureReportCanvas` 가 `#capture-target-paper .no-print` 를 찍는 동안 숨김

---

### L. 자동 저장

#### L-1. 자동 저장 대기 시간 바꾸기

난이도 ⭐

마지막으로 입력한 뒤 이 시간이 지나면 저장합니다.

📁 `js/config.js` · 🔎 `const SAVE_DELAY_MS = 1200;`

```js
// ✏️ 바꾼 후 — 3초
const SAVE_DELAY_MS = 3000;
```

⚠️ 너무 짧으면 저장 요청이 많아져 Firebase 무료 사용량을 빨리 씁니다. 너무 길면 창을 급히 닫을 때 경고창이 자주 뜹니다.

#### L-2. 저장 실패 후 다시 시도 간격

난이도 ⭐

📁 `js/storage.js` · 🔎 `const RETRY_DELAY_MS = 5000;`

인터넷 문제로 실패했을 때만 다시 시도합니다 (규칙 거절 등은 다시 시도하지 않고 토스트로 알림).

#### L-3. 저장 상태 표시 색 바꾸기

난이도 ⭐

📁 `css/action-dock.css`

| 상태 | 🔎 찾을 글자 | 지금 색 |
| --- | --- | --- |
| 대기 | `.action-dock-save.is-idle {` | 회색 `#aebbd0` |
| 저장 중 · 불러오는 중 | `.action-dock-save.is-saving {` | 노랑 `#f0d7a0` (점이 깜빡임) |
| 저장됨 | `.action-dock-save.is-saved {` | 초록 `#86e0a3` |
| 실패 | `.action-dock-save.is-error {` | 빨강 `#ff9ba6` |
| 빈 체크리스트 | `.action-dock-save.is-blank {` | 노랑 |

---

### M. 왼쪽 학생 목록

#### M-1. 학생을 이름 가나다순으로 정렬하기

난이도 ⭐⭐

지금은 **선생님 → 등록 순서(CSV 줄 순서) → 이름** 순입니다.

📁 `js/db/db.js` · 🔎 `function sortStudents(list)`

```js
// ✏️ 바꾸기 전
function sortStudents(list) {
  return list.sort(
    (a, b) =>
      String(a.teacher).localeCompare(String(b.teacher), "ko") ||
      orderOf(a) - orderOf(b) ||
      String(a.name).localeCompare(String(b.name), "ko"),
  );
}
// ✏️ 바꾼 후 — 선생님 → 이름
function sortStudents(list) {
  return list.sort(
    (a, b) =>
      String(a.teacher).localeCompare(String(b.teacher), "ko") ||
      String(a.name).localeCompare(String(b.name), "ko"),
  );
}
```

⚠️ 목록은 **반별로 묶인 뒤** 이 순서가 반 안에서 적용됩니다. 관리자 명단 표는 따로 정렬합니다:
📁 `admin/admin.js` · 🔎 `orderOf(a) - orderOf(b) ||` 줄을 지우면 같은 규칙이 됩니다.

#### M-2. 반별로 묶지 않고 한 목록으로 보기

난이도 ⭐

📁 `js/student-list.js` · 🔎 `if (!students.some((s) => s.className)) return [{ className: null, students }];`

```js
// ✏️ 바꾸기 전
function groupByClass(students) {
  if (!students.some((s) => s.className)) return [{ className: null, students }];
  …
// ✏️ 바꾼 후 — 첫 줄을 조건 없이 돌려주기로 (아래 코드는 실행되지 않음)
function groupByClass(students) {
  return [{ className: null, students }];
  …
```

#### M-3. 반 순서를 이름순으로

난이도 ⭐⭐

지금은 명단에서 **처음 나온 순서**로 반이 놓입니다.

📁 `js/student-list.js` · 🔎 `return [...groups].map(([className, list]) => ({ className, students: list }));`

```js
// ✏️ 바꾼 후
  return [...groups]
    .map(([className, list]) => ({ className, students: list }))
    .sort((x, y) => x.className.localeCompare(y.className, "ko"));
```

💡 반 이름이 없는 학생("반 미지정")은 빈 글자라서 맨 앞에 옵니다.

#### M-4. 목록에서 학교 대신 반 이름 · 다른 정보 보여 주기

난이도 ⭐

📁 `js/student-list.js` · 🔎 `escapeHtml(student.school || "학교 미입력")`

```js
// ✏️ 바꾸기 전
    `<span class="si-school">${escapeHtml(student.school || "학교 미입력")}</span>` +
// ✏️ 바꾼 후 — "예시중 · 중2A반_수 7:30"
    `<span class="si-school">${escapeHtml([student.school, student.className].filter(Boolean).join(" · "))}</span>` +
```

⚠️ 목록에 글자를 넣을 때는 **항상 `escapeHtml(…)` 로 감싸세요.** (이름에 `<` 같은 글자가 있어도 화면이 깨지지 않게)

#### M-5. A/B/C 개수 표시 모양 바꾸기

난이도 ⭐

📁 `js/student-list.js` · 🔎 `function progressHtml(summary)`

```js
// ✏️ 바꾼 후 — "평가 7개" 처럼 합계만
function progressHtml(summary) {
  if (!summary || summary.A + summary.B + summary.C === 0) {
    return '<span class="p-none">평가 전</span>';
  }
  return `<span class="p-none">평가 ${summary.A + summary.B + summary.C}개</span>`;
}
```

#### M-6. "평가 전" · "학교 미입력" · "반 미지정" 문구

난이도 ⭐

📁 `js/student-list.js` · 🔎 `평가 전` · `학교 미입력` · `반 미지정`

#### M-7. 모바일에서 학생 목록 높이

난이도 ⭐

📁 `css/responsive.css` · 🔎 `max-height: 40vh;` (화면 높이의 40%, 넘치면 목록 안에서 스크롤)

---

### N. 로그인

#### N-1. 자동 로그인 끄기 (이름만 미리 채우기)

난이도 ⭐

📁 `js/login.js` · 🔎 `async function initLogin()`

```js
// ✏️ 바꾸기 전
async function initLogin() {
  showLoginScreen();
  const remembered = safeStorage.get(TEACHER_KEY);
  if (!remembered) return;
  document.getElementById("login-name").value = remembered;
  await loginAs(remembered);
}
// ✏️ 바꾼 후 — 마지막 줄만 지움
async function initLogin() {
  showLoginScreen();
  const remembered = safeStorage.get(TEACHER_KEY);
  if (!remembered) return;
  document.getElementById("login-name").value = remembered;
}
```

✅ 새로 접속하면 이름이 채워진 로그인 화면이 뜨고, [시작하기] 를 눌러야 들어감.

#### N-2. 명단에 없는 이름이면 들어가지 못하게 하기

난이도 ⭐⭐

지금은 명단에 없는 이름이면 "빈 체크리스트"(저장 안 됨)로 들어갑니다.

📁 `js/login.js` · 🔎 `const students = await fetchTeacherStudents(name);`

```js
// ✏️ 바꾸기 전
    const students = await fetchTeacherStudents(name);
    currentTeacher = name;
// ✏️ 바꾼 후 — 가운데 4줄 추가
    const students = await fetchTeacherStudents(name);
    if (!students.length) {
      setLoginMessage("명단에 없는 이름입니다. 띄어쓰기까지 정확히 입력했는지 확인해 주세요.");
      return;
    }
    currentTeacher = name;
```

✅ 없는 이름 → 로그인 카드 아래 빨간 안내, 화면이 열리지 않음.
💡 `return` 해도 `finally` 부분이 실행되어 버튼 잠금은 풀립니다.
⚠️ 기억된 이름이 명단에서 빠진 경우에도 로그인 화면에 멈춥니다 (정상).

#### N-3. 마지막으로 연 학생 대신 항상 첫 번째 학생 열기

난이도 ⭐

📁 `js/student-list.js` · 🔎 `const lastId = safeStorage.get(LAST_STUDENT_KEY);`

```js
// ✏️ 바꾼 후
  const lastId = null;
```

#### N-4. 사이드바의 "김선생 선생님" 표시 바꾸기

난이도 ⭐

📁 `js/login.js` · 🔎 `` document.getElementById("teacher-name").textContent = `${name} 선생님`; ``

```js
// ✏️ 바꾼 후 → "김선생 님"
    document.getElementById("teacher-name").textContent = `${name} 님`;
```

앞의 👤 아이콘은 📁 `css/sidebar.css` · 🔎 `content: "👤 ";`

---

### O. 관리자 페이지

#### O-1. CSV 제목 이름을 더 알아보게 하기

난이도 ⭐

CSV 첫 줄의 제목 글자로 열을 찾습니다. **띄어쓰기는 빼고** 비교합니다 (`학생 성명` = `학생성명`).

📁 `admin/admin.js` · 🔎 `const HEADER_NAMES = {`

```js
// ✏️ 바꾼 후 — "학생성명", "담임", "소속학교", "수업반" 추가
const HEADER_NAMES = {
  teacher: ["선생님", "담당선생님", "담당", "교사", "강사", "선생님이름", "담임"],
  name: ["이름", "학생", "학생이름", "학생명", "성명", "학생성명"],
  school: ["중학교", "학교", "학교명", "학교이름", "소속학교"],
  grade: ["학년"],
  className: ["반명", "반", "반이름", "수업", "수업명", "클래스", "수업반"],
};
```

✅ 관리자 페이지 → CSV 를 붙여넣으면 미리보기 위에 "첫 줄 제목으로 열을 찾았어요 → …" 확인.
⚠️ 선생님 · 학생 이름 열을 **둘 다** 찾아야 제목 줄로 인정합니다.

#### O-2. 제목 없는 붙여넣기의 열 순서 바꾸기

난이도 ⭐

📁 `admin/admin.js` · 🔎 `const DEFAULT_COLUMNS = { teacher: 0, name: 1, school: 2, grade: 3, className: 4 };`

```js
// ✏️ 바꾼 후 — 엑셀 열 순서가 [반, 이름, 학년, 학교, 선생님] 일 때 (0 부터 셈)
const DEFAULT_COLUMNS = { className: 0, name: 1, grade: 2, school: 3, teacher: 4 };
```

같은 순서 안내 문구도: 🔎 `제목 줄이 없어 선생님 · 학생 이름 · 학교명 · 학년 · 반 순서로 읽었어요.`

#### O-3. CSV 학년 글자 인식 추가하기 (예: 고1)

난이도 ⭐⭐

지금 알아보는 글자: `mid2` · `중2`(이름표) · `2학년` · `중2` · `2` · `중학교2학년`.

📁 `admin/admin.js` · 🔎 `` if (match && hasGradeData(`mid${match[1]}`)) return `mid${match[1]}`; ``

```js
// ✏️ 바꾼 후 — 그 줄 아래, return null; 위에 추가
  if (match && hasGradeData(`mid${match[1]}`)) return `mid${match[1]}`;
  const high = t.match(/^고(?:등학교)?([1-3])(?:학년)?$/);
  if (high && hasGradeData(`high${high[1]}`)) return `high${high[1]}`;
  return null;
```

✅ `고1` · `고등학교1학년` → `high1` ([C-7](#c-7-새-학년-추가하기-예-고1) 로 `high1` 학년을 만든 뒤).
💡 이름표(`GRADE_LABELS`)와 **똑같은 글자**(예: `고1`)는 이 코드 없이도 알아봅니다.

#### O-4. 중복 판단 기준 바꾸기

난이도 ⭐⭐

지금은 **선생님 · 이름 · 학교 · 학년**이 모두 같으면 "이미 명단에 있음" 으로 건너뜁니다.

📁 `admin/admin.js` · 🔎 `function isDuplicate(student, exceptId)`

```js
// ✏️ 바꾼 후 — 반까지 같아야 중복 (같은 학생을 다른 반에 두 번 등록 허용)
function isDuplicate(student, exceptId) {
  return roster.some(
    (s) =>
      s.id !== exceptId &&
      s.teacher === student.teacher &&
      s.name === student.name &&
      s.school === student.school &&
      s.grade === student.grade &&
      (s.className || "") === (student.className || ""),
  );
}
```

같은 파일 🔎 `const key = [row.teacher, row.name, row.school, row.grade].join("|");` (파일 안 중복 검사)에도 `row.className` 을 추가합니다.

```js
    const key = [row.teacher, row.name, row.school, row.grade, row.className].join("|");
```

⚠️ 같은 학생이 두 번 등록되면 선생님 목록에 두 줄로 나오고, **체크리스트도 따로** 저장됩니다.

#### O-5. 한 번에 등록할 수 있는 최대 인원

난이도 ⭐

📁 `js/db/db.js` · 🔎 `const MAX_ADD_STUDENTS = 500;`

#### O-6. 명단 표에 "등록일" 열 추가하기

난이도 ⭐⭐

**①** 📁 `admin/index.html` · 🔎 `<th class="col-actions">관리</th>` — 바로 위에 추가

```html
<th>등록일</th>
<th class="col-actions">관리</th>
```

같은 파일 🔎 `<td colspan="6" class="roster-empty">명단을 불러오는 중…</td>` 의 `6` → `7`

**②** 📁 `admin/admin.js` · 🔎 `function rowHtml(s)` — 학년 칸 다음에 추가

```js
    `<td><span class="grade-badge g-${escapeHtml(s.grade)}">${escapeHtml(gradeLabel(s.grade))}</span></td>` +
    `<td class="col-class">${s.createdAt ? new Date(s.createdAt).toLocaleDateString("ko-KR") : ""}</td>` +
```

**③** 같은 파일 🔎 `function editRowHtml(s)` — 학년 선택 칸 다음에 빈 칸 추가 (수정할 수 없는 값)

```js
    `<td><select class="edit-input" data-field="grade">${gradeOptionsHtml(s.grade)}</select></td>` +
    "<td></td>" +
```

**④** 같은 파일에서 `colspan="6"` 을 모두(3곳) `colspan="7"` 로 — VS Code **Ctrl + H**(바꾸기)로 한 번에.

✅ 명단 표에 `2026. 9. 17.` 같은 등록일 열. 불러오는 중 · 빈 명단 안내가 표 전체 폭으로 보이는지 확인.

#### O-7. 학생 추가 폼의 기본 학년 바꾸기

난이도 ⭐

📁 `admin/admin.js` · 🔎 `document.getElementById("add-grade").innerHTML = gradeOptionsHtml("mid1");`

```js
// ✏️ 바꾼 후 — 중2 가 처음 선택
  document.getElementById("add-grade").innerHTML = gradeOptionsHtml("mid2");
```

#### O-8. 관리자 페이지 주소 바꾸기 (주소를 아는 사람만 들어오게)

난이도 ⭐⭐

비밀번호가 없으므로, 주소를 짐작하기 어렵게 바꾸는 것만으로도 도움이 됩니다.

1. VS Code 탐색기에서 `admin` 폴더 이름을 예를 들어 `manage-7k3q` 로 바꿉니다.
2. 📁 `manage-7k3q/index.html` 안의 경로 두 곳:

```html
<!-- ✏️ 바꾸기 전 -->
<link rel="stylesheet" href="/admin/admin.css" />
<script src="/admin/admin.js"></script>
<!-- ✏️ 바꾼 후 -->
<link rel="stylesheet" href="/manage-7k3q/admin.css" />
<script src="/manage-7k3q/admin.js"></script>
```

3. 📁 `js/export.js` · 🔎 `관리자 페이지(/admin)에서` → 새 주소를 쓰지 말고 `관리자 페이지에서` 로 바꾸는 것을 추천 (선생님 화면에 주소가 드러나지 않게)

✅ `https://배포주소/manage-7k3q` 로 열림, `/admin` 은 404.
⚠️ 새 주소는 GitHub(공개 저장소라면)와 이 설명서 · README 에 적지 마세요.

#### O-9. 명단을 CSV 파일로 내려받는 버튼 만들기 (백업)

난이도 ⭐⭐⭐

**①** 📁 `admin/index.html` · 🔎 `<div class="roster-tools">` — 안쪽 맨 끝(검색 칸 다음)에 추가

```html
<button type="button" class="btn-small" onclick="downloadRosterCsv()">⬇ CSV 내려받기</button>
```

**②** 📁 `admin/admin.js` · 🔎 `/* ── 알림 ──` — 바로 위에 함수 추가

```js
// 명단을 CSV 파일로 내려받는다 (백업용). 이 파일을 다시 올리면 등록된 학생은 건너뜀.
// 엑셀에서 한글이 깨지지 않게 맨 앞에 BOM(﻿)을 붙인다.
function downloadRosterCsv() {
  if (!ensureRosterReady()) return;
  const cell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const header = ["선생님", "반명", "이름", "중학교", "학년"];
  const lines = [...roster]
    .sort((a, b) => a.teacher.localeCompare(b.teacher, "ko") || orderOf(a) - orderOf(b))
    .map((s) => [s.teacher, s.className || "", s.name, s.school, gradeLabel(s.grade)].map(cell).join(","));
  const csv = "﻿" + [header.join(","), ...lines].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `학생명단_${new Date().toLocaleDateString("sv-SE")}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```

✅ 버튼 → `학생명단_2026-09-17.csv` 다운로드 → 엑셀로 열어 한글 확인 → 그대로 관리자 페이지에 올리면 "이미 명단에 있습니다" 로 모두 건너뜀.
⚠️ 학생 개인정보 파일입니다. 공유 폴더 · GitHub 에 올리지 마세요.

---

### P. 저장소 · Firebase · 새 데이터 칸

#### P-1. 다른 Firebase 프로젝트로 바꾸기

난이도 ⭐⭐

1. 새 프로젝트의 웹 앱 설정값을 📁 `js/firebase-config.js` 에 붙여넣기 ([README 6장 ①](README.md))
2. 새 프로젝트에 Firestore 데이터베이스 만들기 · 규칙 붙여넣기 ([README 6장 ②③](README.md))
3. 명단 다시 등록 (관리자 페이지 CSV — [O-9](#o-9-명단을-csv-파일로-내려받는-버튼-만들기-백업) 로 미리 내려받아 두면 편함)

⚠️ **데이터는 옮겨지지 않습니다.** 예전 프로젝트의 체크리스트는 예전 프로젝트에 남아 있습니다.

#### P-2. Firestore 컬렉션 이름 바꾸기

난이도 ⭐⭐

📁 `js/db/firebase-db.js` · 🔎 `const STUDENTS_COLLECTION = "checklist-students";`

```js
const STUDENTS_COLLECTION = "nature-students";
const REPORTS_COLLECTION = "nature-reports";
```

📁 `firestore.rules` — **세 곳**을 똑같이 바꾸고 콘솔에 다시 게시

| 🔎 찾을 글자 | 바꿀 글자 |
| --- | --- |
| `match /checklist-students/{studentId} {` | `match /nature-students/{studentId} {` |
| `get(/databases/$(database)/documents/checklist-students/$(d.studentId))` | `…/documents/nature-students/$(d.studentId))` |
| `match /checklist-report/{reportId} {` | `match /nature-reports/{reportId} {` |

⚠️ 기존 컬렉션의 데이터는 새 이름으로 옮겨지지 않습니다 (새로 시작). 규칙을 안 바꾸면 "저장소 규칙이 요청을 막았습니다" 오류.

#### P-3. 연습용 테스트 모드 켜기 · 끄기 · 초기화

난이도 ⭐

[1-4. 연습용 테스트 모드](#1-4-연습용-테스트-모드-실제-데이터를-건드리지-않기) 참고. 요약:

| 하고 싶은 것 | 방법 |
| --- | --- |
| 켜기 | 📁 `js/firebase-config.js` 의 `projectId` 값을 `""` 로 (내 컴퓨터에서만) |
| 끄기 | 원래 값으로 되돌리기 (**커밋 전에 꼭**) |
| 테스트 데이터 지우기 | F12 Console: `localStorage.removeItem("nature_test_db")` |
| 기다리는 시간(흉내) 없애기 | 📁 `js/db/test-db.js` · 🔎 `const TEST_DB_DELAY_MS = 120;` → `0` |

#### P-4. 체크리스트에 새 저장 칸 추가하기 (예: 숙제 메모)

난이도 ⭐⭐⭐

종합 의견 아래에 "숙제 · 다음 수업 준비" 칸을 추가해서 **학생 · 시험별로 저장**하는 예입니다.
**화면 → 저장 → 불러오기 → 초기화 → 검사 → 규칙** 여섯 곳을 고칩니다. (데이터 칸을 추가하는 모든 경우에 같은 순서)

**① 화면에 칸 만들기** 📁 `index.html` · 🔎 `<!-- 인쇄할 때만 보이는 푸터` — 바로 **위**에 추가

```html
<!-- 숙제 · 다음 수업 준비 (저장: homework) -->
<div class="opinion-section">
  <div class="homework-title">숙제 · 다음 수업 준비</div>
  <div
    id="homework-box"
    class="opinion-box"
    contenteditable="true"
    oninput="saveCurrentState()"
  ></div>
</div>
```

📁 `css/opinion.css` 맨 아래에 추가

```css
/* 숙제 · 다음 수업 준비 칸 */
.homework-title {
  margin-bottom: 8px;
  color: var(--brand);
  font-size: 14px;
  font-weight: 900;
}
#homework-box {
  min-height: 70px;
}
```

**② 저장할 때 담기** 📁 `js/storage.js` · 🔎 `opinion: document.getElementById("opinion-textarea").innerHTML,`

```js
  const stateObj = {
    opinion: document.getElementById("opinion-textarea").innerHTML,
    homework: document.getElementById("homework-box").innerHTML,
    customEdits: {},
    …
```

**③ 불러올 때 채우기** 📁 `js/storage.js` · 🔎 `restoreScopeSelections(state.scopeSelections || {});` — 바로 **위**에 추가

```js
  document.getElementById("homework-box").innerHTML = state.homework
    ? sanitizeHtml(state.homework)
    : "";
  restoreScopeSelections(state.scopeSelections || {});
```

**④ 다른 학생으로 바꿀 때 비우기** 📁 `js/student-list.js` · 🔎 `document.getElementById("opinion-textarea").innerHTML = DEFAULT_OPINION;`
이 줄이 **4곳**(`openChecklist` · `beginLoading` · `closeChecklist` · `openBlankChecklist`) 있습니다. 각각 바로 아래에:

```js
  document.getElementById("homework-box").innerHTML = "";
```

> 이걸 빼먹으면, 숙제를 적은 학생 다음에 **저장된 적 없는** 학생을 열었을 때 앞 학생의 숙제가 그대로 남아 있습니다.

**⑤ 저장소 검사에 칸 추가** 📁 `js/db/db.js` · 🔎 `opinion: limitText(data.opinion), // 종합 의견 HTML`

```js
  const out = {
    opinion: limitText(data.opinion), // 종합 의견 HTML
    homework: limitText(data.homework), // 숙제 · 다음 수업 준비 HTML
    customEdits: {},
    …
```

> ⚠️ 이걸 빼먹으면 화면에서는 입력되는데 **저장소에 저장되지 않습니다** (`cleanReportData` 는 아는 칸만 통과시킴).

**⑥ Firestore 규칙에 칸 허용** 📁 `firestore.rules` · 🔎 `function checklistReportOk(reportId, d)`

```
// hasOnly 목록 끝에 'homework' 추가
        && d.keys().hasOnly(['studentId', 'teacher', 'studentName', 'schoolName', 'grade', 'examType', 'opinion', 'customEdits', 'activeGrades', 'scopeSelections', 'gradeNotes', 'detailUnits', 'updatedAt', 'homework'])
// 검사 한 줄 추가 (d.updatedAt is number; 의 앞 줄에)
        && (!('homework' in d) || checklistTextOk(d.homework, 0, 60000))
```

→ **Firebase 콘솔 규칙 탭에도 똑같이 반영 후 게시.** (테스트 모드는 규칙을 쓰지 않으므로 콘솔 반영 전에도 테스트 모드에서는 저장됨 — 실제 사이트에서 확인 필수)

✅ 확인 순서: 숙제 입력 → "저장됨" → 새로고침 후 유지 → 다른 학생을 열면 빈 칸 → 인쇄 미리보기 · 이미지에 보임.

#### P-5. 학생 명단에 새 칸 추가하기 (예: 비고)

난이도 ⭐⭐⭐

관리자 페이지에서 학생마다 "비고"를 적는 예입니다.

**① 추가 폼** 📁 `admin/index.html` · 🔎 `<span>반 (선택)</span>` — 그 `<label class="field">…</label>` 이 끝난 **다음**에:

```html
<label class="field">
  <span>비고 (선택)</span>
  <input id="add-memo" maxlength="60" placeholder="예) 토요일 보강" />
</label>
```

📁 `admin/admin.css` · 🔎 `grid-template-columns: repeat(3, minmax(0, 1fr)) 96px minmax(0, 1.3fr) auto;`

```css
  grid-template-columns: repeat(3, minmax(0, 1fr)) 96px minmax(0, 1.3fr) minmax(0, 1fr) auto;
```

**② 추가할 때 담기** 📁 `admin/admin.js` · 🔎 `className: inputValue("add-class"),`

```js
    className: inputValue("add-class"),
    memo: inputValue("add-memo"),
```

**③ 저장소 검사** 📁 `js/db/db.js` · 🔎 `className: cleanText(item.className, "반 이름", { max: 60, required: false }),`

```js
    className: cleanText(item.className, "반 이름", { max: 60, required: false }),
    memo: cleanText(item.memo, "비고", { max: 60, required: false }),
```

**④ 규칙** 📁 `firestore.rules` · 🔎 `function checklistStudentOk(d)` → `hasOnly([…])` 에 `'memo'` 추가, 그리고

```
        && (!('memo' in d) || checklistTextOk(d.memo, 0, 200))
```

→ 콘솔에 반영 · 게시.

**⑤ 명단 표에 보이기 · 수정하기**

- 📁 `admin/index.html` · 🔎 `<th class="col-actions">관리</th>` 위에 `<th>비고</th>` · `colspan="6"` → `7`
- 📁 `admin/admin.js` · 🔎 `function rowHtml(s)` — 학년 칸 다음에 `` `<td class="col-class">${escapeHtml(s.memo || "")}</td>` + ``
- 📁 `admin/admin.js` · 🔎 `function editRowHtml(s)` — 학년 칸 다음에
  `` `<td><input class="edit-input" data-field="memo" value="${escapeHtml(s.memo || "")}" maxlength="60" /></td>` + ``
- 📁 `admin/admin.js` · 🔎 `className: field("className"),` 아래에 `memo: field("memo"),`
- 📁 `admin/admin.js` 의 `colspan="6"` 3곳 → `7`

**⑥ CSV 에서도 읽기 (선택)** 📁 `admin/admin.js`

```js
const HEADER_NAMES = {
  …
  className: ["반명", "반", "반이름", "수업", "수업명", "클래스"],
  memo: ["비고", "메모"],
};
const FIELD_LABELS = { teacher: "선생님", name: "학생 이름", school: "학교명", grade: "학년", className: "반", memo: "비고" };
const DEFAULT_COLUMNS = { teacher: 0, name: 1, school: 2, grade: 3, className: 4, memo: 5 };
```

같은 파일 `previewBulk` 의 🔎 `className: cellOf("className"),` 아래에 `memo: cellOf("memo"),`,
글자 수 검사 🔎 `row.className.length > 60) {` 를 `row.className.length > 60 || row.memo.length > 60) {` 로,
`submitBulk` 의 🔎 `valid.map(({ teacher, name, school, grade, className }) => ({` 를

```js
      valid.map(({ teacher, name, school, grade, className, memo }) => ({
        teacher,
        name,
        school,
        grade,
        className,
        memo,
      })),
```

✅ 학생 추가 · CSV · 수정에서 비고 저장 → 새로고침 후 명단 표에 유지.
⚠️ 수정 저장(`saveEdit`)은 모든 칸을 다시 보냅니다. ⑤의 `memo: field("memo")` 를 빠뜨리면 **수정할 때 비고가 지워집니다.**

#### P-6. Firebase 프로그램(SDK) 버전 올리기

난이도 ⭐

📁 `js/db/firebase-db.js` · 🔎 `const FIREBASE_SDK_URL = "https://www.gstatic.com/firebasejs/12.19.0";`

숫자만 새 버전으로 바꿉니다 (예: `12.20.0`). 바꾼 뒤 로그인 · 저장 · 관리자 추가/삭제를 모두 확인하세요.
⚠️ 앞자리(12 → 13)가 바뀌는 큰 업데이트는 사용법이 달라질 수 있어 확인이 더 필요합니다.

#### P-7. 저장이 거절될 때 원인 찾기

난이도 ⭐⭐

1. F12 → Console 에서 노란 `Firebase 오류` 줄을 펼쳐 원래 오류 문구를 봅니다.
2. `Missing or insufficient permissions` → 규칙 문제. 자주 있는 원인:
   - 코드에서 새 칸을 저장하는데 `firestore.rules` 의 `hasOnly([…])` 에 없음 (P-4 ⑥, P-5 ④)
   - 규칙 파일만 고치고 **콘솔에 게시하지 않음**
     (예: 진단평가 간단히/자세히 기능이 들어간 버전을 배포했는데, `'detailUnits'` 가 들어간 규칙을 아직 게시하지 않음 → **모든** 체크리스트 저장이 거절됨)
   - 명단에서 학생이 지워졌거나 학년이 바뀜 → 새로고침
3. Firebase 콘솔 → Firestore → 규칙 → **규칙 플레이그라운드**로 문서 경로 · 데이터를 넣고 시험해 볼 수 있습니다.

#### P-8. 한 체크리스트를 두 사람이 동시에 고치면? (동작 설명)

저장은 **통째로 덮어쓰기**라서, 마지막에 저장한 사람의 내용이 남습니다.
같은 학생 · 같은 시험을 두 기기에서 동시에 열어 두고 작성하지 않도록 안내해 주세요.

---

### Q. 보안을 더 강하게 하고 싶을 때 (로드맵)

지금은 설정이 쉬운 대신 **주소를 아는 사람은 누구나** 명단 · 체크리스트를 보고 고칠 수 있습니다.
나중에 보호를 강화하고 싶다면 아래 방향으로 바꿀 수 있습니다. (코드 여러 곳이 바뀌므로 한 번에 진행하는 큰 작업입니다)

| 단계 | 내용 | 바뀌는 파일 |
| --- | --- | --- |
| 1 | Firebase 콘솔 → Authentication → **이메일/비밀번호** 로그인 켜기, 선생님 · 관리자 계정 만들기 | (콘솔) |
| 2 | `js/db/firebase-db.js` 에 `firebase-auth.js` 를 불러오고 로그인 · 로그아웃 함수 추가 | `js/db/firebase-db.js`, `js/db/db.js`, `js/db/test-db.js` |
| 3 | 로그인 화면을 "이름" 대신 "이메일 + 비밀번호" 로 | `index.html`, `js/login.js`, `admin/index.html`, `admin/admin.js` |
| 4 | 규칙에서 `request.auth != null` (로그인한 사람만), 관리자 이메일만 명단 쓰기 허용 | `firestore.rules` |

⚠️ 같은 Firebase 프로젝트를 다른 앱과 함께 쓰므로, **익명 로그인은 켜지 마세요.**
다른 앱의 규칙이 "로그인한 사람은 모두 허용" 이면, 익명 로그인만으로 그 앱 데이터가 열릴 수 있습니다.

---

## 7. 저장 · 배포 · 되돌리기 (Git + Vercel)

### 7-1. 흐름 한눈에 보기

```
[내 컴퓨터]  파일 고치기 → node dev-server.js 로 확인
     │
     ▼  커밋 (수정 기록 저장)
[Git]  "SOLUTION 문구 버튼 추가" 같은 메시지와 함께 저장
     │
     ▼  push (GitHub 에 올리기)
[GitHub]
     │  (자동)
     ▼
[Vercel]  새 버전을 만들어 사이트에 공개 → 보통 1분 안에 반영
```

### 7-2. VS Code 로 커밋 · 올리기 (버튼으로)

1. 왼쪽 **소스 제어** 아이콘(갈림길 모양, `Ctrl + Shift + G`)을 누릅니다.
2. "변경 사항" 목록에서 파일을 눌러 **무엇이 바뀌었는지** 확인합니다. (빨강 = 지운 줄, 초록 = 추가한 줄)
3. 위쪽 메시지 칸에 한 줄 설명을 적습니다. 예) `SOLUTION 문구 버튼 2개 추가`
4. **✓ 커밋** 버튼 → (모든 변경을 올릴지 물으면 "예")
5. **변경 내용 동기화**(또는 ↑ push) 버튼을 누릅니다.

### 7-3. 터미널로 커밋 · 올리기 (명령어로)

```bash
git status
```

```bash
git add -A
```

```bash
git commit -m "SOLUTION 문구 버튼 2개 추가"
```

```bash
git push
```

### 7-4. 올리기 전에 꼭 확인할 것

- [ ] `js/firebase-config.js` 가 **실제 값**으로 채워져 있다 (테스트 모드로 비워 둔 상태가 아님)
- [ ] 학생 명단 **CSV 파일**이나 개인정보가 담긴 파일이 변경 목록에 없다
- [ ] `.env` 가 목록에 없다 (`.gitignore` 에 들어 있어서 보통은 안 보임)
- [ ] 내 컴퓨터에서 [9장 체크리스트](#9-고친-뒤-확인-체크리스트) 를 확인했다
- [ ] 데이터 모양을 바꿨다면 `firestore.rules` 를 **콘솔에 게시**했다

### 7-5. 배포 확인 · 되돌리기

| 하고 싶은 것 | 방법 |
| --- | --- |
| 배포가 끝났는지 보기 | Vercel 대시보드 → 프로젝트 → **Deployments** (초록 "Ready" 면 완료) |
| 배포 실패 원인 보기 | 실패한 배포를 눌러 **Build Logs** 확인 (이 프로젝트는 빌드가 없어서 실패하는 일은 드묾) |
| 사이트를 바로 예전 버전으로 | Deployments 에서 예전 배포의 `⋯` → **Promote to Production** (또는 Instant Rollback) |
| 코드도 예전으로 되돌리기 | 되돌릴 커밋을 찾아 `git revert 커밋번호` → `git push` (기록을 지우지 않고 "되돌리는 커밋"을 새로 만듦) |
| 최근 커밋 번호 보기 | `git log --oneline` |

> ⚠️ Vercel 의 미리보기(Preview) 주소도 **같은 Firebase** 를 씁니다. 미리보기에서 입력한 내용도 실제 데이터에 저장됩니다.

---

## 8. 문제 해결

### 8-1. 먼저 볼 곳: 개발자 도구 콘솔

**F12 → Console**. 빨간 글씨 오류를 찾고, 오른쪽의 `파일이름.js:줄번호` 를 누르면 문제 줄로 이동합니다.

| 콘솔 오류 (예) | 뜻 | 해결 |
| --- | --- | --- |
| `Uncaught SyntaxError: Unexpected token '}'` / `missing ) after argument list` / `Invalid or unexpected token` | **문법 오류** — 괄호 · 따옴표 · 쉼표 짝이 안 맞음 | 표시된 줄과 **그 바로 위 줄**을 확인. 방금 고친 곳부터 보기 |
| `Uncaught ReferenceError: xxx is not defined` | 그런 이름의 함수 · 변수가 없음 | 이름 오타(대소문자 포함), 새 파일이면 `index.html` 에 `<script>` 추가했는지, 앞 파일에 문법 오류가 있는지 |
| `Identifier 'xxx' has already been declared` | 같은 이름을 두 번 만듦 | 전체 검색(Ctrl+Shift+F)으로 `const xxx` / `let xxx` 를 찾아 이름 바꾸기 |
| `Cannot read properties of null (reading 'value')` 등 | `getElementById("…")` 가 요소를 못 찾음 | id 오타, HTML 에서 id 를 바꿨는지, 요소를 지웠는지 |
| `xxx is not a function` | 함수가 아닌 것을 부름 · 이름 오타 | 함수 이름 확인 |
| 노란 `Firebase 오류` | 저장소 오류의 원래 내용 | 펼쳐서 `code` · `message` 확인 → [8-3](#8-3-화면에-뜨는-안내-문구별-해결) |

> 💡 JS 파일 하나에 문법 오류가 있으면 **그 파일 전체가 실행되지 않고**, 그 파일의 함수를 쓰는 다른 곳까지 줄줄이 "not defined" 가 납니다. 가장 **위에 있는 첫 오류**부터 고치세요.

### 8-2. 증상별 해결

| 증상 | 확인할 것 | 해결 |
| --- | --- | --- |
| 고쳤는데 화면이 그대로 | ① 파일을 저장했나 (VS Code 탭에 ● 표시) ② `localhost:5600` 으로 열었나 ③ 강력 새로고침 했나 | Ctrl+S 저장 → **Ctrl+Shift+R**. CSS 라면 F12 → Elements → Styles 에서 규칙에 **줄이 그어져** 있는지(다른 규칙에 밀림) 확인 |
| 로그인 화면이 계속 뜸 / 버튼이 안 눌림 | 콘솔 오류 | 8-1 표 참고 |
| 로그인했는데 학생이 없음 (빈 체크리스트) | 관리자 명단의 **선생님 이름**과 띄어쓰기까지 같은지 | 관리자 페이지에서 선생님 이름 수정 |
| 표가 안 보임 | ① 시험 선택이 공란 ② 단원 설정이 모두 꺼짐 ③ "단원 데이터가 없습니다" 안내 | 시험 선택 / 단원 켜기 / `curriculum.js` 의 학년 코드와 명단 학년 일치 확인 |
| 진단평가 · SOLUTION 이 대단원마다 1개만 보임 | 정상 (기본 = 간단히) | 줄마다 쓰려면 표 제목 오른쪽 **"진단평가 자세히"** 스위치, 전체는 단원 설정의 [모두 자세히]. 기본값은 [D-6](#d-6-새-체크리스트의-진단평가-방식-기본값-바꾸기) |
| 예전에 줄마다 적은 A/B/C · SOLUTION 이 안 보임 | 그 대단원이 간단히로 되어 있음 | 스위치를 켜면 그대로 보입니다 (방식을 바꿔도 내용은 지워지지 않음) |
| 업데이트한 뒤 모든 저장이 "저장소 규칙이 요청을 막았습니다" | `firestore.rules` 의 `hasOnly` 에 `'detailUnits'` 가 있는 규칙을 콘솔에 게시했는지 | 규칙을 다시 붙여넣고 게시 → 새로고침 ([5-23](#5-23-firestorerules--firestore-보안-규칙)) |
| 단원 설정이 오른쪽에 안 보임 | 창 폭 (Console 에 `innerWidth`) | 1280 미만이면 왼쪽이 정상. 기준은 [J-1](#j-1-단원-설정이-오른쪽에-보이는-기준-폭-바꾸기) |
| 다른 학생을 열었는데 앞 학생 내용이 남아 있음 | 새로 추가한 칸의 **초기화** | [P-4 ④](#p-4-체크리스트에-새-저장-칸-추가하기-예-숙제-메모) |
| "저장됨" 이 뜨는데 새로고침하면 새 칸 내용이 사라짐 | `db.js` 의 `cleanReportData` · `storage.js` 의 `applyStateObj` | [P-4 ③ ⑤](#p-4-체크리스트에-새-저장-칸-추가하기-예-숙제-메모) |
| 내 컴퓨터(테스트 모드)에선 되는데 실제 사이트에서 저장 실패 | `firestore.rules` 를 콘솔에 게시했나 | [P-7](#p-7-저장이-거절될-때-원인-찾기) |
| CSV 를 올렸는데 모두 "빈 칸이 있습니다" | 미리보기 위 "열을 어떻게 읽었는지" 안내 | 제목 이름 인식 [O-1](#o-1-csv-제목-이름을-더-알아보게-하기), 제목 없는 순서 [O-2](#o-2-제목-없는-붙여넣기의-열-순서-바꾸기) |
| CSV 학년이 "학년을 알 수 없습니다" | 학년 칸 글자 | [O-3](#o-3-csv-학년-글자-인식-추가하기-예-고1), 이름표 [C-8](#c-8-mid3_22-에-이름표-붙이기) |
| CSV 한글이 깨짐 | 파일 인코딩 | 엑셀 "CSV UTF-8" 또는 일반 "CSV" 둘 다 읽음. 깨지면 엑셀에서 표를 복사해 붙여넣기 칸에 붙여넣기 |
| 인쇄하면 색이 안 나옴 | 인쇄 창 설정 | Chrome 인쇄 창 → 설정 더보기 → **배경 그래픽** 체크 |
| 인쇄 모양이 깨짐 · 여백이 이상함 | 인쇄 창의 배율 · 여백 | 배율 "기본값", 여백 "기본값". CSS 를 고쳤다면 `print.css` 확인 |
| 이미지 저장이 안 됨 | 콘솔 오류, 인터넷(html2canvas 는 인터넷에서 불러옴) | 새로고침 후 다시. `scale` 을 너무 크게 했으면 줄이기 ([K-4](#k-4-이미지-해상도-높이기)) |
| 이미지 복사가 안 됨 | 브라우저 · 주소 | Chrome/Edge 최신 버전, `https://` 또는 `localhost` 에서만 동작. 안 되면 "이미지 저장" 사용 |
| 배포 사이트에 "연결 정보가 비어 있습니다" | `js/firebase-config.js` | 테스트 모드로 비운 채 배포됨 → 값 되돌리고 다시 push |
| 관리자 페이지 "명단을 불러오지 못했습니다" | 안내 문구 내용 | 8-3 표 참고 → [다시 불러오기] |

### 8-3. 화면에 뜨는 안내 문구별 해결

| 안내 문구 (앞부분) | 원인 | 해결 |
| --- | --- | --- |
| 저장소 규칙이 요청을 막았습니다 | Firestore 규칙이 거절 (허용되지 않은 칸 · 학년 불일치 · 규칙 미게시 · App Check) | [P-7](#p-7-저장이-거절될-때-원인-찾기) |
| 대상을 찾을 수 없습니다 | 다른 사람이 이미 지운 학생을 수정 | 새로고침 |
| Firestore 데이터베이스가 없습니다 | 프로젝트에 Firestore 가 없음 | 콘솔에서 데이터베이스 만들기 (ID `(default)`) |
| Firestore 가 아직 준비되지 않았습니다 | Firestore API 가 꺼짐 | 콘솔에서 데이터베이스 만들기 |
| Firebase 설정값이 올바르지 않습니다 | apiKey 등이 틀림 | 콘솔에서 다시 복사 ([1-4](#1-4-연습용-테스트-모드-실제-데이터를-건드리지-않기) 참고) |
| Firebase API 키가 다른 사이트 주소에서만 쓰도록 제한 | Google Cloud 에서 API 키에 주소 제한 | 제한 목록에 사이트 주소 추가 |
| js/firebase-config.js 파일을 읽지 못했습니다 | 붙여넣기 실수로 문법 오류 | `const firebaseConfig = { … };` 모양 확인, `import` 줄 지우기 |
| Firebase 연결 정보(js/firebase-config.js)가 비어 있습니다 | 설정이 빈 채로 배포 | 값 채우고 다시 배포 |
| 인터넷 연결이 불안정해 Firebase 에 연결하지 못했습니다 | 인터넷 끊김 · 학교/학원 방화벽 | 자동 저장은 5초 뒤 다시 시도. 계속되면 `www.gstatic.com` · `firestore.googleapis.com` 접속이 막혔는지 확인 |
| Firebase 사용량 한도를 넘었습니다 | 무료 사용량 초과 | 잠시 뒤 · 다음 날 다시. 계속되면 콘솔 사용량 확인 |
| ○○을(를) 입력해 주세요 / ○○자 이하로 입력해 주세요 | 입력값 검사 (`db.js`) | 입력값 고치기, 제한을 바꾸려면 [5-8](#5-8-jsdbdbjs--저장소-고르기--입력값-검사-두-화면-공용) |

### 8-4. 콘솔에서 상태 들여다보기 (읽기만)

F12 → Console 에 입력하고 Enter. **값을 보기만 하는 명령**입니다.

| 입력 | 보여 주는 것 |
| --- | --- |
| `DB.mode` | 지금 저장소: `"firebase"` · `"test"` · `"unavailable"` |
| `currentTeacher` | 로그인한 선생님 이름 |
| `currentStudent` | 열린 학생 정보 |
| `currentExam` · `currentGrade` | 고른 시험 · 학년 코드 |
| `buildStateObj()` | 지금 화면을 저장하면 들어갈 내용 |
| `innerWidth` | 창 폭 (px) |
| `teacherStudents.length` | 왼쪽 목록 학생 수 |

> ⚠️ `await DB.deleteStudent(…)` 처럼 **바꾸는 명령**은 실제 데이터를 바꿉니다. 테스트 모드가 아니면 콘솔에서 실행하지 마세요.

---

## 9. 고친 뒤 확인 체크리스트

모든 항목을 매번 할 필요는 없고, **고친 부분과 관련된 줄**을 확인하세요. 처음에는 [테스트 모드](#1-4-연습용-테스트-모드-실제-데이터를-건드리지-않기)에서 확인하는 것을 추천합니다.

### 9-1. 공통

- [ ] F12 콘솔에 빨간 오류가 없다 (선생님 화면 · 관리자 화면 모두)
- [ ] 테스트 모드였다면 `js/firebase-config.js` 를 원래대로 되돌렸다

### 9-2. 관리자 화면 (`/admin`)

- [ ] 명단이 불러와진다 (선생님 칩 · 표)
- [ ] 한 명 추가 → 표에 나타난다
- [ ] CSV 붙여넣기 → 미리보기 → [N명 등록] → 표에 나타난다 (이미 있는 학생은 건너뜀)
- [ ] [수정] → 저장 → 바뀐 값 유지 (새로고침 후에도)
- [ ] [삭제] → 확인창 → 사라진다

### 9-3. 선생님 화면 (`/`)

- [ ] 선생님 이름으로 로그인 → 왼쪽에 반별 학생 목록
- [ ] (새 탭 · 시험 공란이면) 왼쪽 위 시험 선택 칸만 밝고 나머지 화면은 어두움 + 말풍선 → 시험을 고르면 사라짐
- [ ] 시험 선택 → 첫 학생(또는 마지막 학생) 체크리스트가 열림
- [ ] 단원 설정 켜기/끄기 → 표 보이기/숨기기, "표시 단원" 숫자
- [ ] A/B/C 클릭 → 줄 색 · 진행 현황 숫자
- [ ] 새 체크리스트는 대단원마다 진단평가 · SOLUTION 이 1개(오른쪽 두 칸이 세로로 합쳐짐) → "진단평가 자세히" 스위치를 켜면 줄마다, 끄면 다시 1개 (적은 내용 유지)
- [ ] 단원 설정에서 대단원의 **첫 번째 중단원**을 꺼도 합쳐진 평가 칸이 다음 줄로 옮겨 가 계속 보임
- [ ] [모두 자세히] · [모두 간단히] → 모든 대단원이 바뀌고 누른 버튼이 강조됨
- [ ] 메모 칸 입력 · SOLUTION 문구 버튼 · 종합 의견 입력
- [ ] "저장 중…" → "14:05 저장됨"
- [ ] **새로고침** → 같은 내용 유지, 왼쪽 목록 A/B/C 개수 유지
- [ ] 다른 학생 열기 → 그 학생 내용 (앞 학생 내용이 남지 않음)
- [ ] 시험 바꾸기 → 시험별로 따로 저장됨
- [ ] 🖨️ 인쇄 미리보기: 머리말 · 배지 · 메모 · SOLUTION · 의견 · 푸터 발급일 (스위치는 안 보이고, 간단히 대단원은 합쳐진 칸 1개)
- [ ] 📸 이미지 저장 · 📋 이미지 복사: 버튼 · 스위치 · 안내 글자("코멘트") 없이 깔끔하게, 합쳐진 칸의 메모 · SOLUTION 글자가 가려지지 않음
- [ ] 명단에 없는 이름으로 로그인 → 빈 체크리스트 (저장 안 됨 표시)
- [ ] 로그아웃 → 로그인 화면

### 9-4. 화면 폭

- [ ] 넓은 PC (1280px 이상): 단원 설정이 오른쪽, 리포트와 겹치지 않음
- [ ] 보통 (861~1279px): 단원 설정이 왼쪽 학생 목록 아래
- [ ] 모바일 (F12 → Ctrl+Shift+M, 폭 375): 한 줄 배치, 버튼 모음이 맨 아래, 표가 카드 모양 (간단히 대단원은 중단원 카드들 아래에 "대단원 진단평가 · SOLUTION" 카드 한 장)

### 9-5. 데이터 모양을 바꿨다면

- [ ] `js/db/db.js` 검사(`cleanStudent` / `cleanReportData`)에 새 칸 추가
- [ ] `firestore.rules` 의 `hasOnly([…])` 와 검사 줄 추가 → **콘솔에 게시**
- [ ] 실제 사이트(또는 실제 Firebase 연결 상태)에서 저장 → 새로고침 확인

---

## 10. 부록 — 색인

> 이 장의 표는 코드에서 **자동으로 뽑아** 만들었습니다. 이름으로 검색(Ctrl+Shift+F)하면 바로 찾을 수 있습니다.

### 10-1. 함수 색인 (파일 순서)


**📁 `js/config.js`**

| 함수 | 하는 일 |
| --- | --- |
| `gradeLabel(grade)` | 학년 코드 → 이름표.  예) gradeLabel("mid2") → "중2" |
| `hasGradeData(grade)` | 그 학년의 단원 데이터가 js/data/curriculum.js 에 있는지.  예) hasGradeData("mid2") → true |
| `unitColor(idx)` | 몇 번째 대단원(idx, 0부터 시작)인지 넣으면 그 색을 돌려준다. |

**📁 `js/utils.js`**

| 함수 | 하는 일 |
| --- | --- |
| `getTextFromElement(el)` | 요소(el) 안의 글자만 뽑아 공백을 한 칸으로 정리해 돌려준다. el 이 없으면 "". |
| `escapeHtml(text)` | 글자를 HTML 안에 안전하게 넣을 수 있게 특수문자를 바꾼다. |
| `sanitizeHtml(html)` | 불러온 HTML 에서 위험한 태그 · 속성을 지우고 글자 꾸밈만 남긴다 |
| `cleanHtmlNode(parent)` | sanitizeHtml 의 실제 정리 작업 (안쪽 요소부터 차례로) |
| `htmlHasText(html)` | HTML 안에 실제 글자가 있는지.  예) "<br>" → false,  "<b>-</b>" → true |
| `splitStudentName(name)` | 명단 이름 뒤에 붙은 구분용 영문자(동명이인 구분 등)를 떼어 나눈다. |
| `makeSafeStorage(getStorage)` | 브라우저에 작은 값을 기억하는 도우미. |

**📁 `js/db/firebase-db.js`**

| 함수 | 하는 일 |
| --- | --- |
| `createFirebaseDB(config)` | Firebase(Firestore) 저장소 만들기 — connect · 명단 · 체크리스트 함수들 |
| `friendlyFirebaseError(error)` | Firebase 오류 → 알아보기 쉬운 한국어 문구 (retryable 표시) |

**📁 `js/db/test-db.js`**

| 함수 | 하는 일 |
| --- | --- |
| `createTestDB()` | 테스트 모드 저장소 만들기 — Firebase 저장소와 같은 함수 이름 |

**📁 `js/db/db.js`**

| 함수 | 하는 일 |
| --- | --- |
| `reportId(student, exam)` | 학생 한 명 · 시험 하나의 체크리스트 문서 id.  예) "a1B2c3…__mid2__1학기 기말고사" |
| `orderOf(student)` | 등록 순서 값. order 가 없는 학생(콘솔에서 직접 넣은 학생 등)은 등록 시각으로 대신한다. |
| `sortStudents(list)` | 선생님(가나다순) → 등록 순서(CSV 줄 순서) → 이름 순으로 정렬 |
| `reportDocument(student, exam, data, updatedAt)` | 저장할 체크리스트 문서. 누구의 어떤 체크리스트인지도 함께 적어 둔다 (Firestore 콘솔에서 알아보기 쉽게). |
| `dbError(message, { code = "error", retryable = false, cause } = {})` | 화면에 그대로 보여 줄 문구가 담긴 오류 만들기 |
| `inputError(message)` | 입력값 오류 만들기 (code: "invalid-input") |
| `cleanText(value, label, { max = 40, required = true, noSlash = false } = {})` | 글자 입력값 정리: 앞뒤 공백 제거 + 비었는지 · 너무 긴지 검사 |
| `cleanStudent(input)` | 명단 한 줄 검사 → 저장할 칸만 돌려준다. |
| `cleanExam(value)` | 시험 종류 (예: "1학기 기말고사") — 체크리스트 문서 id 에 들어가므로 / 금지 |
| `cleanReportData(data)` | 체크리스트 내용 (js/storage.js 의 buildStateObj 가 만든 것)에서 필요한 칸만 골라 검사한다. |
| `entriesOf(obj)` | 객체를 [이름, 값] 목록으로 (항목이 너무 많으면 오류) |
| `limitText(value)` | 글자로 바꾸고 너무 길면 오류 |
| `safeKey(key)` | 항목 이름은 "m1-3-1_content" 같은 영문 · 숫자 · - · _ 만 허용 |
| `hasFirebaseConfig()` | js/firebase-config.js 에 프로젝트 정보가 들어 있는지 |
| `isLocalComputer()` | 내 컴퓨터에서 연 페이지인지 (테스트 모드는 여기서만 허용 → 배포 사이트가 실수로 테스트 모드가 되지 않게) |
| `createUnavailableDB(message)` | 쓸 수 없는 저장소: 어떤 함수를 불러도 같은 안내 오류 |
| `pickStore()` | 설정 · 주소를 보고 Firebase / 테스트 / 사용 불가 저장소 중 하나 고르기 |
| `showTestModeBanner()` | 테스트 모드일 때 화면 맨 위에 작은 안내 띠를 띄운다 (js/main.js · admin/admin.js 에서 호출) |

**📁 `js/notify.js`**

| 함수 | 하는 일 |
| --- | --- |
| `clockHM(ts)` | 시각(ts, 밀리초)을 "14:05" 형태로 바꾼다. ts 가 없으면 지금 시각. |
| `setSaveState(kind, ts)` | 오른쪽 위 자동 저장 상태 문구 · 색 바꾸기 |
| `showToast(msg)` | 화면 아래 알림(토스트)을 2.2초 보여 줌 |

**📁 `js/storage.js`**

| 함수 | 하는 일 |
| --- | --- |
| `buildStateObj()` | 지금 화면의 체크리스트 내용을 저장용 객체로 만든다 |
| `applyStateObj(state)` | 저장된 내용을 지금 그려진 표에 채워 넣는다 |
| `resolveDetailUnits(state, grade)` | 저장본(state)에서 대단원마다 "진단평가 자세히"를 켤지 정한다 → { "m2-1": false, "m2-2": true, … } |
| `fetchReport(student, exam)` | 학생 한 명 · 시험 하나의 체크리스트를 받아 온다 → 내용 (한 번도 저장된 적 없으면 null) |
| `markAsSaved(updatedAt)` | 방금 불러온 화면 내용을 "저장소와 같은 상태"로 기억한다 (이후 바뀐 내용만 저장하려고). |
| `markAsUnsaved()` | 지금 화면 내용이 저장소에 아직 없다고 표시한다 (예전 브라우저 저장본을 가져왔을 때 바로 저장하려고). |
| `saveCurrentState()` | 입력칸·버튼 등에서 부르는 저장 함수 (index.html 의 oninput 등). 실제로는 저장을 "예약"만 한다. |
| `scheduleSave(delay = SAVE_DELAY_MS)` | SAVE_DELAY_MS 뒤에 저장하도록 예약한다. |
| `flushSave()` | 예약을 기다리지 않고 바로 저장한다. 학생·시험을 바꾸거나 로그아웃하기 전에 부른다. |
| `persistCurrentReport()` | 저장을 줄 세워 실행한다 (앞의 저장이 끝난 뒤에 다음 저장). |
| `async saveNow()` | 실제 저장: 저장소와 다른 내용이 있으면 DB.saveReport |

**📁 `js/legacy-import.js`**

| 함수 | 하는 일 |
| --- | --- |
| `async findLegacyReport(student, exam)` | 명단의 학생 · 시험에 맞는 예전 저장본을 찾는다. 없거나 읽을 수 없으면 null. |
| `readRecord(db, key)` | 예전 DB 에서 키 하나로 저장본을 읽는다 (없으면 null) |

**📁 `js/scope-panel.js`**

| 함수 | 하는 일 |
| --- | --- |
| `renderScopeWidget()` | 현재 학년의 단원 설정 체크박스 목록을 새로 그림 (모두 꺼짐) |
| `toggleBigBlock(key, checkbox)` | 대단원 체크: 그 대단원 블록과 중단원 줄 전부 보이기/숨기기 |
| `toggleSubRow(checkbox)` | 중단원 체크: 그 줄만 보이기/숨기기 (대단원 체크 자동 계산) |
| `setAllScopes(status)` | 전체 단원 켜기(true) / 끄기(false) |
| `restoreScopeSelections(scopeSelections)` | 저장된 중단원 체크 상태를 체크박스 · 표에 반영 |

**📁 `js/report-header.js`**

| 함수 | 하는 일 |
| --- | --- |
| `fillReportHeader()` | 머리말(이름 · 학교 · 시험)과 탭 제목 채우기 |
| `onHeaderInput()` | 빈 체크리스트에서 이름·학교명을 입력할 때 (index.html 의 oninput): 탭 제목만 바꿈 |
| `updateTitle()` | 탭 제목 = PDF · 이미지 파일 이름 만들기 |

**📁 `js/checklist-table.js`**

| 함수 | 하는 일 |
| --- | --- |
| `renderReportTables()` | 현재 학년의 표 전체를 새로 그림 (curriculum.js 사용) |
| `gradeCellHtml(key, kind, label)` | 진단평가 칸 <td> 하나: [A/B/C 버튼] [인쇄·이미지용 배지] [메모 칸] |
| `solutionCellHtml(key, kind, label)` | SOLUTION 칸 <td> 하나 (기본값 "-"). key · kind · label 은 gradeCellHtml 과 같음 |
| `unitKeyOf(unit, idx, grade = currentGrade)` | 대단원의 id (저장할 때 쓰는 열쇠).  예) unitKeyOf({ id: "m2-1", … }, 0) → "m2-1" |
| `setUnitDetail(unitKey, on, { save = true } = {})` | 대단원 하나(unitKey)를 자세히(on = true) / 간단히(false)로 바꾼다. |
| `setAllDetail(on)` | [모두 자세히](true) / [모두 간단히](false) 버튼 |
| `layoutUnitEval(block)` | 대단원 평가 칸(간단히용 두 칸)을 알맞은 자리로 옮긴다. |
| `layoutAllUnitEval()` | 표 전체의 대단원 평가 칸 자리를 다시 맞춘다. |
| `updateDetailControls()` | 단원 설정 패널의 [모두 자세히] [모두 간단히] 버튼 중 지금 상태에 맞는 버튼을 강조한다 (updateStatus 에서 호출) |
| `applyGradeState(key, grade)` | 한 줄을 A/B/C 로 표시 (줄 배경 · 버튼 색 · 인쇄 배지) |
| `selectGradeBtn(btn, grade, key)` | A/B/C 버튼 클릭 → 표시 · 저장 예약 · 진행 현황 |
| `getActiveGrade(key)` | 평가 항목(key)에서 선택된 평가를 읽는다: "A" \| "B" \| "C" \| 아직 안 골랐으면 "-" |
| `onGradeNoteKeydown(event)` | Enter 를 누르면 줄을 바꾸지 않고 입력을 마친다 (한글 조합 중에 누른 Enter 는 조합부터 끝내게 둠) |
| `onGradeNoteBeforeInput(event)` | 어떤 방법으로든 줄바꿈이 들어가려 하면 막는다 (한글 조합 중 Enter 등 keydown 으로 못 막는 경우) |
| `onGradeNotePaste(event)` | 붙여넣기는 서식 없이 글자만 (줄바꿈은 띄어쓰기로) |
| `onGradeNoteInput(el, event)` | 입력할 때마다: 너무 길면 자르고, 다 지웠으면 칸을 완전히 비운 뒤(안내 글자가 다시 보이게) 자동 저장 |
| `readGradeNote(el)` | 메모 칸의 글자 (저장용: 공백 정리) |
| `placeCaretAtEnd(el)` | 입력 칸(el)의 커서를 글자 맨 끝으로 옮긴다 |
| `getEvalItems()` | 지금 화면에서 평가해야 하는 항목들 (단원 설정에서 숨긴 단원·줄은 빠짐) |
| `updateStatus()` | 진행 현황(평가 N/M · A/B/C 개수) · 표시 단원 수 · 단원 안내 문구 |
| `onSolutionFocus(cell, event)` | SOLUTION 칸에 들어갔을 때: 팝오버를 띄우고, 공란("-")이면 글자를 전체 선택 |
| `selectBlankSolution(cell)` | 칸이 공란("-")이면 글자 전체를 선택한다 (브라우저가 커서를 놓은 "뒤에" 하도록 한 박자 늦춤) |
| `onSolutionBlur(cell)` | SOLUTION 칸에서 나갈 때: 글자를 다 지웠으면 다시 공란("-")으로 채우고 저장 |
| `showMacroPopover(cell, event)` | SOLUTION 칸(cell) 바로 아래에 팝오버를 띄운다. |
| `hideMacroPopover()` | 팝오버를 닫는다. |
| `setBlankSolution()` | "➖ 공란 (해당 없음)" 버튼: SOLUTION 을 기본값 "-" 로 되돌린다. |
| `injectMacro(text, isDangerColor)` | 문구 버튼 (index.html 의 injectMacro('문구', false)) |

**📁 `js/student-list.js`**

| 함수 | 하는 일 |
| --- | --- |
| `async fetchTeacherStudents(teacher)` | 저장소에서 선생님의 담당 학생 목록(+ 선택한 시험의 A/B/C 개수)을 받아 온다. |
| `summarize(report, grade)` | 체크리스트에서 A/B/C 개수만 뽑는다 → { A: 3, B: 1, C: 0, updatedAt } (체크리스트가 없으면 null) |
| `countGrades(state, grade)` | 저장된 체크리스트(state)의 A/B/C 개수 → { A, B, C } |
| `setTeacherStudents(list)` | 목록을 바꾸고 다시 그린다. |
| `renderStudentList()` | 왼쪽 학생 목록을 반별로 그림 (열린 학생 강조) |
| `groupByClass(students)` | 반(className)별로 묶는다. 명단 순서를 지키고, 반은 처음 나온 순서대로 놓는다. |
| `studentItem(student)` | 목록의 학생 한 줄 (버튼) |
| `progressHtml(summary)` | 목록 오른쪽의 평가 개수 표시.  예) "A3 B1 C0" / 아직 평가 안 했으면 "평가 전" |
| `updateStudentSummary(studentId, exam, data, updatedAt)` | 저장에 성공하면 목록의 A/B/C 개수도 바로 바꾼다 (storage.js 의 saveNow 에서 호출) |
| `initExamSelect()` | 시험 선택 준비 + 머리말 시험 칸에 같은 목록 복사 + 빈 체크리스트 학년 목록 |
| `updateExamHint()` | 시험을 아직 고르지 않았으면(공란) 왼쪽 시험 칸을 눈에 띄게 표시한다. |
| `updateExamSpotlight()` | 지금 상태를 보고 안내를 보이거나 숨긴다. |
| `examPickerElement()` | 밝게 남길 영역 = 왼쪽 위 "시험 [선택 칸]" 한 줄 |
| `followExamSpotlight()` | 안내가 떠 있는 동안 화면이 바뀔 때마다 시험 선택 칸의 위치를 따라가 밝은 네모와 말풍선을 옮긴다. |
| `async onExamSelectChange()` | 시험 선택을 바꿨을 때 |
| `async confirmLeave()` | 학생·시험을 바꾸거나 로그아웃하기 전에 지금 체크리스트를 저장한다. |
| `async openInitialStudent()` | 로그인 직후 · 시험을 고른 직후: 마지막으로 열었던(또는 눌렀던) 학생, 없으면 첫 번째 학생의 체크리스트를 연다. |
| `async openChecklist(studentId, { skipLeaveCheck = false } = {})` | 학생의 체크리스트 열기 (저장 → 불러오기 → 표 그리기 → 채우기) |
| `beginLoading(message)` | 체크리스트를 불러오는 동안: 저장을 멈추고 표 자리에 안내 문구를 보여 준다. |
| `showReportMessage(message, { retry = false } = {})` | 표 자리에 안내 문구를 보여 준다 (학생 선택 전 · 불러오는 중 · 오류). |
| `retryOpenChecklist()` | "다시 시도" 버튼 |
| `closeChecklist(message)` | 열린 체크리스트를 닫고 안내 문구를 보여 준다 (페이지를 처음 열 때 · 로그아웃할 때). |
| `openBlankChecklist(grade, { keepHeader = false } = {})` | 빈 체크리스트를 연다. |
| `setBlankMode(on)` | 빈 체크리스트 모드 켜기/끄기 (왼쪽 학년 선택을 보이거나 숨김) |
| `hasBlankEdits({ includeHeader = false } = {})` | 빈 체크리스트에 뭔가 작성했는지. includeHeader 면 머리말의 이름·학교 입력도 포함 |
| `onBlankGradeChange()` | 빈 체크리스트의 학년을 바꿨을 때 (index.html 의 onchange): 표를 그 학년으로 새로 그림 |

**📁 `js/login.js`**

| 함수 | 하는 일 |
| --- | --- |
| `async initLogin()` | 페이지를 열 때 (main.js): 기억된 이름이 있으면 자동 로그인, 없으면 로그인 화면만 보여 줌 |
| `submitLogin(event)` | 로그인 폼 제출 |
| `async loginAs(name)` | 이름으로 로그인 → 학생 목록 → 체크리스트 (명단에 없으면 빈 체크리스트) |
| `async logout()` | 로그아웃 버튼 (index.html): 지금 체크리스트를 저장한 뒤 로그인 화면으로 |
| `showLoginScreen()` | 로그인 화면 보이기 + 이름 칸에 커서 |
| `hideLoginScreen()` | 로그인 화면 숨기기 |
| `setLoginMessage(message)` | 로그인 카드 아래 안내·오류 문구 (줄바꿈 \n 가능) |
| `setLoginBusy(busy)` | 명단을 확인하는 동안 버튼을 잠근다 |

**📁 `js/export.js`**

| 함수 | 하는 일 |
| --- | --- |
| `getUngradedItems()` | 보이는 평가 항목 중 A/B/C 를 아직 고르지 않은 항목들 |
| `getEmptySolutionItems()` | 보이는 평가 항목 중 SOLUTION 이 비어 있는 항목들 |
| `itemLabel(item)` | 항목의 이름표 (중단원 이름, 간단히 대단원은 대단원 제목). 경고창에 목록으로 보여 줄 때 사용 |
| `ensureReadyForOutput(actionLabel)` | 인쇄 · 이미지 전 필수 입력 검사 (통과하면 true) |
| `printReport()` | 검사 → 이름·학교 확인창 → 브라우저 인쇄 창 열기 |
| `setPrintDate()` | 인쇄물 맨 아래 푸터의 "발급일 2026. 06. 27" 을 오늘 날짜로 채운다 (페이지를 열 때 main.js 에서 호출) |
| `swapMetaFieldsForCapture()` | 이미지로 찍는 동안 머리말 입력칸을 글자(span)로 바꿈 |
| `captureReportCanvas()` | 리포트 용지를 이미지(canvas)로 찍는다 (이미지 저장·복사 공용) |
| `saveAsImageFile()` | 📸 이미지 저장: 검사 → 캡처 → PNG 파일 다운로드 (파일 이름 = 탭 제목) |
| `copyImageToClipboard()` | 📋 이미지 복사: 검사 → 캡처 → 클립보드에 PNG 복사 (시트·메신저에 Ctrl+V) |
| `ensureAllRowsGraded(actionLabel)` | ⚠️ 지금은 쓰지 않는 예전 검사 함수 (지워도 됨) |

**📁 `admin/admin.js`**

| 함수 | 하는 일 |
| --- | --- |
| `async loadRoster()` | 저장소에서 전체 명단을 새로 불러와 화면을 다시 그린다. |
| `ensureRosterReady()` | 명단을 아직 못 불러왔으면 안내하고 false (중복 확인을 못 하므로 추가를 막음) |
| `handleError(error, prefix)` | 저장 실패 알림 + (입력값 문제가 아니면) 명단 다시 불러오기 |
| `gradeOptionsHtml(selected)` | 학년 선택 목록 HTML (js/data/curriculum.js 에 있는 학년 전부) |
| `parseGrade(text)` | "2학년" · "중2" · "2" · "mid2" 같은 글자를 학년 코드로 (모르면 null) |
| `async submitAddStudent(event)` | 추가 폼 제출 |
| `inputValue(id)` | 입력칸 값 (앞뒤 공백 제거) |
| `isDuplicate(student, exceptId)` | 선생님·이름·학교·학년이 모두 같은 학생이 이미 있는지 (exceptId 는 비교에서 뺄 학생) |
| `onBulkFileSelected(input)` | 파일 선택 |
| `async loadBulkFile(file)` | 파일을 읽어 붙여넣기 칸에 넣고 미리보기를 만든다 |
| `decodeText(buffer)` | 파일 내용(바이트)을 글자로 바꾼다. UTF-8 로 읽어 보고, 깨지면 EUC-KR(엑셀 한글 기본)로 읽는다. |
| `parseTable(text)` | CSV · 탭 글을 표(줄 × 칸)로 나눔 (따옴표 안 쉼표 · 줄바꿈 처리) |
| `detectColumns(firstRow)` | 첫 줄이 제목 줄이면 { 항목: 열 번호 } 를, 아니면 null 을 돌려준다. |
| `previewBulk()` | 붙여넣은 글(또는 불러온 파일)을 읽어 미리보기를 만든다 (입력할 때마다 실행) |
| `renderBulkPreview()` | 미리보기 표와 등록 버튼 글자를 그린다 |
| `async submitBulk()` | "N명 등록" 버튼: 오류 없는 줄만 파일 순서대로 등록 |
| `renderAll()` | 선생님 칩 · 자동완성 · 명단 표를 다시 그림 |
| `teacherCounts()` | 선생님별 학생 수 [["김선생", 5], …] (가나다순) |
| `renderTeacherControls()` | 선생님·반 이름 자동완성 · 선생님 거르기 선택 · 선생님 칩을 다시 그린다 |
| `renderRoster()` | 거르기·검색 조건에 맞는 학생을 표로 그린다 (선생님 → 등록 순서, 수정 중인 줄은 입력칸으로) |
| `rowHtml(s)` | 보기용 한 줄 |
| `editRowHtml(s)` | 수정용 한 줄 (Enter = 저장, Esc = 취소) |
| `async saveEdit(id)` | 수정한 줄 저장 |
| `async deleteStudent(id)` | 학생 삭제 (체크리스트 기록도 함께 삭제) |
| `notify(message, isError = false)` | 화면 아래에 잠깐 알림을 띄운다 (isError 면 빨간색으로 조금 더 오래) |
| `initAdmin()` | 관리자 페이지 시작: 이벤트 연결 + 명단 불러오기 |

### 10-2. 설정값(상수) 색인

| 이름 | 📁 파일 | 값 | 설명 |
| --- | --- | --- | --- |
| `CURRICULUM_DATA` | `js/data/curriculum.js` | `{ … }` | 학년별 대단원 · 중단원 · 주요 내용 데이터 (표와 단원 설정의 원본) |
| `GRADE_LABELS` | `js/config.js` | `{ … }` | 학년 코드 → 화면 이름표 (mid1 → 중1) |
| `UNIT_COLORS` | `js/config.js` | `[ … ]` | 대단원 순서별 색 목록 |
| `GRADE_META` | `js/config.js` | `{ … }` | A/B/C 별 버튼 class · 줄 배경 class · 인쇄 배지 스타일 |
| `SAVE_DELAY_MS` | `js/config.js` | `1200` | 마지막 입력 후 자동 저장까지 기다리는 시간 (밀리초) |
| `SAFE_HTML_TAGS` | `js/utils.js` | `(계산된 값)` | 불러온 HTML 에서 남겨 둘 태그 목록 |
| `DROP_HTML_TAGS` | `js/utils.js` | `(계산된 값)` | 불러온 HTML 에서 안의 내용까지 통째로 지울 태그 목록 |
| `safeStorage` | `js/utils.js` | `(계산된 값)` | 브라우저를 닫아도 남는 값 (localStorage) — 로그인한 이름, 마지막 학생 등 |
| `safeSession` | `js/utils.js` | `(계산된 값)` | 이 탭에서만 남는 값 (sessionStorage) — 새로고침하면 유지, 탭을 닫으면 사라짐 (예: 고른 시험) |
| `firebaseConfig` | `js/firebase-config.js` | `{ apiKey, projectId, … }` | Firebase 연결 정보 (콘솔에서 복사) |
| `FIREBASE_SDK_URL` | `js/db/firebase-db.js` | `"https://www.gstatic.com/firebasejs/12.19.0"` | Firebase 프로그램 주소 (버전을 올릴 때는 숫자만 바꾸기) |
| `STUDENTS_COLLECTION` | `js/db/firebase-db.js` | `"checklist-students"` | 학생 명단 컬렉션 이름 (firestore.rules 경로와 같아야 함) |
| `REPORTS_COLLECTION` | `js/db/firebase-db.js` | `"checklist-report"` | 체크리스트 컬렉션 이름 (firestore.rules 경로와 같아야 함) |
| `FIRESTORE_BATCH_LIMIT` | `js/db/firebase-db.js` | `400` | 한 번에 묶어서 쓰는(추가·삭제) 문서 수 (Firestore 최대 500) |
| `FIRESTORE_IN_LIMIT` | `js/db/firebase-db.js` | `30` | "id 가 이 목록 중 하나" 조건에 한 번에 넣을 수 있는 최대 개수 |
| `TEST_DB_KEY` | `js/db/test-db.js` | `"nature_test_db"` | localStorage 에 저장하는 이름 |
| `TEST_DB_DELAY_MS` | `js/db/test-db.js` | `120` | 진짜 서버처럼 아주 잠깐 기다림 ("불러오는 중" 화면도 확인할 수 있게) |
| `PERMISSION_DENIED_MESSAGE` | `js/db/db.js` | (긴 값) | 규칙 거절 오류 안내 문구 |
| `NOT_FOUND_MESSAGE` | `js/db/db.js` | `"대상을 찾을 수 없습니다. 이미 삭제되었을 수 있으니 새로고침해 주세요."` | 대상 없음 오류 안내 문구 |
| `MAX_ADD_STUDENTS` | `js/db/db.js` | `500` | 한 번에 추가할 수 있는 최대 인원 |
| `REPORT_TEXT_MAX` | `js/db/db.js` | `20000` | 체크리스트 칸 하나(HTML 포함)의 최대 글자 수 |
| `REPORT_KEYS_MAX` | `js/db/db.js` | `500` | 항목(중단원) 최대 개수 |
| `GRADE_NOTE_TEXT_MAX` | `js/db/db.js` | `100` | 진단평가 메모 최대 글자 수 (화면에서는 더 짧게 막음) |
| `DB` | `js/db/db.js` | `(계산된 값)` | 화면 코드가 쓰는 저장소. 입력값을 검사한 뒤 고른 저장소에 전달한다. |
| `RETRY_DELAY_MS` | `js/storage.js` | `5000` | 저장 실패 후 다시 시도할 때까지 기다리는 시간 |
| `LEGACY_DB_NAME` | `js/legacy-import.js` | `"nature_checklist_db"` | 예전 버전이 쓰던 IndexedDB 이름 |
| `LEGACY_STORE` | `js/legacy-import.js` | `"reports"` | 예전 IndexedDB 안의 저장소 이름 |
| `BLANK_SOLUTION` | `js/checklist-table.js` | `"-"` | SOLUTION 칸 기본값 (공란) |
| `GRADE_NOTE_MAX` | `js/checklist-table.js` | `30` | 진단평가 메모 칸 최대 글자 수 (화면 기준) |
| `DETAIL_DEFAULT` | `js/checklist-table.js` | `false` | 새 체크리스트의 진단평가 방식: false = 대단원별 1개(간단히), true = 중단원별(자세히) |
| `CARD_LAYOUT_QUERY` | `js/checklist-table.js` | `(계산된 값)` | 폭 860px 이하 화면(모바일 카드 모양)인지. 인쇄는 "print" 라서 여기에 해당하지 않음 (항상 표 모양) |
| `EXAM_KEY` | `js/student-list.js` | `"nature_exam"` | 이 탭에서만 기억하는 "고른 시험" (새로고침하면 유지, 새로 접속하면 공란) |
| `LAST_STUDENT_KEY` | `js/student-list.js` | `"nature_last_student"` | 이 브라우저에 기억하는 "마지막으로 연 학생 id" |
| `BLANK_GRADE_KEY` | `js/student-list.js` | `"nature_blank_grade"` | 이 브라우저에 기억하는 "빈 체크리스트에서 마지막으로 고른 학년" |
| `TEACHER_KEY` | `js/login.js` | `"nature_teacher"` | 이 브라우저에 기억하는 "로그인한 선생님 이름" |
| `HEADER_NAMES` | `admin/admin.js` | `{ … }` | CSV 제목 칸 글자 → 명단 항목 (띄어쓰기를 뺀 글자로 비교) |
| `FIELD_LABELS` | `admin/admin.js` | `{ … }` | CSV 미리보기 안내에 쓰는 항목 이름 |
| `DEFAULT_COLUMNS` | `admin/admin.js` | `{ … }` | CSV 에 제목 줄이 없을 때 읽는 열 순서 (0부터) |

### 10-3. HTML id 색인

**선생님 화면** (`index.html`)

| id | 태그 | 쓰는 파일 |
| --- | --- | --- |
| `login-screen` | `<div>` | `js/student-list.js`, `js/login.js`, `css/login.css` |
| `login-name` | `<input>` | `js/login.js` |
| `login-submit` | `<button>` | `js/login.js` |
| `login-message` | `<p>` | `js/login.js` |
| `teacher-name` | `<span>` | `js/login.js` |
| `exam-select` | `<select>` | `js/student-list.js` |
| `blank-grade-picker` | `<label>` | `js/student-list.js` |
| `blank-grade-select` | `<select>` | `js/student-list.js` |
| `student-count` | `<span>` | `js/student-list.js` |
| `student-list` | `<div>` | `js/student-list.js` |
| `scope-status` | `<span>` | `js/checklist-table.js` |
| `detail-all-on` | `<button>` | `js/checklist-table.js` |
| `detail-all-off` | `<button>` | `js/checklist-table.js` |
| `scope-widget-root` | `<div>` | `js/scope-panel.js`, `js/student-list.js` |
| `capture-target-paper` | `<div>` | `js/export.js` |
| `student-name` | `<input>` | `js/report-header.js`, `js/student-list.js`, `js/export.js` |
| `school-name` | `<input>` | `js/report-header.js`, `js/student-list.js`, `js/export.js` |
| `exam-type` | `<select>` | `js/report-header.js`, `js/student-list.js`, `js/export.js` |
| `report-table-root` | `<div>` | `js/checklist-table.js`, `js/student-list.js` |
| `opinion-textarea` | `<div>` | `js/storage.js`, `js/student-list.js`, `js/main.js` |
| `print-date` | `<span>` | `js/export.js` |
| `report-status` | `<div>` | `js/checklist-table.js`, `js/export.js` |
| `save-state` | `<div>` | `js/notify.js` |
| `app-toast` | `<div>` | `js/notify.js` |
| `exam-spotlight` | `<div>` | `js/student-list.js` |
| `exam-spotlight-tip` | `<div>` | `js/student-list.js` |
| `solution-macro-popover` | `<div>` | `js/checklist-table.js`, `css/checklist-table.css` |

**관리자 화면** (`admin/index.html`)

| id | 태그 | 쓰는 파일 |
| --- | --- | --- |
| `admin-app` | `<div>` | – |
| `add-teacher` | `<input>` | `admin/admin.js` |
| `add-name` | `<input>` | `admin/admin.js` |
| `add-school` | `<input>` | `admin/admin.js` |
| `add-grade` | `<select>` | `admin/admin.js` |
| `add-class` | `<input>` | `admin/admin.js` |
| `add-submit` | `<button>` | `admin/admin.js` |
| `teacher-options` | `<datalist>` | `admin/admin.js` |
| `class-options` | `<datalist>` | `admin/admin.js` |
| `bulk-section` | `<details>` | `admin/admin.js` |
| `bulk-file` | `<input>` | – |
| `bulk-file-name` | `<span>` | `admin/admin.js` |
| `bulk-text` | `<textarea>` | `admin/admin.js` |
| `bulk-preview` | `<div>` | `admin/admin.js` |
| `bulk-submit` | `<button>` | `admin/admin.js` |
| `roster-count` | `<span>` | `admin/admin.js` |
| `filter-teacher` | `<select>` | `admin/admin.js` |
| `filter-text` | `<input>` | `admin/admin.js` |
| `teacher-chips` | `<div>` | `admin/admin.js` |
| `roster-body` | `<tbody>` | `admin/admin.js` |
| `admin-toast` | `<div>` | `admin/admin.js` |

**JS 가 만드는 id** (표를 그릴 때 생김)

| id 모양 | 무엇 | 만드는 함수 |
| --- | --- | --- |
| `중단원id-row` · `-content` · `-badge` · `-note` · `-solution` | 표 한 줄과 칸들 | `renderReportTables` (`js/checklist-table.js`) |
| `학년-unit-idx-번호` (예: `mid2-unit-idx-0`) | 대단원 블록 | `renderReportTables` |
| `scope-empty-hint` | "단원 설정에서 … 체크하면" 안내 | `renderReportTables` |
| `test-mode-banner` | 테스트 모드 안내 띠 | `showTestModeBanner` (`js/db/db.js`) |
