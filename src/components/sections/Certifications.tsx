import { Link } from "react-router";
import { FadeIn, Label, Reveal } from "@/components/motion";
import { certifications } from "@/data/content";
import { t } from "@/i18n/t";

export function Certifications() {
  return (
    <section id="certifications" className="border-t border-ink px-5 py-24 md:px-8 md:py-36">
      <div className="mb-16 grid gap-6 md:grid-cols-12">
        <Label n="04" className="md:col-span-3">
          {t.certs.label}
        </Label>
        <Reveal
          as="h2"
          text={t.certs.title}
          className="font-wide text-5xl font-black uppercase leading-[0.9] tracking-tight md:col-span-9 md:text-8xl"
        />
      </div>

      <div className="grid border-t border-ink md:grid-cols-3">
        {certifications.map((c, i) => (
          <FadeIn key={c.slug} delay={i * 0.08} className="border-b border-ink md:border-b-0 md:border-r md:last:border-r-0">
            <Link
              to={`/certifications/${c.slug}`}
              className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-ink hover:text-paper md:p-8"
            >
              <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider">
                <span className="text-red">0{i + 1}</span>
                <span className="text-muted group-hover:text-paper/60">{c.achieved}</span>
              </div>
              <div className="my-10 flex h-36 items-center justify-center overflow-hidden">
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className={
                    c.slug === "worldskills"
                      ? "h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
                      : "h-24 object-contain grayscale transition duration-700 group-hover:grayscale-0"
                  }
                />
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted group-hover:text-paper/60">{c.issuer}</div>
              <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">{c.title}</h3>
              <span className="mt-auto pt-8 text-sm font-medium">
                <span className="border-b border-current pb-0.5">{t.certs.details}</span> →
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
