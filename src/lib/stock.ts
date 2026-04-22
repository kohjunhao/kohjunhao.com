export type Recommendation = "highly" | "recommended" | "skip";

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
  sector?: "Infrastructure" | "DeFi" | "AI" | "DePIN" | "Applications";
  note?: string;
  year?: string;
};

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
];

export const investments: Investment[] = rawInvestments.map((i) => ({
  ...i,
  sector: i.sector ?? SECTOR_MAP[i.name] ?? "Applications",
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

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}
export function getMovie(slug: string) {
  return movies.find((m) => m.slug === slug);
}
export function getGame(slug: string) {
  return games.find((g) => g.slug === slug);
}
export function getCurated(slug: string) {
  return curated.find((c) => c.slug === slug);
}

export type Book = {
  slug: string;
  title: string;
  author: string;
  year: string;
  rec: Recommendation;
  note?: string;
  bodyNote?: string;
};

export const books: Book[] = [
  { slug: "bitcoin-standard", title: "The Bitcoin Standard", author: "Saifedean Ammous", year: "2018", rec: "highly", note: "the book you mail a skeptic", bodyNote: "The argument isn't really about bitcoin. It's about hardness as a property — money that can't be debased is the tail that wags the dog of civilisation. Half the chapters are history, and they're the strongest half." },
  { slug: "mastering-bitcoin", title: "Mastering Bitcoin", author: "Andreas M. Antonopoulos", year: "2014", rec: "highly" },
  { slug: "network-state", title: "The Network State", author: "Balaji Srinivasan", year: "2022", rec: "highly" },
  { slug: "zero-to-one", title: "Zero to One", author: "Peter Thiel", year: "2014", rec: "highly", note: "the one i re-read" },
  { slug: "sovereign-individual", title: "The Sovereign Individual", author: "James Dale Davidson", year: "1997", rec: "highly" },
  { slug: "antifragile", title: "Antifragile", author: "Nassim Nicholas Taleb", year: "2012", rec: "highly", note: "taleb at his peak" },
  { slug: "hard-thing", title: "The Hard Thing About Hard Things", author: "Ben Horowitz", year: "2014", rec: "highly" },
  { slug: "lean-startup", title: "The Lean Startup", author: "Eric Ries", year: "2011", rec: "recommended" },
  { slug: "cryptoassets", title: "Cryptoassets", author: "Chris Burniske", year: "2017", rec: "recommended" },
  { slug: "age-of-cryptocurrency", title: "The Age of Cryptocurrency", author: "Paul Vigna", year: "2015", rec: "recommended" },
  { slug: "digital-gold", title: "Digital Gold", author: "Nathaniel Popper", year: "2015", rec: "recommended" },
  { slug: "black-swan", title: "The Black Swan", author: "Nassim Nicholas Taleb", year: "2007", rec: "recommended" },
  { slug: "thinking-fast-slow", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: "2011", rec: "recommended", note: "system 1/2 lives rent free" },
  { slug: "innovators-dilemma", title: "The Innovator's Dilemma", author: "Clayton M. Christensen", year: "1997", rec: "recommended" },
  { slug: "crossing-the-chasm", title: "Crossing the Chasm", author: "Geoffrey A. Moore", year: "1991", rec: "recommended" },
  { slug: "venture-deals", title: "Venture Deals", author: "Brad Feld", year: "2011", rec: "recommended" },
  { slug: "mom-test", title: "The Mom Test", author: "Rob Fitzpatrick", year: "2013", rec: "recommended", note: "interview technique, not theory" },
  { slug: "everything-store", title: "The Everything Store", author: "Brad Stone", year: "2013", rec: "recommended" },
  { slug: "hooked", title: "Hooked", author: "Nir Eyal", year: "2014", rec: "skip", note: "manual for bad patterns" },
  { slug: "blitzscaling", title: "Blitzscaling", author: "Reid Hoffman", year: "2018", rec: "skip", note: "aged badly. aged publicly." },
];

export type Movie = {
  slug: string;
  title: string;
  year: string;
  director: string;
  rec: Recommendation;
  note?: string;
};

export const movies: Movie[] = [
  { slug: "blade-runner-2049", title: "Blade Runner 2049", year: "2017", director: "Villeneuve", rec: "highly" },
  { slug: "the-matrix", title: "The Matrix", year: "1999", director: "Wachowski", rec: "highly" },
  { slug: "inception", title: "Inception", year: "2010", director: "Nolan", rec: "highly" },
  { slug: "ex-machina", title: "Ex Machina", year: "2014", director: "Garland", rec: "highly" },
  { slug: "arrival", title: "Arrival", year: "2016", director: "Villeneuve", rec: "highly" },
  { slug: "ghost-in-the-shell", title: "Ghost in the Shell", year: "1995", director: "Oshii", rec: "highly" },
  { slug: "big-short", title: "The Big Short", year: "2015", director: "McKay", rec: "highly" },
  { slug: "her", title: "Her", year: "2013", director: "Jonze", rec: "recommended" },
  { slug: "social-network", title: "The Social Network", year: "2010", director: "Fincher", rec: "recommended" },
  { slug: "interstellar", title: "Interstellar", year: "2014", director: "Nolan", rec: "recommended" },
  { slug: "minority-report", title: "Minority Report", year: "2002", director: "Spielberg", rec: "recommended" },
  { slug: "imitation-game", title: "The Imitation Game", year: "2014", director: "Tyldum", rec: "recommended" },
  { slug: "tron-legacy", title: "Tron: Legacy", year: "2010", director: "Kosinski", rec: "recommended" },
  { slug: "ready-player-one", title: "Ready Player One", year: "2018", director: "Spielberg", rec: "skip" },
  { slug: "transcendence", title: "Transcendence", year: "2014", director: "Pfister", rec: "skip" },
];

export type Game = {
  slug: string;
  title: string;
  platform: "steam" | "switch" | "ps5" | "xbox" | "retro" | "other";
  hours: number;
  rec?: Recommendation;
  note?: string;
  currentlyPlaying?: boolean;
};

export const games: Game[] = [
  { slug: "balatro", title: "Balatro", platform: "steam", hours: 38, rec: "recommended", note: "poker rogue-like, lethal pacing", currentlyPlaying: true },
  { slug: "baldurs-gate-3", title: "Baldur's Gate 3", platform: "steam", hours: 312, rec: "highly", note: "actual role-playing, not menu-driven" },
  { slug: "factorio", title: "Factorio", platform: "steam", hours: 287, rec: "recommended", note: "clear your calendar" },
  { slug: "elden-ring", title: "Elden Ring", platform: "steam", hours: 194, rec: "recommended", note: "beautiful world, fair challenge" },
  { slug: "civ-vi", title: "Civilization VI", platform: "steam", hours: 163, rec: "recommended" },
  { slug: "hades", title: "Hades", platform: "steam", hours: 108, rec: "recommended", note: "the gold standard for run-based design" },
  { slug: "the-witness", title: "The Witness", platform: "steam", hours: 74, rec: "highly", note: "a puzzle game that teaches you how to see" },
  { slug: "outer-wilds", title: "Outer Wilds", platform: "steam", hours: 51, rec: "highly", note: "the one I'd erase my memory to replay" },
  { slug: "slay-the-spire", title: "Slay the Spire", platform: "steam", hours: 49, rec: "recommended", note: "rogue-like deckbuilder, still unmatched" },
  { slug: "disco-elysium", title: "Disco Elysium", platform: "steam", hours: 44, rec: "highly", note: "the best prose in any medium this decade" },
  { slug: "starfield", title: "Starfield", platform: "steam", hours: 18, rec: "skip", note: "Bethesda's weakest in a decade" },
  { slug: "cyberpunk", title: "Cyberpunk 2077", platform: "steam", hours: 24, rec: "skip", note: "great city, thin RPG" },
];

export const recLabel: Record<Recommendation, { label: string; glyph: string }> = {
  highly: { label: "Highly recommend", glyph: "✓✓" },
  recommended: { label: "Recommend", glyph: "✓" },
  skip: { label: "Skip", glyph: "─" },
};

export type CuratedCategory =
  | "Stationery"
  | "Tools"
  | "Hardware"
  | "Wearables"
  | "Home";

export type CuratedItem = {
  slug: string;
  name: string;
  maker: string;
  category: CuratedCategory;
  price?: string;
  url?: string;
  note: string;
  bodyNote?: string;
};

// A curated.supply-style shelf — objects worth keeping. Seed list, easily
// extended in place. Short serif notes only; no marketing copy.
export const curated: CuratedItem[] = [
  {
    slug: "lamy-2000",
    name: "Lamy 2000",
    maker: "Lamy",
    category: "Stationery",
    price: "$250",
    url: "https://www.lamy.com/en/lamy-2000/",
    note: "The fountain pen the Bauhaus would ship.",
    bodyNote:
      "Designed by Gerd Müller in 1966, still in production without a single revision worth noting. Makrolon body. Brushed steel. Writes like a pencil that never dulls.",
  },
  {
    slug: "muji-b6",
    name: "Passport Memo B6",
    maker: "Muji",
    category: "Stationery",
    price: "S$6",
    url: "https://www.muji.com/sg/products/cmdty/detail/4934761580982",
    note: "The notebook that disappears into the work.",
    bodyNote:
      "Slim, unrestrained, no branding. The only notebook I've used consistently for a decade. Buy twelve at a time.",
  },
  {
    slug: "hario-v60",
    name: "V60 Pour-Over",
    maker: "Hario",
    category: "Home",
    price: "S$35",
    url: "https://hario.com/",
    note: "Honest device. One moving part — you.",
    bodyNote:
      "Ceramic cone, single hole, spiraled ribs. Every cup is the same if you are. Every cup is different if you are.",
  },
  {
    slug: "kindle-paperwhite",
    name: "Kindle Paperwhite",
    maker: "Amazon",
    category: "Hardware",
    price: "S$220",
    url: "https://www.amazon.com/kindle",
    note: "An unkind interface to a kind habit.",
    bodyNote:
      "The software is mediocre. The hardware is transformative. I read two books a week because of this, and would read none if I only had the phone.",
  },
  {
    slug: "mx-master-3s",
    name: "MX Master 3S",
    maker: "Logitech",
    category: "Hardware",
    price: "S$169",
    url: "https://www.logitech.com/en-us/shop/p/mx-master-3s",
    note: "A mouse that remembers which machine you're on.",
    bodyNote:
      "Three devices, one scroll wheel. The MagSpeed flywheel is the sound of free time arriving.",
  },
  {
    slug: "blundstone-585",
    name: "Originals 585",
    maker: "Blundstone",
    category: "Wearables",
    price: "S$290",
    url: "https://www.blundstone.com/",
    note: "Boots that outlast the argument.",
    bodyNote:
      "Elastic sides, no laces, leather that ages the right way. You're never overdressed, never underdressed. A decade of daily use and still the thing I reach for.",
  },
  {
    slug: "fujifilm-x100vi",
    name: "X100VI",
    maker: "Fujifilm",
    category: "Hardware",
    price: "S$2,400",
    url: "https://fujifilm-x.com/global/products/cameras/x100vi/",
    note: "The camera that stays on the desk, ready.",
    bodyNote:
      "Fixed 23mm. No zoom, no excuse. The JPEG profiles save you from Lightroom. The rangefinder styling gets it out of the bag.",
  },
  {
    slug: "aesop-resurrection",
    name: "Resurrection Hand Wash",
    maker: "Aesop",
    category: "Home",
    price: "S$65",
    url: "https://www.aesop.com/",
    note: "The small luxury that survives every budget.",
    bodyNote:
      "Mandarin rind, rosemary leaf, cedar atlas. One bottle on the desk is the compound interest of a nice life.",
  },
];

