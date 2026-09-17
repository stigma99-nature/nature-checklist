/* ==========================================================================
   dev-server.js — 🧪 내 컴퓨터에서 실행해 보는 개발용 서버
   --------------------------------------------------------------------------
     실행:  node dev-server.js
     주소:  http://localhost:5600          (관리자 페이지: http://localhost:5600/admin)

   · 프로젝트 폴더의 파일(index.html · css · js …)을 그대로 보여 주기만 하는 간단한 서버입니다.
     (서버 코드는 없습니다. 명단 · 체크리스트는 브라우저가 Firebase 에 직접 저장합니다)
   · js/firebase-config.js 가 비어 있으면 "테스트 모드" → 이 브라우저 안에만 저장됩니다.
     채워져 있으면 실제 Firebase 에 연결됩니다. (localhost 는 Firebase 가 기본으로 허용)
   · index.html 을 더블클릭해서 열면(file://) 관리자 페이지 등이 제대로 열리지 않으니 이 서버를 쓰세요.

   ※ 실제 배포(Vercel)에서는 이 파일을 쓰지 않습니다. 설치할 패키지도 없습니다.
   ========================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5600;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// 브라우저에 보여 주지 않을 파일·폴더 (비밀 값 · git 기록 등)
const BLOCKED = /^\/(\.env|\.git|\.claude|node_modules)(\/|$)/;

http
  .createServer((req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      serveFile(url.pathname, res);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }
  })
  .listen(PORT, () => {
    console.log(`▶ 체크리스트   http://localhost:${PORT}`);
    console.log(`▶ 관리자 페이지 http://localhost:${PORT}/admin`);
  });

// 파일 보내기. 폴더 주소(/admin 등)는 그 안의 index.html 을 보낸다.
function serveFile(pathname, res) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (e) {
    return notFound(res);
  }
  if (BLOCKED.test(decoded)) return notFound(res);
  let file = path.join(ROOT, decoded);
  const relative = path.relative(ROOT, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return notFound(res); // 프로젝트 폴더 밖
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) return notFound(res);
  res.writeHead(200, {
    "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(file).pipe(res);
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("404 Not Found");
}
