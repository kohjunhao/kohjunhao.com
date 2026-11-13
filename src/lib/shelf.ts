import coverData from "@/data/covers.json";
import shelfData from "@/data/shelf.json";

export type ShelfKind = "films" | "books" | "games" | "boardGames";

export type Film = {
  slug: string;
  title: string;
  year: number | null;
  type: string;
  genres: string[];
  director: string;
  cast: string[];
  platform: string;
  hours: number | null;
  seasons: number | null;
};

export type Book = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  /** YYYY-MM-DD, or null when the sheet has no date. */
  read: string | null;
};

export type Game = {
  slug: string;
  title: string;
};

export type Cover = {
  src: string;
  w: number;
  h: number;
  color: string | null;
};

type CoverEntry = { w: number; h: number; page: string; color?: string };

/** The sheet writes "-" for an unknown director. */
const UNKNOWN_DIRECTOR = "-";

export const films = (shelfData.films as Film[]).map((f) =>
  f.director === UNKNOWN_DIRECTOR ? { ...f, director: "" } : f,
);
export const books = shelfData.books as Book[];
export const games = shelfData.games as Game[];
export const boardGames = shelfData.boardGames as Game[];

const covers = coverData as Partial<Record<ShelfKind, Record<string, CoverEntry>>>;

export function cover(kind: ShelfKind, slug: string): Cover | null {
  const entry = covers[kind]?.[slug];
  if (!entry) {
    return null;
  }
  return { src: `/shelf/${kind}/${slug}.webp`, w: entry.w, h: entry.h, color: entry.color ?? null };
}

export { TINTS, hash, tint } from "./tint";

export const byTitle = <T extends { title: string }>(a: T, b: T) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" });
