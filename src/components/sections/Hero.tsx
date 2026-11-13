import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { Clock } from "@/components/Clock";
import { Magnetic } from "@/components/motion";
import { openChat } from "@/components/chat/ChatWidget";
import { profile } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

function BigLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

const meta = [
  { k: "Based in", v: "Switzerland" },
  { k: "Now", v: "AWS · Technical Account Manager" },
  { k: "Focus", v: "AWS cloud · Event networks" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-6 pt-24 md:px-8">
      {/* meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="grid grid-cols-2 gap-y-4 border-t border-ink pt-3 font-mono text-[11px] uppercase tracking-wider md:grid-cols-12"
      >
        {meta.map((m) => (
          <div key={m.k} className="md:col-span-3">
            <div className="text-muted">{m.k}</div>
            <div>{m.v}</div>
          </div>
        ))}
        <div className="md:col-span-3 md:text-right">
          <div className="text-muted">Local time</div>
          <Clock />
        </div>
      </motion.div>

      {/* middle: statement + portrait */}
      <div className="my-8 grid items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: EASE }}
            className="max-w-xl text-2xl leading-[1.15] tracking-tight md:text-4xl"
          >
            Technical Account Manager at <span className="font-serif italic">AWS</span>, and the network builder
            behind three UEFA finals and Openair Frauenfeld.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link
                to="/#work"
                className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-red"
              >
                Selected work <span aria-hidden>↓</span>
              </Link>
            </Magnetic>
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              CV (PDF)
            </a>
            <button
              onClick={() => openChat()}
              className="px-3 py-3.5 text-sm font-medium underline decoration-red decoration-2 underline-offset-4 hover:text-red"
            >
              Ask AI Pablo
            </button>
          </motion.div>
        </div>

        <motion.figure
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ delay: 0.3, duration: 1.4, ease: EASE }}
          className="relative ml-auto hidden aspect-[4/5] w-full overflow-hidden bg-paper-2 md:col-span-2 md:col-start-11 md:block"
        >
          <motion.img
            style={{ scale: imgScale }}
            src={profile.avatar}
            alt={profile.name}
            fetchPriority="high"
            className="h-full w-full object-cover grayscale"
          />
          <figcaption className="absolute bottom-2 left-2 bg-paper px-1.5 py-0.5 font-mono text-[10px] uppercase">
            Fig. 01 — Pablo
          </figcaption>
        </motion.figure>
      </div>

      {/* the name, full width */}
      <motion.h1
        style={{ y: nameY }}
        aria-label={profile.name}
        className="font-wide text-[13vw] font-black uppercase leading-[0.8] tracking-[-0.045em] md:text-[11.6vw]"
      >
        <BigLine text={profile.firstName} delay={0.1} />
        <span className="flex items-end justify-between">
          <BigLine text={profile.lastName} delay={0.2} />
        </span>
      </motion.h1>
    </section>
  );
}
