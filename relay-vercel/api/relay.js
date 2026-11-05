// Ретранслятор заявок в Telegram для Vercel.
// Принимает POST {"text": "..."} с заголовком X-Relay-Secret и пересылает текст в Telegram.
// Переменные проекта (Settings → Environment Variables): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RELAY_SECRET.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Только запросы с общим секретом сайта
  const secret = req.headers["x-relay-secret"] || "";
  if (!process.env.RELAY_SECRET || secret !== process.env.RELAY_SECRET) {
    res.status(403).send("Forbidden");
    return;
  }

  const text = req.body && typeof req.body.text === "string" ? req.body.text.slice(0, 3500) : "";
  if (!text) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    res.status(r.ok ? 200 : 502).send(r.ok ? "ok" : "telegram error");
  } catch {
    res.status(502).send("telegram unreachable");
  }
};
