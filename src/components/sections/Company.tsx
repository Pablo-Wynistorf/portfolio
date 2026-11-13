import { FadeIn, Label, Reveal } from "@/components/motion";
import { company } from "@/data/content";

export function Company() {
  return (
    <section id="company" className="border-t border-ink px-5 py-24 md:px-8 md:py-36">
      <div className="mb-16 grid gap-6 md:grid-cols-12">
        <Label n="02.2" className="md:col-span-3">
          Company
        </Label>
        <div className="md:col-span-9">
          <Reveal
            as="h2"
            text="Founder, Nextenic GmbH."
            className="font-wide text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl"
          />
          <p className="mt-8 max-w-xl text-lg text-muted">
            {company.summary} {company.place}, since {company.founded}.
          </p>
          <a
            href={company.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex border-b border-ink pb-0.5 text-sm font-medium hover:border-red hover:text-red"
          >
            nextenic.com ↗
          </a>
        </div>
      </div>

      <div className="grid border-t border-ink md:grid-cols-2">
        {company.products.map((p, i) => (
          <FadeIn key={p.name} delay={i * 0.08} className="border-b border-ink md:border-b-0 md:odd:border-r">
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-ink hover:text-paper md:p-10"
            >
              <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider">
                <span className="text-red">0{i + 1}</span>
                <span className="text-muted group-hover:text-paper/60">{p.kind}</span>
              </div>
              <h3 className="mt-10 font-wide text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                {p.name}
              </h3>
              <p className="mt-6 max-w-lg leading-relaxed text-ink-2 group-hover:text-paper/80">{p.text}</p>
              <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase">
                {p.tags.map((t) => (
                  <span key={t} className="border border-current px-2 py-1">
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-auto pt-10 text-sm font-medium">
                <span className="border-b border-current pb-0.5">{p.url.replace("https://", "")}</span> ↗
              </span>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
