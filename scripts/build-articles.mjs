// Builds src/content/articles.json from the essays saved off Paragraph in data/raw/articles/<slug>.md,
// and copies each essay's pictures into public/articles/<slug>/<n>.webp.
// usage: node scripts/build-articles.mjs [--force]   (--force downloads pictures that already exist)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const RAW_DIR = join(ROOT, "data", "raw", "articles");
const IMG_DIR = join(ROOT, "public", "articles");
const OUT = join(ROOT, "src", "content", "articles.json");

const WORDS_PER_MINUTE = 220;
const DESCRIPTION_MAX = 160;
const IMG_MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

// Paragraph's slugs and publish dates. An essay saved with front matter carries no date.
const ESSAYS = [
  { slug: "write-up-on-convex", date: "2022-06-30" },
  { slug: "web3-s-current-state-and-improvements", date: "2022-06-25" },
  { slug: "new-protocols-to-look-out-for-q2-2022", date: "2022-04-25" },
  { slug: "defi-1-0-the-problems-and-the-road-back-up", date: "2022-04-25" },
];

const force = process.argv.includes("--force");

function splitFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    return { meta: {}, body: raw };
  }
  const meta = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

// "# Title", then "By [0xvega](...) · 2022-06-30", then a "---" rule.
function splitHeader(body) {
  const match = body.match(/^# (.+)\n+By .+\n+---\n/);
  if (!match) {
    return { title: undefined, body };
  }
  return { title: match[1].trim(), body: body.slice(match[0].length) };
}

function stripChrome(body) {
  return (
    body
      // Paragraph's page furniture saved after the essay: search box, sign in, JSON-LD.
      .replace(/\n+Search\.\.\.[\s\S]*$/, "\n")
      .replace(/\n+---\n+\*Originally published on [\s\S]*$/, "\n")
      .replace(/!\[[^\]]*\]\(https:\/\/paragraph\.com\/branding\/[^)]*\)\n*/g, "")
      // The export escapes some tildes twice, which would print "(\~409K USD)".
      .replace(/\\\\~/g, "\\~")
  );
}

// "1) Retrograde" underlined with dashes would parse as a list and a rule, so setext
// headings become ATX ones before anything else reads the Markdown.
function atxHeadings(body) {
  return body.replace(/^([^\n#>*!\-=\s][^\n]*)\n(=+|-+)[ \t]*$/gm, (_, text, bar) =>
    `${bar.startsWith("=") ? "#" : "##"} ${text.trim()}`,
  );
}

const plain = (md) =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\([\\`*_{}[\]()#+\-.!~])/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Paragraph repeats each picture's alt text as the next paragraph; the page renders the alt
// as the caption, so the repeat goes.
function dropRepeatedCaptions(body) {
  const kept = [];
  for (const block of body.split(/\n{2,}/)) {
    const image = kept.at(-1)?.match(/^!\[([^\]]+)\]\([^)]*\)$/);
    if (image && plain(block) === plain(image[1])) {
      continue;
    }
    kept.push(block);
  }
  return kept.join("\n\n");
}

// img.paragraph.com serves storage.googleapis.com originals through a resizer; fetch the original.
const originalUrl = (url) => url.replace(/^https:\/\/img\.paragraph\.com\/cdn-cgi\/image\/[^/]+\//, "");

async function localizeImages(slug, body) {
  const dir = join(IMG_DIR, slug);
  const jobs = [];
  const rewritten = body.replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, (_, alt, url) => {
    const n = jobs.length + 1;
    jobs.push({ file: join(dir, `${n}.webp`), url: originalUrl(url) });
    return `![${alt}](/articles/${slug}/${n}.webp)`;
  });
  for (const { file, url } of jobs) {
    if (existsSync(file) && !force) {
      continue;
    }
    mkdirSync(dir, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${url}: HTTP ${res.status}`);
    }
    await sharp(Buffer.from(await res.arrayBuffer()))
      .resize({ width: IMG_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(file);
    console.log(`  ${file.slice(ROOT.length + 1)}`);
  }
  return rewritten;
}

function trimTo(text, max) {
  if (text.length <= max) {
    return text;
  }
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:]+$/, "")}…`;
}

// The first block of running prose: not a picture, a heading, a rule, a bare link or a bold label.
function firstParagraph(body) {
  const block = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .find((b) => b && !/^(!\[|#|---|\*\*[^*]+\*\*$|https?:)/.test(b));
  return plain(block ?? "");
}

const countWords = (md) => plain(md.replace(/https?:\/\/\S+/g, "")).split(" ").filter(Boolean).length;

const articles = [];
for (const { slug, date } of ESSAYS) {
  console.log(slug);
  const raw = readFileSync(join(RAW_DIR, `${slug}.md`), "utf8").replace(/\r\n/g, "\n");
  const { meta, body: afterMeta } = splitFrontMatter(raw);
  const { title: headerTitle, body: afterHeader } = splitHeader(afterMeta.trimStart());
  const title = meta.title ?? headerTitle;
  if (!title) {
    throw new Error(`${slug}: no title in front matter or header`);
  }
  const cleaned = dropRepeatedCaptions(atxHeadings(stripChrome(afterHeader)).trim());
  const markdown = `${(await localizeImages(slug, cleaned)).trim()}\n`;
  articles.push({
    slug,
    title,
    date,
    description: trimTo(plain(meta.description ?? firstParagraph(markdown)), DESCRIPTION_MAX),
    minutes: Math.max(1, Math.round(countWords(markdown) / WORDS_PER_MINUTE)),
    markdown,
  });
}

articles.sort((a, b) => b.date.localeCompare(a.date));
writeFileSync(OUT, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`wrote ${OUT.slice(ROOT.length + 1)}: ${articles.map((a) => `${a.slug} ${a.minutes} min`).join(", ")}`);
