import { useEffect, useState } from "react";
import { stripLang } from "@/i18n";
import { t } from "@/i18n/t";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/** Loader: a 0→100 counter, then the panel lifts away. Once per session, home only. */
export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(
    () => typeof window !== "undefined" && stripLang(window.location.pathname.replace(/\/+$/, "")) === "/" && !sessionStorage.getItem("intro-seen"),
  );
  const n = useMotionValue(0);
  const label = useTransform(n, (v) => String(Math.round(v)).padStart(3, "0"));
  const width = useTransform(n, (v) => `${v}%`);

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("intro-seen", "1");
    document.documentElement.style.overflow = "hidden";
    const ctl = animate(n, 100, { duration: reduce ? 0.1 : 1.4, ease: [0.65, 0, 0.35, 1] });
    ctl.then(() => setTimeout(() => setShow(false), reduce ? 0 : 150));
    return () => {
      ctl.stop();
      document.documentElement.style.overflow = "";
    };
  }, [show, reduce, n]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink p-5 text-paper md:p-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider text-paper/60">
            <span>Pablo Wynistorf</span>
            <span>{t.intro.portfolio} — {new Date().getFullYear()}</span>
          </div>
          <div>
            <motion.div className="font-wide text-[28vw] font-black leading-[0.8] tracking-[-0.05em] md:text-[18vw]">
              <motion.span>{label}</motion.span>
            </motion.div>
            <div className="mt-6 h-px w-full bg-paper/20">
              <motion.div className="h-full bg-red" style={{ width }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
