import Link from "next/link";
import { Tile } from "@/components/tile";
import { books, cover, films, type Film } from "@/lib/shelf";

const FILM_COUNT = 24;
const BOOK_COUNT = 8;
const MIN_TILES = 12;

const newestFirst = (a: Film, b: Film) => (b.year ?? 0) - (a.year ?? 0);

const PAGES = [
  { label: "Films", href: "/films" },
  { label: "Books", href: "/books" },
  { label: "Games", href: "/games" },
];

export function ShelfStrip() {
  const newest = [...films].sort(newestFirst);
  const covered = newest.filter((f) => cover("films", f.slug)).slice(0, FILM_COUNT);
  const bookTiles = books.filter((b) => cover("books", b.slug)).slice(0, BOOK_COUNT);
  const shortBy = MIN_TILES - covered.length - bookTiles.length;
  const filler = shortBy > 0 ? newest.filter((f) => !covered.includes(f)).slice(0, shortBy) : [];

  return (
    <section className="v3-frame v3-strip" aria-labelledby="shelf">
      <div className="v3-activity-head">
        <h2 id="shelf" className="v3-label">
          Shelf
        </h2>
        <span className="v3-caption">What I watched, read and played</span>
      </div>

      <div className="v3-strip-row">
        {[...covered, ...filler].map((f) => (
          <Tile key={f.slug} kind="films" slug={f.slug} title={f.title} year={f.year} caption={f.director || undefined} />
        ))}
        {bookTiles.map((b) => (
          <Tile key={b.slug} kind="books" slug={b.slug} title={b.title} caption={b.author || undefined} />
        ))}
      </div>

      <nav className="v3-strip-links" aria-label="See all">
        <span className="v3-caption">See all</span>
        {PAGES.map(({ label, href }) => (
          <Link key={href} href={href} className="v3-pill">
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
