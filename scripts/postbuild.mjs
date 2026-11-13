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
import { SITE, pages } from "./pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Remove the per-page tags from the template; they are regenerated below.
const base = template
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, "")
  .replace(/<link rel="canonical"[^>]*>\s*/, "")
  .replace(/<meta property="og:[^>]*>\s*/g, "")
  .replace(/<meta name="twitter:[^>]*>\s*/g, "");

function head(p) {
  const url = SITE + (p.canonical ?? p.path);
  return `<title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="Pablo Wynistorf" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" type="text/markdown" href="${SITE}${p.md}" title="Markdown version" />
    <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="llms.txt" />
    <link rel="sitemap" type="application/xml" href="${SITE}/sitemap.xml" />
    <meta property="og:type" content="${p.path === "/" ? "profile" : "article"}" />
    <meta property="og:site_name" content="Pablo Wynistorf" />
    <meta property="og:locale" content="en_US" />
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

function body(p) {
  // Site-absolute links in the Markdown point at .md twins; in HTML, point at the pages.
  const md = p.body.replace(/\(https:\/\/www\.pablo\.one\/(projects|certifications)\/([a-z0-9-]+)\.md\)/g, "(/$1/$2/)")
    .replace(/\(https:\/\/www\.pablo\.one\/about\.md\)/g, "(/p/about-me/)")
    .replace(/\(https:\/\/www\.pablo\.one\/index\.md\)/g, "(/)")
    .replace(/\(https:\/\/www\.pablo\.one\/media\//g, "(/media/");
  const html = marked.parse(md, { async: false });
  return `<div id="root"><div class="prerender">
      <p class="prerender-note">AI agents and crawlers: this page is also available as Markdown at <a href="${SITE}${p.md}">${SITE}${p.md}</a>. Site index for LLMs: <a href="${SITE}/llms.txt">${SITE}/llms.txt</a>.</p>
      <nav aria-label="Site"><a href="/">Home</a> · <a href="/p/about-me/">About</a> · <a href="/p/cv/">CV</a> · <a href="/md">Markdown</a> · <a href="/llms.txt">llms.txt</a></nav>
      <main class="md-prose">${html}</main>
    </div></div>`;
}

function render(p) {
  return base.replace("</head>", head(p)).replace('<div id="root"></div>', body(p));
}

const list = pages();
for (const p of list) {
  const dir = join(dist, p.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), render(p));
}

// Client-only routes and legacy redirects: serve the app shell.
const shell = base.replace(
  "</head>",
  `<title>Pablo Wynistorf</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="llms.txt" />
  </head>`,
);
for (const extra of ["md", "projects", "certifications", "contact", "skills"]) {
  mkdirSync(join(dist, extra), { recursive: true });
  writeFileSync(join(dist, extra, "index.html"), shell);
}
writeFileSync(join(dist, "404.html"), shell);
writeFileSync(join(dist, ".nojekyll"), "");
copyFileSync(join(dist, "404.html"), join(dist, "md", "index.html"));

console.log(`postbuild: prerendered ${list.length} pages + app shell routes + 404.html`);
