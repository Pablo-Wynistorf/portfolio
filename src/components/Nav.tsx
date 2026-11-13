import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Clock } from "@/components/Clock";
import { openChat } from "@/components/chat/ChatWidget";
import { profile } from "@/data/content";
import { t } from "@/i18n/t";
import { LANGS, lang, switchLang } from "@/i18n";

const navLinks = () => [
  { to: "/#about", label: t.nav.about },
  { to: "/#work", label: t.nav.work },
  { to: "/#journey", label: t.nav.journey },
  { to: "/#certifications", label: t.nav.certifications },
  { to: "/p/cv", label: t.nav.cv },
  { to: "/#contact", label: t.nav.contact },
  { to: "/md", label: t.nav.md },
];

/** EN · DE · FR · IT. Picking one reloads the same page in that language and remembers it. */
export function LangSwitch({ className = "" }: { className?: string }) {
  return (
    <div role="group" aria-label={t.nav.language} className={`flex gap-2 ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => l !== lang && switchLang(l)}
          aria-current={l === lang ? "true" : undefined}
          lang={l}
          className={l === lang ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function RollLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="group relative inline-block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{label}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full text-red transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
        {label}
      </span>
    </Link>
  );
}

export function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const links = navLinks();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 400 && y > prev);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <ScrollProgress className="top-0 z-[60] h-[2px] bg-red" />

      <motion.header
        animate={{ y: hidden && !open ? "-110%" : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
      >
        <div className="grid grid-cols-2 items-center px-5 py-4 font-mono text-[11px] uppercase tracking-wider md:grid-cols-[1fr_auto_1fr] md:px-8">
          <Link to="/#top" className="justify-self-start font-sans text-sm font-semibold normal-case tracking-normal">
            {profile.name}
          </Link>
          <nav aria-label="Main" className="hidden gap-7 md:flex">
            {links.map((l) => (
              <RollLink key={l.label} {...l} />
            ))}
          </nav>
          <div className="flex items-center justify-self-end gap-5">
            <LangSwitch className="hidden md:flex" />
            <Clock className="hidden xl:inline" />
            <button onClick={() => openChat()} className="hidden underline-offset-4 hover:underline md:inline">
              {t.nav.askAi}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={t.nav.menu}
              className="flex h-8 items-center gap-2 md:hidden"
            >
              {open ? t.nav.close : t.nav.menu}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-8 pt-24 text-paper md:hidden"
          >
            <nav className="flex flex-col">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-paper/15 py-3"
                >
                  <Link to={l.to} className="flex items-baseline justify-between gap-3 font-wide text-[clamp(1.35rem,7.2vw,2.25rem)] font-bold uppercase [overflow-wrap:anywhere]">
                    {l.label}
                    <span className="shrink-0 font-mono text-xs font-normal text-paper/50">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col items-start gap-5 font-mono text-xs uppercase">
              <LangSwitch className="gap-4 text-sm" />
              <button
                onClick={() => {
                  setOpen(false);
                  openChat();
                }}
                className="text-red"
              >
                {t.nav.askAi} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
