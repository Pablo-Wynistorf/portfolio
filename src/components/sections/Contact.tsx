import { useState } from "react";
import { Magnetic, Reveal } from "@/components/motion";
import { openChat } from "@/components/chat/ChatWidget";
import { profile } from "@/data/content";
import { t } from "@/i18n/t";

const links = () => [
  { label: t.contact.email, href: `mailto:${profile.email}` },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="contact" className="bg-ink px-5 pb-10 pt-24 text-paper md:px-8 md:pt-36">
      <div className="mb-12 flex items-baseline gap-3 font-mono text-xs uppercase tracking-wider">
        <span className="text-red">(05)</span> {t.contact.label}
      </div>

      <Reveal
        as="h2"
        text={t.contact.title}
        className="font-wide text-[19vw] font-black uppercase leading-[0.8] tracking-[-0.04em] md:text-[15vw]"
      />

      <div className="mt-16 grid gap-12 border-t border-paper/20 pt-10 md:grid-cols-12">
        <p className="text-lg leading-relaxed text-paper/70 md:col-span-5">
          {t.contact.text}
        </p>
        <div className="md:col-span-6 md:col-start-7">
          <div className="flex flex-wrap items-center gap-4">
            <a href={`mailto:${profile.email}`} className="text-3xl font-medium tracking-tight underline decoration-red decoration-2 underline-offset-8 hover:text-red md:text-5xl">
              {profile.email}
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(profile.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="font-mono text-xs uppercase text-paper/60 hover:text-paper"
            >
              {copied ? t.contact.copied : t.contact.copy}
            </button>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {links().map((l) => (
              <Magnetic key={l.label} strength={0.25}>
                <a
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="inline-block rounded-full border border-paper/30 px-6 py-3 text-sm font-medium transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                >
                  {l.label} ↗
                </a>
              </Magnetic>
            ))}
            <Magnetic strength={0.25}>
              <button
                onClick={() => openChat()}
                className="inline-block rounded-full bg-red px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                {t.nav.askAi}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
