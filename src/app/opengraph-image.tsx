import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const alt = "Koh Jun Hao. Analyst at Ouroboros Capital. Ships things.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ROOT = process.cwd();
const SKY = "#0a3886";
const ART_HEIGHT = 300;

export default async function Image() {
  // A static instance, cut from the variable font, because Satori reads TTF only.
  const font = await readFile(join(ROOT, "src", "fonts", "CalSans-SemiBold-og.ttf"));
  // Satori draws JPEG and PNG, so the footer's webp is converted on the way in.
  const art = await sharp(join(ROOT, "public", "footer", "singapore-1828-1200.webp")).jpeg({ quality: 85 }).toBuffer();
  const artUrl = `data:image/jpeg;base64,${art.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "Cal Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px 0", flex: 1 }}>
          <div style={{ fontSize: 26, color: "#8a8a8a" }}>kohjunhao.com</div>
          <div style={{ marginTop: 28, fontSize: 92, fontWeight: 600, letterSpacing: -3, color: "#1f1f1f" }}>Koh Jun Hao</div>
          <div style={{ marginTop: 12, display: "flex", fontSize: 40, fontWeight: 500, letterSpacing: -1 }}>
            <span style={{ color: "#1f1f1f" }}>Ships things.</span>
            <span style={{ color: "#8a8a8a", marginLeft: 14 }}>This is the log.</span>
          </div>
        </div>
        <div style={{ display: "flex", height: ART_HEIGHT, background: SKY, overflow: "hidden", alignItems: "flex-end" }}>
          <img src={artUrl} alt="" width={1200} height={420} style={{ width: 1200, height: 420, objectFit: "cover", objectPosition: "50% 100%" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Cal Sans", data: font, weight: 600, style: "normal" }],
    },
  );
}
