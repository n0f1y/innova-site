// Превращает обычную ссылку на видео (как в адресной строке браузера) в адрес встраиваемого плеера.
// Возвращает null, если площадка не поддерживается: тогда сайт откроет ссылку в новой вкладке.
export function toEmbedUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  // YouTube: watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID, /live/ID
  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    const id = host === "youtu.be" ? parts[0] : u.searchParams.get("v") ?? (["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : undefined);
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
  }

  // Vimeo: vimeo.com/ID
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = parts.find((p) => /^\d+$/.test(p));
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }

  // Rutube: rutube.ru/video/ID/ или rutube.ru/play/embed/ID
  if (host === "rutube.ru") {
    const i = parts.findIndex((p) => p === "video" || p === "embed");
    const id = i >= 0 ? parts[i + 1] : undefined;
    return id && /^[a-f0-9]{16,}$/i.test(id) ? `https://rutube.ru/play/embed/${id}?autoplay=1` : null;
  }

  // VK Видео: vk.com/video-123_456, vkvideo.ru/video-123_456 или video_ext.php?oid=-123&id=456
  if (host === "vk.com" || host === "vkvideo.ru" || host === "vk.ru") {
    // hash нужен для видео с ограниченным доступом, у открытых его нет
    const hash = u.searchParams.get("hash");
    const tail = `&autoplay=1${hash ? `&hash=${encodeURIComponent(hash)}` : ""}`;
    const m = /video(-?\d+)_(\d+)/.exec(u.pathname + u.search);
    if (m) return `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}${tail}`;
    const oid = u.searchParams.get("oid");
    const id = u.searchParams.get("id");
    // только числа: иначе в адрес плеера можно подмешать посторонние параметры
    return oid && id && /^-?\d+$/.test(oid) && /^\d+$/.test(id) ? `https://vk.com/video_ext.php?oid=${oid}&id=${id}${tail}` : null;
  }

  return null;
}
