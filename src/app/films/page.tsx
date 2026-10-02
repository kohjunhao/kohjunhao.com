import type { Metadata } from "next";
import { FilmWall, type FilmGroup, type WallFilm } from "@/components/film-wall";
import { Tile } from "@/components/tile";
import { TopBar } from "@/components/top-bar";
import { films } from "@/lib/shelf";

export const metadata: Metadata = {
  title: "Films and shows",
  description: "Every film and show I have watched, by release year.",
};

/** The rare types (Short Film, Documentary, TV Special, Interactive Film, blank) count as movies. */
const GROUP_OF_TYPE: Partial<Record<string, FilmGroup>> = {
  Series: "series",
  Anime: "anime",
  "Anime Movie": "anime",
};

const HOURS_STEP = 10;

export default function FilmsPage() {
  const dated = films.flatMap((f) => (f.year === null ? [] : [f.year]));
  const first = Math.min(...dated);
  const last = Math.max(...dated);
  const hours = Math.round(films.reduce((sum, f) => sum + (f.hours ?? 0), 0) / HOURS_STEP) * HOURS_STEP;

  const wall: WallFilm[] = films.map((f) => ({
    slug: f.slug,
    title: f.title,
    year: f.year,
    group: GROUP_OF_TYPE[f.type] ?? "movies",
    tile: <Tile kind="films" slug={f.slug} title={f.title} year={f.year} caption={f.director || undefined} />,
  }));

  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />

      <main id="main" className="v3-frame v3-shelf">
        <header className="v3-shelf-head">
          <h1 className="v3-label">Films and shows</h1>
          <p className="v3-sum">
            {films.length.toLocaleString("en-US")} titles, about {hours.toLocaleString("en-US")} hours, {first} to {last}
          </p>
        </header>

        <FilmWall films={wall} first={first} last={last} />

        <p className="v3-credit">Covers from Wikipedia, Open Library and the Steam store</p>
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
