import { articles, PARAGRAPH_URL, paragraphUrl } from "@/lib/articles";
import { fullDate } from "./format";
import type { Sheet } from "./model";
import { numberCell, tableSheet } from "./table";

export function buildWriting(): Sheet {
  const sheet = tableSheet({
    slug: "articles",
    bodyKind: "entry",
    columns: [
      { name: "Title", width: 380, mobileWidth: 240 },
      { name: "Published", width: 120 },
      { name: "Minutes", width: 84 },
      { name: "About", width: 520 },
      { name: "Link", width: 110 },
    ],
    body: articles.map((a) => [
      { v: a.title, href: `/articles/${a.slug}` },
      { v: a.date, text: fullDate(a.date) },
      numberCell(a.minutes),
      { v: a.description },
      { v: "Read", href: paragraphUrl(a), role: "link" },
    ]),
  });

  const more = sheet.columns.map((_, c) => (c === 0 ? { v: "More on Paragraph", href: PARAGRAPH_URL } : null));
  return { ...sheet, rows: [...sheet.rows, more] };
}
