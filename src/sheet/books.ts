import { books } from "@/lib/shelf";
import { fullDate } from "./format";
import type { Sheet } from "./model";
import { coverPicture } from "./pictures";
import { countIf, tableSheet, tally } from "./table";

const READ = 3;
const YEAR_DIGITS = 4;

export function buildBooks(): Sheet {
  const n = books.length;
  const years = tally(books.flatMap((b) => (b.read ? [b.read.slice(0, YEAR_DIGITS)] : []))).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return tableSheet({
    slug: "books",
    columns: [
      { name: "Title", width: 320, mobileWidth: 220 },
      { name: "Author", width: 220 },
      { name: "Genre", width: 160 },
      { name: "Read", width: 120 },
    ],
    body: books.map((b) => [
      { v: b.title, picture: coverPicture("books", b.slug, b.title) },
      { v: b.author },
      { v: b.genre },
      b.read ? { v: b.read, text: fullDate(b.read) } : null,
    ]),
    pivot: [
      {
        kind: "counts",
        title: "By year read",
        items: years.map(([year, count]) => ({ label: year, count, fx: countIf(READ, n, `${year}*`) })),
      },
    ],
  });
}
