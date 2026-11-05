// Ретранслятор заявок в Telegram для Cloudflare Workers.
// Принимает POST {"text": "..."} с заголовком X-Relay-Secret и пересылает текст в Telegram.
// Секреты (Settings → Variables and Secrets): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RELAY_SECRET.
export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    // Только запросы с общим секретом сайта
    const secret = request.headers.get("X-Relay-Secret") || "";
    if (!env.RELAY_SECRET || secret !== env.RELAY_SECRET) return new Response("Forbidden", { status: 403 });

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad Request", { status: 400 });
    }
    const text = typeof body.text === "string" ? body.text.slice(0, 3500) : "";
    if (!text) return new Response("Bad Request", { status: 400 });

    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    return new Response(res.ok ? "ok" : "telegram error", { status: res.ok ? 200 : 502 });
  },
};
