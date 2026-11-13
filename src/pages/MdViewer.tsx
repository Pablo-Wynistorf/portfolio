import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { marked } from "marked";
import { motion } from "motion/react";
import { useSeo } from "@/lib/seo";
import { certifications, projects } from "@/data/content";
import { cn } from "@/lib/utils";

const SITE = "https://www.pablo.one";

const DOCS = [
  { file: "/llms.txt", label: "llms.txt", group: "For AI agents" },
  { file: "/llms-full.txt", label: "llms-full.txt", group: "For AI agents" },
  { file: "/index.md", label: "Home", group: "Pages" },
  { file: "/about.md", label: "About", group: "Pages" },
  { file: "/cv.md", label: "CV", group: "Pages" },
  ...projects.map((p) => ({ file: `/projects/${p.slug}.md`, label: p.title, group: "Projects" })),
  ...certifications.map((c) => ({ file: `/certifications/${c.slug}.md`, label: c.title, group: "Certifications" })),
];

/** /md → /index.md, /md/projects/x → /projects/x.md, /md/llms.txt → /llms.txt */
function fileFromPath(pathname: string) {
  const rest = pathname.replace(/^\/md\/?/, "").replace(/\/+$/, "");
  if (!rest) return "/index.md";
  if (/\.(md|txt)$/.test(rest)) return `/${rest}`;
  return `/${rest}.md`;
}

const viewerPath = (file: string) => (file === "/index.md" ? "/md" : `/md${file.replace(/\.md$/, "")}`);
const pagePath = (file: string) =>
  file === "/index.md" ? "/" : file === "/about.md" ? "/p/about-me" : file === "/cv.md" ? "/p/cv" : file.replace(/\.md$/, "");

export default function MdViewer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const file = fileFromPath(pathname);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [raw, setRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const doc = DOCS.find((d) => d.file === file);

  useSeo({ title: `${doc?.label ?? file} · Markdown · Pablo Wynistorf`, path: pathname });

  useEffect(() => {
    let live = true;
    setText(null);
    setError(false);
    fetch(file)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((t) => live && setText(t))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [file]);

  const html = useMemo(() => {
    if (text === null) return "";
    // keep navigation inside the viewer for links to other .md twins on this site
    const local = text.replace(/\(https:\/\/www\.pablo\.one\/media\//g, "(/media/").replace(/\]\(https:\/\/www\.pablo\.one(\/[^)\s]+\.(?:md|txt))\)/g, (_, f) => `](${viewerPath(f)})`);
    return marked.parse(local, { async: false }) as string;
  }, [text]);

  const groups = [...new Set(DOCS.map((d) => d.group))];

  return (
    <section className="px-5 pb-24 pt-24 md:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-wider">
        <span>
          <span className="text-red">(MD)</span> Markdown viewer
        </span>
        <span className="text-muted">Every page of this site, as plain Markdown, for people and AI agents</span>
      </div>

      <div className="mt-8 grid gap-10 border-t border-ink pt-8 md:grid-cols-12">
        <aside className="md:col-span-3">
          <nav aria-label="Markdown files" className="space-y-6 md:sticky md:top-24">
            {groups.map((g) => (
              <div key={g}>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">{g}</div>
                <ul className="space-y-1">
                  {DOCS.filter((d) => d.group === g).map((d) => (
                    <li key={d.file}>
                      <Link
                        to={viewerPath(d.file)}
                        className={cn(
                          "block truncate py-0.5 text-sm hover:text-red",
                          d.file === file && "font-semibold underline decoration-red decoration-2 underline-offset-4",
                        )}
                      >
                        {d.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 md:col-span-9">
          <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-ink pb-4">
            <code className="mr-auto truncate font-mono text-xs">{SITE + file}</code>
            {(["Rendered", "Raw"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setRaw(m === "Raw")}
                className={cn(
                  "rounded-full border border-ink px-3 py-1 font-mono text-[11px] uppercase",
                  raw === (m === "Raw") ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper",
                )}
              >
                {m}
              </button>
            ))}
            <button
              onClick={() => {
                if (text) navigator.clipboard?.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="rounded-full border border-ink px-3 py-1 font-mono text-[11px] uppercase hover:bg-ink hover:text-paper"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <a href={file} className="rounded-full border border-ink px-3 py-1 font-mono text-[11px] uppercase hover:bg-ink hover:text-paper">
              Open file ↗
            </a>
            {file.endsWith(".md") && (
              <button
                onClick={() => navigate(pagePath(file))}
                className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] uppercase text-paper hover:bg-red"
              >
                View page →
              </button>
            )}
          </div>

          {error && <p className="text-red">This file could not be loaded.</p>}
          {text === null && !error && <p className="font-mono text-xs text-muted">Loading…</p>}
          {text !== null && (
            <motion.div key={file + String(raw)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {raw ? (
                <pre className="overflow-x-auto whitespace-pre-wrap break-words border border-ink bg-ink p-5 font-mono text-[13px] leading-relaxed text-paper">
                  {text}
                </pre>
              ) : (
                <article
                  className="md-prose"
                  onClick={(e) => {
                    const a = (e.target as HTMLElement).closest("a");
                    const href = a?.getAttribute("href");
                    if (href?.startsWith("/md")) {
                      e.preventDefault();
                      navigate(href);
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
