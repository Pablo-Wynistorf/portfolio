import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Award, FileText, FolderGit2, Home, Mail, Route, User } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile } from "@/data/content";
import { cn } from "@/lib/utils";

const items = [
  { to: "/#top", label: "Home", icon: Home },
  { to: "/#about", label: "About", icon: User },
  { to: "/#journey", label: "Journey", icon: Route },
  { to: "/#projects", label: "Projects", icon: FolderGit2 },
  { to: "/#certifications", label: "Certifications", icon: Award },
  { to: "/p/cv", label: "CV", icon: FileText },
  { to: "/#contact", label: "Contact", icon: Mail },
];

const external = [
  { href: profile.github, label: "GitHub", icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedinIcon },
];

function Tip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md border border-white/10 bg-neutral-900/90 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
      {label}
    </span>
  );
}

export function Nav() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollProgress className="top-0 z-[60] h-[2px] bg-gradient-to-r from-teal-300 via-sky-400 to-fuchsia-500" />

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10"
      >
        <Link to="/#top" className="group flex items-center gap-3">
          <img
            src={profile.avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-teal-300/60"
          />
          <span className="font-display text-sm font-semibold tracking-wide text-white/90">
            pablo<span className="text-teal-300">.one</span>
          </span>
        </Link>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/80 backdrop-blur-md transition hover:border-teal-300/50 hover:text-white"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle" />
          Get in touch
        </a>
      </motion.header>

      <motion.nav
        aria-label="Main"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 16 }}
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
      >
        <Dock
          iconMagnification={64}
          iconDistance={120}
          className="mt-0 h-14 border-white/10 bg-neutral-950/70 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/p/cv" ? pathname.startsWith("/p/cv") : false;
            return (
              <DockIcon key={label} className="group relative">
                <Link
                  to={to}
                  aria-label={label}
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/10 hover:text-white",
                    active && "bg-white/10 text-teal-300",
                  )}
                >
                  <Icon className="h-[45%] w-[45%]" />
                </Link>
                <Tip label={label} />
              </DockIcon>
            );
          })}
          <div className="mx-1 hidden h-8 w-px self-center bg-white/10 sm:block" />
          {external.map(({ href, label, icon: Icon }) => (
            <DockIcon key={label} className="group relative hidden sm:flex">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-full w-full items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-[45%] w-[45%]" />
              </a>
              <Tip label={label} />
            </DockIcon>
          ))}
        </Dock>
      </motion.nav>
    </>
  );
}
