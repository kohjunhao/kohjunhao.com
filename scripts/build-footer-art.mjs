// Builds public/footer/singapore-1828.webp for the site footer: Robert James Elliot's
// "View of the town and roads of Singapore from the Government Hill" (published 1828,
// public domain) recoloured as blue ink on cream paper, with the sky turned the footer's
// own blue so the picture grows out of the footer instead of sitting in a box.
// usage: node scripts/build-footer-art.mjs
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SOURCE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/8/84/View_of_the_town_and_roads_of_Singapore_from_the_government_hill_published_1828.jpg";
const SOURCE = join(ROOT, "data", "raw", "singapore-1828.jpg");
const OUT_DIR = join(ROOT, "public", "footer");
// Two widths: the full one for desktop, the small one for phones where the footer shows
// a 220px-tall slice of the picture.
const OUTPUTS = [
  { name: "singapore-1828.webp", width: 2400 },
  { name: "singapore-1828-1200.webp", width: 1200 },
];

// Trims the plate border, the white margin above the sky and the caption line under the
// picture. The ratio is exactly 2400:840, the size the footer markup declares.
const CROP = { left: 56, top: 48, width: 3728, height: 1305 };
const OUT_WIDTH = 2400;
const SKY = [10, 56, 134]; // --sky in src/app/v3.css
const CREAM = [251, 236, 209];

// Paper tone is estimated from the brightest pixel in each neighbourhood, so dense
// hatching does not read as dark paper. Scaled down first because a max filter in JS is slow.
const PAPER_SCALE = 8;
const PAPER_RADIUS = 3;
const PAPER_BLUR = 3;
const INK_PERCENTILE = 0.01;
const SKY_BLUR = 2;
// Clouds run down to about 0.7 of the sky's brightness and the far hills sit at about 0.82,
// so the fill is loose above the horizon band and strict inside it, where only the clear
// sky passes; the blur is small so the thin horizon line still fences the fill off the sea.
const CLOUD_THRESHOLD = 0.7;
const SKY_THRESHOLD = 0.9;
const HORIZON_ROW = 0.6;
const SEA_ROW = 0.66;
// The print was folded twice into its book, so two faint vertical bands cross the scan at
// about 31% and 62% of its width. A per-column gain, measured on rows where the band
// crosses even texture, flattens each without smearing the drawing.
const SEAMS = [
  { x0: 0.285, x1: 0.33, rows: [0.7, 0.95] },
  { x0: 0.59, x1: 0.655, rows: [0.12, 0.48] },
];
// The plate's border line runs along the very top, so the fill is seeded from the top
// few percent of rows rather than the first row alone.
const SKY_SEED_ROWS = 0.05;
const SKY_FEATHER = 2.5;
// The tallest trees touch the top edge; fading them into the sky over the top fifth
// avoids a hard horizontal cut where the picture meets the footer's blue.
const TOP_FADE = 0.2;
const INK_GAMMA = 1.15;
const WEBP_QUALITY = 78;

async function ensureSource() {
  if (existsSync(SOURCE)) {
    return;
  }
  const res = await fetch(SOURCE_URL, { headers: { "User-Agent": "kohjunhao.com build script" } });
  if (!res.ok) {
    throw new Error(`download failed: ${res.status}`);
  }
  mkdirSync(dirname(SOURCE), { recursive: true });
  writeFileSync(SOURCE, Buffer.from(await res.arrayBuffer()));
}

function flattenSeam(gray, w, h, seam) {
  const x0 = Math.round(w * seam.x0);
  const x1 = Math.round(w * seam.x1);
  const y0 = Math.round(h * seam.rows[0]);
  const y1 = Math.round(h * seam.rows[1]);
  const columnMean = (x) => {
    let sum = 0;
    for (let y = y0; y < y1; y++) {
      sum += gray[y * w + x];
    }
    return sum / (y1 - y0);
  };
  const left = columnMean(x0);
  const right = columnMean(x1);
  for (let x = x0; x <= x1; x++) {
    const trend = left + ((right - left) * (x - x0)) / (x1 - x0);
    const gain = Math.min(1.5, Math.max(1, trend / columnMean(x)));
    for (let y = 0; y < h; y++) {
      gray[y * w + x] = Math.min(255, Math.round(gray[y * w + x] * gain));
    }
  }
}

function maxFilter(src, w, h, r) {
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = Math.min(h - 1, Math.max(0, y + dy));
        for (let dx = -r; dx <= r; dx++) {
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          const v = src[yy * w + xx];
          if (v > m) {
            m = v;
          }
        }
      }
      out[y * w + x] = m;
    }
  }
  return out;
}

async function paperTone(gray, w, h) {
  const sw = Math.round(w / PAPER_SCALE);
  const sh = Math.round(h / PAPER_SCALE);
  const small = await grey(gray, w, h).resize(sw, sh).raw().toBuffer();
  const maxed = maxFilter(small, sw, sh, PAPER_RADIUS);
  return oneChannel(grey(Buffer.from(maxed), sw, sh).blur(PAPER_BLUR).resize(w, h), w * h);
}

// sharp widens a one-channel raw image to three channels on resize or blur unless the
// colourspace is pinned; every pixel loop below indexes a single channel.
function grey(buf, w, h) {
  return sharp(buf, { raw: { width: w, height: h, channels: 1 } }).toColourspace("b-w");
}

async function oneChannel(pipeline, expected) {
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 1 || data.length !== expected) {
    throw new Error(`expected one channel over ${expected} pixels, got ${info.channels} x ${data.length}`);
  }
  return data;
}

function percentile(values, q) {
  const sorted = Float32Array.from(values).sort();
  return sorted[Math.floor(sorted.length * q)];
}

// Sky = the light region connected to the top edge. A flood fill keeps the light sea and
// the pale far hills out, because hatching and the horizon line cut them off from the top.
async function skyMask(lum, w, h) {
  const bytes = Buffer.from(Uint8Array.from(lum, (v) => Math.round(v * 255)));
  const blurred = await oneChannel(grey(bytes, w, h).blur(SKY_BLUR), w * h);
  const light = new Uint8Array(w * h);
  const horizonFrom = Math.round(h * HORIZON_ROW) * w;
  const seaFrom = Math.round(h * SEA_ROW) * w;
  for (let i = 0; i < seaFrom; i++) {
    const threshold = i < horizonFrom ? CLOUD_THRESHOLD : SKY_THRESHOLD;
    light[i] = blurred[i] / 255 >= threshold ? 1 : 0;
  }
  const sky = new Uint8Array(w * h);
  const stack = [];
  const seedRows = Math.round(h * SKY_SEED_ROWS);
  for (let i = 0; i < w * seedRows; i++) {
    if (light[i]) {
      stack.push(i);
      sky[i] = 255;
    }
  }
  while (stack.length > 0) {
    const i = stack.pop();
    const x = i % w;
    const next = [i - 1, i + 1, i - w, i + w];
    for (const j of next) {
      if (j < 0 || j >= w * h) {
        continue;
      }
      if ((j === i - 1 && x === 0) || (j === i + 1 && x === w - 1)) {
        continue;
      }
      if (light[j] && !sky[j]) {
        sky[j] = 255;
        stack.push(j);
      }
    }
  }
  return oneChannel(grey(Buffer.from(sky), w, h).blur(SKY_FEATHER), w * h);
}

const smoothstep = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

async function build() {
  await ensureSource();
  const { data: gray, info } = await sharp(SOURCE)
    .extract(CROP)
    .resize(OUT_WIDTH)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  for (const seam of SEAMS) {
    flattenSeam(gray, w, h, seam);
  }

  const paper = await paperTone(gray, w, h);
  const lum = new Float32Array(w * h);
  for (let i = 0; i < lum.length; i++) {
    lum[i] = Math.min(1, gray[i] / Math.max(1, paper[i]));
  }
  const ink = percentile(lum, INK_PERCENTILE);
  for (let i = 0; i < lum.length; i++) {
    lum[i] = Math.max(0, (lum[i] - ink) / (1 - ink));
  }

  const sky = await skyMask(lum, w, h);
  const coverage = sky.reduce((a, b) => a + b, 0) / (255 * sky.length);
  if (process.env.FOOTER_ART_DEBUG) {
    await grey(Buffer.from(sky), w, h).png().toFile(process.env.FOOTER_ART_DEBUG);
  }
  const out = Buffer.alloc(w * h * 3);
  for (let i = 0; i < lum.length; i++) {
    const y = (i - (i % w)) / w;
    const fade = smoothstep(y / (h * TOP_FADE));
    const land = (1 - sky[i] / 255) * fade;
    const t = Math.pow(lum[i], INK_GAMMA);
    for (let c = 0; c < 3; c++) {
      const paperInk = SKY[c] + (CREAM[c] - SKY[c]) * t;
      out[i * 3 + c] = Math.round(SKY[c] + (paperInk - SKY[c]) * land);
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`ink floor ${ink.toFixed(3)}, sky ${(coverage * 100).toFixed(1)}%`);
  for (const { name, width } of OUTPUTS) {
    const file = join(OUT_DIR, name);
    await sharp(out, { raw: { width: w, height: h, channels: 3 } })
      .resize(width)
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(file);
    console.log(`ok ${file} ${width} wide, ${Math.round(statSync(file).size / 1024)} KB`);
  }
}

await build();
