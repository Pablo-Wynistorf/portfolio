import { useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { FadeIn, Label } from "@/components/motion";
import { Lightbox } from "@/components/Lightbox";
import { projects } from "@/data/content";
import NotFound from "./NotFound";
import { useSeo } from "@/lib/seo";
import { t } from "@/i18n/t";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectPage() {
  const { slug } = useParams();
  const idx = projects.findIndex((p) => p.slug === slug);
  const p = projects[idx];
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const [open, setOpen] = useState<number | null>(null);

  useSeo({
    title: p ? `${p.title} · Pablo Wynistorf` : `${t.seo.notFound} · Pablo Wynistorf`,
    description: p ? `${p.short} ${p.location}, ${p.year}.` : undefined,
    path: `/projects/${slug}`,
  });

  if (!p) return <NotFound />;
  const next = projects[(idx + 1) % projects.length];
  const meta = [
    { k: t.project.year, v: p.year },
    { k: t.project.location, v: p.location },
    { k: t.project.type, v: p.category },
    { k: t.project.tags, v: p.tags.join(", ") },
  ];

  return (
    <article className="pt-24">
      <header className="px-5 md:px-8">
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider">
          <Link to="/#work" className="hover:text-red">
            {t.project.index}
          </Link>
          <Link to={`/md/projects/${p.slug}`} className="hover:text-red">
            {t.project.viewMd}
          </Link>
        </div>
        <h1 className="mt-10 font-wide text-[11vw] font-black uppercase leading-[0.85] tracking-[-0.03em] md:text-[8vw]">
          {p.title.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-top">
              <motion.span
                className="inline-block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.06 }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 grid grid-cols-2 gap-y-4 border-t border-ink pt-3 font-mono text-[11px] uppercase tracking-wider md:grid-cols-4"
        >
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="text-muted">{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
        </motion.dl>
      </header>

      <motion.div
        ref={coverRef}
        initial={{ clipPath: "inset(0 50% 0 50%)" }}
        animate={{ clipPath: "inset(0 0% 0 0%)" }}
        transition={{ delay: 0.3, duration: 1.4, ease: EASE }}
        className="relative mt-10 h-[70vh] overflow-hidden bg-paper-2"
      >
        <motion.img style={{ y, scale: 1.2 }} src={p.cover} alt={p.title} className="h-full w-full object-cover" />
      </motion.div>

      <div className="px-5 py-20 md:px-8 md:py-28">
        {p.sections.map((s, si) => (
          <section key={s.heading} className="grid gap-6 border-t border-ink py-12 md:grid-cols-12">
            <Label n={`0${si + 1}`} className="md:col-span-3">
              {s.heading}
            </Label>
            <div className="md:col-span-8 md:col-start-5">
              {s.body?.map((para, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <p className={i === 0 ? "mb-6 text-2xl leading-snug tracking-tight md:text-3xl" : "mb-6 text-lg leading-relaxed text-ink-2"}>
                    {para}
                  </p>
                </FadeIn>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b, i) => (
                    <FadeIn as="li" key={i} delay={0.03 * i} y={10} className="grid gap-1 border-b border-ink/20 py-4 md:grid-cols-8">
                        <span className="font-mono text-xs text-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                        {b.label && <span className="font-semibold md:col-span-2">{b.label}</span>}
                        <span className={b.label ? "text-ink-2 md:col-span-5" : "text-ink-2 md:col-span-7"}>{b.text}</span>
                    </FadeIn>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        {p.video && (
          <section className="grid gap-6 border-t border-ink py-12 md:grid-cols-12">
            <Label n="▶" className="md:col-span-3">
              {t.project.video}
            </Label>
            <FadeIn className="md:col-span-8 md:col-start-5">
              <div className="aspect-video bg-ink">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${p.video}`}
                  title="Best of WorldSkills Lyon 2024"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </section>
        )}

        {p.pdf && (
          <section className="grid gap-6 border-t border-ink py-12 md:grid-cols-12">
            <Label n="PDF" className="md:col-span-3">
              {t.project.document}
            </Label>
            <FadeIn className="md:col-span-8 md:col-start-5">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-wider">
                <span className="text-muted">
                  {p.pdf.pages} {t.project.pages} · {p.pdf.lang.toUpperCase()}
                </span>
                <a href={p.pdf.src} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-red">
                  {t.project.openPdf} ↗
                </a>
              </div>
              <object data={p.pdf.src} type="application/pdf" className="h-[80vh] w-full border border-ink bg-white">
                <a href={p.pdf.src} className="block p-6 underline">
                  {t.project.openPdf}
                </a>
              </object>
            </FadeIn>
          </section>
        )}

        {p.links.length > 0 && (
        <section className="grid gap-6 border-t border-ink py-12 md:grid-cols-12">
          <Label n="↗" className="md:col-span-3">
            {t.project.links}
          </Label>
          <ul className="md:col-span-8 md:col-start-5">
            {p.links.map((l) => (
              <li key={l.href} className="border-b border-ink/20">
                <a href={l.href} target="_blank" rel="noreferrer" className="group flex justify-between py-4 text-lg hover:text-red">
                  {l.label}
                  <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        )}

        <section className="border-t border-ink pt-12">
          {p.gallery.length > 0 && (
            <Label n="✱" className="mb-8">
              {t.project.gallery} · {p.gallery.length}
            </Label>
          )}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {p.gallery.map((g, i) => (
              <FadeIn key={g.src} delay={(i % 4) * 0.06} className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}>
                <button onClick={() => setOpen(i)} className="group block h-full w-full overflow-hidden bg-paper-2 text-left">
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="aspect-[4/3] h-full w-full object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                  />
                </button>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase text-muted">
                  <span>{g.alt}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="mt-10 font-mono text-[10px] uppercase text-muted">
            {t.project.photosBy}
            {p.coverCredit && (
              <>
                {" "}· {t.project.titleImageBy}{" "}
                <a href={p.coverCredit.href} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                  {p.coverCredit.label}
                </a>
              </>
            )}
          </p>
        </section>
      </div>

      <Link to={`/projects/${next.slug}`} className="group block bg-ink px-5 py-16 text-paper md:px-8 md:py-24">
        <div className="font-mono text-[11px] uppercase tracking-wider text-paper/60">{t.project.next}</div>
        <div className="mt-4 font-wide text-5xl font-black uppercase leading-[0.9] tracking-tight transition-colors group-hover:text-red md:text-8xl">
          {next.title}
        </div>
      </Link>

      <Lightbox images={p.gallery} index={open} onChange={setOpen} />
    </article>
  );
}
