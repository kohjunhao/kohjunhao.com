import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Koh Jun Hao — Operator, researcher. Writing and building, quietly.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f0eee9",
          color: "#1b1a17",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#3a4a7a",
          }}
        >
          koh jun hao · kohjunhao.com
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Koh Jun Hao
          </div>
          <div
            style={{
              fontSize: 36,
              fontStyle: "italic",
              color: "#6d6a62",
              maxWidth: 880,
              lineHeight: 1.25,
            }}
          >
            Reading, writing, writing cheques.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#6d6a62",
          }}
        >
          <span>paragraph · @0xvega</span>
          <div
            style={{
              width: 88,
              height: 88,
              background: "#8b3a3a",
              color: "#f0eee9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "serif",
              fontSize: 52,
              fontWeight: 600,
              transform: "rotate(-3deg)",
            }}
          >
            印
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
