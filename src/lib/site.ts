export const site = {
  name: "Koh Jun Hao",
  location: "Singapore",
  status: "shipping",
  lastUpdated: "2026.04.22",
  education: {
    school: "University of London",
    degree: "BSc Computer Science",
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

export const sections = [
  { label: "Films", href: "/films" },
  { label: "Books", href: "/books" },
  { label: "Games", href: "/games" },
  { label: "Writing", href: "/articles" },
  { label: "Investments", href: "/investments" },
] as const;

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
  { index: "04", slug: "films", label: "Films", kind: "stock", note: "Every film and show watched" },
  { index: "05", slug: "books", label: "Books", kind: "stock", note: "A public shelf" },
  { index: "06", slug: "games", label: "Games", kind: "stock", note: "Video games and board games" },
  { index: "07", slug: "design", label: "Design", kind: "meta", note: "The system, in-product" },
];
