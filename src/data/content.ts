// ─── src/data/content.ts ─────────────────────────────────────────────────────
// Single source of truth for ALL editable content.
// Components import from here — never use inline strings in JSX (PRD §10).
// Update copy, links, and project data here only.

// ─── Site metadata & social links ────────────────────────────────────────────
export const meta = {
  name:             "Aryan Kumar",
  email:            "aryankumar.it04@gmail.com",
  github:           "https://github.com/AryanK-IT",
  linkedin:         "https://www.linkedin.com/in/aryan-kumar-3790232a4/",
  // Set VITE_FORMSPREE_URL in Vercel dashboard env variables
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_URL ?? "",
};

// ─── Hero section ─────────────────────────────────────────────────────────────
export const hero = {
  label:     "Backend Developer · KIIT University · 2026",
  nameLines: ["ARYAN", "KUMAR."],
  chips:     ["Backend Dev", "ML Explorer", "Builder"],
  // Duplicated string in JSX for seamless marquee loop
  marquee:   "— Backend Development · REST APIs · Cloud Computing · Machine Learning · Node.js · Python · KIIT University —",
};

// ─── About section ────────────────────────────────────────────────────────────
export const about = {
  // Pull quote rendered in Bebas Neue — final word "think." in accent color
  pullQuote:  ["I build things", "that scale and", "think."],
  accentWord: "think.",
  paragraphs: [
    "Hey — I'm Aryan, a backend developer and Information Technology student at KIIT University (graduating 2027).",
    "I specialise in designing robust server-side systems, RESTful APIs, and full-stack applications using Node.js, Express, and MongoDB.",
    "I'm also deeply interested in the intersection of backend engineering and machine learning — having built an AI voice detection system during a 5-day hackathon using Python, deep learning, and signal processing.",
    "I reverse-engineer how things work just to rebuild them better.",
  ],
  // Stats strip — JetBrains Mono, separated by · in JSX
  stats: ["B.Tech · IT", "KIIT, Bhubaneswar", "2023–2027", "Backend Specialist"],
};

// ─── Projects ─────────────────────────────────────────────────────────────────
// Four projects displayed as numbered editorial rows (PRD §6.4).
// All GitHub links point to profile until individual repo URLs are confirmed.
export const projects = [
  {
    id:          "01",
    title:       "Splitwise Clone",
    tags:        ["React", "Node.js", "Express", "MongoDB", "JWT"],
    description: "Full-stack expense tracker with a debt simplification algorithm, real-time visualization, and JWT-secured multi-user splitting.",
    link:        "https://github.com/AryanK-IT",
  },
  {
    id:          "02",
    title:       "AI Voice Detection System",
    tags:        ["Python", "Deep Learning", "MFCCs", "Signal Processing"],
    description: "ML pipeline to detect AI-generated synthetic audio via spectral analysis. Built in a 5-day hackathon with a team of four.",
    link:        "https://github.com/AryanK-IT",
  },
  {
    id:          "03",
    title:       "REST API Project",
    tags:        ["Node.js", "Express.js", "CRUD"],
    description: "Clean multi-endpoint CRUD API with efficient, secure data handling patterns.",
    link:        "https://github.com/AryanK-IT",
  },
  {
    id:          "04",
    title:       "Django Application",
    tags:        ["Python", "Django", "ORM"],
    description: "Scalable Django web app demonstrating ORM-based data modelling and full-stack Python development.",
    link:        "https://github.com/AryanK-IT",
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────
// Three columns rendered as chip grids (PRD §6.5).
// Key = column header, value = array of skill chip labels.
export const skills: Record<string, string[]> = {
  "Languages": [
    "JavaScript (ES6+)",
    "Python",
    "Java",
    "C",
    "SQL",
  ],
  "Frameworks & Tools": [
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Django",
    "Git",
    "GitHub",
    "VS Code",
  ],
  "Architectures": [
    "RESTful APIs",
    "Microservices",
    "CRUD Operations",
    "JWT Auth",
    "MVC Pattern",
  ],
};

// ─── Contact section ──────────────────────────────────────────────────────────
export const contact = {
  ctaLines:    ["LET'S BUILD", "SOMETHING."],
  accentWord:  "SOMETHING.",
  subtext:     "Got a project, an idea, or just want to talk systems and code? I'm always up for it.",
  // Form field placeholders
  fields: {
    name:    "Name",
    email:   "Email",
    message: "Message",
  },
  submitLabel: "SEND MESSAGE →",
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const footer = {
  copy: "© 2026 Aryan Kumar · Built with React & Framer Motion",
};

// ─── Navigation links ─────────────────────────────────────────────────────────
// href values are section IDs — anchor scroll handled via smooth-scroll CSS.
export const navLinks = [
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills"   },
  { label: "Contact",  href: "#contact"  },
];
