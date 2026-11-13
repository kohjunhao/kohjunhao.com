import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { buildLog } from "@/sheet/log";
import { colLetter, isCell, shownText } from "@/sheet/model";

export const alt = "Koh Jun Hao's site, drawn as the corner of a spreadsheet.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#101114";
const INK_3 = "#8f95a1";
const LINE = "#e3e5e9";
const LINE_2 = "#cdd1d8";
const CHROME = "#f5f6f7";
const TODAY = "#fff7cc";
const BAD = "#d8402f";
const WARN = "#e5a50a";

const ROW_NUMBERS = 56;
const LETTERS = 36;
const MAIN = [180, 520, 116];
const WEEK = 22;
const WEEKS_SHOWN = 14;
const ROWS = [44, 96, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46];
const FIRST_MARK_ROW = 5;
const BAR_HEIGHT = 12;

const left = (col: number) => ROW_NUMBERS + MAIN.slice(0, col).reduce((s, w) => s + w, 0);
const weekLeft = (w: number) => left(MAIN.length) + w * WEEK;
const rowTop = (r: number) => LETTERS + ROWS.slice(0, r).reduce((s, h) => s + h, 0);

export default async function Image() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "src", "fonts", "Inter-Regular.ttf")),
    readFile(join(process.cwd(), "src", "fonts", "Inter-SemiBold.ttf")),
  ]);

  const log = buildLog();
  const table = log.table!;
  const weeks = log.columns.filter((c) => c.narrow).length;
  const firstWeekCol = table.lastCol - WEEKS_SHOWN + 1;
  const intro = log.rows[1][0];
  const introText = isCell(intro) ? shownText(intro) : "";

  const marks: { row: number; week: number; color: string }[] = [];
  for (let i = 0; FIRST_MARK_ROW + i < ROWS.length; i++) {
    const row = log.rows[table.first + i];
    for (let w = 0; w < Math.min(WEEKS_SHOWN, weeks); w++) {
      const cell = row?.[firstWeekCol + w];
      if (!isCell(cell) || !cell.fill?.startsWith("bar")) {
        continue;
      }
      const color = cell.fill === "bar-bad" ? BAD : cell.fill === "bar-warn" ? WARN : INK;
      marks.push({ row: FIRST_MARK_ROW + i, week: w, color });
    }
  }

  const columnEdges = [...MAIN.map((_, i) => left(i + 1)), ...Array.from({ length: WEEKS_SHOWN }, (_, w) => weekLeft(w + 1))];
  const letters = [...MAIN.map((w, i) => ({ x: left(i), w, label: colLetter(i) })), ...Array.from({ length: WEEKS_SHOWN }, (_, w) => ({ x: weekLeft(w), w: WEEK, label: "" }))];

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#ffffff", fontFamily: "Inter", color: INK }}>
        <div style={{ position: "absolute", left: weekLeft(WEEKS_SHOWN - 1), top: LETTERS, width: WEEK, height: 630 - LETTERS, background: TODAY }} />

        {ROWS.map((_, r) => (
          <div key={`h${r}`} style={{ position: "absolute", left: 0, top: rowTop(r + 1) - 1, width: 1200, height: 1, background: LINE }} />
        ))}
        {columnEdges.map((x, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: x - 1, top: 0, width: 1, height: 630, background: LINE }} />
        ))}

        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: LETTERS, background: CHROME, borderBottom: `1px solid ${LINE_2}` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: ROW_NUMBERS, height: 630, background: CHROME, borderRight: `1px solid ${LINE_2}` }} />
        {letters.map((l, i) => (
          <div key={`l${i}`} style={{ position: "absolute", left: l.x, top: 0, width: l.w, height: LETTERS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: INK_3, background: i === 0 || i === 1 ? "#ffe14d" : "transparent" }}>
            {l.label}
          </div>
        ))}
        {ROWS.map((h, r) => (
          <div key={`n${r}`} style={{ position: "absolute", left: 0, top: rowTop(r), width: ROW_NUMBERS, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: INK_3, background: r === 1 ? "#ffe14d" : "transparent" }}>
            {String(r + 1)}
          </div>
        ))}

        <div style={{ position: "absolute", left: left(0), top: rowTop(1), width: left(2) - left(0), height: ROWS[1] - 1, background: "#ffffff" }} />
        <div style={{ position: "absolute", left: left(0) + 18, top: rowTop(1), height: ROWS[1], display: "flex", alignItems: "center", fontSize: 64, fontWeight: 600, letterSpacing: -2 }}>
          {site.name}
        </div>
        <div style={{ position: "absolute", left: left(0) - 1, top: rowTop(1) - 1, width: left(2) - left(0) + 1, height: ROWS[1] + 1, border: `3px solid ${INK}` }} />
        <div style={{ position: "absolute", left: left(2) - 6, top: rowTop(2) - 6, width: 11, height: 11, background: INK, border: "2px solid #ffffff" }} />

        <div style={{ position: "absolute", left: left(0), top: rowTop(2), width: left(2) - left(0) - 1, height: ROWS[2] + ROWS[3] - 1, background: "#ffffff" }} />
        <div style={{ position: "absolute", left: left(0) + 18, top: rowTop(2) + 2, width: left(2) - left(0) - 36, display: "flex", fontSize: 26, lineHeight: 1.7, color: "#2b2e35" }}>
          {introText}
        </div>

        {marks.map((m, i) => (
          <div key={`m${i}`} style={{ position: "absolute", left: weekLeft(m.week), top: rowTop(m.row) + (ROWS[m.row] - BAR_HEIGHT) / 2, width: WEEK, height: BAR_HEIGHT, background: m.color }} />
        ))}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
