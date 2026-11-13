import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, ChefHat, Cpu, Dumbbell, MountainSnow, Plane, Waves, type LucideIcon } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SectionTitle } from "./SectionTitle";
import { about, profile } from "@/data/content";

const ICONS: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  cpu: Cpu,
  plane: Plane,
  "chef-hat": ChefHat,
  "mountain-snow": MountainSnow,
  waves: Waves,
};

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(20% 20% 20% 20% round 48px)", "inset(0% 0% 0% 0% round 24px)"]);

  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="01 · About me" title="Let me introduce myself." />

        <div className="mb-16">
          <TextGenerateEffect
            words={about.intro}
            className="max-w-4xl font-display text-2xl font-medium leading-snug md:text-4xl [&_span]:text-white"
          />
        </div>

        <motion.div ref={ref} style={{ clipPath: clip }} className="relative mb-20 h-[45vh] overflow-hidden md:h-[60vh]">
          <motion.img
            style={{ y: imgY, scale: 1.3 }}
            src={profile.banner}
            alt={profile.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent" />
        </motion.div>

        <BlurFade inView>
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-neutral-400">{about.competition}</p>
          <Link
            to="/projects/worldskills"
            className="mb-20 inline-flex items-center gap-1 text-teal-300 underline-offset-4 hover:underline"
          >
            Read about WorldSkills 2024 Lyon <ArrowUpRight className="h-4 w-4" />
          </Link>
        </BlurFade>

        <h3 className="mb-8 font-display text-2xl font-semibold text-white">Beyond work</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {about.hobbies.map((h, i) => {
            const Icon = ICONS[h.icon];
            return (
              <BlurFade key={h.title} inView delay={i * 0.07}>
                <MagicCard
                  mode="orb"
                  glowFrom="#2dd4bf"
                  glowTo="#a78bfa"
                  className="h-full rounded-3xl"
                >
                  <div className="flex h-full flex-col p-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-teal-300/20 to-fuchsia-400/10">
                      <Icon className="h-5 w-5 text-teal-200" />
                    </div>
                    <h4 className="mb-2 font-display text-lg font-semibold text-white">{h.title}</h4>
                    <p className="text-sm leading-relaxed text-neutral-400">{h.text}</p>
                    {h.link && (
                      <a
                        href={h.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm text-teal-300 hover:underline"
                      >
                        {h.link.label} <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </MagicCard>
              </BlurFade>
            );
          })}
        </div>
        <BlurFade inView>
          <p className="mt-14 max-w-3xl text-neutral-500">{about.outro}</p>
        </BlurFade>
      </div>
    </section>
  );
}
