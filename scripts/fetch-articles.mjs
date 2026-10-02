// Fetches kjh's Paragraph essays as Markdown into data/raw/articles/<slug>.md (gitignored).
// paragraph.com returns the post as Markdown when asked for text/markdown, with a short
// header that build-articles.mjs strips. Add a slug here when he publishes a new essay.
// usage: node scripts/fetch-articles.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "data", "raw", "articles");
const BLOG = "https://paragraph.com/@0xvega";
const SLUGS = [
  "write-up-on-convex",
  "web3-s-current-state-and-improvements",
  "new-protocols-to-look-out-for-q2-2022",
  "defi-1-0-the-problems-and-the-road-back-up",
];

mkdirSync(OUT_DIR, { recursive: true });
for (const slug of SLUGS) {
  const res = await fetch(`${BLOG}/${slug}`, { headers: { Accept: "text/markdown", "User-Agent": "kohjunhao.com build" } });
  if (!res.ok) {
    console.log(`FAIL ${slug}: ${res.status}`);
    continue;
  }
  const markdown = await res.text();
  writeFileSync(join(OUT_DIR, `${slug}.md`), markdown);
  console.log(`ok ${slug}: ${markdown.split(/\s+/).length} words`);
}
