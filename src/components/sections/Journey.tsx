import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { FadeIn, Label, Reveal } from "@/components/motion";
import { timeline } from "@/data/content";

export function Journey() {
  const years = [...new Set(timeline.map((t) => t.year))];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="journey" className="border-t border-ink px-5 py-24 md:px-8 md:py-36">
      <div className="mb-16 grid gap-6 md:grid-cols-12">
        <Label n="03" className="md:col-span-3">
          Journey
        </Label>
        <Reveal
          as="h2"
          text="From stadiums to the cloud."
          className="font-wide text-5xl font-black uppercase leading-[0.9] tracking-tight md:col-span-9 md:text-8xl"
        />
      </div>

      <div ref={ref} className="relative">
        {/* progress rule */}
        <div className="absolute top-0 hidden h-full w-px bg-ink/15 md:left-[30%] md:block">
          <motion.div style={{ scaleY }} className="h-full w-full origin-top bg-red" />
        </div>

        {years.map((year) => (
          <div key={year} className="grid gap-6 pb-16 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="md:sticky md:top-24">
                <span className="font-wide text-7xl font-black tracking-tighter md:text-[6.5rem] md:leading-none">{year}</span>
              </div>
            </div>
            <ul className="md:col-span-8 md:col-start-5">
              {timeline
                .filter((t) => t.year === year)
                .map((t, i) => {
                  const inner = (
                    <>
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1">
                        <span className="block text-xl font-semibold tracking-tight transition-colors group-hover:text-red md:text-2xl">
                          {t.title}
                        </span>
                        <span className="mt-1 block text-muted">{t.text}</span>
                      </span>
                      {(t.to || t.href) && (
                        <span aria-hidden className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                          ↗
                        </span>
                      )}
                    </>
                  );
                  const cls = "group flex items-baseline gap-5 border-b border-ink/20 py-5";
                  return (
                    <FadeIn as="li" key={t.title} delay={i * 0.05} y={16}>
                        {t.to ? (
                          <Link to={t.to} className={cls}>
                            {inner}
                          </Link>
                        ) : t.href ? (
                          <a href={t.href} target="_blank" rel="noreferrer" className={cls}>
                            {inner}
                          </a>
                        ) : (
                          <div className={cls.replace("group ", "")}>{inner}</div>
                        )}
                    </FadeIn>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
