// Language of the page. English lives at /, the others under /de, /fr and /it.
// The router runs with the language prefix as its basename, so every
// <Link to="/..."> stays prefix-free and lands in the same language.
export const LANGS = ["en", "de", "fr", "it"] as const;
export type Lang = (typeof LANGS)[number];

const PREFIX = /^\/(de|fr|it)(?=\/|$)/;
const STORE = "pablo.one.lang";

export function langOf(pathname: string): Lang {
  return (pathname.match(PREFIX)?.[1] as Lang | undefined) ?? "en";
}

export const lang: Lang = typeof window === "undefined" ? "en" : langOf(window.location.pathname);
export const basename = lang === "en" ? "/" : `/${lang}`;

/** Path without the language prefix, e.g. /de/projects/x → /projects/x */
export const stripLang = (pathname: string) => pathname.replace(PREFIX, "") || "/";

/** Same page in another language: /projects/x → /fr/projects/x */
export const pathIn = (to: Lang, pathname: string) => (to === "en" ? "" : `/${to}`) + stripLang(pathname);

export function switchLang(to: Lang) {
  try {
    localStorage.setItem(STORE, to);
  } catch {
    /* private mode */
  }
  const { pathname, search, hash } = window.location;
  window.location.assign(pathIn(to, pathname) + search + hash);
}

/**
 * First visit to an English URL: send the visitor to their browser language,
 * unless they picked a language before. Prefixed URLs are always respected,
 * and the Markdown viewer stays English. Returns true when it redirects.
 */
export function autoRedirect(): boolean {
  if (typeof window === "undefined" || lang !== "en") return false;
  const { pathname, search, hash } = window.location;
  if (/^\/md(\/|$)/.test(pathname)) return false;
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORE);
  } catch {
    /* private mode */
  }
  const wanted =
    saved ??
    (navigator.languages?.length ? navigator.languages : [navigator.language])
      .map((l) => l.slice(0, 2).toLowerCase())
      .find((l) => (LANGS as readonly string[]).includes(l));
  if (!wanted || wanted === "en" || !(LANGS as readonly string[]).includes(wanted)) return false;
  window.location.replace(pathIn(wanted as Lang, pathname) + search + hash);
  return true;
}
