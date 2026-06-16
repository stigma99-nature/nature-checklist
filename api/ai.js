// Vercel 서버리스 함수 — OpenAI 호출 프록시
// 브라우저에 API 키를 노출하지 않기 위해, 키는 서버 환경변수에서만 사용한다.
//
// Vercel 프로젝트 Settings → Environment Variables 에 등록:
//   OPENAI_API_KEY  (필수)  : OpenAI API 키
//   OPENAI_MODEL    (선택)  : 사용할 모델명 (미설정 시 기본값 사용)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res
      .status(500)
      .json({ error: "서버에 OPENAI_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  let prompt = "";
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    prompt = (body.prompt || "").toString();
  } catch (e) {
    res.status(400).json({ error: "요청 본문을 해석할 수 없습니다." });
    return;
  }
  if (!prompt.trim()) {
    res.status(400).json({ error: "prompt가 비어 있습니다." });
    return;
  }

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, input: prompt }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({
        error: (data && data.error && data.error.message) ||
          `OpenAI 요청 실패 (${r.status})`,
      });
      return;
    }

    // 응답에서 텍스트만 추출해 반환
    let text = data.output_text || "";
    if (!text && Array.isArray(data.output)) {
      const c = data.output
        .flatMap((it) => it.content || [])
        .find((x) => x.type === "output_text" || x.type === "text");
      text = (c && c.text) || "";
    }
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
