import { Globe } from "@/components/ui/globe";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionTitle } from "./SectionTitle";
import { places } from "@/data/content";

export function World() {
  return (
    <section id="world" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <SectionTitle
            eyebrow="05 · On the map"
            title="Where I've built."
            sub="Stadiums, festival grounds and competition halls across Europe."
            className="mb-8"
          />
          <div className="flex flex-wrap gap-2">
            {places.map((p, i) => (
              <BlurFade key={p.name} inView delay={i * 0.06}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-300" />
                  </span>
                  {p.name}
                </span>
              </BlurFade>
            ))}
          </div>
        </div>
        <div className="relative aspect-square w-full">
          <div className="absolute inset-[15%] rounded-full bg-teal-400/10 blur-3xl" />
          <Globe
            className="!static mx-auto"
            config={{
              width: 800,
              height: 800,
              onRender: () => {},
              devicePixelRatio: 2,
              phi: 0,
              theta: 0.55,
              dark: 1,
              diffuse: 1.2,
              mapSamples: 16000,
              mapBrightness: 5,
              baseColor: [0.2, 0.22, 0.26],
              markerColor: [45 / 255, 212 / 255, 191 / 255],
              glowColor: [0.15, 0.35, 0.35],
              markers: places.map((p) => ({ location: p.coords, size: 0.07 })),
            }}
          />
        </div>
      </div>
    </section>
  );
}
