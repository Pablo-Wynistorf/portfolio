import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { FadeIn } from "@/components/motion";
import { skills, stats } from "@/data/content";

export function Skills() {
  return (
    <section id="skills">
      <div className="bg-ink py-4 text-paper">
        <Marquee className="[--duration:55s] [--gap:0rem] p-0" repeat={3}>
          {skills.map((s) => (
            <span key={s} className="flex items-center font-mono text-sm uppercase tracking-wider">
              <span className="px-6">{s}</span>
              <span className="text-red">✱</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="grid grid-cols-2 border-b border-ink md:grid-cols-5">
        {stats.map((s, i) => (
          <FadeIn
            key={s.label}
            delay={i * 0.06}
            className="border-ink px-5 py-10 odd:border-r last:col-span-2 last:border-r-0! md:border-r md:px-8 md:last:col-span-1 [&:nth-child(n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0"
          >
            <div className="font-wide text-6xl font-black tracking-tighter md:text-7xl">
              <NumberTicker value={s.value} className="text-ink" />
              <span className="text-red">{s.suffix}</span>
            </div>
            <div className="mt-3 max-w-[12rem] text-sm leading-snug text-muted">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
