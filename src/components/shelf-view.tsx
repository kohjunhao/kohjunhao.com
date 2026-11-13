"use client";

import { useDeferredValue, useMemo, useState, type CSSProperties } from "react";
import { int } from "@/lib/format";
import type { Shelf, ShelfCell, ShelfItem } from "@/lib/shelf";

type View = "list" | "covers";
type Direction = "ascending" | "descending";
type Sort = { col: number; dir: Direction } | null;

const VIEWS: { id: View; label: string }[] = [
  { id: "list", label: "List" },
  { id: "covers", label: "Covers" },
];

/** A header click sorts ascending, then descending, then back to the list's own order. */
function nextSort(sort: Sort, col: number): Sort {
  if (sort?.col !== col) {
    return { col, dir: "ascending" };
  }
  return sort.dir === "ascending" ? { col, dir: "descending" } : null;
}

// Blank cells sink to the bottom in both directions.
function compareCells(a: ShelfCell, b: ShelfCell, dir: Direction) {
  if (a.sort === null || b.sort === null) {
    return a.sort === b.sort ? 0 : a.sort === null ? 1 : -1;
  }
  const order =
    typeof a.sort === "number" && typeof b.sort === "number"
      ? a.sort - b.sort
      : String(a.sort).localeCompare(String(b.sort), "en", { sensitivity: "base", numeric: true });
  return dir === "ascending" ? order : -order;
}

function sorted(items: ShelfItem[], sort: Sort) {
  if (!sort) {
    return items;
  }
  return [...items].sort((a, b) => compareCells(a.cells[sort.col], b.cells[sort.col], sort.dir));
}

export function ShelfView({ shelf }: { shelf: Shelf }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("list");
  const [sort, setSort] = useState<Sort>(null);
  const needle = useDeferredValue(query.trim().toLowerCase());

  const haystacks = useMemo(
    () => new Map(shelf.items.map((item) => [item.key, item.cells.map((c) => c.text).join(" ").toLowerCase()])),
    [shelf.items],
  );
  const matches = useMemo(
    () => (needle ? shelf.items.filter((item) => haystacks.get(item.key)!.includes(needle)) : shelf.items),
    [shelf.items, haystacks, needle],
  );
  const rows = useMemo(() => sorted(matches, sort), [matches, sort]);
  const withCovers = rows.filter((item) => item.cover);

  const total = shelf.items.length;
  const shown = view === "covers" ? withCovers.length : rows.length;
  const coverless = rows.length - withCovers.length;
  const count = `${int(shown)} of ${int(total)}${view === "covers" && coverless > 0 ? `. ${int(coverless)} without a cover.` : ""}`;

  const cols = shelf.columns.map((c) => c.width).join(" ");
  const phoneCols = shelf.columns
    .filter((c) => c.onPhone)
    .map((c) => c.width)
    .join(" ");
  const cellClass = (i: number, base: string) => {
    const col = shelf.columns[i];
    return [base, col.numeric && "num", !col.onPhone && "off-phone"].filter(Boolean).join(" ");
  };

  return (
    <>
      <div className="tools">
        <input
          className="find"
          type="text"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find"
          aria-label="Find"
        />
        <span className="count" aria-live="polite">
          {count}
        </span>
        <span className="switch">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </span>
      </div>

      {view === "list" ? (
        <div className="table" role="table" style={{ "--cols": cols, "--cols-phone": phoneCols } as CSSProperties}>
          <div className="tr th" role="row">
            {shelf.columns.map((c, i) => (
              <span
                key={c.label}
                className={cellClass(i, "")}
                role="columnheader"
                aria-sort={sort?.col === i ? sort.dir : undefined}
              >
                <button type="button" onClick={() => setSort(nextSort(sort, i))}>
                  {c.label}
                  {sort?.col === i && (sort.dir === "ascending" ? " ↑" : " ↓")}
                </button>
              </span>
            ))}
          </div>
          {rows.map((item) => (
            <div key={item.key} className="tr" role="row">
              {item.cells.map((cell, i) => (
                <span key={shelf.columns[i].label} className={cellClass(i, "td")} role="cell">
                  {cell.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <ul className={shelf.coverShape === "square" ? "covers square" : "covers"}>
          {withCovers.map((item) => (
            <li key={item.key}>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized covers; the optimiser would only re-encode them */}
              <img src={item.cover!.src} width={item.cover!.w} height={item.cover!.h} alt="" loading="lazy" decoding="async" />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
