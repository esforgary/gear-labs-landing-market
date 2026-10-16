# GearLabs

React + TypeScript + Vite (`client`), Express + SQLite (`server`).

## Локальный запуск

Требуется Node.js 22.12+ (проверено на 24).

Установка зависимостей из корня проекта:

```powershell
npm ci --prefix client
npm ci --prefix server
```

На Windows запустите `start-project.bat`. Он запускает API и Vite в фоне и открывает сайт:
http://127.0.0.1:5173/gear-labs-landing-market/

Либо запустите в двух терминалах:

```powershell
npm start --prefix server
npm run dev --prefix client -- --host 127.0.0.1
```

API работает на порту 5050. База `server/mydatabase.db` уже содержит данные; для обычного запуска seed не требуется.

## Проверки

```powershell
npm run build --prefix client
npm run lint --prefix client
```

Сборка появляется в `client/dist`. Базовый путь `/gear-labs-landing-market/` сохранён для GitHub Pages. Копии изображений в `server/public` и `client/public/static` нужны соответственно API и статическому хостингу.

## Импортированные проекты

Локальные демо находятся в `client/public/imported` и входят в обычную сборку сайта. После правок исходников фоторедактора или дневника выполните `npm run build:photo-editor --prefix client` либо `npm run build:calorie-calculator --prefix client`, затем общую сборку. Исходники Meridian и его отдельная инструкция сборки — в `client/demos/market-analysis`; QA Abstract сохранён как самостоятельный HTML.

Scenarios включает только фоторедактор с IndexedDB и экспортом PNG. «Ритм» использует localStorage без авторизации и сетевого API. Meridian получает публичные рыночные данные; для них требуется интернет. Модель удаления фона фоторедактора загружается при первом использовании, изображения обрабатываются на устройстве.
