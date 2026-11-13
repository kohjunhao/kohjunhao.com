import { films } from "@/lib/shelf";
import { oneDecimal } from "./format";
import type { Sheet } from "./model";
import { coverPicture } from "./pictures";
import { bodyRange, countIf, numberCell, tableSheet, tally } from "./table";

const YEAR = 1;
const TYPE = 2;
const PLATFORM = 5;
const HOURS = 6;
const TOP_PLATFORMS = 8;
const DECADE = 10;

export function buildFilms(): Sheet {
  const n = films.length;
  const decades = tally(films.flatMap((f) => (f.year ? [String(Math.floor(f.year / DECADE) * DECADE)] : []))).sort(
    (a, b) => Number(a[0]) - Number(b[0]),
  );
  const hours = films.reduce((sum, f) => sum + (f.hours ?? 0), 0);
  const years = bodyRange(YEAR, n);

  return tableSheet({
    slug: "films",
    coverShape: "portrait",
    columns: [
      { name: "Title", width: 300, mobileWidth: 220 },
      { name: "Year", width: 64 },
      { name: "Type", width: 110 },
      { name: "Genres", width: 210 },
      { name: "Director", width: 190 },
      { name: "Platform", width: 120 },
      { name: "Hours", width: 72 },
    ],
    body: films.map((f) => [
      { v: f.title, picture: coverPicture("films", f.slug, f.title) },
      f.year ? { v: f.year, text: String(f.year), align: "right" } : null,
      { v: f.type },
      { v: f.genres.join(", ") },
      { v: f.director },
      { v: f.platform },
      f.hours === null ? null : numberCell(f.hours, oneDecimal(f.hours)),
    ]),
    pivot: [
      {
        kind: "counts",
        title: "By type",
        items: tally(films.map((f) => f.type)).map(([label, count]) => ({ label, count, fx: countIf(TYPE, n, label) })),
      },
      {
        kind: "counts",
        title: "By platform",
        items: tally(films.map((f) => f.platform).filter(Boolean))
          .slice(0, TOP_PLATFORMS)
          .map(([label, count]) => ({ label, count, fx: countIf(PLATFORM, n, label) })),
      },
      {
        kind: "counts",
        title: "By decade",
        items: decades.map(([decade, count]) => ({
          label: `${decade}s`,
          count,
          fx: `=COUNTIFS(${years},">=${decade}",${years},"<${Number(decade) + DECADE}")`,
        })),
      },
      { kind: "total", label: "Hours watched", value: hours, text: oneDecimal(hours), fx: `=SUM(${bodyRange(HOURS, n)})` },
    ],
  });
}
