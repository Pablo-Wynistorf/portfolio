import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";
import { SectionTitle } from "./SectionTitle";
import { timeline } from "@/data/content";

export function Journey() {
  const years = [...new Set(timeline.map((t) => t.year))];
  const data = years.map((year) => ({
    title: year,
    content: (
      <div className="space-y-4">
        {timeline
          .filter((t) => t.year === year)
          .map((t) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-display text-lg font-semibold text-white md:text-xl">{t.title}</h4>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-neutral-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-300" />
                </div>
                <p className="mt-1 text-sm text-neutral-400 md:text-base">{t.text}</p>
              </>
            );
            const cls =
              "group block rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-teal-300/30 hover:bg-white/[0.04]";
            return "to" in t && t.to ? (
              <Link key={t.title} to={t.to} className={cls}>
                {inner}
              </Link>
            ) : (
              <a key={t.title} href={(t as { href: string }).href} target="_blank" rel="noreferrer" className={cls}>
                {inner}
              </a>
            );
          })}
      </div>
    ),
  }));

  return (
    <section id="journey" className="relative py-20">
      <Timeline
        data={data}
        heading={
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
            <SectionTitle
              eyebrow="02 · Journey"
              title="From stadiums to the cloud."
              sub="Networks for European football finals and festivals, and a path from SwissSkills to WorldSkills."
            />
          </div>
        }
      />
    </section>
  );
}
