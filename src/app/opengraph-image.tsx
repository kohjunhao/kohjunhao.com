import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { leadText } from "@/lib/lead";
import { site } from "@/lib/site";

export const alt = `${site.name}. ${leadText}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f7f4ea";
const INK = "#14130f";
const LINE = "rgba(20,19,15,.13)";
const SERIF = "Newsreader";

// Rendered at dusk by scripts/build-plate.mjs, because this renderer cannot blend layers.
const PLATE = { width: 1200, height: 364 };
const OG_DIR = join(process.cwd(), "src", "og");

const assets = Promise.all([
  readFile(join(OG_DIR, "Newsreader-36pt-Regular.ttf")),
  readFile(join(OG_DIR, "plate-dusk.jpg")),
]);

export default async function Image() {
  const [serif, plate] = await assets;

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: PAPER, color: INK, fontFamily: SERIF }}>
        <img
          src={`data:image/jpeg;base64,${plate.toString("base64")}`}
          width={PLATE.width}
          height={PLATE.height}
          alt=""
          style={{ borderBottom: `1px solid ${LINE}` }}
        />
        <div style={{ display: "flex", flexDirection: "column", padding: "34px 64px 0" }}>
          <div style={{ fontSize: 28, lineHeight: 1.2 }}>{site.name}</div>
          <div style={{ marginTop: 14, fontSize: 40, lineHeight: 1.13, letterSpacing: -0.6, maxWidth: 1020 }}>{leadText}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: SERIF, data: serif, weight: 400, style: "normal" }],
    },
  );
}
