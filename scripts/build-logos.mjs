// Fetches a small logo for each company on the investments page into public/logos/<slug>.webp
// and writes src/data/logos.json ({ slug: { w, h } }). Sources, keyless: Clearbit's logo
// service by domain, then Google's favicon service as the fallback. Companies without a
// site, or whose logo cannot be found, get no file and the page draws their initial instead.
// usage: node scripts/build-logos.mjs [--force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const STOCK = readFileSync(join(ROOT, "src", "lib", "stock.ts"), "utf8");
const OUT_DIR = join(ROOT, "public", "logos");
const MANIFEST = join(ROOT, "src", "data", "logos.json");
const UA = "kohjunhao.com logo build (https://kohjunhao.com)";
const SIZE = 128;
const MIN_SIZE = 32;
const PAUSE_MS = 150;
const force = process.argv.includes("--force");

// Mirrors investmentSlug() in src/lib/stock.ts so file names match the page.
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const companies = [...STOCK.matchAll(/\{ name: "([^"]+)"(?:, url: "([^"]+)")?/g)].map(([, name, url]) => ({
  name,
  slug: slugify(name),
  host: url ? new URL(url).hostname.replace(/^www\./, "") : null,
}));

async function fetchImage(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) {
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    if (!meta.width || meta.width < MIN_SIZE) {
      return null;
    }
    return buf;
  } catch {
    return null;
  }
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
mkdirSync(OUT_DIR, { recursive: true });
let found = 0;
for (const { name, slug, host } of companies) {
  const file = join(OUT_DIR, `${slug}.webp`);
  if (!host || (manifest[slug] && existsSync(file) && !force)) {
    continue;
  }
  const image =
    (await fetchImage(`https://logo.clearbit.com/${host}?size=${SIZE}`)) ??
    (await fetchImage(`https://www.google.com/s2/favicons?domain=${host}&sz=${SIZE}`));
  if (!image) {
    console.log(`miss ${name} (${host})`);
    continue;
  }
  const info = await sharp(image).resize(SIZE, SIZE, { fit: "inside" }).webp({ quality: 85 }).toFile(file);
  manifest[slug] = { w: info.width, h: info.height };
  found += 1;
  await new Promise((r) => setTimeout(r, PAUSE_MS));
}
writeFileSync(MANIFEST, JSON.stringify(manifest));
console.log(`done: ${found} logos written, ${Object.keys(manifest).length} in the manifest of ${companies.length} companies`);
