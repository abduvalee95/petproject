# Билим Нуру - Окуу Борбору CRM Demo

Статический portfolio-ready demo для управления учениками и оплатами учебного центра. Проект собран на `Vite + Vanilla JS`, хранит состояние в `localStorage` и готов к деплою на Vercel или Netlify без backend-части.

## Возможности

- дашборд с карточками KPI и графиками на `Chart.js`
- таблица учеников с поиском, фильтрацией, сортировкой и пагинацией
- отчёты по оплатам, курсам и каналам оплаты
- добавление и редактирование ученика через локальную форму
- CSV-экспорт текущего demo-набора
- безопасные synthetic demo data вместо реальных контактов

## Стек

- Vite
- Vanilla JavaScript (ES modules)
- Chart.js
- Vitest

## Запуск локально

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Собранные статические файлы будут лежать в `dist/`.

## Тесты

```bash
npm run test
```

Покрываются pure-функции для:

- статусов оплат
- форматирования телефона и сумм
- фильтрации, сортировки и пагинации
- CSV-генерации
- fallback-поведения `localStorage`

## Deploy на Vercel

Проект уже содержит [`vercel.json`](./vercel.json) с:

- `cleanUrls`
- security headers
- cache headers для assets

Обычный поток деплоя:

```bash
npm install
npm run build
vercel --prod
```

Если нужен CI/CD через prebuilt flow:

```bash
vercel build --prod
vercel deploy --prebuilt --prod
```

## Deploy на Netlify

Проект содержит [`netlify.toml`](./netlify.toml) с:

- publish directory = `dist`
- build command = `npm run build`
- эквивалентными security/cache headers

Достаточно импортировать репозиторий в Netlify или загрузить `dist/`.

## Структура

```text
src/
  app.js
  data/
  lib/
  ui/
tests/
public/
```

## Ограничения

- backend, auth и API в этот demo scope не входят
- данные синтетические и предназначены только для portfolio/demo сценария
- состояние хранится локально в браузере по ключу `edu-pay-crm:v1`
