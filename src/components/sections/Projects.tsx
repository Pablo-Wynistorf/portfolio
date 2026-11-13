import { Link } from "react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionTitle } from "./SectionTitle";
import { allPhotos, projects } from "@/data/content";

export function Projects() {
  // 15 photos for the parallax wall, spread across all projects
  const wall = Array.from({ length: 15 }, (_, i) => allPhotos[(i * 7) % allPhotos.length]).map((p) => ({
    title: p.project.title,
    link: `/projects/${p.project.slug}`,
    thumbnail: p.src,
  }));

  return (
    <section id="projects" className="relative">
      <HeroParallax
        products={wall}
        header={
          <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-6 py-20 md:py-32">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-teal-300/80">03 · Projects</p>
            <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-8xl">
              Built on site. <br />
              <span className="bg-gradient-to-r from-teal-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                Under pressure.
              </span>
            </h2>
            <p className="mt-8 max-w-2xl text-base text-neutral-400 md:text-xl">
              Stadium networks for UEFA finals, festival-wide infrastructure at Openair Frauenfeld, and the cloud
              competition of a lifetime in Lyon.
            </p>
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-6 pb-32">
        <SectionTitle eyebrow="All projects" title="Pick one." />
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <BlurFade key={p.slug} inView delay={(i % 2) * 0.1}>
              <Link to={`/projects/${p.slug}`} className="block">
                <CardContainer containerClassName="py-0" className="w-full">
                  <CardBody className="group/card relative h-auto w-full rounded-3xl border border-white/10 bg-neutral-950 p-5 transition-colors hover:border-teal-300/30 hover:shadow-[0_0_80px_-20px_rgba(45,212,191,0.4)]">
                    <CardItem translateZ="40" className="flex w-full items-center justify-between text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {p.location}
                      </span>
                      <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono">{p.year}</span>
                    </CardItem>
                    <CardItem translateZ="60" className="mt-3 font-display text-2xl font-bold text-white">
                      {p.title}
                    </CardItem>
                    <CardItem as="p" translateZ="50" className="mt-2 text-sm text-neutral-400">
                      {p.short}
                    </CardItem>
                    <CardItem translateZ="100" rotateX={6} className="mt-5 w-full overflow-hidden rounded-2xl">
                      <img
                        src={p.cover}
                        alt={p.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition duration-700 group-hover/card:scale-105"
                      />
                    </CardItem>
                    <CardItem translateZ="40" className="mt-5 flex w-full items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-neutral-400">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-teal-300">
                        Open <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
