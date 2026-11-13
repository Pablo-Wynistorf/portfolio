import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { skills, stats } from "@/data/content";

function Chip({ label }: { label: string }) {
  return (
    <span className="mx-1 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-display text-sm text-neutral-300 backdrop-blur transition hover:border-teal-300/40 hover:text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-teal-300 to-fuchsia-400" />
      {label}
    </span>
  );
}

export function Skills() {
  const half = Math.ceil(skills.length / 2);
  return (
    <section id="skills" className="relative py-20">
      <div className="relative flex w-full flex-col overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <Marquee pauseOnHover className="[--duration:40s]">
          {skills.slice(0, half).map((s) => (
            <Chip key={s} label={s} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {skills.slice(half).map((s) => (
            <Chip key={s} label={s} />
          ))}
        </Marquee>
      </div>

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 px-0 md:grid-cols-5">
        {stats.map((s, i) => (
          <BlurFade key={s.label} inView delay={i * 0.08} className="bg-[#050508] p-8 text-center">
            <div className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
              <NumberTicker value={s.value} className="text-white" />
              <span className="bg-gradient-to-r from-teal-300 to-fuchsia-400 bg-clip-text text-transparent">{s.suffix}</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-neutral-500">{s.label}</div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
