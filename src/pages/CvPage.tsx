import { useEffect } from "react";
import { FadeIn, Reveal } from "@/components/motion";
import { profile } from "@/data/content";

export default function CvPage() {
  useEffect(() => {
    document.title = "Curriculum vitae · Pablo Wynistorf";
  }, []);
  return (
    <section className="px-5 pb-24 pt-24 md:px-8">
      <div className="font-mono text-[11px] uppercase tracking-wider">
        <span className="text-red">(CV)</span> Curriculum vitae
      </div>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-8">
        <Reveal
          as="h1"
          immediate
          text="Curriculum vitae"
          className="font-wide text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl"
        />
        <a
          href={profile.cv}
          download
          className="rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-red"
        >
          Download PDF ↓
        </a>
      </div>
      <FadeIn className="mt-10">
        <object data={profile.cv} type="application/pdf" className="h-[90vh] w-full border border-ink bg-white">
          <a href={profile.cv} className="block p-6 underline">
            Download the CV (PDF)
          </a>
        </object>
      </FadeIn>
    </section>
  );
}
