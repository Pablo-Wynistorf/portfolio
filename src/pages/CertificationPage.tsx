import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { certifications } from "@/data/content";
import NotFound from "./NotFound";

export default function CertificationPage() {
  const { slug } = useParams();
  const c = certifications.find((x) => x.slug === slug);

  useEffect(() => {
    if (c) document.title = `${c.title} · Pablo Wynistorf`;
  }, [c]);

  if (!c) return <NotFound />;
  const isMedal = c.slug === "worldskills";

  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <BlurFade>
        <Link to="/#certifications" className="mb-10 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All certifications
        </Link>
      </BlurFade>

      <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
        <CardContainer containerClassName="py-0">
          <CardBody className="relative h-auto w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8">
            <CardItem translateZ="80" className="w-full">
              <img
                src={c.image}
                alt={c.title}
                className={isMedal ? "aspect-[4/3] w-full rounded-2xl object-cover" : "mx-auto h-56 object-contain"}
              />
            </CardItem>
            <BorderBeam size={200} duration={8} colorFrom="#2dd4bf" colorTo="#a78bfa" />
          </CardBody>
        </CardContainer>

        <div>
          <BlurFade delay={0.1}>
            <div className="mb-4 inline-flex items-center gap-2 text-sm text-teal-300">
              <BadgeCheck className="h-4 w-4" /> {c.issuer}
            </div>
          </BlurFade>
          <BlurFade delay={0.15}>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">{c.title}</h1>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-neutral-400">{c.body}</p>
          </BlurFade>
          <BlurFade delay={0.25}>
            <dl className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-neutral-500">Date achieved</dt>
                <dd className="mt-1 font-medium text-white">{c.achieved}</dd>
              </div>
              {c.id && (
                <div>
                  <dt className="text-neutral-500">Certification ID</dt>
                  <dd className="mt-1 break-all font-mono text-white">{c.id}</dd>
                </div>
              )}
            </dl>
          </BlurFade>
          <BlurFade delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              {[{ label: "View on Credly", href: c.credly }, ...(c.extra ?? [])].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white transition hover:border-teal-300/50 hover:bg-white/5"
                >
                  {l.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
              {isMedal && (
                <Link
                  to="/projects/worldskills"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-teal-200"
                >
                  My WorldSkills story <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </BlurFade>
        </div>
      </div>

      {c.pdf && (
        <BlurFade inView className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold text-white">Certificate</h2>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white">
            <object data={c.pdf} type="application/pdf" className="h-[80vh] w-full">
              <a href={c.pdf} className="block p-6 text-black underline">
                Download the certificate (PDF)
              </a>
            </object>
          </div>
        </BlurFade>
      )}
    </article>
  );
}
