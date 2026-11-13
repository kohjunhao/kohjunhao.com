// Rebuilds the 1828 harbour plate from the raw scan, so the crop can be reproduced.
// usage: node scripts/build-plate.mjs data/raw/singapore-1828.jpg
//
// Writes public/plate/singapore-1828-2600.webp and -1300.webp for the home page, and
// src/og/plate-dusk.jpg for the share card, which cannot blend layers itself.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { plateModel } from "../src/lib/plate.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "plate");
const DUSK_OUT = join(ROOT, "src", "og", "plate-dusk.jpg");

// The scan's border and title are trimmed off by these fractions of its size.
const TRIM = { left: 0.016, right: 0.988, top: 0.03, bottom: 0.905 };
const STRIP_RATIO = 3.3;
// The strip sits this far down the height left over after cutting it.
const STRIP_DROP = 0.34;
// Levels: these greys become black and white, so the paper reads as clean as the page.
const BLACK_POINT = 28;
const WHITE_POINT = 206;
const WIDTHS = [2600, 1300];
const WEBP_QUALITY = 80;

const DUSK_MINUTE = 18 * 60 + 18;
const OG_WIDTH = 1200;
const OG_HEIGHT = Math.round(OG_WIDTH / STRIP_RATIO);
const JPEG_QUALITY = 86;

const scan = process.argv[2];
if (!scan) {
  console.error("usage: node scripts/build-plate.mjs <raw scan.jpg>");
  process.exit(1);
}

async function engraving() {
  const { width, height } = await sharp(scan).metadata();
  const px = (n) => Math.floor(n);
  const left = px(width * TRIM.left);
  const top = px(height * TRIM.top);
  const trimmedW = px(width * TRIM.right) - left;
  const trimmedH = px(height * TRIM.bottom) - top;
  const stripH = px(trimmedW / STRIP_RATIO);
  const drop = px((trimmedH - stripH) * STRIP_DROP);
  const scale = 255 / (WHITE_POINT - BLACK_POINT);

  const cropped = await sharp(scan)
    .grayscale()
    .extract({ left, top: top + drop, width: trimmedW, height: stripH })
    .png()
    .toBuffer();
  return sharp(cropped).linear(scale, -BLACK_POINT * scale).png().toBuffer();
}

async function duskPlate(strip) {
  const m = plateModel();
  const sky = m.skyAt(DUSK_MINUTE);
  const orb = m.orbAt(DUSK_MINUTE);
  const r = m.orbRadius(OG_WIDTH, "sun");
  const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">
    <rect width="100%" height="100%" fill="rgb(${sky.join(",")})"/>
    <circle cx="${OG_WIDTH * orb.x}" cy="${OG_HEIGHT * orb.y}" r="${r}" fill="${m.sunColor(orb.arc)}"/>
  </svg>`;
  const engraved = await sharp(strip).resize(OG_WIDTH, OG_HEIGHT, { fit: "cover" }).toColourspace("srgb").toBuffer();

  mkdirSync(dirname(DUSK_OUT), { recursive: true });
  await sharp(Buffer.from(backdrop))
    .composite([{ input: engraved, blend: "multiply" }])
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(DUSK_OUT);
  console.log("wrote", DUSK_OUT);
}

const strip = await engraving();
mkdirSync(OUT_DIR, { recursive: true });
for (const w of WIDTHS) {
  const out = join(OUT_DIR, `singapore-1828-${w}.webp`);
  const { width, height } = await sharp(strip).metadata();
  const info = await sharp(strip)
    .resize(w, Math.floor((height * w) / width), { fit: "fill" })
    .webp({ quality: WEBP_QUALITY })
    .toFile(out);
  console.log("wrote", out, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
}
await duskPlate(strip);
