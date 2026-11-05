# Ретранслятор заявок в Telegram (Vercel)

Нужен, потому что сервер сайта (Timeweb) не достаёт до api.telegram.org.
Сайт отправляет заявку сюда, а функция пересылает её в Telegram.

Vercel → Add New → Project → репозиторий `innova-site` → **Root Directory: `relay-vercel`**.
Переменные (Environment Variables): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RELAY_SECRET`.
Адрес функции: `https://ИМЯ-ПРОЕКТА.vercel.app/api/relay`. Его вписывают в `TELEGRAM_RELAY_URL` на хостинге сайта.
