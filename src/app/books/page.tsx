import type { Metadata } from "next";
import { Spine } from "@/components/spine";
import { TopBar } from "@/components/top-bar";
import { books, type Book } from "@/lib/shelf";

export const metadata: Metadata = {
  title: "Books",
  description: "Every book I have finished, on a shelf, grouped by the year I read it.",
};

const UNDATED = "Undated";

/** Biggest year first, so the full shelves lead; books with no date go last. */
function byYearRead(list: Book[]) {
  const groups = new Map<string, Book[]>();
  for (const book of list) {
    const key = book.read ? book.read.slice(0, 4) : UNDATED;
    groups.set(key, [...(groups.get(key) ?? []), book]);
  }
  return [...groups.entries()].sort(([a, x], [b, y]) => {
    if (a === UNDATED) {
      return 1;
    }
    if (b === UNDATED) {
      return -1;
    }
    return y.length - x.length || Number(b) - Number(a);
  });
}

export default function BooksPage() {
  const groups = byYearRead(books);
  const topYear = groups[0][0];

  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />

      <main id="main" className="v3-frame v3-shelf v3-books">
        <header className="v3-shelf-head">
          <h1 className="v3-label">Books</h1>
          <p className="v3-sum">
            {books.length} finished, most of them in {topYear}
          </p>
        </header>

        {groups.map(([year, list]) => (
          <section key={year} className="v3-bookcase-group" aria-label={year}>
            <h2 className="v3-label">
              {year} <span className="v3-row-count">{list.length}</span>
            </h2>
            <ul className="v3-bookcase">
              {list.map((book) => (
                <Spine key={book.slug} book={book} />
              ))}
            </ul>
          </section>
        ))}

        <p className="v3-credit">Covers and colours from Open Library</p>
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
