import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { useSeo } from "@/lib/seo";

export default function Home() {
  useSeo({
    title: "Pablo Wynistorf · Technical Account Manager at AWS",
    description:
      "Pablo Wynistorf: Technical Account Manager at AWS, AWS Certified Solutions Architect – Professional, WorldSkills 2024 Medallion for Excellence in Cloud Computing, and network builder for UEFA finals and Openair Frauenfeld.",
    path: "/",
  });
  return (
    <>
      <Hero />
      <Skills />
      <About />
      <Projects />
      <Journey />
      <Certifications />
      <Contact />
    </>
  );
}
