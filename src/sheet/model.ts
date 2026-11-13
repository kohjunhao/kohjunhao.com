export type Format = "plain" | "muted" | "good" | "bad" | "warn";
export type Fill = "h1" | "h2" | "h3" | "h4" | "bar" | "bar-bad" | "bar-warn";
export type Role = "name" | "intro" | "label" | "total" | "head" | "month" | "key";
export type Inline = string | { text: string; href: string };
export type Picture = { src: string; w: number; h: number; alt: string; tint?: string };

export type Cell = {
  /** Raw value: sorting, status-bar maths, Find and CSV. `true` is a checkbox-style mark. */
  v: string | number | boolean | null;
  /** Shown instead of String(v): formatted dates and numbers. */
  text?: string;
  /** Shown instead of text when the cell has links inside it. */
  parts?: Inline[];
  /** Second line, grey. */
  sub?: string;
  /** Formula bar text, defaults to the shown text. */
  fx?: string;
  /** The whole cell is a link. A href starting with "/" is a cross-sheet link. */
  href?: string;
  format?: Format;
  fill?: Fill;
  role?: Role;
  /** 0 to 1, a data bar behind a number. */
  bar?: number;
  thumb?: Picture;
  /** Floated over the grid while this row is active. */
  picture?: Picture;
  align?: "right";
  colSpan?: number;
  rowSpan?: number;
};

export type Slot = Cell | null | "covered";
export type Column = { width: number; mobileWidth?: number; narrow?: boolean };
export type RowKind = "name" | "summary" | "head" | "entry";
export type View = "rows" | "covers";

/** Row and column indexes are zero based; `last` and `lastCol` are inclusive. */
export type TableRange = { head: number; first: number; last: number; firstCol: number; lastCol: number };

export type Sheet = {
  slug: string;
  columns: Column[];
  rows: Slot[][];
  rowKinds?: Record<number, RowKind>;
  table?: TableRange;
  todayColumn?: number;
  defaultView?: View;
  /** The cell selected on load, as [row, column]. */
  select?: Addr;
};

export type Addr = readonly [row: number, col: number];

export function colLetter(index: number) {
  let s = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  }
  return s;
}

export const address = ([r, c]: Addr) => `${colLetter(c)}${r + 1}`;

/** `B8:B52`, for formulas that name a column of the table. */
export const columnRange = (col: number, first: number, last: number) => `${address([first, col])}:${address([last, col])}`;

export function shownText(cell: Cell | null): string {
  if (!cell) {
    return "";
  }
  if (cell.parts) {
    return cell.parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
  }
  if (cell.text !== undefined) {
    return cell.text;
  }
  if (cell.v === null || typeof cell.v === "boolean") {
    return "";
  }
  return String(cell.v);
}

export const fxText = (cell: Cell | null) => cell?.fx ?? shownText(cell);

export const isCell = (slot: Slot | undefined): slot is Cell => typeof slot === "object" && slot !== null;
