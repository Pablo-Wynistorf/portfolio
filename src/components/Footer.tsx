import { useEffect, useState } from "react";
import { Clock } from "@/components/Clock";
import { profile } from "@/data/content";
import { countVisit } from "@/lib/visits";

export function Footer() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    countVisit().then(setCount);
  }, []);

  return (
    <footer className="bg-ink px-5 pb-6 pt-4 text-paper md:px-8">
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
