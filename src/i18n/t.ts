// Interface text for the current language. `t` is a live binding:
// loadLanguage() swaps it before the app first renders.
import * as content from "@/data/content";
import { ui as en, type UI } from "./en.ts";
import { applyTranslation } from "./apply.ts";
import { lang } from "./index.ts";

export let t: UI = en;

export async function loadLanguage() {
  if (lang === "en") return;
  const mod = await (lang === "de" ? import("./de.ts") : lang === "fr" ? import("./fr.ts") : import("./it.ts"));
  t = mod.ui;
  applyTranslation(content, mod.content);
}
