# Crescent Quizzes Frontend

Crescent Quizzes is a quiz platform for browsing quizzes, answering multiple-choice questions, and reviewing account and result information. This Vue 3 application provides the user interface and communicates with the Laravel API.

## Requirements

- Node.js `20.19+` or `22.12+`
- npm
- The Laravel backend running at `http://localhost:8000`

The API base URL is currently configured in `src/services/api.ts` as `http://localhost:8000/api/cqs`.

## Install

From this directory (`quiz-app-vue`), install the frontend dependencies:

```powershell
npm install
```

## Run in Development

Start the Laravel backend first, then run the frontend in a separate terminal:

```powershell
npm run dev
```

Vite prints the local development URL, usually `http://localhost:5173`.

## Build and Check

```powershell
npm run type-check
npm run build
```

The production build is written to `dist/`.
