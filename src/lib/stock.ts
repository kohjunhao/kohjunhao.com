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

export type Project = {
  index: string;
  name: string;
  note: string;
  status: string;
};

export const projects: Project[] = [
  { index: "01", name: "kohjunhao.com", note: "This site. Next.js + Aizome design system", status: "SHIPPING" },
];

export type Investment = {
  name: string;
  url?: string;
  featured?: boolean;
  note?: string;
};

// 73 companies from the portfolio. Featured ones appear in a spotlight row.
export const investments: Investment[] = [
  // Featured / spotlight (ordered by recency of prominence)
  { name: "Ethena", url: "https://ethena.fi", featured: true, note: "Synthetic dollar protocol" },
  { name: "MegaETH", url: "https://megaeth.systems", featured: true, note: "Real-time Ethereum L2" },
  { name: "Plasma", url: "https://plasma.io", featured: true, note: "Stablecoin-native chain" },
  { name: "Chaos Labs", url: "https://chaoslabs.xyz", featured: true, note: "Risk simulation for DeFi" },
  { name: "Fogo", url: "https://fogo.io", featured: true, note: "High-performance L1" },
  { name: "Dawn", url: "https://dawn.org", featured: true, note: "Decentralized wireless" },
  { name: "OpenAI", url: "https://openai.com", featured: true, note: "AI research" },
  { name: "xAI", url: "https://x.ai", featured: true, note: "AI research" },

  // Full portfolio (alphabetical, non-featured)
  { name: "Anoma" },
  { name: "aPriori" },
  { name: "Bebop" },
  { name: "Cap" },
  { name: "Citrea" },
  { name: "ClayStack" },
  { name: "Cysic" },
  { name: "Derive" },
  { name: "Ethos" },
  { name: "Felix" },
  { name: "Fjord" },
  { name: "Fluent" },
  { name: "GTE" },
  { name: "Holograph" },
  { name: "Holyheld" },
  { name: "Hyperbeat" },
  { name: "Hyperlane" },
  { name: "Hyperspace" },
  { name: "Infinex" },
  { name: "Initia" },
  { name: "Interstate" },
  { name: "Irys" },
  { name: "Kamigotchi" },
  { name: "Kuru" },
  { name: "Level" },
  { name: "Lighthouse" },
  { name: "Limitless" },
  { name: "Mellow Protocol" },
  { name: "Milkyway" },
  { name: "Mira" },
  { name: "Monerium" },
  { name: "Morph" },
  { name: "N1" },
  { name: "Nillion" },
  { name: "Octra" },
  { name: "OneBalance" },
  { name: "Panoptic" },
  { name: "Pepe's Game" },
  { name: "Perena" },
  { name: "Perpl" },
  { name: "Ping Network" },
  { name: "Polymer Labs" },
  { name: "Pulse" },
  { name: "Ranger" },
  { name: "Resolv Labs" },
  { name: "Rise" },
  { name: "Rysk Finance" },
  { name: "Shogun" },
  { name: "Sorella Labs" },
  { name: "Sparkball" },
  { name: "Spicenet" },
  { name: "Stratum" },
  { name: "Sundial" },
  { name: "Superform Labs" },
  { name: "Theoriq" },
  { name: "Usual" },
  { name: "Veda" },
  { name: "Volmex" },
  { name: "WalletConnect" },
  { name: "Wildcat Labs" },
  { name: "WINR" },
  { name: "Yala" },
  { name: "Zerion" },
];

export type Book = {
  title: string;
  author: string;
  rec: Recommendation;
  note?: string;
};

export const books: Book[] = [
  { title: "The Bitcoin Standard", author: "Saifedean Ammous", rec: "highly" },
  { title: "Mastering Bitcoin", author: "Andreas M. Antonopoulos", rec: "highly" },
  { title: "The Network State", author: "Balaji Srinivasan", rec: "highly" },
  { title: "Zero to One", author: "Peter Thiel", rec: "highly" },
  { title: "The Sovereign Individual", author: "James Dale Davidson", rec: "highly" },
  { title: "Antifragile", author: "Nassim Nicholas Taleb", rec: "highly" },
  { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", rec: "highly" },
  { title: "The Lean Startup", author: "Eric Ries", rec: "recommended" },
  { title: "Cryptoassets", author: "Chris Burniske", rec: "recommended" },
  { title: "The Age of Cryptocurrency", author: "Paul Vigna", rec: "recommended" },
  { title: "Digital Gold", author: "Nathaniel Popper", rec: "recommended" },
  { title: "The Black Swan", author: "Nassim Nicholas Taleb", rec: "recommended" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", rec: "recommended" },
  { title: "The Innovator's Dilemma", author: "Clayton M. Christensen", rec: "recommended" },
  { title: "Crossing the Chasm", author: "Geoffrey A. Moore", rec: "recommended" },
  { title: "Venture Deals", author: "Brad Feld", rec: "recommended" },
  { title: "The Mom Test", author: "Rob Fitzpatrick", rec: "recommended" },
  { title: "The Everything Store", author: "Brad Stone", rec: "recommended" },
  { title: "Hooked", author: "Nir Eyal", rec: "skip" },
  { title: "Blitzscaling", author: "Reid Hoffman", rec: "skip" },
];

export type Movie = {
  title: string;
  year: string;
  rec: Recommendation;
  note?: string;
};

export const movies: Movie[] = [
  { title: "Blade Runner 2049", year: "2017", rec: "highly" },
  { title: "The Matrix", year: "1999", rec: "highly" },
  { title: "Inception", year: "2010", rec: "highly" },
  { title: "Ex Machina", year: "2014", rec: "highly" },
  { title: "Arrival", year: "2016", rec: "highly" },
  { title: "Ghost in the Shell", year: "1995", rec: "highly" },
  { title: "The Big Short", year: "2015", rec: "highly" },
  { title: "Her", year: "2013", rec: "recommended" },
  { title: "The Social Network", year: "2010", rec: "recommended" },
  { title: "Interstellar", year: "2014", rec: "recommended" },
  { title: "Minority Report", year: "2002", rec: "recommended" },
  { title: "The Imitation Game", year: "2014", rec: "recommended" },
  { title: "Tron: Legacy", year: "2010", rec: "recommended" },
  { title: "Ready Player One", year: "2018", rec: "skip" },
  { title: "Transcendence", year: "2014", rec: "skip" },
];

export type Game = {
  index: string;
  title: string;
  platform: string;
  status: "playing" | "finished" | "paused";
};

export const games: Game[] = [];

export const recLabel: Record<Recommendation, { label: string; glyph: string }> = {
  highly: { label: "Highly recommend", glyph: "✓✓" },
  recommended: { label: "Recommend", glyph: "✓" },
  skip: { label: "Skip", glyph: "─" },
};
