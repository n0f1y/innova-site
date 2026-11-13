# Сайт бизнес-инкубатора «Иннова» — передача проекта

Сайт: https://innovadar.ru (главный). innovadar.com и www перенаправляются на него.

## Стек
- Next.js 15 (App Router), React 19, Tailwind 3, TypeScript
- Контент: Sanity CMS (проект `ujh0dx6q`, датасет `production`), панель — `studio/` (maksimar.sanity.studio)
- Страницы обновляются сами (ISR, `revalidate = 60`): правки в Sanity появляются на сайте за ~1 минуту
- Хостинг: Timeweb Cloud App Platform (Docker, `Dockerfile`), приложение `innova-site`
- Репозиторий: https://github.com/n0f1y/innova-site (ветка `main`)

## Запуск локально
Нужен Node.js 20+ (лучше 22).
```
npm install
npm run dev        # http://localhost:3000
npm run build      # проверка продакшн-сборки
```
Файл `.env.local` в архив НЕ положен (секреты). Скопируйте `.env.example` в `.env.local`.
Для просмотра сайта достаточно двух переменных:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=ujh0dx6q
NEXT_PUBLIC_SANITY_DATASET=production
```
Без них сайт показывает запасные тексты из `src/data/content.ts`.

## Где что лежит
- `src/data/content.ts` — тексты и запасные значения (тарифы, виды деятельности и т.д.)
- `src/data/legal.ts` — политика конфиденциальности и согласие на ПД (страницы /privacy, /consent)
- `src/components/` — блоки сайта (Header, Footer, ApplyForm, Blog …)
- `src/app/api/apply/route.ts` — приём заявок; `src/lib/telegram.ts` — отправка
- `src/app/materials/[slug]` — страницы статей/новостей из Sanity
- `next.config.mjs` — заголовки безопасности, CSP, редиректы .com/www → innovadar.ru
- `studio/` — схема и панель Sanity
- `public/brand/` — логотипы
- `relay-php/relay.php` — скрипт отправки заявок на почту (лежит на хостинге REG.RU, `relay.innovadar.ru`)
- `relay/`, `relay-vercel/` — запасные варианты ретранслятора, НЕ используются
- `ИНСТРУКЦИЯ_ПАНЕЛЬ.md`, `ПАМЯТКА_ДЛЯ_ЗАКАЗЧИКА.html` — как заказчик работает в панели

## Как работают заявки
Форма → `POST /api/apply` → (валидация, антиспам, лимит) → HTTP-запрос на `MAIL_RELAY_URL`
(`http://relay.innovadar.ru/relay.php`, заголовок `X-Relay-Secret`) → PHP `mail()` на `innovaesg@mail.ru`.
Telegram напрямую НЕ работает: серверы в РФ не достают до api.telegram.org.

Переменные окружения в Timeweb: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`APPLY_ENABLED=true`, `MAIL_RELAY_URL`, `RELAY_SECRET` (значения спросите у владельца проекта).

## Как выкатить изменения на сайт
Автодеплоя нет.
1. Внести правки, проверить `npm run build`.
2. `git add . && git commit -m "..." && git push` (в ветку main).
3. Timeweb → Приложения → innova-site → Настройки деплоя → выбрать последний коммит →
   «Сохранить данные» → «Запустить». Дождаться статуса «В сети».
Если нужен доступ к репозиторию/Timeweb/Sanity — запросить у владельца проекта.
Репозиторий сейчас публичный (так Timeweb берёт код по URL); не коммитьте туда секреты.

## Домены и DNS
Домены innovadar.ru и innovadar.com куплены на REG.RU. DNS ведёт REG.RU-хостинг «Хост-0»
(панель ISPmanager, оплачен до 04.12.2026 — продлить, иначе пропадут DNS и ретранслятор заявок).
A-записи указывают на IP Timeweb 200.169.184.226.

## Известные открытые вопросы
- Проверить, что innovadar.com / www.innovadar.com открываются по HTTPS и перекидывают на .ru
  (если нет — выпустить SSL для них в Timeweb → приложение → SSL).
- Сменить `RELAY_SECRET` (он светился в переписке): в `relay.php` на хостинге и в переменных Timeweb.
- Удалить неиспользуемые `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` из Timeweb.
- Удалить старый `~/www/innovadar.com/relay.php` на хостинге REG.RU.
- Включить 2FA в Sanity, GitHub, Timeweb, REG.RU.
- В юр. документах e-mail для отзыва согласия `innova@mail.ru`, а заявки идут на `innovaesg@mail.ru` — уточнить у заказчика.
- Контакты (телефон, e-mail, Telegram, VK) и эксперты заполняются заказчиком через панель Sanity.
