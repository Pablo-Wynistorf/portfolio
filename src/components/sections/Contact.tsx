import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BlurFade } from "@/components/ui/blur-fade";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile } from "@/data/content";

const links = [
  { label: "E-Mail", desc: "Get in touch with me via e-mail", href: `mailto:${profile.email}`, icon: Mail },
  { label: "GitHub", desc: "Connect with me on GitHub", href: profile.github, icon: GithubIcon },
  { label: "LinkedIn", desc: "Connect with me on LinkedIn", href: profile.linkedin, icon: LinkedinIcon },
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="contact" className="relative flex min-h-[90vh] items-center overflow-hidden px-6 py-32">
      <BackgroundBeams />
      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <BlurFade inView>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-teal-300/80">06 · Contact</p>
        </BlurFade>
        <BlurFade inView delay={0.1}>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-8xl">
            Let's build
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              something.
            </span>
          </h2>
        </BlurFade>
        <BlurFade inView delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-neutral-400 md:text-lg">
            Do you have a question, a suggestion, or just want to say hello? I'd love to hear from you. Send me an
            e-mail and I'll get back to you as soon as possible. Your thoughts and feedback are always welcome.
          </p>
        </BlurFade>

        <BlurFade inView delay={0.3}>
          <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-2 pl-6 backdrop-blur">
            <a href={`mailto:${profile.email}`} className="font-mono text-lg text-white md:text-2xl">
              {profile.email}
            </a>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                navigator.clipboard?.writeText(profile.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              aria-label="Copy e-mail address"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:bg-teal-200"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </motion.button>
          </div>
        </BlurFade>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          {links.map((l, i) => (
            <BlurFade key={l.label} inView delay={0.35 + i * 0.08}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-neutral-950/60 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/40"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white transition group-hover:bg-teal-300 group-hover:text-black">
                  <l.icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-display font-semibold text-white">{l.label}</span>
                  <span className="block text-xs text-neutral-500">{l.desc}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-neutral-600 transition group-hover:text-white" />
              </a>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
