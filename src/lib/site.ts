export const site = {
  name: "Koh Jun Hao",
  tagline: "Operator · Researcher",
  location: "Singapore",
  status: "shipping",
  lastUpdated: "2026.04.22",
  education: {
    school: "National University of Singapore",
    degree: "B. Comp. Sci.",
    years: "2022 – 2026",
    focus: "Distributed Systems, Blockchain, AI/ML",
  },
  handle: {
    paragraph: "0xvega",
    x: "kohjunhao",
    telegram: "kohjunhao",
    github: "kohjunhao",
    linkedin: "kohjunhao",
  },
  links: {
    twitter: "https://twitter.com/kohjunhao",
    telegram: "https://t.me/kohjunhao",
    github: "https://github.com/kohjunhao",
    linkedin: "https://linkedin.com/in/kohjunhao",
    paragraph: "https://paragraph.com/@0xvega",
  },
} as const;

export type NavEntry = {
  index: string;
  slug: string;
  label: string;
  kind: "writing" | "ledger" | "stock" | "meta";
  count?: number;
  note?: string;
};

export const nav: NavEntry[] = [
  { index: "01", slug: "articles", label: "Articles", kind: "writing", note: "Long-form DeFi research" },
  { index: "02", slug: "projects", label: "Projects", kind: "ledger", note: "What I'm building" },
  { index: "03", slug: "investments", label: "Investments", kind: "ledger", note: "Angel portfolio" },
  { index: "04", slug: "books", label: "Books", kind: "stock", note: "A public shelf" },
  { index: "05", slug: "movies", label: "Movies", kind: "stock", note: "A public film log" },
  { index: "06", slug: "games", label: "Games", kind: "stock", note: "Steam · Switch · PS5" },
  { index: "07", slug: "curated", label: "Curated", kind: "stock", note: "Objects worth keeping" },
  { index: "08", slug: "design", label: "Design", kind: "meta", note: "The system, in-product" },
];
