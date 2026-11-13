import { useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { Label, Reveal } from "@/components/motion";
import { allPhotos, projects } from "@/data/content";

/** Index of projects; the cover follows the pointer while you hover a row. */
function WorkIndex() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30, mass: 0.5 });
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <div className="relative">
      <div className="hidden grid-cols-12 border-b border-ink pb-2 font-mono text-[11px] uppercase tracking-wider text-muted md:grid">
        <span className="col-span-1">Year</span>
        <span className="col-span-6">Project</span>
        <span className="col-span-3">Location</span>
        <span className="col-span-2 text-right">Type</span>
      </div>
      <ul
        ref={listRef}
        onPointerMove={(e) => {
          const r = listRef.current!.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
        onPointerLeave={() => setHover(null)}
      >
        {projects.map((p, i) => (
          <li key={p.slug} onPointerEnter={() => setHover(i)}>
            <Link
              to={`/projects/${p.slug}`}
              className="group grid grid-cols-12 items-baseline gap-2 border-b border-ink py-5 transition-colors duration-300 hover:bg-ink hover:text-paper md:py-7"
            >
              <span className="col-span-2 pl-1 font-mono text-xs md:col-span-1">{p.year}</span>
              <span className="col-span-10 font-wide text-2xl font-bold uppercase leading-none tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-6 md:text-4xl">
                {p.title}
              </span>
              <span className="col-span-6 col-start-3 text-sm md:col-span-3 md:col-start-auto">{p.location}</span>
              <span className="col-span-4 pr-1 text-right font-mono text-[11px] uppercase md:col-span-2">{p.category}</span>
            </Link>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {hover !== null && (
          <motion.div
            key="preview"
            className="pointer-events-none absolute left-0 top-0 z-10 hidden h-56 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden md:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={projects[hover].cover}
                src={projects[hover].cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A strip of on-site photos that moves sideways as you scroll down. */
function PhotoStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  const photos = Array.from({ length: 10 }, (_, i) => allPhotos[(i * 5 + 2) % allPhotos.length]);

  return (
    <div ref={ref} className="relative h-[300vh] bg-ink text-paper">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-8 flex items-baseline justify-between px-5 font-mono text-[11px] uppercase tracking-wider md:px-8">
          <span>
            <span className="text-red">(02.1)</span> On site
          </span>
          <span className="text-paper/50">Tirana · Istanbul · Athens · Frauenfeld · Dublin · Lyon</span>
        </div>
        <motion.div style={{ x }} className="flex gap-4 pl-5 md:gap-6 md:pl-8">
          {photos.map((p, i) => (
            <Link
              key={p.src + i}
              to={`/projects/${p.project.slug}`}
              className="group relative h-[55vh] w-[75vw] shrink-0 overflow-hidden md:w-[38vw]"
            >
              <img
                src={p.src}
                alt={p.project.title}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-4 font-mono text-[11px] uppercase">
                <span>{p.project.title}</span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="work">
      <div className="px-5 py-24 md:px-8 md:py-36">
        <div className="mb-14 grid gap-6 md:grid-cols-12">
          <Label n="02" className="md:col-span-3">
            Selected work
          </Label>
          <div className="md:col-span-9">
            <Reveal
              as="h2"
              text="Built on site, under pressure."
              className="font-wide text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl"
            />
            <p className="mt-8 max-w-xl text-lg text-muted">
              Stadium networks for UEFA finals, festival-wide infrastructure at Openair Frauenfeld, and the cloud
              competition of a lifetime in Lyon.
            </p>
          </div>
        </div>
        <WorkIndex />
      </div>
      <PhotoStrip />
    </section>
  );
}
