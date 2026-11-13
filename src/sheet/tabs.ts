import { log } from "@/content/log";
import { articles } from "@/lib/articles";
import { boardGames, books, films, games } from "@/lib/shelf";
import { investments } from "@/lib/stock";
import { fullDate } from "./format";
import { lastEditDay } from "./log";

export type TabId = "log" | "films" | "books" | "games" | "portfolio" | "writing" | "about";
export type Tab = { id: TabId; name: string; href: string; count?: number };

/** What every page's chrome needs from the server, so no data file ships to the browser. */
export type Book = { tabs: Tab[]; lastEdit: string };

export function workbook(): Book {
  return {
    tabs: [
      { id: "log", name: "Log", href: "/", count: log.length },
      { id: "films", name: "Films", href: "/films", count: films.length },
      { id: "books", name: "Books", href: "/books", count: books.length },
      { id: "games", name: "Games", href: "/games", count: games.length + boardGames.length },
      { id: "portfolio", name: "Portfolio", href: "/investments", count: investments.length },
      { id: "writing", name: "Writing", href: "/articles", count: articles.length },
      { id: "about", name: "About", href: "/about" },
    ],
    lastEdit: fullDate(lastEditDay()),
  };
}
