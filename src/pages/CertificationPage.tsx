import { Link, useParams } from "react-router";
import { FadeIn, Label, Reveal } from "@/components/motion";
import { certifications } from "@/data/content";
import NotFound from "./NotFound";
import { useSeo } from "@/lib/seo";

export default function CertificationPage() {
  const { slug } = useParams();
  const c = certifications.find((x) => x.slug === slug);

  useSeo({
    title: c ? `${c.title} · Pablo Wynistorf` : "Not found · Pablo Wynistorf",
    description: c ? `${c.title}, ${c.issuer}, ${c.achieved}.` : undefined,
    path: `/certifications/${slug}`,
  });

  if (!c) return <NotFound />;
  const isMedal = c.slug === "worldskills";
  const links = [{ label: "View on Credly", href: c.credly }, ...(c.extra ?? [])];

  return (
    <article className="px-5 pb-24 pt-24 md:px-8">
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider">
        <Link to="/#certifications" className="hover:text-red">
          ← Certifications
        </Link>
        <Link to={`/md/certifications/${c.slug}`} className="hover:text-red">
          View as Markdown
        </Link>
      </div>

      <Reveal
        as="h1"
        immediate
        text={c.title}
        className="mt-10 block max-w-6xl font-wide text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl"
      />

      <div className="mt-14 grid gap-10 border-t border-ink pt-10 md:grid-cols-12">
        <FadeIn className="md:col-span-5">
          <div className={isMedal ? "overflow-hidden bg-paper-2" : "flex aspect-[4/3] items-center justify-center bg-paper-2 p-10"}>
            <img src={c.image} alt={c.title} className={isMedal ? "aspect-[4/3] w-full object-cover" : "max-h-40 object-contain"} />
          </div>
        </FadeIn>

        <div className="md:col-span-6 md:col-start-7">
          <FadeIn>
            <p className="text-2xl leading-snug tracking-tight md:text-3xl">{c.body}</p>
          </FadeIn>
          <dl className="mt-10 grid grid-cols-2 gap-y-4 border-t border-ink pt-3 font-mono text-[11px] uppercase tracking-wider">
            <div>
              <dt className="text-muted">Issuer</dt>
              <dd>{c.issuer}</dd>
            </div>
            <div>
              <dt className="text-muted">Achieved</dt>
              <dd>{c.achieved}</dd>
            </div>
            {c.id && (
              <div className="col-span-2">
                <dt className="text-muted">Certification ID</dt>
                <dd className="break-all normal-case">{c.id}</dd>
              </div>
            )}
          </dl>
          <ul className="mt-10 border-t border-ink">
            {links.map((l) => (
              <li key={l.href} className="border-b border-ink/20">
                <a href={l.href} target="_blank" rel="noreferrer" className="flex justify-between py-4 text-lg hover:text-red">
                  {l.label} <span>↗</span>
                </a>
              </li>
            ))}
            {isMedal && (
              <li className="border-b border-ink/20">
                <Link to="/projects/worldskills" className="flex justify-between py-4 text-lg hover:text-red">
                  My WorldSkills story <span>→</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {c.pdf && (
        <section className="mt-24 border-t border-ink pt-10">
          <Label n="PDF" className="mb-8">
            Certificate
          </Label>
          <FadeIn>
            <object data={c.pdf} type="application/pdf" className="h-[80vh] w-full border border-ink bg-white">
              <a href={c.pdf} className="block p-6 underline">
                Download the certificate (PDF)
              </a>
            </object>
          </FadeIn>
        </section>
      )}
    </article>
  );
}
