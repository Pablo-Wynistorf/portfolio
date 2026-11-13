import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { profile } from "@/data/content";

// Same visitor counter the Hugo site used. Module-level promise so StrictMode
// and route changes do not count the same visit twice.
let visit: Promise<number | null> | null = null;
function countVisit() {
  visit ??= fetch("https://count.onedns.ch", { method: "POST", mode: "cors", credentials: "omit" })
    .then((r) => r.json())
    .then((d) => (typeof d?.count === "number" ? d.count : null))
    .catch(() => null);
  return visit;
}

export function Footer() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    countVisit().then(setCount);
  }, []);

  return (
    <footer className="relative z-10 border-t border-white/5 px-6 pb-28 pt-10 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>
          © {profile.since} – {new Date().getFullYear()} {profile.name}. Licensed under {profile.name}.
        </p>
        <p className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          {count && count > 0 ? (
            <span>
              Visitors: <span className="font-mono text-neutral-300">{count.toLocaleString()}</span>
            </span>
          ) : (
            <span>Visitor count unavailable</span>
          )}
        </p>
      </div>
    </footer>
  );
}
