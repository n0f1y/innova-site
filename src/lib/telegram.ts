// Отправка сообщения в Telegram через бота. Токен и чат берутся только из переменных окружения сервера.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function telegramConfigured(): boolean {
  return process.env.APPLY_ENABLED === "true" && Boolean(process.env.TELEGRAM_BOT_TOKEN) && Boolean(process.env.TELEGRAM_CHAT_ID);
}

export type Application = { name: string; phone: string; email: string; message: string };

export async function sendApplication(a: Application): Promise<boolean> {
  const text = [
    "<b>Новая заявка резидента</b>",
    `Имя: ${esc(a.name)}`,
    `Телефон: ${esc(a.phone)}`,
    `Почта: ${esc(a.email)}`,
    a.message ? `О проекте: ${esc(a.message)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    // Токен в журнал не выводим: ошибка сети не содержит его, но адрес запроса — да
    console.error("Telegram: не удалось отправить заявку");
    return false;
  }
}
