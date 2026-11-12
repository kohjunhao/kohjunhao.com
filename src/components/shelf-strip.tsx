import Link from "next/link";
import { Tile } from "@/components/tile";
import { boardGames, books, cover, films, games, type Film } from "@/lib/shelf";

const FILM_COUNT = 22;
const BOOK_COUNT = 8;

const newestFirst = (a: Film, b: Film) => (b.year ?? 0) - (a.year ?? 0);

export function ShelfStrip() {
  const filmTiles = [...films]
    .sort(newestFirst)
    .filter((f) => cover("films", f.slug))
    .slice(0, FILM_COUNT);
  const bookTiles = books.filter((b) => cover("books", b.slug)).slice(0, BOOK_COUNT);

  const pages = [
    { label: "Films and shows", href: "/films", count: films.length },
    { label: "Books", href: "/books", count: books.length },
    { label: "Games", href: "/games", count: games.length + boardGames.length },
  ];

  const tiles = (
    <>
      {filmTiles.map((f) => (
        <Tile key={f.slug} kind="films" slug={f.slug} title={f.title} year={f.year} caption={f.director || undefined} />
      ))}
      {bookTiles.map((b) => (
        <Tile key={b.slug} kind="books" slug={b.slug} title={b.title} caption={b.author || undefined} />
      ))}
    </>
  );

  return (
    <section className="v3-frame shelf" aria-labelledby="shelf">
      <div className="sec-head">
        <h2 id="shelf">
          Shore leave. <span>Watched, read and played.</span>
        </h2>
      </div>

      {/* The row is doubled so the drift can loop without a seam. */}
      <div className="shelf-belt">
        <div className="shelf-track">
          <div className="shelf-run">{tiles}</div>
          <div className="shelf-run" aria-hidden>
            {tiles}
          </div>
        </div>
      </div>

      <nav className="shelf-pages" aria-label="The shelves">
        {pages.map(({ label, href, count }) => (
          <Link key={href} href={href}>
            <b>{count.toLocaleString("en-US")}</b>
            <span>{label}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M5.5 3 9.5 7l-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </nav>
    </section>
  );
}
