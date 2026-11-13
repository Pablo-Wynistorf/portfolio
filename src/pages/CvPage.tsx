import { useEffect } from "react";
import { Download } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { profile } from "@/data/content";

export default function CvPage() {
  useEffect(() => {
    document.title = "Curriculum vitae · Pablo Wynistorf";
  }, []);
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <BlurFade>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-teal-300/80">Curriculum vitae</p>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">Take a look at my CV.</h1>
          </BlurFade>
        </div>
        <BlurFade delay={0.2}>
          <a href={profile.cv} download>
            <ShimmerButton shimmerColor="#5eead4" background="rgba(10,10,14,1)" className="gap-2 px-6 py-3 text-sm">
              <Download className="h-4 w-4" /> Download PDF
            </ShimmerButton>
          </a>
        </BlurFade>
      </div>
      <BlurFade delay={0.3}>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_0_120px_-30px_rgba(45,212,191,0.35)]">
          <object data={profile.cv} type="application/pdf" className="h-[85vh] w-full">
            <a href={profile.cv} className="block p-6 text-black underline">
              Download the CV (PDF)
            </a>
          </object>
        </div>
      </BlurFade>
    </section>
  );
}
