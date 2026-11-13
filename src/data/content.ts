const m = (p: string) => `/media/${p}`;

export const profile = {
  name: "Pablo Wynistorf",
  firstName: "Pablo",
  lastName: "Wynistorf",
  title: "Technical Account Manager, AWS",
  roles: [
    "a Technical Account Manager at AWS",
    "an IT Technician",
    "a Cloud Engineer",
    "an AWS Solutions Architect",
    "a WorldSkills Medallist",
    "an Event Network Builder",
  ],
  tagline:
    "I design cloud infrastructure on AWS and build the networks behind Europe's biggest football finals and festivals.",
  avatar: m("avatar/avatar.webp"),
  banner: m("about/pablo-wynistorf.webp"),
  email: "mail@pablo.one",
  github: "https://github.com/Pablo-Wynistorf",
  githubRepos: "https://github.com/Pablo-Wynistorf?tab=repositories",
  linkedin: "https://www.linkedin.com/in/pablo-wynistorf/",
  cv: m("cv/Resume_Pablo_Wynistorf.pdf"),
  since: 2024,
};

export const about = {
  intro:
    "Hi, I'm Pablo Wynistorf. I love technology, I follow a wide range of IT projects, and I compete in cloud computing on the world stage.",
  competition:
    "At SwissSkills 2023 I reached second place in Cloud Computing. After an assessment between the best competitors of 2022 and 2023, the SwissSkills committee selected me for WorldSkills 2024 in Lyon, where I received the Medallion for Excellence for my skills in cloud computing on AWS.",
  outro:
    "This mix of activities shapes a well-rounded lifestyle. It reflects not only professional work but also a commitment to a satisfying life beyond it.",
  hobbies: [
    {
      icon: "dumbbell",
      title: "Fitness",
      text: "A consistent gym routine up to five times a week keeps me healthy and gives me a sense of accomplishment.",
    },
    {
      icon: "cpu",
      title: "Computer science",
      text: "I follow a wide range of IT projects. It feeds my passion for technology and innovation.",
      link: { label: "My repositories", href: "https://github.com/Pablo-Wynistorf?tab=repositories" },
    },
    {
      icon: "plane",
      title: "Drones & nature",
      text: "Flying my drone to capture beautiful shots, or just a peaceful walk. Nature is where I find calm and inspiration.",
    },
    {
      icon: "chef-hat",
      title: "Cooking & baking",
      text: "The careful art of cooking and baking is my creative outlet and a way to relax.",
    },
    {
      icon: "mountain-snow",
      title: "Skiing",
      text: "When winter covers the landscape, I swap the weights for skis and the thrill of snowy slopes.",
    },
    {
      icon: "waves",
      title: "Swimming in the Aare",
      text: "When the summer sun shines, I swim in the Aare, often with friends.",
      link: { label: "The Aare", href: "https://www.myswitzerland.com/de-ch/erlebnisse/das-berner-leben-an-der-aare/" },
    },
  ],
};

export const stats = [
  { value: 3, suffix: "", label: "UEFA finals networked" },
  { value: 50, suffix: "+", label: "Cisco switches per festival" },
  { value: 30, suffix: "", label: "Access points per festival" },
  { value: 80, suffix: "+", label: "Countries at WorldSkills" },
  { value: 2, suffix: "", label: "AWS certifications" },
];

export const skills = [
  "Amazon Web Services",
  "Cloud Architecture",
  "Well-Architected",
  "Networking",
  "Cisco Switching",
  "Wireless / Access Points",
  "Network Security",
  "Infrastructure",
  "Automation",
  "Databases",
  "Scalable Infrastructure",
  "Fiber & Copper Cabling",
  "CCTV Transport",
  "Event Networking",
  "Public WiFi",
  "Payment Networks",
];

export type Section = { heading: string; body?: string[]; bullets?: { label?: string; text: string }[] };

export type Project = {
  slug: string;
  title: string;
  short: string;
  location: string;
  year: string;
  category: string;
  tags: string[];
  cover: string;
  coverCredit?: { label: string; href: string };
  sections: Section[];
  gallery: { src: string; alt: string }[];
  video?: string;
  links: { label: string; href: string }[];
  coords: [number, number];
};

const pj = (dir: string, f: string) => m(`projects/${dir}/${f}.webp`);

const uefaBullets = (vip: boolean) => [
  {
    label: "Pitch-side network",
    text: "A reliable network for photographers on the pitch, for fast and secure transfer of photos and data.",
  },
  {
    label: "Media tribune",
    text: "A high-speed network for all media staff, for uninterrupted coverage and reporting.",
  },
  ...(vip
    ? [{ label: "VIP tents", text: "Public WiFi in the VIP tents, with seamless connectivity for guests." }]
    : []),
  {
    label: "UEFA staff network",
    text: "A dedicated network for UEFA employees, supporting their work throughout the event.",
  },
];

export const projects: Project[] = [
  {
    slug: "worldskills",
    title: "WorldSkills Lyon 2024",
    short: "Representing Switzerland in Cloud Computing on AWS. Awarded the Medallion for Excellence.",
    location: "Lyon, France",
    year: "2024",
    category: "WorldSkills",
    tags: ["AWS", "Cloud Computing", "Competition"],
    cover: pj("worlskills-lyon-2024", "worldskills-lyon-2024"),
    coords: [45.764, 4.8357],
    sections: [
      {
        heading: "Project overview",
        body: [
          "WorldSkills is a global competition that brings together skilled professionals from around the world. Held every two years, it sees participants from over 80 countries competing in skills from engineering and IT to arts and design. Its goal is to inspire and raise the standard of vocational skills worldwide.",
          "At WorldSkills Lyon 2024 I represented Switzerland in Cloud Computing. Over four days I worked through a series of hard tasks on AWS: designing, deploying and managing cloud infrastructure. I configured secure networks, managed databases, set up scalable infrastructure and deployed automated workflows, all following well-architected principles for efficiency, reliability and cost. My performance earned me a Medallion for Excellence.",
        ],
      },
      {
        heading: "My experience",
        body: [
          "For me, WorldSkills Lyon 2024 was a once-in-a-lifetime experience. My journey began in January 2024, when I started preparing with my coach, Pascal Mathis. Together we built a rigorous training plan: lots of hands-on practice, a wide range of AWS services, several AWS Jam and AWS GameDay sessions, and sharpening my problem-solving and architecture skills.",
          "To build confidence I took part in several demo competitions. The most memorable was a 3-day test competition in Ireland, against more than half of my later WorldSkills competitors. It let me test my skills under pressure, find areas to improve, and connect with peers from around the world.",
          "Throughout the year I joined several team weekends with the SwissSkills National Team. They were intense training, team building and insights from coaches and past competitors. They taught me the value of collaboration and adaptability, and reminded me I was part of something bigger: representing Switzerland on the global stage.",
        ],
      },
    ],
    video: "VJ-04uMyDy0",
    gallery: [
      { src: pj("worlskills-lyon-2024", "pablo-with-pascal"), alt: "Me and my coach Pascal Mathis" },
      { src: pj("worlskills-lyon-2024", "test-competiton-dublin"), alt: "Test competition, Dublin" },
      { src: pj("worlskills-lyon-2024", "national-team"), alt: "Swiss national team" },
      { src: pj("worlskills-lyon-2024", "opening-ceremony-01"), alt: "Opening ceremony" },
      { src: pj("worlskills-lyon-2024", "opening-ceremony-02"), alt: "Opening ceremony" },
      { src: pj("worlskills-lyon-2024", "opening-ceremony-03"), alt: "Opening ceremony" },
      { src: pj("worlskills-lyon-2024", "pablo-at-comp-01"), alt: "Competition" },
      { src: pj("worlskills-lyon-2024", "pablo-at-comp-02"), alt: "Competition" },
      { src: pj("worlskills-lyon-2024", "pablo-at-comp-03"), alt: "Competition" },
      { src: pj("worlskills-lyon-2024", "closing-ceremony-01"), alt: "Closing ceremony" },
      { src: pj("worlskills-lyon-2024", "closing-ceremony-02"), alt: "Closing ceremony" },
      { src: pj("worlskills-lyon-2024", "closing-ceremony-03"), alt: "Closing ceremony" },
    ],
    links: [
      { label: "LinkedIn post", href: "https://www.linkedin.com/feed/update/urn:li:activity:7242602929466093568" },
      { label: "Skill factsheet", href: "https://worldskills.org/skills/id/545/" },
      {
        label: "Official results",
        href: "https://results.worldskills.org/results?event=579&offset=0&skill=1706&base_skill=545",
      },
    ],
  },
  {
    slug: "openair-frauenfeld-2024",
    title: "Openair Frauenfeld 2024",
    short: "A festival-wide network: 50+ Cisco switches, ~30 access points, fiber and copper across the grounds.",
    location: "Frauenfeld, Switzerland",
    year: "2024",
    category: "Event Networking",
    tags: ["Festival", "Networking", "Infrastructure"],
    cover: pj("openair-frauenfeld-2024", "openair-frauenfeld-2024"),
    coverCredit: {
      label: "baselundregion.ch",
      href: "https://baselundregion.ch/2023/06/22/von-basel-nach-frauenfeld-das-openair-frauenfeld-vom-06-bis-08-juli-2023/",
    },
    coords: [47.5536, 8.8988],
    sections: [
      {
        heading: "Project overview",
        body: [
          "At Openair Frauenfeld 2024 our mission was a state-of-the-art network across the festival grounds, with seamless connectivity for thousands of attendees. Together with our partner company Konzept5 we deployed over 50 Cisco switches and about 30 access points, linked by a mix of fiber and copper cabling. It powered everything from public WiFi to backstage communications.",
          "The festival layout was vast and complex.",
        ],
      },
      {
        heading: "Network setup",
        bullets: [
          { label: "Food & beverage", text: "Reliable network infrastructure for seamless service across all stalls." },
          { label: "VIP connectivity", text: "Dedicated public WiFi for VIP areas." },
          { label: "Swisscom stand", text: "A public WiFi network showcasing Swisscom's services." },
          { label: "Backstage internet", text: "Connectivity for staff and performers." },
          { label: "Security & monitoring", text: "Transport of video and CCTV feeds for full security coverage." },
          { label: "Ticketing", text: "Secure internet connections for efficient entry management." },
          { label: "Payments", text: "High-speed internet for quick and safe payment transactions." },
        ],
      },
    ],
    gallery: [
      { src: pj("openair-frauenfeld-2024", "gelaendeplan-oaf-2024"), alt: "Festival site plan" },
      { src: pj("openair-frauenfeld-2024", "south-stage-oaf-2024"), alt: "South stage under construction" },
      { src: pj("openair-frauenfeld-2024", "north-stage-oaf-2024"), alt: "North stage" },
      { src: pj("openair-frauenfeld-2024", "park-stage-oaf-2024"), alt: "Park stage" },
    ],
    links: [
      { label: "LinkedIn post", href: "https://www.linkedin.com/feed/update/urn:li:activity:7216422673751437314" },
      { label: "Konzept5", href: "https://konzept5.ch" },
    ],
  },
  {
    slug: "uefa-conference-league-final-2024-athens",
    title: "UEFA Conference League Final 2024",
    short: "Stadium-wide connectivity for photographers, media and UEFA staff in Athens.",
    location: "Athens, Greece",
    year: "2024",
    category: "Event Networking",
    tags: ["Sports", "Networking", "Infrastructure"],
    cover: pj("uefa-conference-league-final-athen", "uefa-conference-league-final-2024"),
    coords: [37.9838, 23.7275],
    sections: [
      {
        heading: "Project overview",
        body: [
          "At the UEFA Conference League Final 2024 in Athens, our team built a complete network infrastructure across the stadium. We covered photographers on the pitch, media staff in the media tribune, and secure connectivity for all UEFA employees.",
        ],
      },
      { heading: "Network setup", bullets: uefaBullets(false) },
    ],
    gallery: [
      { src: pj("uefa-conference-league-final-athen", "team"), alt: "The team" },
      { src: pj("uefa-conference-league-final-athen", "stadium"), alt: "Stadium" },
      { src: pj("uefa-conference-league-final-athen", "pitch"), alt: "Pitch" },
    ],
    links: [
      {
        label: "Intranet post (Swisscom only)",
        href: "https://intranet.swisscom.com/home/articles/tgeduj04/3_finales_europeennes_en_11_jours_",
      },
    ],
  },
  {
    slug: "openair-frauenfeld-2023",
    title: "Openair Frauenfeld 2023",
    short: "Network for every food & beverage location, VIP WiFi, CCTV transport and ticketing.",
    location: "Frauenfeld, Switzerland",
    year: "2023",
    category: "Event Networking",
    tags: ["Festival", "Networking", "Infrastructure"],
    cover: pj("openair-frauenfeld-2023", "openair-frauenfeld-2023"),
    coverCredit: {
      label: "maennersache.de",
      href: "https://www.maennersache.de/frauenfeld-festival-line-up-tickets-preise-camping-12773.html",
    },
    coords: [47.5536, 8.8988],
    sections: [
      {
        heading: "Project overview",
        body: [
          "With my team I was responsible for the network infrastructure for all food and beverage locations at Openair Frauenfeld 2023. With our partner company Konzept5 we installed more than 50 Cisco switches and around 30 access points.",
        ],
      },
      {
        heading: "Network setup",
        bullets: [
          { text: "Designed and built a reliable network for seamless operations at all food and beverage stalls." },
          { text: "Provided public WiFi for VIP areas." },
          { text: "Set up public WiFi at the Swisscom stand." },
          { text: "Backstage internet for staff and performers." },
          { text: "Video and CCTV transport for security and monitoring." },
          { text: "Internet connectivity for ticketing systems." },
          { text: "High-speed internet and secure payment processing." },
        ],
      },
    ],
    gallery: [{ src: pj("openair-frauenfeld-2023", "south-stage-oaf-2023"), alt: "South stage" }],
    links: [
      { label: "LinkedIn post", href: "https://www.linkedin.com/feed/update/urn:li:activity:7112344709221474304" },
      { label: "Konzept5", href: "https://konzept5.ch" },
    ],
  },
  {
    slug: "uefa-champions-league-final-2023-istanbul",
    title: "UEFA Champions League Final 2023",
    short: "Pitch-side, media tribune, VIP tents and UEFA staff networks in Istanbul.",
    location: "Istanbul, Türkiye",
    year: "2023",
    category: "Event Networking",
    tags: ["Sports", "Networking", "Infrastructure"],
    cover: pj("uefa-champions-league-final-istanbul", "uefa-champions-league-final-2023"),
    coverCredit: {
      label: "luzernerzeitung.ch",
      href: "https://www.luzernerzeitung.ch/sport/presseschau-city-beendet-seinen-alptraum-guardiola-sein-drama-das-sind-die-stimmen-zum-triumph-von-manchester-city-ld.2471724",
    },
    coords: [41.0082, 28.9784],
    sections: [
      {
        heading: "Project overview",
        body: [
          "At the UEFA Champions League Final 2023 in Istanbul, our team built a complete network infrastructure across the stadium: for photographers on the pitch, media staff in the media tribune, public WiFi in VIP tents, and secure connectivity for all UEFA employees.",
        ],
      },
      { heading: "Network setup", bullets: uefaBullets(true) },
    ],
    gallery: [
      { src: pj("uefa-champions-league-final-istanbul", "team"), alt: "The team" },
      { src: pj("uefa-champions-league-final-istanbul", "media-tribune"), alt: "Media tribune" },
      { src: pj("uefa-champions-league-final-istanbul", "stadium-1"), alt: "Stadium" },
      { src: pj("uefa-champions-league-final-istanbul", "stadium-2"), alt: "Stadium" },
      { src: pj("uefa-champions-league-final-istanbul", "vip-zone"), alt: "VIP zone" },
      { src: pj("uefa-champions-league-final-istanbul", "vip-zone-2"), alt: "VIP zone" },
      { src: pj("uefa-champions-league-final-istanbul", "fanzone"), alt: "Fan zone" },
    ],
    links: [
      {
        label: "Intranet post (Swisscom only)",
        href: "https://intranet.swisscom.com/home/articles/tgeduj04/yes_we_did_it_",
      },
    ],
  },
  {
    slug: "uefa-conference-league-final-2022-tirana",
    title: "UEFA Conference League Final 2022",
    short: "The first final: networks for the pitch, media tribune and UEFA staff in Tirana.",
    location: "Tirana, Albania",
    year: "2022",
    category: "Event Networking",
    tags: ["Sports", "Networking", "Infrastructure"],
    cover: pj("uefa-conference-league-final-tirana", "uefa-conference-league-final-2022"),
    coords: [41.3275, 19.8187],
    sections: [
      {
        heading: "Project overview",
        body: [
          "At the UEFA Conference League Final 2022 in Tirana, our team built a complete network infrastructure across the stadium: for photographers on the pitch, media staff in the media tribune, and secure connectivity for all UEFA employees.",
        ],
      },
      { heading: "Network setup", bullets: uefaBullets(false) },
    ],
    gallery: [
      { src: pj("uefa-conference-league-final-tirana", "team"), alt: "The team" },
      { src: pj("uefa-conference-league-final-tirana", "stadium"), alt: "Stadium" },
      { src: pj("uefa-conference-league-final-tirana", "media-tribune"), alt: "Media tribune" },
      { src: pj("uefa-conference-league-final-tirana", "event-core"), alt: "Event core" },
    ],
    links: [
      {
        label: "Intranet post (Swisscom only)",
        href: "https://intranet.swisscom.com/home/articles/tgeduj04/uefa_conference_league",
      },
    ],
  },
];

export type Certification = {
  slug: string;
  title: string;
  issuer: string;
  short: string;
  image: string;
  achieved: string;
  id?: string;
  credly: string;
  extra?: { label: string; href: string }[];
  pdf?: string;
  body: string;
};

export const certifications: Certification[] = [
  {
    slug: "aws-certified-solutions-architect-professional",
    title: "AWS Certified Solutions Architect – Professional",
    issuer: "Amazon Web Services",
    short: "Professional",
    image: m("certifications/aws-certified-solutions-architect-professional/aws_logo.webp"),
    achieved: "Nov 2024",
    id: "55227318f07a4592ad5900bf54f543d4",
    credly: "https://www.credly.com/badges/539303ec-c8fd-48dd-ba25-043f52f1e5de/public_url",
    pdf: m("certifications/aws-certified-solutions-architect-professional/certificate.pdf"),
    body: "This certification validates my skills and knowledge in designing distributed systems on AWS, and I'm excited to apply these principles in my projects.",
  },
  {
    slug: "worldskills",
    title: "Medallion for Excellence @ WorldSkills 2024, Lyon",
    issuer: "WorldSkills International",
    short: "Medallion",
    image: m("certifications/medallion-for-excellence-at-worldskills/worldskills-lyon-2024.webp"),
    achieved: "Sep 2024",
    credly: "https://www.credly.com/badges/4690a58e-1ae4-4f63-b504-e775956e6b2b",
    extra: [
      {
        label: "Ranking on WorldSkills International",
        href: "https://results.worldskills.org/results?event=579&offset=0&skill=1706&base_skill=545",
      },
      { label: "Skill factsheet", href: "https://worldskills.org/skills/id/545/" },
    ],
    body: "I'm honored to have represented Switzerland at WorldSkills 2024 in Lyon, France, where I was awarded a Medallion for Excellence in Cloud Computing. The competition spanned several days of challenges exclusively on the AWS platform.",
  },
  {
    slug: "aws-certified-solutions-architect-associate",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    short: "Associate",
    image: m("certifications/aws-certified-solutions-architect-associate/aws_logo.webp"),
    achieved: "May 2023",
    id: "KXF09WT24FVQ1GGD",
    credly: "https://www.credly.com/badges/8f632add-ae77-49ac-92f7-70906e300e4d/public_url",
    pdf: m("certifications/aws-certified-solutions-architect-associate/certificate.pdf"),
    body: "This certification validates my skills and knowledge in designing distributed systems on AWS, and I'm excited to apply these principles in my projects.",
  },
];

export const timeline: { year: string; title: string; text: string; to?: string; href?: string }[] = [
  {
    year: "2022",
    title: "UEFA Conference League Final, Tirana",
    text: "My first UEFA final: networks for the pitch, media tribune and UEFA staff.",
    to: "/projects/uefa-conference-league-final-2022-tirana",
  },
  {
    year: "2023",
    title: "AWS Solutions Architect – Associate",
    text: "Certified in designing distributed systems on AWS.",
    to: "/certifications/aws-certified-solutions-architect-associate",
  },
  {
    year: "2023",
    title: "UEFA Champions League Final, Istanbul",
    text: "Pitch-side, media, VIP tents and UEFA staff networks.",
    to: "/projects/uefa-champions-league-final-2023-istanbul",
  },
  {
    year: "2023",
    title: "Openair Frauenfeld",
    text: "Networks for every food & beverage location of the festival.",
    to: "/projects/openair-frauenfeld-2023",
  },
  {
    year: "2023",
    title: "SwissSkills 2023 – 2nd place",
    text: "Second place in Cloud Computing, then selected for WorldSkills.",
    href: "https://www.ict-berufsbildung.ch/resources/Results-ICTskills2023.pdf",
  },
  {
    year: "2024",
    title: "Training with Pascal Mathis",
    text: "From January: AWS Jams, GameDays and a test competition in Dublin.",
    to: "/projects/worldskills",
  },
  {
    year: "2024",
    title: "UEFA Conference League Final, Athens",
    text: "Stadium-wide connectivity for the third European final.",
    to: "/projects/uefa-conference-league-final-2024-athens",
  },
  {
    year: "2024",
    title: "Openair Frauenfeld",
    text: "50+ Cisco switches and ~30 access points across the grounds.",
    to: "/projects/openair-frauenfeld-2024",
  },
  {
    year: "2024",
    title: "WorldSkills Lyon – Medallion for Excellence",
    text: "Representing Switzerland in Cloud Computing on AWS.",
    to: "/projects/worldskills",
  },
  {
    year: "2024",
    title: "AWS Solutions Architect – Professional",
    text: "The professional-level AWS architecture certification.",
    to: "/certifications/aws-certified-solutions-architect-professional",
  },
  {
    year: "Now",
    title: "Technical Account Manager at AWS",
    text: "Helping AWS customers run and grow their workloads in the cloud.",
    href: "https://www.linkedin.com/in/pablo-wynistorf/",
  },
];

export const places = [
  { name: "Tirana", coords: [41.3275, 19.8187] as [number, number] },
  { name: "Istanbul", coords: [41.0082, 28.9784] as [number, number] },
  { name: "Athens", coords: [37.9838, 23.7275] as [number, number] },
  { name: "Lyon", coords: [45.764, 4.8357] as [number, number] },
  { name: "Dublin", coords: [53.3498, -6.2603] as [number, number] },
  { name: "Frauenfeld", coords: [47.5536, 8.8988] as [number, number] },
];

export const allPhotos = projects.flatMap((p) =>
  [p.cover, ...p.gallery.map((g) => g.src)].map((src) => ({ src, project: p })),
);
