import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { Lightbox } from "@/components/Lightbox";
import { projects } from "@/data/content";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug } = useParams();
  const idx = projects.findIndex((p) => p.slug === slug);
  const p = projects[idx];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.3]);
  const dim = useTransform(scrollYProgress, [0, 1], [0.3, 0.9]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (p) document.title = `${p.title} · Pablo Wynistorf`;
  }, [p]);

  if (!p) return <NotFound />;
  const next = projects[(idx + 1) % projects.length];

  return (
    <article>
      <div ref={ref} className="relative h-[85vh] overflow-hidden">
        <motion.img style={{ y, scale }} src={p.cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-16">
          <BlurFade>
            <Link to="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
          </BlurFade>
          <BlurFade delay={0.1}>
            <span className="mb-4 inline-block rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs text-teal-200">
              {p.category}
            </span>
          </BlurFade>
          <TextAnimate
            as="h1"
            by="word"
            animation="blurInUp"
            once
            className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl"
          >
            {p.title}
          </TextAnimate>
          <BlurFade delay={0.4}>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-neutral-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {p.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {p.year}
              </span>
            </div>
          </BlurFade>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_280px]">
          <div className="space-y-16">
            {p.sections.map((s) => (
              <section key={s.heading}>
                <BlurFade inView>
                  <h2 className="mb-6 font-display text-3xl font-bold text-white">{s.heading}</h2>
                </BlurFade>
                {s.body?.map((para, i) => (
                  <BlurFade key={i} inView delay={0.05 * i}>
                    <p className="mb-5 text-lg leading-relaxed text-neutral-400">{para}</p>
                  </BlurFade>
                ))}
                {s.bullets && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {s.bullets.map((b, i) => (
                      <BlurFade key={i} inView delay={0.05 * i}>
                        <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-teal-300/30">
                          {b.label && <div className="mb-1 font-display font-semibold text-white">{b.label}</div>}
                          <div className="text-sm text-neutral-400">{b.text}</div>
                        </div>
                      </BlurFade>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {p.video && (
              <section>
                <h2 className="mb-6 font-display text-3xl font-bold text-white">Best of WorldSkills Lyon 2024</h2>
                <BlurFade inView>
                  <div className="aspect-video overflow-hidden rounded-3xl border border-white/10">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${p.video}`}
                      title="Best of WorldSkills Lyon 2024"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </BlurFade>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-neutral-500">Links</h3>
              <ul className="space-y-3">
                {p.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between text-sm text-neutral-300 hover:text-white">
                      {l.label}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 mt-8 font-mono text-xs uppercase tracking-widest text-neutral-500">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-neutral-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-24">
          <BlurFade inView>
            <h2 className="mb-8 font-display text-3xl font-bold text-white">Image gallery</h2>
          </BlurFade>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {p.gallery.map((g, i) => (
              <BlurFade key={g.src} inView delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid">
                <button
                  onClick={() => setOpen(i)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-white/10"
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full transition duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-sm text-white transition duration-500 group-hover:translate-y-0">
                    {g.alt}
                  </span>
                </button>
              </BlurFade>
            ))}
          </div>
        </section>

        <div className="mt-16 space-y-1 text-xs text-neutral-600">
          <p>
            Photos by{" "}
            <Link to="/" className="hover:text-neutral-300">
              Pablo Wynistorf
            </Link>
            {p.coverCredit && (
              <>
                {" "}· Title image by{" "}
                <a href={p.coverCredit.href} target="_blank" rel="noreferrer" className="hover:text-neutral-300">
                  {p.coverCredit.label}
                </a>
              </>
            )}
          </p>
        </div>

        <Link
          to={`/projects/${next.slug}`}
          className="group relative mt-24 block overflow-hidden rounded-3xl border border-white/10"
        >
          <img src={next.cover} alt="" loading="lazy" className="h-64 w-full object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-60" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent p-8">
            <span className="text-xs uppercase tracking-widest text-neutral-400">Next project</span>
            <span className="mt-2 flex items-center gap-3 font-display text-3xl font-bold text-white md:text-4xl">
              {next.title}
              <ArrowRight className="h-7 w-7 transition group-hover:translate-x-2" />
            </span>
          </div>
        </Link>
      </div>

      <Lightbox images={p.gallery} index={open} onChange={setOpen} />
    </article>
  );
}
