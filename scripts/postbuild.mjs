// Makes the SPA work on GitHub Pages (and any static host):
// - copies index.html into every known route folder, so deep links return 200
// - writes 404.html as a fallback for anything else
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const routes = JSON.parse(readFileSync(join(root, "src/data/routes.json"), "utf8"));
const index = join(dist, "index.html");

const paths = [
  ...routes.pages,
  ...routes.projects.map((s) => `projects/${s}`),
  ...routes.certifications.map((s) => `certifications/${s}`),
];

for (const p of paths) {
  mkdirSync(join(dist, p), { recursive: true });
  copyFileSync(index, join(dist, p, "index.html"));
}
copyFileSync(index, join(dist, "404.html"));
writeFileSync(join(dist, ".nojekyll"), "");
console.log(`postbuild: ${paths.length} route pages + 404.html`);
