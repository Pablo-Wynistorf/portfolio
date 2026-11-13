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
  const desktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", desktop ? "35%" : "0%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section id="top" ref={ref} className="relative flex flex-col gap-8 overflow-hidden px-5 pb-10 pt-20 md:min-h-[100svh] md:justify-between md:gap-0 md:px-8 md:pb-6 md:pt-24">
      {/* meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="order-1 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-ink pt-3 font-mono text-[10px] uppercase tracking-wider md:grid-cols-12 md:text-[11px]"
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
      <div className="order-3 grid items-end gap-8 md:order-2 md:my-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: EASE }}
            className="max-w-xl text-[1.65rem] leading-[1.15] tracking-tight md:text-4xl"
          >
            Technical Account Manager at <span className="font-serif italic">AWS</span>, founder of Nextenic GmbH,
            and the network builder behind three UEFA finals and Openair Frauenfeld.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 grid grid-cols-2 items-center gap-3 sm:flex sm:flex-wrap"
          >
            <Magnetic className="w-full sm:w-auto">
              <Link
                to="/#work"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-red sm:inline-flex sm:w-auto"
              >
                Selected work <span aria-hidden>↓</span>
              </Link>
            </Magnetic>
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-3.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper sm:inline-flex"
            >
              CV (PDF)
            </a>
            <button
              onClick={() => openChat()}
              className="col-span-2 justify-self-start px-1 py-2 text-sm font-medium underline decoration-red decoration-2 underline-offset-4 hover:text-red sm:col-span-1 sm:px-3 sm:py-3.5"
            >
              Ask AI Pablo
            </button>
          </motion.div>
        </div>

        <motion.figure
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ delay: 0.3, duration: 1.4, ease: EASE }}
          className="relative order-first aspect-[4/3] w-full overflow-hidden bg-paper-2 md:order-none md:col-span-2 md:col-start-11 md:aspect-[4/5]"
        >
          <motion.img
            style={{ scale: imgScale }}
            src={profile.avatar}
            alt={profile.name}
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_30%] grayscale"
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
        className="order-2 font-wide text-[11.3vw] font-black uppercase leading-[0.82] tracking-[-0.045em] md:order-3 md:text-[11.6vw]"
      >
        <BigLine text={profile.firstName} delay={0.1} />
        <span className="flex items-end justify-between">
          <BigLine text={profile.lastName} delay={0.2} />
        </span>
      </motion.h1>
    </section>
  );
}
