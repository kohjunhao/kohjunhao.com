import coverData from "@/data/covers.json";
import shelfData from "@/data/shelf.json";
import { counted, fullDate, int, oneDecimal } from "./format";

/** The folders cover files live in, under /public/shelf. */
type CoverFolder = "films" | "books" | "games" | "boardGames";

type Film = {
  slug: string;
  title: string;
  year: number | null;
  type: string;
  director: string;
  platform: string;
  hours: number | null;
};

type Book = {
  slug: string;
  title: string;
  author: string;
  /** YYYY-MM-DD, or null when the sheet has no date. */
  read: string | null;
};

type Game = { slug: string; title: string };

type CoverEntry = { w: number; h: number };

export type Cover = { src: string; w: number; h: number };

export type ShelfId = "films" | "games" | "books";

export type ShelfColumn = {
  label: string;
  /** A CSS grid track, such as `64px` or `minmax(0,2fr)`. */
  width: string;
  numeric: boolean;
  /** Narrow screens show only these. */
  onPhone: boolean;
};

/** `sort` is what a header click orders by; null sorts last either way. */
export type ShelfCell = { text: string; sort: string | number | null };

export type ShelfItem = { key: string; title: string; cells: ShelfCell[]; cover: Cover | null };

export type Shelf = {
  id: ShelfId;
  name: string;
  summary: string;
  /** Posters and book jackets are portrait; game art comes in every shape. */
  coverShape: "portrait" | "square";
  columns: ShelfColumn[];
  items: ShelfItem[];
};

/** The sheet writes "-" for an unknown director. */
const UNKNOWN = "-";

const covers = coverData as Partial<Record<CoverFolder, Record<string, CoverEntry>>>;

function cover(folder: CoverFolder, slug: string): Cover | null {
  const entry = covers[folder]?.[slug];
  if (!entry) {
    return null;
  }
  return { src: `/shelf/${folder}/${slug}.webp`, w: entry.w, h: entry.h };
}

const text = (value: string | null): ShelfCell => ({ text: value ?? "", sort: value || null });

const col = (label: string, width: string, onPhone: boolean, numeric = false): ShelfColumn => ({
  label,
  width,
  numeric,
  onPhone,
});

const films = (shelfData.films as Film[]).map((f) => (f.director === UNKNOWN ? { ...f, director: "" } : f));
const books = shelfData.books as Book[];
const videoGames = shelfData.games as Game[];
const boardGames = shelfData.boardGames as Game[];

export const filmHours = films.reduce((sum, f) => sum + (f.hours ?? 0), 0);

const GAME_KINDS: { folder: CoverFolder; label: string; items: Game[] }[] = [
  { folder: "games", label: "Video game", items: videoGames },
  { folder: "boardGames", label: "Board game", items: boardGames },
];

export const shelves: Record<ShelfId, Shelf> = {
  films: {
    id: "films",
    name: "Films",
    summary: `${int(films.length)} films and series. ${oneDecimal(filmHours)} hours watched.`,
    coverShape: "portrait",
    columns: [
      col("Title", "minmax(0,2.2fr)", true),
      col("Year", "52px", true, true),
      col("Type", "minmax(0,.8fr)", false),
      col("Director", "minmax(0,1.2fr)", false),
      col("Platform", "minmax(0,.8fr)", false),
      col("Hours", "60px", true, true),
    ],
    items: films.map((f) => ({
      key: f.slug,
      title: f.title,
      cover: cover("films", f.slug),
      cells: [
        text(f.title),
        { text: f.year ? String(f.year) : "", sort: f.year },
        text(f.type),
        text(f.director),
        text(f.platform),
        { text: f.hours === null ? "" : oneDecimal(f.hours), sort: f.hours },
      ],
    })),
  },
  games: {
    id: "games",
    name: "Games",
    summary: `${counted(videoGames.length + boardGames.length, "game", "games")}. ${counted(videoGames.length, "video game", "video games")} and ${counted(boardGames.length, "board game", "board games")}.`,
    coverShape: "square",
    columns: [col("Title", "minmax(0,1fr)", true), col("Kind", "120px", true)],
    items: GAME_KINDS.flatMap((kind) =>
      kind.items.map((g) => ({
        key: `${kind.folder}/${g.slug}`,
        title: g.title,
        cover: cover(kind.folder, g.slug),
        cells: [text(g.title), text(kind.label)],
      })),
    ),
  },
  books: {
    id: "books",
    name: "Books",
    summary: `${counted(books.length, "book", "books")}.`,
    coverShape: "portrait",
    columns: [col("Title", "minmax(0,1.6fr)", true), col("Author", "minmax(0,1fr)", true), col("Read", "110px", false)],
    items: books.map((b) => ({
      key: b.slug,
      title: b.title,
      cover: cover("books", b.slug),
      cells: [text(b.title), text(b.author), { text: b.read ? fullDate(b.read) : "", sort: b.read }],
    })),
  },
};

export const SHELF_ORDER: ShelfId[] = ["films", "games", "books"];
