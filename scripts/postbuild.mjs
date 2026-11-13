// Prerenders every page for crawlers and AI agents, then adds SPA fallbacks.
// For each page in pages.mjs it writes dist/<path>/index.html with:
// - its own <title>, description, canonical, Open Graph and Twitter tags
// - <link rel="alternate" type="text/markdown"> pointing to the Markdown twin
// - JSON-LD structured data
// - the page content as real HTML inside #root (React replaces it on load)
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { SITE, base, pages, useContent } from "./pages.mjs";
import { applyTranslation } from "../src/i18n/apply.ts";
import { ui as en } from "../src/i18n/en.ts";
import * as de from "../src/i18n/de.ts";
import * as fr from "../src/i18n/fr.ts";
import * as it from "../src/i18n/it.ts";

const LANGS = { en: { ui: en }, de, fr, it };
const OG_LOCALE = { en: "en_US", de: "de_CH", fr: "fr_CH", it: "it_CH" };
const prefix = (l) => (l === "en" ? "" : `/${l}`);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Remove the per-page tags from the template; they are regenerated below.
const shellBase = template
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, "")
  .replace(/<link rel="canonical"[^>]*>\s*/, "")
  .replace(/<meta property="og:[^>]*>\s*/g, "")
  .replace(/<meta name="twitter:[^>]*>\s*/g, "");

function head(p, l) {
  const url = SITE + prefix(l) + (p.canonical ?? p.path);
  const alternates = p.canonical
    ? ""
    : [...Object.keys(LANGS).map((x) => [x, x]), ["x-default", "en"]]
        .map(([hl, x]) => `<link rel="alternate" hreflang="${hl}" href="${SITE}${prefix(x)}${p.path}" />`)
        .join("\n    ");
  return `<title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="Pablo Wynistorf" />
    <link rel="canonical" href="${url}" />
    ${alternates}
    <link rel="alternate" type="text/markdown" href="${SITE}${p.md}" title="Markdown version" />
    <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="llms.txt" />
    <link rel="sitemap" type="application/xml" href="${SITE}/sitemap.xml" />
    <meta property="og:type" content="${p.path === "/" ? "profile" : "article"}" />
    <meta property="og:site_name" content="Pablo Wynistorf" />
    <meta property="og:locale" content="${OG_LOCALE[l]}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${p.image}" />
    ${p.path === "/" ? '<meta property="profile:first_name" content="Pablo" />\n    <meta property="profile:last_name" content="Wynistorf" />' : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.title)}" />
    <meta name="twitter:description" content="${esc(p.description)}" />
    <meta name="twitter:image" content="${p.image}" />
    <script type="application/ld+json">${JSON.stringify(p.jsonld).replace(/</g, "\\u003c")}</script>
  </head>`;
}

function body(p, l) {
  const t = LANGS[l].ui;
  const home = prefix(l) || "/";
  // Site-absolute links in the Markdown point at .md twins; in HTML, point at the pages.
  const md = p.body.replace(/\(https:\/\/www\.pablo\.one\/(projects|certifications)\/([a-z0-9-]+)\.md\)/g, `(${prefix(l)}/$1/$2/)`)
    .replace(/\(https:\/\/www\.pablo\.one\/about\.md\)/g, `(${prefix(l)}/p/about-me/)`)
    .replace(/\(https:\/\/www\.pablo\.one\/index\.md\)/g, `(${home})`)
    .replace(/\(https:\/\/www\.pablo\.one\/media\//g, "(/media/");
  const html = marked.parse(md, { async: false });
  return `<div id="root"><div class="prerender">
      <p class="prerender-note">AI agents and crawlers: this page is also available as Markdown at <a href="${SITE}${p.md}">${SITE}${p.md}</a>. Site index for LLMs: <a href="${SITE}/llms.txt">${SITE}/llms.txt</a>.</p>
      <nav aria-label="Site"><a href="${home}">Pablo Wynistorf</a> · <a href="${prefix(l)}/#about">${t.nav.about}</a> · <a href="${prefix(l)}/p/cv/">${t.nav.cv}</a> · <a href="/md">Markdown</a> · <a href="/llms.txt">llms.txt</a> · ${Object.keys(LANGS).map((x) => `<a href="${prefix(x)}${p.path}" hreflang="${x}">${x.toUpperCase()}</a>`).join(" ")}</nav>
      <main class="md-prose">${html}</main>
    </div></div>`;
}

function render(p, l) {
  return shellBase
    .replace(/<html lang="[^"]*"/, `<html lang="${l}"`)
    .replace("</head>", head(p, l))
    .replace('<div id="root"></div>', body(p, l));
}

/** Translated titles and descriptions; the page bodies come from the translated content. */
function localize(list, l) {
  const t = LANGS[l].ui;
  return list.map((p) => {
    if (p.path === "/") return { ...p, title: t.seo.homeTitle, description: t.seo.homeDescription };
    if (p.path === "/p/cv/") return { ...p, title: `${t.cv.title} · Pablo Wynistorf`, description: t.seo.cvDescription };
    return p;
  });
}

let count = 0;
for (const l of Object.keys(LANGS)) {
  if (l !== "en") useContent(applyTranslation(structuredClone({ ...base }), LANGS[l].content));
  const list = localize(pages(), l);
  for (const p of list) {
    const dir = join(dist, prefix(l), p.path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), render(p, l));
    count++;
  }
}
useContent(base);

// Client-only routes and legacy redirects: serve the app shell.
const shell = shellBase.replace(
  "</head>",
  `<title>Pablo Wynistorf</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="llms.txt" />
  </head>`,
);
for (const l of Object.keys(LANGS)) {
  for (const extra of ["md", "projects", "certifications", "contact", "skills"]) {
    mkdirSync(join(dist, prefix(l), extra), { recursive: true });
    writeFileSync(join(dist, prefix(l), extra, "index.html"), shell);
  }
}
writeFileSync(join(dist, "404.html"), shell);
writeFileSync(join(dist, ".nojekyll"), "");
copyFileSync(join(dist, "404.html"), join(dist, "md", "index.html"));

console.log(`postbuild: prerendered ${count} pages in ${Object.keys(LANGS).length} languages + app shell routes + 404.html`);
