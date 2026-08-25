import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as Sentry from "@sentry/browser";

if (import.meta.env.PROD) {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (dsn) {
    Sentry.init({
      dsn,
      integrations: [],
      tracesSampleRate: 1.0,
    });
    console.log("Sentry мониторинг успешно запущен в продакшене.");
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
