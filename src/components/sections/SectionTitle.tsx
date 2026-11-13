import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  sub,
  className,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-14", center && "text-center", className)}>
      <BlurFade inView>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-teal-300/80">{eyebrow}</p>
      </BlurFade>
      <BlurFade inView delay={0.1}>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">{title}</h2>
      </BlurFade>
      {sub && (
        <BlurFade inView delay={0.2}>
          <p className={cn("mt-5 max-w-2xl text-neutral-400 md:text-lg", center && "mx-auto")}>{sub}</p>
        </BlurFade>
      )}
    </div>
  );
}
