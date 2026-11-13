import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { LampContainer } from "@/components/ui/lamp";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";
import { certifications } from "@/data/content";

export function Certifications() {
  return (
    <section id="certifications" className="relative">
      <LampContainer className="min-h-[70vh] rounded-none">
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="mb-4 text-center font-mono text-xs uppercase tracking-[0.35em] text-teal-300/80"
        >
          04 · Certifications
        </motion.p>
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text py-4 text-center font-display text-5xl font-bold tracking-tight text-transparent md:text-8xl"
        >
          Certified.
        </motion.h2>
      </LampContainer>

      <div className="relative z-50 mx-auto -mt-40 grid max-w-6xl gap-6 px-6 pb-32 md:grid-cols-3">
        {certifications.map((c, i) => (
          <BlurFade key={c.slug} inView delay={i * 0.12}>
            <Link
              to={`/certifications/${c.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-7 backdrop-blur-xl transition hover:-translate-y-2 hover:border-white/20"
            >
              <div className="relative mb-6 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent">
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className={
                    c.slug === "worldskills"
                      ? "h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      : "h-24 object-contain transition duration-700 group-hover:scale-110"
                  }
                />
              </div>
              <div className="mb-2 flex items-center gap-2 text-xs text-teal-300">
                <BadgeCheck className="h-4 w-4" /> {c.issuer} · {c.achieved}
              </div>
              <h3 className="font-display text-xl font-semibold leading-tight text-white">{c.title}</h3>
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm text-neutral-400 transition group-hover:text-white">
                View details <ArrowUpRight className="h-4 w-4" />
              </span>
              <BorderBeam
                size={120}
                duration={6 + i * 2}
                colorFrom="#2dd4bf"
                colorTo="#a78bfa"
                className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </Link>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
