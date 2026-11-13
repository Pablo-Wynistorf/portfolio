import { useRef, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Words slide up out of a mask, one after another. */
export function Reveal({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = immediate || inView;
  const words = text.split(" ");
  const M = motion[Tag] as typeof motion.span;
  return (
    <M ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-top">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            animate={show ? { y: 0 } : { y: "105%" }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

/** A plain fade-up for blocks. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li";
}) {
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Image that opens from a thin slit and drifts slower than the page. */
export function ClipImage({
  src,
  alt,
  className,
  imgClassName,
  parallax = 12,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden bg-paper-2", className)}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: 1 + parallax / 50 }}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </motion.div>
  );
}

/** Text whose words go from faint to full ink as it scrolls through the viewport. */
export function ScrollInk({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/** Pulls its child a little toward the pointer. */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={cn("inline-block", className)}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** "(01) About" style label used at the top of each section. */
export function Label({ n, children, className }: { n: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-3 font-mono text-xs uppercase tracking-wider", className)}>
      <span className="text-red">({n})</span>
      <span>{children}</span>
    </div>
  );
}
