import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const NAME = "PABLO WYNISTORF";

/** A short curtain intro, shown once per browser session on the home page. */
export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/" && !sessionStorage.getItem("intro-seen");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("intro-seen", "1");
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), reduce ? 200 : 1900);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [show, reduce]);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030305]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex overflow-hidden font-display text-3xl font-bold tracking-[0.3em] text-white md:text-6xl">
            {NAME.split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={c === " " ? "w-4 md:w-8" : ""}
              >
                {c}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="absolute bottom-1/3 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
