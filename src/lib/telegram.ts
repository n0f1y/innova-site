// Отправка заявки в Telegram. Два режима:
// 1) через ретранслятор (TELEGRAM_RELAY_URL + RELAY_SECRET): нужен, когда сервер хостинга не достаёт до api.telegram.org;
//    токен бота и чат хранятся в ретрансляторе, сайт передаёт только текст;
// 2) напрямую (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID).
// Все значения берутся только из переменных окружения сервера.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const relayConfigured = () => Boolean(process.env.TELEGRAM_RELAY_URL) && Boolean(process.env.RELAY_SECRET);
const directConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN) && Boolean(process.env.TELEGRAM_CHAT_ID);

export function telegramConfigured(): boolean {
  return process.env.APPLY_ENABLED === "true" && (relayConfigured() || directConfigured());
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
    const res = relayConfigured()
      ? await fetch(process.env.TELEGRAM_RELAY_URL as string, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Relay-Secret": process.env.RELAY_SECRET as string },
          body: JSON.stringify({ text }),
          signal: AbortSignal.timeout(10000),
        })
      : await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
          signal: AbortSignal.timeout(8000),
        });
    return res.ok;
  } catch {
    // Адрес запроса содержит токен, поэтому подробности ошибки в журнал не выводим
    console.error("Telegram: не удалось отправить заявку");
    return false;
  }
}
