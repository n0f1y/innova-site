// Ссылки, которые вносятся в панели управления, показываем только если они безопасны:
// внутренние адреса сайта, http(s), почта и телефон. Всё остальное (например, javascript:) заменяем на заглушку.
export function safeHref(raw: string | undefined | null, fallback = "#"): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if ((value.startsWith("/") && !value.startsWith("//")) || value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}
