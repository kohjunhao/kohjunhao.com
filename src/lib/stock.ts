export type BlogPost = {
  index: string;
  title: string;
  note: string;
  date: string;
};

export const blogPosts: BlogPost[] = [
  { index: "01", title: "Starting again, in public", note: "Notes on why this site now exists", date: "2026.04.22" },
];

export type ProjectStatus = "shipping" | "exploring" | "paused" | "dormant";

export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  year: string;
  note: string;
  article?: string;
  embed?: string;
  about?: string;
};

export const projects: Project[] = [
  {
    slug: "blackjack",
    name: "Blackjack Simulator",
    status: "shipping",
    year: "2026",
    note: "EV, variance, and deviations against real shoes",
    embed: "/embeds/blackjack/index.html",
    about:
      "A browser-native blackjack simulator. Runs millions of hands against configurable rule sets, basic strategy, and index deviations — plots EV, variance, and bankroll drawdown in real time. Built to quickly A/B a rule change or an indexed play before committing table hours to it.",
  },
  {
    slug: "state-of-world",
    name: "State of the World",
    status: "shipping",
    year: "2026",
    note: "Fifty indicators, drawn small and side by side",
    embed: "/embeds/state-of-world/index.html",
    about:
      "A one-page dashboard of fifty indicators across eight domains — macroeconomy, demographics, climate, energy, geopolitics, technology, markets, health. Small multiples, sparkline + value + delta, range frames, single accent. Built in the Aizome system following Tufte's rules: above all else, show the data.",
  },
  {
    slug: "kohjunhao-com",
    name: "kohjunhao.com",
    status: "shipping",
    year: "2026",
    note: "This site. Next.js + Aizome design system",
    article: "starting-again-in-public",
  },
  {
    slug: "aizome",
    name: "Aizome",
    status: "shipping",
    year: "2026",
    note: "The design system that powers this site",
  },
  {
    slug: "x-likes-aggregator",
    name: "x-likes-aggregator",
    status: "paused",
    year: "2025",
    note: "Parse, categorize, and search your Twitter/X likes export",
  },
  {
    slug: "alfred",
    name: "Alfred",
    status: "exploring",
    year: "2025",
    note: "Crypto AI companion · private beta",
  },
  {
    slug: "compendium",
    name: "Compendium",
    status: "dormant",
    year: "2023",
    note: "Remember all the games, books, and movies in your life",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export type Investment = {
  name: string;
  url?: string;
  featured?: boolean;
  category?: "Crypto" | "Frontier Tech";
  sector?: "Infrastructure" | "DeFi" | "AI" | "DePIN" | "Applications";
  note?: string;
  year?: string;
};

// Non-crypto holdings — AI, robotics, space, energy. Everything else is Crypto.
const FRONTIER = new Set<string>([
  "OpenAI", "xAI", "Crusoe", "1X", "Apptronik", "Figure", "Humans&",
  "Project Prometheus", "Thalassa", "Exowatt", "Oligo Space", "Cowboy Space Corp",
  "Atoms", "Dyna Robotics", "Nous Research", "Replit",
]);

const SECTOR_MAP: Record<string, Investment["sector"]> = {};
const infraList = ["MegaETH","Plasma","Fogo","Citrea","Initia","Morph","Polymer Labs","Hyperlane","Anoma","N1","Rise","Stratum","aPriori","Fluent","Cysic","Irys","Octra","Spicenet","Milkyway"];
const defiList = ["Ethena","Chaos Labs","Level","Usual","Panoptic","Resolv Labs","Cap","Derive","Felix","GTE","Kuru","Limitless","Mellow Protocol","Perena","Perpl","Rysk Finance","Sorella Labs","Superform Labs","Veda","Volmex","Yala","Infinex","Bebop","Holyheld","Zerion"];
const aiList = ["OpenAI","xAI","Mira","Nillion","Theoriq"];
const depinList = ["Dawn","Ping Network","Hyperbeat","Hyperspace","Fjord"];
infraList.forEach((n) => (SECTOR_MAP[n] = "Infrastructure"));
defiList.forEach((n) => (SECTOR_MAP[n] = "DeFi"));
aiList.forEach((n) => (SECTOR_MAP[n] = "AI"));
depinList.forEach((n) => (SECTOR_MAP[n] = "DePIN"));

const rawInvestments: Investment[] = [
  { name: "Ethena", url: "https://ethena.fi", featured: true, note: "Synthetic dollar protocol", year: "2023" },
  { name: "MegaETH", url: "https://megaeth.systems", featured: true, note: "Real-time Ethereum L2", year: "2024" },
  { name: "Plasma", url: "https://plasma.io", featured: true, note: "Stablecoin-native chain", year: "2024" },
  { name: "Chaos Labs", url: "https://chaoslabs.xyz", featured: true, note: "Risk simulation for DeFi", year: "2022" },
  { name: "Fogo", url: "https://fogo.io", featured: true, note: "High-performance L1", year: "2024" },
  { name: "Dawn", url: "https://dawn.org", featured: true, note: "Decentralized wireless", year: "2023" },
  { name: "OpenAI", url: "https://openai.com", featured: true, note: "AI research", year: "2022" },
  { name: "xAI", url: "https://x.ai", featured: true, note: "AI research", year: "2023" },
  { name: "Anoma" }, { name: "aPriori" }, { name: "Bebop" }, { name: "Cap" },
  { name: "Citrea" }, { name: "ClayStack" }, { name: "Cysic" }, { name: "Derive" },
  { name: "Ethos" }, { name: "Felix" }, { name: "Fjord" }, { name: "Fluent" },
  { name: "GTE" }, { name: "Holograph" }, { name: "Holyheld" }, { name: "Hyperbeat" },
  { name: "Hyperlane" }, { name: "Hyperspace" }, { name: "Infinex" }, { name: "Initia" },
  { name: "Interstate" }, { name: "Irys" }, { name: "Kamigotchi" }, { name: "Kuru" },
  { name: "Level" }, { name: "Lighthouse" }, { name: "Limitless" }, { name: "Mellow Protocol" },
  { name: "Milkyway" }, { name: "Mira" }, { name: "Monerium" }, { name: "Morph" },
  { name: "N1" }, { name: "Nillion" }, { name: "Octra" }, { name: "OneBalance" },
  { name: "Panoptic" }, { name: "Pepe's Game" }, { name: "Perena" }, { name: "Perpl" },
  { name: "Ping Network" }, { name: "Polymer Labs" }, { name: "Pulse" }, { name: "Ranger" },
  { name: "Resolv Labs" }, { name: "Rise" }, { name: "Rysk Finance" }, { name: "Shogun" },
  { name: "Sorella Labs" }, { name: "Sparkball" }, { name: "Spicenet" }, { name: "Stratum" },
  { name: "Sundial" }, { name: "Superform Labs" }, { name: "Theoriq" }, { name: "Usual" },
  { name: "Veda" }, { name: "Volmex" }, { name: "WalletConnect" }, { name: "Wildcat Labs" },
  { name: "WINR" }, { name: "Yala" }, { name: "Zerion" },
  // — added Jun 2026 —
  { name: "1X" }, { name: "Apptronik" }, { name: "Beezie" },
  { name: "Cowboy Space Corp" }, { name: "Crusoe" }, { name: "Exowatt" },
  { name: "Figure" }, { name: "Humans&" }, { name: "Noise" },
  { name: "Oligo Space" }, { name: "Project Prometheus" }, { name: "Rip.fun" },
  { name: "Thalassa" },
  // — added Oct 2026 —
  { name: "Acier" }, { name: "Atoms" }, { name: "Dyna Robotics" },
  { name: "Nous Research" }, { name: "Replit" },
];

export const investments: Investment[] = rawInvestments.map((i) => ({
  ...i,
  sector: i.sector ?? SECTOR_MAP[i.name] ?? "Applications",
  category: (FRONTIER.has(i.name) ? "Frontier Tech" : "Crypto") as Investment["category"],
}));

export function investmentSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getInvestment(slug: string): Investment | undefined {
  return investments.find((i) => investmentSlug(i.name) === slug);
}
