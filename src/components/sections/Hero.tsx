import { useRef } from "react";
import { Link } from "react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, Download, Sparkles } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { Spotlight } from "@/components/ui/spotlight-new";
import { AuroraText } from "@/components/ui/aurora-text";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { TextAnimate } from "@/components/ui/text-animate";
import { profile } from "@/data/content";

const AURORA = ["#2dd4bf", "#38bdf8", "#a78bfa", "#f472b6"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // 3D tilt for the portrait
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-24"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <Particles className="absolute inset-0" quantity={140} ease={70} color="#99f6e4" refresh />
      </div>
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(170, 100%, 85%, .10) 0, hsla(170, 100%, 55%, .03) 50%, hsla(170, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(200, 100%, 85%, .07) 0, hsla(200, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(280, 100%, 85%, .05) 0, hsla(280, 100%, 45%, .02) 80%, transparent 100%)"
      />

      <motion.div style={{ y, scale, opacity: fade }} className="mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-[1.25fr_1fr]">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/5 px-4 py-1.5 text-xs text-teal-200 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            WorldSkills 2024 · Medallion for Excellence
          </motion.div>

          <h1 className="font-display text-6xl font-bold leading-[0.9] tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            <TextAnimate as="span" by="character" animation="blurInUp" duration={0.8} once className="block">
              {profile.firstName}
            </TextAnimate>
            <AuroraText colors={AURORA} speed={1.2} className="block">
              {profile.lastName}
            </AuroraText>
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 text-xl text-neutral-400 md:text-2xl">
            <span>I'm an</span>
            <WordRotate
              words={profile.roles}
              duration={2600}
              className="font-display font-semibold text-white"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/#projects">
              <ShimmerButton
                shimmerColor="#5eead4"
                background="rgba(10,10,14,1)"
                className="px-7 py-3.5 text-sm font-medium"
              >
                See my work
              </ShimmerButton>
            </Link>
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
            >
              <Download className="h-4 w-4 transition group-hover:translate-y-0.5" />
              Download CV
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
          className="relative mx-auto aspect-square w-64 sm:w-80 md:w-full md:max-w-sm"
        >
          <div className="absolute -inset-10 animate-[spin_18s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#2dd4bf33,#38bdf833,#a78bfa33,#f472b633,#2dd4bf33)] blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900">
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <BorderBeam size={180} duration={8} colorFrom="#2dd4bf" colorTo="#a78bfa" borderWidth={2} />
            <BorderBeam size={180} duration={8} delay={4} colorFrom="#f472b6" colorTo="#38bdf8" borderWidth={2} />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 bottom-10 rounded-2xl border border-white/10 bg-neutral-950/80 px-4 py-3 text-xs backdrop-blur-xl"
          >
            <div className="text-neutral-400">AWS Certified</div>
            <div className="font-display text-sm font-semibold text-white">Solutions Architect Pro</div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 top-8 rounded-2xl border border-white/10 bg-neutral-950/80 px-4 py-3 text-xs backdrop-blur-xl"
          >
            <div className="text-neutral-400">Networks for</div>
            <div className="font-display text-sm font-semibold text-white">3 UEFA finals</div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        style={{ opacity: fade }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 text-neutral-500 hover:text-white md:block"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
