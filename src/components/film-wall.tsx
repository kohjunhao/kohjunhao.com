"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export type FilmGroup = "movies" | "series" | "anime";

export type WallFilm = {
  slug: string;
  title: string;
  year: number | null;
  group: FilmGroup;
  /** The tile, rendered on the server so the cover manifest stays out of the client bundle. */
  tile: ReactNode;
};

type Filter = "all" | FilmGroup;
type Sort = "newest" | "oldest" | "az";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "movies", label: "Movies" },
  { key: "series", label: "Series" },
  { key: "anime", label: "Anime" },
];

const SORTS: { key: Sort; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "az", label: "A to Z" },
];

const LABEL_EVERY = 10;

const byTitle = (a: WallFilm, b: WallFilm) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" });

/** Undated titles sort last whichever way the years run. */
function byYear(direction: 1 | -1) {
  return (a: WallFilm, b: WallFilm) => {
    if (a.year === b.year) {
      return byTitle(a, b);
    }
    if (a.year === null) {
      return 1;
    }
    if (b.year === null) {
      return -1;
    }
    return (a.year - b.year) * direction;
  };
}

const SORTERS: Record<Sort, (a: WallFilm, b: WallFilm) => number> = {
  newest: byYear(-1),
  oldest: byYear(1),
  az: byTitle,
};

const titles = (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "title" : "titles"}`;

export function FilmWall({ films, first, last }: { films: WallFilm[]; first: number; last: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [year, setYear] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const inGroup = films.filter((f) => filter === "all" || f.group === filter);
  const shown = inGroup.filter((f) => year === null || f.year === year).sort(SORTERS[sort]);

  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const counts = new Map<number, number>();
  for (const f of inGroup) {
    if (f.year !== null) {
      counts.set(f.year, (counts.get(f.year) ?? 0) + 1);
    }
  }
  const peak = Math.max(1, ...counts.values());
  const focus = hovered ?? year;
  const readout =
    focus === null ? `${titles(shown.length)} shown` : `${focus}, ${titles(counts.get(focus) ?? 0)}`;

  return (
    <>
      <div className="v3-ruler-wrap" style={{ "--years": years.length } as CSSProperties}>
        <p className="v3-ruler-readout" aria-live="polite">
          {readout}
          {year !== null && (
            <button type="button" className="v3-ruler-clear" onClick={() => setYear(null)}>
              Clear year
            </button>
          )}
        </p>
        <div className="v3-ruler" role="group" aria-label="Titles by release year" onMouseLeave={() => setHovered(null)}>
          {years.map((y) => {
            const n = counts.get(y) ?? 0;
            return (
              <button
                key={y}
                type="button"
                className="v3-bar"
                style={{ "--h": n / peak } as CSSProperties}
                aria-label={`${y}, ${titles(n)}`}
                aria-pressed={year === y}
                data-empty={n === 0 || undefined}
                disabled={n === 0}
                onMouseEnter={() => setHovered(y)}
                onFocus={() => setHovered(y)}
                onBlur={() => setHovered(null)}
                onClick={() => setYear(year === y ? null : y)}
              />
            );
          })}
        </div>
        <div className="v3-ruler-years" aria-hidden>
          {years.map((y, i) =>
            y % LABEL_EVERY === 0 ? (
              <span key={y} style={{ gridColumn: `${i + 1} / span ${LABEL_EVERY}` }}>
                {y}
              </span>
            ) : null,
          )}
        </div>
      </div>

      <div className="v3-wall-tools">
        <div className="v3-toggle" role="group" aria-label="Kind">
          {FILTERS.map(({ key, label }) => (
            <button key={key} type="button" className="v3-pill" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="v3-toggle" role="group" aria-label="Order">
          {SORTS.map(({ key, label }) => (
            <button key={key} type="button" className="v3-pill" aria-pressed={sort === key} onClick={() => setSort(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="v3-wall">
        {shown.map((f) => (
          <div key={f.slug}>{f.tile}</div>
        ))}
      </div>
      {shown.length === 0 && <p className="v3-caption">Nothing here for that year.</p>}
    </>
  );
}
