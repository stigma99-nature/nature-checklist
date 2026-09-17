/* ==========================================================================
   js/notify.js — 🔔 사용자에게 상태를 알려 주는 작은 표시들
   --------------------------------------------------------------------------
   · 자동 저장 상태 : 오른쪽 위 버튼 모음 맨 아래 "● 14:05 저장됨" (#save-state)
   · 토스트 알림    : 화면 아래 가운데에 잠깐 떴다 사라지는 알림 (#app-toast)
   스타일: css/action-dock.css
   ========================================================================== */

// 시각(ts, 밀리초)을 "14:05" 형태로 바꾼다. ts 가 없으면 지금 시각.
function clockHM(ts) {
  const d = new Date(ts || Date.now());
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

// 자동 저장 상태 표시를 바꾼다.
// kind: 'idle'(대기) | 'loading'(불러오는 중) | 'saving'(저장 중)
//       | 'saved'(저장됨, ts = 저장 시각) | 'error'(실패) | 'blank'(빈 체크리스트: 저장 안 함)
function setSaveState(kind, ts) {
  const el = document.getElementById("save-state");
  if (!el) return;
  el.classList.remove("is-idle", "is-saving", "is-saved", "is-error", "is-blank");
  if (kind === "blank") {
    el.classList.add("is-blank");
    el.textContent = "명단에 없는 이름 · 저장되지 않아요";
  } else if (kind === "loading") {
    el.classList.add("is-saving");
    el.textContent = "불러오는 중…";
  } else if (kind === "saving") {
    el.classList.add("is-saving");
    el.textContent = "저장 중…";
  } else if (kind === "saved") {
    el.classList.add("is-saved");
    el.textContent = `${clockHM(ts)} 저장됨`;
  } else if (kind === "error") {
    el.classList.add("is-error");
    el.textContent = "저장 실패 — 다시 시도해 주세요";
  } else {
    el.classList.add("is-idle");
    el.textContent = "입력하면 자동 저장됩니다";
  }
}

// 토스트 알림을 2.2초 동안 보여 준다. 연달아 부르면 마지막 호출부터 다시 2.2초.
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("app-toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}
