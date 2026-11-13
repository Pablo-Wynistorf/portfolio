import { useEffect, useState } from "react";

/** Live local time in Switzerland, e.g. "14:05 CET". */
export function Clock({ className }: { className?: string }) {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Zurich",
      timeZoneName: "short",
    }).format(new Date());
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const t = setInterval(() => setNow(fmt()), 15_000);
    return () => clearInterval(t);
  }, []);
  return <span className={className}>{now}</span>;
}
