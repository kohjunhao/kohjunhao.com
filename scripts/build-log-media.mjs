// Builds the thumbnails for the log from scripts/log-media.json into public/log/<name>.jpg.
// Each item has one source: a page to screenshot (url), a frame of a video (video + at),
// an image file (file), or the preview picture stored inside a 3D print file (threemf).
// usage: node scripts/build-log-media.mjs [--force] [name ...]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "public", "log");
const WIDTH = 800;
const HEIGHT = 500;
const SHOT_WIDTH = 1280;
const SHOT_HEIGHT = 800;
const MAT = "0xF3F3F0";
const THREEMF_PREVIEWS = ["Auxiliaries/.thumbnails/thumbnail_middle.png", "Metadata/plate_1.png"];

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
const expand = (p) => p.replace(/^~/, homedir());

const manifest = JSON.parse(readFileSync(join(HERE, "log-media.json"), "utf8"));
const items = manifest.filter((item) => {
  if (only.length > 0 && !only.includes(item.name)) {
    return false;
  }
  return force || !existsSync(join(OUT_DIR, `${item.name}.jpg`));
});

const work = mkdtempSync(join(tmpdir(), "log-media-"));
mkdirSync(OUT_DIR, { recursive: true });

function ffmpeg(input, filter, output, extra = []) {
  execFileSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", ...extra, "-i", input, "-filter_complex", filter, "-frames:v", "1", "-q:v", "4", output],
    { stdio: "inherit" },
  );
}

// Fills the frame and crops the overflow: right for pages and video frames.
const COVER = `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`;
// Fits the whole picture on a pale mat: right for figures and product renders.
const CONTAIN =
  `color=c=${MAT}:s=${WIDTH}x${HEIGHT}[bg];` +
  `[0:v]scale=${WIDTH - 80}:${HEIGHT - 60}:force_original_aspect_ratio=decrease[fg];` +
  `[bg][fg]overlay=(W-w)/2:(H-h)/2:format=auto`;

function previewFrom3mf(path, dest) {
  for (const entry of THREEMF_PREVIEWS) {
    try {
      const png = execFileSync("unzip", ["-p", path, entry], { maxBuffer: 32 * 1024 * 1024 });
      if (png.length > 0) {
        writeFileSync(dest, png);
        return;
      }
    } catch {}
  }
  throw new Error(`no preview picture inside ${path}`);
}

try {
  const pages = items.filter((item) => item.url);
  if (pages.length > 0) {
    const jobs = pages.map((item) => ({
      url: item.url,
      out: join(work, `${item.name}.png`),
      w: SHOT_WIDTH,
      h: SHOT_HEIGHT,
      wait: item.wait ?? 3000,
    }));
    const jobsFile = join(work, "jobs.json");
    writeFileSync(jobsFile, JSON.stringify(jobs));
    execFileSync("node", [join(HERE, "shot.mjs"), jobsFile], { stdio: "inherit" });
  }

  for (const item of items) {
    const out = join(OUT_DIR, `${item.name}.jpg`);
    try {
      if (item.url) {
        ffmpeg(join(work, `${item.name}.png`), COVER, out);
      } else if (item.video) {
        ffmpeg(expand(item.video), COVER, out, ["-ss", String(item.at ?? 0)]);
      } else if (item.file) {
        ffmpeg(expand(item.file), CONTAIN, out);
      } else if (item.threemf) {
        const png = join(work, `${item.name}.png`);
        previewFrom3mf(expand(item.threemf), png);
        ffmpeg(png, CONTAIN, out);
      }
      console.log("built", `public/log/${item.name}.jpg`);
    } catch (err) {
      console.log("FAILED", item.name, err.message);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
