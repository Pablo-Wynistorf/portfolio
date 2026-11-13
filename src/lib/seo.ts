import { useEffect } from "react";

const SITE = "https://www.pablo.one";

function setMeta(selector: string, attr: "content" | "href", value: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/** Markdown twin of an app path, e.g. /projects/x → /projects/x.md */
export function mdFor(pathname: string): string {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return "/index.md";
  if (p === "/p/cv") return "/cv.md";
  if (p === "/p/about-me") return "/about.md";
  if (/^\/(projects|certifications)\/[a-z0-9-]+$/.test(p)) return `${p}.md`;
  return "/index.md";
}

/**
 * Keeps title, description, canonical and the Markdown alternate link in sync
 * after client-side navigation (the first load already has them prerendered).
 */
export function useSeo({ title, description, path }: { title: string; description?: string; path: string }) {
  useEffect(() => {
    document.title = title;
    const canonical = SITE + (path.endsWith("/") ? path : `${path}/`).replace(/^\/\/$/, "/");
    if (description) {
      setMeta('meta[name="description"]', "content", description, () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      });
    }
    setMeta('link[rel="canonical"]', "href", path === "/" ? `${SITE}/` : canonical, () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    });
    setMeta('link[rel="alternate"][type="text/markdown"]', "href", SITE + mdFor(path), () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "alternate");
      l.setAttribute("type", "text/markdown");
      l.setAttribute("title", "Markdown version");
      return l;
    });
  }, [title, description, path]);
}
