// Generates the AI/SEO text files into public/ (served as-is by Vite and Pages):
// Markdown twins of every page, llms.txt, llms-full.txt, sitemap.xml, robots.txt.
// Runs before `vite` and `vite build`; the outputs are git-ignored.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, llmsTxt, pages } from "./pages.mjs";

const pub = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const write = (p, text) => {
  const f = join(pub, p);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, text);
};

const LANGS = ["en", "de", "fr", "it"];
const pre = (l) => (l === "en" ? "" : `/${l}`);
const list = pages();
for (const p of list) write(p.md, p.body);

write("llms.txt", llmsTxt(list));
write("llms-full.txt", list.map((p) => p.body).join("\n\n---\n\n"));

const today = new Date().toISOString().slice(0, 10);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${list
  .filter((p) => p.sitemap !== false)
  .flatMap((p) => {
    // every page exists in English (/), German (/de), French (/fr) and Italian (/it)
    const alt = [...LANGS.map((l) => [l, l]), ["x-default", "en"]]
      .map(([hl, l]) => `<xhtml:link rel="alternate" hreflang="${hl}" href="${SITE}${pre(l)}${p.path}"/>`)
      .join("");
    return LANGS.map((l) => `  <url><loc>${SITE}${pre(l)}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority>${alt}</url>`);
  })
  .join("\n")}
</urlset>
`,
);

write(
  "robots.txt",
  `# Humans and crawlers welcome.
# AI agents: a Markdown version of this site is listed at ${SITE}/llms.txt
# (single file: ${SITE}/llms-full.txt). Each page also links its Markdown twin
# via <link rel="alternate" type="text/markdown">.
User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`,
);

console.log(`gen-md: ${list.length} Markdown pages, llms.txt, llms-full.txt, sitemap.xml, robots.txt`);
