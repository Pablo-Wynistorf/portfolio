import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { autoRedirect, basename, lang } from "./i18n/index.ts";
import { loadLanguage } from "./i18n/t.ts";
import "./index.css";

if (!autoRedirect()) {
  document.documentElement.lang = lang;
  // if a translation fails to load, show the English text rather than nothing
  loadLanguage().catch(() => {}).then(() =>
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </StrictMode>,
    ),
  );
}
