import logos from "@/data/logos.json";
import { investments, investmentSlug } from "@/lib/stock";
import type { Picture, Sheet } from "./model";
import { bodyRange, countIf, tableSheet, tally } from "./table";

const COMPANY = 0;
const CATEGORY = 1;
const SECTOR = 2;
const LOGO_SIZE = 16;

function logo(name: string): Picture | undefined {
  const slug = investmentSlug(name);
  if (!(slug in logos)) {
    return undefined;
  }
  return { src: `/logos/${slug}.webp`, w: LOGO_SIZE, h: LOGO_SIZE, alt: "" };
}

export function buildPortfolio(): Sheet {
  const n = investments.length;
  const rows = [...investments].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  const counts = (values: string[], col: number) =>
    tally(values).map(([label, count]) => ({ label, count, fx: countIf(col, n, label) }));

  return tableSheet({
    slug: "investments",
    columns: [
      { name: "Company", width: 260, mobileWidth: 200 },
      { name: "Category", width: 150 },
      { name: "Sector", width: 150 },
    ],
    body: rows.map((i) => [{ v: i.name, thumb: logo(i.name) }, { v: i.category ?? null }, { v: i.sector ?? null }]),
    pivot: [
      { kind: "counts", title: "By sector", items: counts(rows.map((i) => i.sector ?? ""), SECTOR) },
      { kind: "counts", title: "By category", items: counts(rows.map((i) => i.category ?? ""), CATEGORY) },
      { kind: "total", label: "Total", value: n, text: String(n), fx: `=COUNTA(${bodyRange(COMPANY, n)})` },
    ],
  });
}
