import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Company } from "@/components/sections/Company";
import { useSeo } from "@/lib/seo";
import { t } from "@/i18n/t";

export default function Home() {
  useSeo({
    title: t.seo.homeTitle,
    description: t.seo.homeDescription,
    path: "/",
  });
  return (
    <>
      <Hero />
      <Skills />
      <About />
      <Projects />
      <Company />
      <Journey />
      <Certifications />
      <Contact />
    </>
  );
}
