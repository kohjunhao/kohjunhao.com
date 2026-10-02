// Fetches cover art for the shelf into public/shelf/<kind>/<slug>.webp and writes the
// manifest src/data/covers.json ({ kind: { slug: { w, h, page } } }). Sources, all keyless:
// Open Library for books, the Steam store for PC games, and the lead image of the English
// Wikipedia article for everything else, matched by title, year and type. Items that match
// nothing get no cover and the pages draw a typographic tile instead.
// usage: node scripts/build-shelf-covers.mjs [--limit N] [--force] [films|books|games|boardGames ...]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SHELF = JSON.parse(readFileSync(join(ROOT, "src", "data", "shelf.json"), "utf8"));
const MANIFEST = join(ROOT, "src", "data", "covers.json");
const OUT_DIR = join(ROOT, "public", "shelf");
const UA = "kohjunhao.com shelf build (https://kohjunhao.com)";
const COVER_WIDTH = 240;
const WEBP_QUALITY = 80;
const PAUSE_MS = 300;
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const MIN_IMAGE_WIDTH = 120;

const args = process.argv.slice(2);
const force = args.includes("--force");
const limitAt = args.indexOf("--limit");
const limit = limitAt >= 0 ? Number(args[limitAt + 1]) : Infinity;
const kinds = args.filter((a) => /^(films|books|games|boardGames)$/.test(a));
const only = kinds.length > 0 ? kinds : ["films", "books", "games", "boardGames"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

async function getImage(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    return null;
  }
  return Buffer.from(await res.arrayBuffer());
}

const normalise = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// A match needs the sheet title to appear in the article title (or the reverse), so a
// search that drifts to a different work is dropped rather than shown.
function titleMatches(wanted, found) {
  const a = normalise(wanted);
  const b = normalise(found.replace(/\s*\(.*\)\s*$/, ""));
  return a === b || b.startsWith(a) || a.startsWith(b) || b.includes(a);
}

async function wikipedia(query, wanted, expect) {
  const search = await getJson(`${WIKI_API}?action=query&list=search&srlimit=3&format=json&srsearch=${encodeURIComponent(query)}`);
  const hits = search?.query?.search ?? [];
  for (const hit of hits) {
    if (!titleMatches(wanted, hit.title)) {
      continue;
    }
    const summary = await getJson(WIKI_SUMMARY + encodeURIComponent(hit.title.replace(/ /g, "_")));
    const description = `${summary?.description ?? ""} ${summary?.extract?.slice(0, 200) ?? ""}`.toLowerCase();
    if (!expect.some((word) => description.includes(word))) {
      continue;
    }
    const image = summary?.originalimage ?? summary?.thumbnail;
    if (!image || image.width < MIN_IMAGE_WIDTH || /\.svg/i.test(image.source)) {
      continue;
    }
    return { url: image.source, page: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${hit.title}` };
  }
  return null;
}

const FILM_WORDS = {
  Movie: { suffix: "film", expect: ["film"] },
  Series: { suffix: "television series", expect: ["series", "show", "television"] },
  Anime: { suffix: "anime", expect: ["anime", "series", "manga"] },
  "Anime Movie": { suffix: "anime film", expect: ["film", "anime"] },
};
const FILM_DEFAULT = { suffix: "film", expect: ["film", "series", "show", "television", "anime"] };

const SOURCES = {
  films: async (item) => {
    const words = FILM_WORDS[item.type] ?? FILM_DEFAULT;
    const year = item.year ? ` ${item.year}` : "";
    return wikipedia(`${item.title}${year} ${words.suffix}`, item.title, words.expect);
  },
  books: async (item) => {
    const q = `title=${encodeURIComponent(item.title)}&author=${encodeURIComponent(item.author)}&limit=1&fields=cover_i,key,title`;
    const found = await getJson(`https://openlibrary.org/search.json?${q}`);
    const doc = found?.docs?.[0];
    if (!doc?.cover_i) {
      return null;
    }
    return { url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`, page: `https://openlibrary.org${doc.key}` };
  },
  games: async (item) => {
    const steam = await getJson(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(item.title)}&cc=sg&l=en`);
    const hit = steam?.items?.find((x) => titleMatches(item.title, x.name));
    if (hit) {
      return {
        url: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${hit.id}/library_600x900.jpg`,
        fallback: hit.tiny_image,
        page: `https://store.steampowered.com/app/${hit.id}`,
      };
    }
    return wikipedia(`${item.title} video game`, item.title, ["game"]);
  },
  boardGames: async (item) => wikipedia(`${item.title} board game`, item.title, ["game"]),
};

async function save(kind, item, found) {
  const image = (await getImage(found.url)) ?? (found.fallback ? await getImage(found.fallback) : null);
  if (!image) {
    return null;
  }
  const dir = join(OUT_DIR, kind);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${item.slug}.webp`);
  const info = await sharp(image).resize(COVER_WIDTH).webp({ quality: WEBP_QUALITY }).toFile(file);
  return { w: info.width, h: info.height, page: found.page };
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
let done = 0;
let missed = 0;
for (const kind of only) {
  manifest[kind] ??= {};
  for (const item of SHELF[kind].slice(0, limit)) {
    if (manifest[kind][item.slug] && !force && existsSync(join(OUT_DIR, kind, `${item.slug}.webp`))) {
      continue;
    }
    try {
      const found = await SOURCES[kind](item);
      const saved = found ? await save(kind, item, found) : null;
      if (saved) {
        manifest[kind][item.slug] = saved;
        done += 1;
      } else {
        missed += 1;
        console.log(`miss ${kind} ${item.title}`);
      }
    } catch (err) {
      missed += 1;
      console.log(`fail ${kind} ${item.title}: ${err.message}`);
    }
    writeFileSync(MANIFEST, JSON.stringify(manifest));
    await sleep(PAUSE_MS);
  }
}
// The books page colours each spine from its cover, so every manifest entry carries the
// cover's dominant colour. Computed here from the saved file, so a run that only needs
// colours is quick and needs no network.
async function fillColours() {
  let coloured = 0;
  for (const kind of Object.keys(manifest)) {
    for (const [slug, entry] of Object.entries(manifest[kind])) {
      const file = join(OUT_DIR, kind, `${slug}.webp`);
      if (entry.color || !existsSync(file)) {
        continue;
      }
      const { dominant } = await sharp(file).stats();
      entry.color = `#${[dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
      coloured += 1;
    }
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest));
  return coloured;
}

const coloured = await fillColours();
console.log(`done: ${done} covers written, ${missed} without, ${coloured} colours added`);
