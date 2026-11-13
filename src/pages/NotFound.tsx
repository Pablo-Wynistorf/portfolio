import { Link } from "react-router";
import { t } from "@/i18n/t";

export default function NotFound() {
  return (
    <section className="flex min-h-[85vh] flex-col justify-end px-5 pb-16 pt-24 md:px-8">
      <div className="font-mono text-[11px] uppercase tracking-wider">
        <span className="text-red">(404)</span> {t.notFound.label}
      </div>
      <h1 className="mt-6 font-wide text-[38vw] font-black leading-[0.75] tracking-[-0.05em] md:text-[30vw]">404</h1>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-6 border-t border-ink pt-4">
        <p className="text-xl">{t.notFound.text}</p>
        <Link to="/" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-red">
          {t.notFound.back}
        </Link>
      </div>
    </section>
  );
}
