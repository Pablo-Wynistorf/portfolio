import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { mdFor } from "@/lib/seo";
import { Clock } from "@/components/Clock";
import { profile } from "@/data/content";
import { countVisit } from "@/lib/visits";

export function Footer() {
  const [count, setCount] = useState<number | null>(null);
  const { pathname } = useLocation();
  const md = mdFor(pathname);
  useEffect(() => {
    countVisit().then(setCount);
  }, []);

  return (
    <footer className="bg-ink px-5 pb-6 pt-4 text-paper md:px-8">
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-paper/60">
        <Link to={md === "/index.md" ? "/md" : `/md${md.replace(/\.md$/, "")}`} className="hover:text-paper">
          This page as Markdown
        </Link>
        <a href="/llms.txt" className="hover:text-paper">
          llms.txt
        </a>
        <a href="/llms-full.txt" className="hover:text-paper">
          llms-full.txt
        </a>
        <a href="/sitemap.xml" className="hover:text-paper">
          Sitemap
        </a>
      </div>
      <div className="grid grid-cols-2 gap-y-3 border-t border-paper/20 pt-4 font-mono text-[11px] uppercase tracking-wider text-paper/60 md:grid-cols-4">
        <span>
          © {profile.since}–{new Date().getFullYear()} {profile.name}
        </span>
        <span>Licensed under {profile.name}</span>
        <span>
          {count && count > 0 ? (
            <>
              Visitors <span className="text-paper">{count.toLocaleString("de-CH")}</span>
            </>
          ) : (
            "Visitor count unavailable"
          )}
        </span>
        <span className="md:text-right">
          CH <Clock />
        </span>
      </div>
    </footer>
  );
}
