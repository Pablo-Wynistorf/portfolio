// Single source for every public page: URL, SEO metadata, Markdown body and
// JSON-LD. Used by gen-md.mjs (writes public/*.md, llms.txt, sitemap, robots)
// and postbuild.mjs (prerenders HTML for crawlers and AI agents).
// Reads src/data/content.ts directly (Node strips the TypeScript types).
import { about, certifications, profile, projects, skills, stats, timeline } from "../src/data/content.ts";

export const SITE = "https://www.pablo.one";
const abs = (p) => (p.startsWith("http") ? p : SITE + p);
const mdUrl = (p) => SITE + p;

const DESCRIPTION =
  "Pablo Wynistorf: Technical Account Manager at AWS, AWS Certified Solutions Architect – Professional, WorldSkills 2024 Medallion for Excellence in Cloud Computing, and network builder for UEFA finals and Openair Frauenfeld.";

const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: profile.name,
  givenName: profile.firstName,
  familyName: profile.lastName,
  url: `${SITE}/`,
  image: abs(profile.avatar),
  email: `mailto:${profile.email}`,
  jobTitle: "Technical Account Manager",
  worksFor: { "@type": "Organization", name: "Amazon Web Services", url: "https://aws.amazon.com" },
  address: { "@type": "PostalAddress", addressCountry: "CH" },
  nationality: { "@type": "Country", name: "Switzerland" },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: skills,
  award: [
    "Medallion for Excellence, WorldSkills Lyon 2024 (Cloud Computing)",
    "2nd place, SwissSkills 2023 (Cloud Computing)",
  ],
  hasCredential: certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.title,
    credentialCategory: c.slug === "worldskills" ? "award" : "certification",
    recognizedBy: { "@type": "Organization", name: c.issuer },
    url: c.credly,
  })),
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: `${SITE}/`,
  name: `${profile.name} · Portfolio`,
  inLanguage: "en",
  publisher: { "@id": `${SITE}/#person` },
};

const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(url) })),
});

const ld = (...graph) => ({ "@context": "https://schema.org", "@graph": graph });

const header = (title, path, mdPath) =>
  [
    `# ${title}`,
    "",
    `> Markdown version of ${SITE}${path} · Index for AI agents: ${SITE}/llms.txt · Full site in one file: ${SITE}/llms-full.txt`,
    "",
  ].join("\n");

const projectLine = (p) => `- [${p.title}](${mdUrl(`/projects/${p.slug}.md`)}): ${p.year}, ${p.location}. ${p.short}`;
const certLine = (c) => `- [${c.title}](${mdUrl(`/certifications/${c.slug}.md`)}): ${c.issuer}, ${c.achieved}.`;

function homeMd() {
  return [
    header(`${profile.name} · ${profile.title}`, "/"),
    `${profile.name} is a **Technical Account Manager at Amazon Web Services (AWS)**, based in Switzerland. ${profile.tagline}`,
    "",
    "## At a glance",
    "",
    "- Current role: Technical Account Manager at AWS",
    "- Background: IT Technician, cloud engineering and event networking",
    "- Certifications: AWS Certified Solutions Architect – Professional (Nov 2024) and – Associate (May 2023)",
    "- Awards: Medallion for Excellence in Cloud Computing at WorldSkills Lyon 2024; 2nd place at SwissSkills 2023",
    "- Event networks: UEFA Conference League Finals 2022 (Tirana) and 2024 (Athens), UEFA Champions League Final 2023 (Istanbul), Openair Frauenfeld 2023 and 2024",
    ...stats.map((s) => `- ${s.value}${s.suffix} ${s.label.toLowerCase()}`),
    "",
    "## About",
    "",
    about.intro,
    "",
    `More: [About me](${mdUrl("/about.md")})`,
    "",
    "## Projects",
    "",
    ...projects.map(projectLine),
    "",
    "## Certifications and awards",
    "",
    ...certifications.map(certLine),
    "",
    "## Journey",
    "",
    ...timeline.map((t) => `- **${t.year}**: ${t.title}. ${t.text}`),
    "",
    "## Skills",
    "",
    skills.join(", "),
    "",
    "## Contact",
    "",
    `- E-mail: [${profile.email}](mailto:${profile.email})`,
    `- GitHub: [${profile.github}](${profile.github})`,
    `- LinkedIn: [${profile.linkedin}](${profile.linkedin})`,
    `- CV (PDF): [${abs(profile.cv)}](${abs(profile.cv)})`,
    `- Chat with an AI version of Pablo: [chat.pablo.one](https://chat.pablo.one)`,
    "",
  ].join("\n");
}

function aboutMd() {
  return [
    header(`About ${profile.name}`, "/p/about-me/"),
    about.intro,
    "",
    about.competition,
    "",
    `Read more: [WorldSkills Lyon 2024](${mdUrl("/projects/worldskills.md")})`,
    "",
    "## Beyond work",
    "",
    ...about.hobbies.map((h) => `- **${h.title}**: ${h.text}${h.link ? ` ([${h.link.label}](${h.link.href}))` : ""}`),
    "",
    about.outro,
    "",
  ].join("\n");
}

function projectMd(p) {
  const out = [
    header(p.title, `/projects/${p.slug}/`),
    `- Year: ${p.year}`,
    `- Location: ${p.location}`,
    `- Type: ${p.category}`,
    `- Tags: ${p.tags.join(", ")}`,
    "",
    `![${p.title}](${abs(p.cover)})`,
    "",
  ];
  for (const s of p.sections) {
    out.push(`## ${s.heading}`, "");
    for (const para of s.body ?? []) out.push(para, "");
    for (const b of s.bullets ?? []) out.push(`- ${b.label ? `**${b.label}**: ` : ""}${b.text}`);
    if (s.bullets) out.push("");
  }
  if (p.video) out.push("## Video", "", `[Best of WorldSkills Lyon 2024 on YouTube](https://www.youtube.com/watch?v=${p.video})`, "");
  out.push("## Links", "", ...p.links.map((l) => `- [${l.label}](${l.href})`), "");
  out.push("## Image gallery", "", ...p.gallery.map((g) => `![${g.alt}](${abs(g.src)})`), "");
  out.push(`Photos by ${profile.name}.${p.coverCredit ? ` Title image by [${p.coverCredit.label}](${p.coverCredit.href}).` : ""}`, "");
  return out.join("\n");
}

function certMd(c) {
  return [
    header(c.title, `/certifications/${c.slug}/`),
    c.body,
    "",
    `- Issuer: ${c.issuer}`,
    `- Date achieved: ${c.achieved}`,
    ...(c.id ? [`- Certification ID: ${c.id}`] : []),
    `- Credly: [View on Credly](${c.credly})`,
    ...(c.extra ?? []).map((l) => `- [${l.label}](${l.href})`),
    ...(c.pdf ? [`- Certificate (PDF): [${abs(c.pdf)}](${abs(c.pdf)})`] : []),
    "",
  ].join("\n");
}

function cvMd() {
  return [
    header(`Curriculum vitae · ${profile.name}`, "/p/cv/"),
    `The full CV is a PDF: [${abs(profile.cv)}](${abs(profile.cv)})`,
    "",
    "## Summary",
    "",
    `- Technical Account Manager at AWS`,
    ...timeline.map((t) => `- ${t.year}: ${t.title}`),
    "",
  ].join("\n");
}

/** Every indexable page. `path` is the canonical HTML path, `md` the Markdown file. */
export function pages() {
  const list = [
    {
      path: "/",
      md: "/index.md",
      title: `${profile.name} · Technical Account Manager at AWS`,
      description: DESCRIPTION,
      image: abs("/media/projects/worlskills-lyon-2024/worldskills-lyon-2024.webp"),
      body: homeMd(),
      jsonld: ld(person, website, { "@type": "ProfilePage", "@id": `${SITE}/#profile`, url: `${SITE}/`, name: `${profile.name}`, mainEntity: { "@id": `${SITE}/#person` }, isPartOf: { "@id": `${SITE}/#website` } }),
      priority: "1.0",
    },
    {
      path: "/p/about-me/",
      // the app shows About as a section of the home page, so this URL points search engines there
      canonical: "/",
      sitemap: false,
      md: "/about.md",
      title: `About ${profile.name}`,
      description: `${about.intro} ${about.competition}`.slice(0, 158).replace(/\s\S*$/, "") + "…",
      image: abs(profile.banner),
      body: aboutMd(),
      jsonld: ld({ "@type": "AboutPage", url: `${SITE}/p/about-me/`, name: `About ${profile.name}`, mainEntity: person }, crumbs([["Home", "/"], ["About", "/p/about-me/"]])),
      priority: "0.8",
    },
    {
      path: "/p/cv/",
      md: "/cv.md",
      title: `Curriculum vitae · ${profile.name}`,
      description: `Curriculum vitae of ${profile.name}, Technical Account Manager at AWS. Download the PDF.`,
      image: abs(profile.avatar),
      body: cvMd(),
      jsonld: ld({ "@type": "WebPage", url: `${SITE}/p/cv/`, name: "Curriculum vitae", about: { "@id": `${SITE}/#person` } }, crumbs([["Home", "/"], ["CV", "/p/cv/"]])),
      priority: "0.7",
    },
    ...projects.map((p) => ({
      path: `/projects/${p.slug}/`,
      md: `/projects/${p.slug}.md`,
      title: `${p.title} · ${profile.name}`,
      description: `${p.short} ${p.location}, ${p.year}.`.slice(0, 160),
      image: abs(p.cover),
      body: projectMd(p),
      jsonld: ld(
        {
          "@type": "CreativeWork",
          name: p.title,
          url: `${SITE}/projects/${p.slug}/`,
          description: p.short,
          image: [abs(p.cover), ...p.gallery.slice(0, 5).map((g) => abs(g.src))],
          dateCreated: p.year,
          keywords: p.tags.join(", "),
          locationCreated: { "@type": "Place", name: p.location, geo: { "@type": "GeoCoordinates", latitude: p.coords[0], longitude: p.coords[1] } },
          creator: { "@id": `${SITE}/#person` }
        },
        crumbs([["Home", "/"], [p.title, `/projects/${p.slug}/`]]),
      ),
      priority: "0.8",
    })),
    ...certifications.map((c) => ({
      path: `/certifications/${c.slug}/`,
      md: `/certifications/${c.slug}.md`,
      title: `${c.title} · ${profile.name}`,
      description: `${c.title}, ${c.issuer}, ${c.achieved}. ${c.body}`.slice(0, 160).replace(/\s\S*$/, "") + "…",
      image: abs(c.image),
      body: certMd(c),
      jsonld: ld(
        {
          "@type": "EducationalOccupationalCredential",
          name: c.title,
          url: `${SITE}/certifications/${c.slug}/`,
          credentialCategory: c.slug === "worldskills" ? "award" : "certification",
          recognizedBy: { "@type": "Organization", name: c.issuer },
          about: { "@id": `${SITE}/#person` },
          sameAs: c.credly,
        },
        crumbs([["Home", "/"], [c.title, `/certifications/${c.slug}/`]]),
      ),
      priority: "0.6",
    })),
  ];
  return list;
}

/** llms.txt per https://llmstxt.org */
export function llmsTxt(list) {
  const by = (prefix) => list.filter((p) => p.path.startsWith(prefix));
  const line = (p) => `- [${p.title.replace(/ · Pablo Wynistorf$/, "")}](${SITE}${p.md}): ${p.description}`;
  return [
    `# ${profile.name}`,
    "",
    `> ${DESCRIPTION}`,
    "",
    "Every page of this site has a Markdown twin: append `.md` to a project or certification path (for example /projects/worldskills.md), or use the links below. The HTML pages are a JavaScript app; prefer the Markdown files.",
    "",
    "## Main",
    "",
    line(list[0]),
    line(list[1]),
    line(list[2]),
    "",
    "## Projects",
    "",
    ...by("/projects/").map(line),
    "",
    "## Certifications",
    "",
    ...by("/certifications/").map(line),
    "",
    "## Optional",
    "",
    `- [Full site in one file](${SITE}/llms-full.txt): all pages above concatenated`,
    `- [Ask an AI version of Pablo](https://chat.pablo.one): chatbot grounded in this site, GitHub and LinkedIn`,
    `- [GitHub](${profile.github})`,
    `- [LinkedIn](${profile.linkedin})`,
    "",
  ].join("\n");
}
