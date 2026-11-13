import { Link } from "react-router";
import { ClipImage, FadeIn, Label, Reveal, ScrollInk } from "@/components/motion";
import { about, profile } from "@/data/content";
import { t } from "@/i18n/t";

export function About() {
  return (
    <section id="about" className="px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-10 md:grid-cols-12">
        <Label n="01" className="md:col-span-3">
          {t.about.label}
        </Label>
        <div className="md:col-span-9">
          <ScrollInk
            text={about.intro}
            className="text-3xl font-medium leading-[1.1] tracking-tight md:text-6xl"
          />
        </div>
      </div>

      <div className="mt-20 grid gap-10 md:mt-32 md:grid-cols-12">
        <ClipImage src={profile.banner} alt={profile.name} className="aspect-[16/7] md:col-span-12" imgClassName="grayscale-[30%]" />
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="font-serif text-3xl italic leading-tight">{t.about.tagline}</p>
        </div>
        <FadeIn className="md:col-span-5 md:col-start-5">
          <p className="text-lg leading-relaxed">{about.competition}</p>
          <Link
            to="/projects/worldskills"
            className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-sm font-medium hover:border-red hover:text-red"
          >
            {t.about.readWs}
          </Link>
        </FadeIn>
      </div>

      <div className="mt-24 md:mt-36">
        <div className="grid gap-6 border-b border-ink pb-4 md:grid-cols-12">
          <Label n="01.1" className="md:col-span-3">
            {t.about.beyond}
          </Label>
          <Reveal as="h3" text={t.about.beyondTitle} className="font-wide text-3xl font-bold uppercase leading-none tracking-tight md:col-span-9 md:text-5xl" />
        </div>
        <ol>
          {about.hobbies.map((h, i) => (
            <FadeIn as="li" key={h.title} delay={i * 0.04} y={12} className="group grid items-baseline gap-2 border-b border-ink py-6 md:grid-cols-12">
                <span className="font-mono text-xs text-muted md:col-span-1">0{i + 1}</span>
                <span className="font-wide text-2xl font-bold uppercase tracking-tight transition-colors group-hover:text-red md:col-span-4 md:text-3xl">
                  {h.title}
                </span>
                <span className="text-muted md:col-span-5 md:col-start-7">{h.text}</span>
                {h.link ? (
                  <a href={h.link.href} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase underline underline-offset-4 hover:text-red md:col-span-2 md:text-right">
                    {h.link.label} ↗
                  </a>
                ) : (
                  <span className="md:col-span-2" />
                )}
            </FadeIn>
          ))}
        </ol>
        <p className="mt-10 max-w-xl text-muted md:ml-[25%]">{about.outro}</p>
      </div>
    </section>
  );
}
