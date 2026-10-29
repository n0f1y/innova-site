const isProd = process.env.NODE_ENV === "production";

// Политика загрузки ресурсов: страница может брать скрипты, стили и шрифты только со своего адреса,
// картинки ещё и из хранилища Sanity, а встраивать в себя только известные видеоплееры.
// 'unsafe-inline' нужен самому Next.js (его служебные скрипты и стили встроены в страницу).
// В режиме разработки политику не включаем: ей мешает перезагрузка страницы на лету.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://rutube.ru https://vk.com https://vkvideo.ru",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(isProd
    ? [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Не сообщаем посетителям, на чём сделан сайт
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
