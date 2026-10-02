// Builds src/data/shelf.json, the public part of kjh's "Books + Games + Movies" sheet, from
// the private export in data/raw/shelf.json (gitignored). Only the columns that describe
// the work itself are copied; his notes, flags and source columns stay private.
// usage: node scripts/build-shelf.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SOURCE = join(ROOT, "data", "raw", "shelf.json");
const OUT = join(ROOT, "src", "data", "shelf.json");

const TABS = {
  films: "MoviesShows (Completed)",
  books: "Books",
  games: "Games",
  boardGames: "Board Games",
};
const FILM = { title: 0, year: 1, type: 2, genre: 3, director: 4, cast: 5, platform: 6, hours: 7, seasons: 8 };
const BOOK = { title: 0, author: 1, genre: 2, completed: 3, when: 5 };
// Sheets stores dates as days since 30 Dec 1899.
const SHEET_EPOCH = Date.UTC(1899, 11, 30);
const DAY_MS = 86_400_000;

// A title that is only a number, such as the film "65" or the series "1899", comes out of
// the sheet export as "65.0", so the float formatting is undone.
const cell = (row, i) =>
  (row[i] ?? "")
    .toString()
    .trim()
    .replace(/^(\d+)\.0$/, "$1");
const list = (text) => text.split(",").map((s) => s.trim()).filter(Boolean);
const number = (text) => (text === "" || text === "N/A" ? null : Number(text));

export function slugify(title, year) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return year ? `${base}-${year}` : base;
}

function unique(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.slug)) {
      return false;
    }
    seen.add(item.slug);
    return true;
  });
}

function films(rows) {
  return unique(
    rows
      .filter((row) => cell(row, FILM.title))
      .map((row) => {
        const year = number(cell(row, FILM.year));
        return {
          slug: slugify(cell(row, FILM.title), year),
          title: cell(row, FILM.title),
          year,
          type: cell(row, FILM.type) || "Movie",
          genres: list(cell(row, FILM.genre)),
          director: cell(row, FILM.director),
          cast: list(cell(row, FILM.cast)),
          platform: cell(row, FILM.platform),
          hours: number(cell(row, FILM.hours)),
          seasons: number(cell(row, FILM.seasons)),
        };
      }),
  );
}

function books(rows) {
  return unique(
    rows
      .filter((row) => cell(row, BOOK.completed) === "TRUE" && cell(row, BOOK.title))
      .map((row) => {
        const serial = number(cell(row, BOOK.when));
        const read = serial ? new Date(SHEET_EPOCH + serial * DAY_MS).toISOString().slice(0, 10) : null;
        return {
          slug: slugify(cell(row, BOOK.title)),
          title: cell(row, BOOK.title),
          author: cell(row, BOOK.author),
          genre: cell(row, BOOK.genre),
          read,
        };
      }),
  );
}

const titles = (rows) => unique(rows.filter((row) => cell(row, 0)).map((row) => ({ slug: slugify(cell(row, 0)), title: cell(row, 0) })));

const raw = JSON.parse(readFileSync(SOURCE, "utf8"));
const body = (tab) => raw[TABS[tab]].slice(1);
const shelf = {
  built: new Date().toISOString().slice(0, 10),
  films: films(body("films")),
  books: books(body("books")),
  games: titles(body("games")),
  boardGames: titles(body("boardGames")),
};
writeFileSync(OUT, JSON.stringify(shelf));
console.log(
  `ok ${OUT}: ${shelf.films.length} films and shows, ${shelf.books.length} books, ${shelf.games.length} games, ${shelf.boardGames.length} board games`,
);
