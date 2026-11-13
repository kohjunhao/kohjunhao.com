import { isCell, shownText, type Addr, type Cell, type Column, type Sheet } from "./model";

/** Empty rows drawn after the last row, as a spreadsheet always has more. */
export const TAIL_ROWS = 8;

const EMPTY_COLUMN: Column = { width: 104 };
/** Wide enough that a full-width desktop window never shows the end of the columns. */
const FILL_WIDTH = 1920;
/** Tall enough that a short sheet still runs past the bottom of the window. */
const FILL_ROWS = 60;

/** A sheet padded with empty columns and rows, so the grid carries on past the data the way a real one does. */
export function fillSheet(sheet: Sheet): Sheet {
  const width = sheet.columns.reduce((sum, c) => sum + c.width, 0);
  const extraColumns = Math.max(0, Math.ceil((FILL_WIDTH - width) / EMPTY_COLUMN.width));
  const extraRows = Math.max(0, FILL_ROWS - TAIL_ROWS - sheet.rows.length);

  return {
    ...sheet,
    columns: [...sheet.columns, ...Array.from({ length: extraColumns }, () => EMPTY_COLUMN)],
    rows: [...sheet.rows, ...Array.from({ length: extraRows }, () => [])],
  };
}

export type Direction = "asc" | "desc";
export type Sort = { column: number; direction: Direction } | null;
export type Selection = { anchor: Addr; focus: Addr };
export type Range = { top: number; left: number; bottom: number; right: number };

export type SelectionAction =
  | { type: "set"; anchor: Addr; focus?: Addr }
  | { type: "extend"; focus: Addr }
  /** Moves the focus from wherever it is now; `extend` keeps the anchor. */
  | { type: "move"; to: (focus: Addr) => Addr; extend: boolean }
  | { type: "collapse" };

export function selectionReducer(state: Selection, action: SelectionAction): Selection {
  switch (action.type) {
    case "set":
      return { anchor: action.anchor, focus: action.focus ?? action.anchor };
    case "extend":
      return { anchor: state.anchor, focus: action.focus };
    case "move": {
      const focus = action.to(state.focus);
      return { anchor: action.extend ? state.anchor : focus, focus };
    }
    case "collapse":
      return { anchor: state.focus, focus: state.focus };
  }
}

/** Ascending, then descending, then off. A new column starts ascending. */
export function nextSort(sort: Sort, column: number): Sort {
  if (!sort || sort.column !== column) {
    return { column, direction: "asc" };
  }
  return sort.direction === "asc" ? { column, direction: "desc" } : null;
}

export const rowCount = (sheet: Sheet) => sheet.rows.length + TAIL_ROWS;

const isEmpty = (v: Cell["v"] | undefined) => v === null || v === undefined || v === "";

function compareValues(a: Cell["v"], b: Cell["v"]) {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b), "en", { sensitivity: "base" });
}

function matches(cell: Cell | null, term: string) {
  if (!cell) {
    return false;
  }
  const haystacks = [shownText(cell), cell.sub ?? ""];
  if (typeof cell.v === "string" || typeof cell.v === "number") {
    haystacks.push(String(cell.v));
  }
  return haystacks.some((h) => h.toLowerCase().includes(term));
}

const slotCell = (sheet: Sheet, r: number, c: number): Cell | null => {
  const slot = sheet.rows[r]?.[c];
  return isCell(slot) ? slot : null;
};

/**
 * The source row drawn in each table body slot, top to bottom, after Find and Sort.
 * -1 marks a slot left empty because Find hid its row.
 */
export function displayOrder(sheet: Sheet, sort: Sort, find: string): number[] {
  const table = sheet.table;
  if (!table) {
    return [];
  }
  const size = table.last - table.first + 1;
  let order = Array.from({ length: size }, (_, i) => table.first + i);

  const term = find.trim().toLowerCase();
  if (term) {
    order = order.filter((r) => {
      for (let c = table.firstCol; c <= table.lastCol; c++) {
        if (matches(slotCell(sheet, r, c), term)) {
          return true;
        }
      }
      return false;
    });
  }

  if (sort) {
    const sign = sort.direction === "asc" ? 1 : -1;
    order = [...order].sort((ra, rb) => {
      const a = slotCell(sheet, ra, sort.column)?.v ?? null;
      const b = slotCell(sheet, rb, sort.column)?.v ?? null;
      if (isEmpty(a) || isEmpty(b)) {
        return Number(isEmpty(a)) - Number(isEmpty(b));
      }
      return sign * compareValues(a, b);
    });
  }

  return [...order, ...Array.from({ length: size - order.length }, () => -1)];
}

export const inTableBody = (sheet: Sheet, r: number, c: number) =>
  Boolean(sheet.table && r >= sheet.table.first && r <= sheet.table.last && c >= sheet.table.firstCol && c <= sheet.table.lastCol);

/** The source row a display row draws from inside the table range: itself outside it, -1 when hidden. */
export function sourceRow(sheet: Sheet, order: number[], r: number) {
  const table = sheet.table;
  if (!table || r < table.first || r > table.last) {
    return r;
  }
  return order[r - table.first];
}

/** The cell shown at a display address, after Sort and Find. */
export function cellAt(sheet: Sheet, order: number[], [r, c]: Addr): Cell | null {
  if (!inTableBody(sheet, r, c)) {
    return slotCell(sheet, r, c);
  }
  const src = sourceRow(sheet, order, r);
  return src < 0 ? null : slotCell(sheet, src, c);
}

/** Maps every covered address to the merged cell that owns it. Merges sit outside the table. */
export function mergeOwners(sheet: Sheet): Map<string, Addr> {
  const owners = new Map<string, Addr>();
  sheet.rows.forEach((row, r) =>
    row.forEach((slot, c) => {
      if (!isCell(slot) || (!slot.colSpan && !slot.rowSpan)) {
        return;
      }
      for (let dr = 0; dr < (slot.rowSpan ?? 1); dr++) {
        for (let dc = 0; dc < (slot.colSpan ?? 1); dc++) {
          owners.set(`${r + dr}:${c + dc}`, [r, c]);
        }
      }
    }),
  );
  return owners;
}

export const ownerOf = (owners: Map<string, Addr>, [r, c]: Addr): Addr => owners.get(`${r}:${c}`) ?? [r, c];

export function spanOf(sheet: Sheet, owners: Map<string, Addr>, addr: Addr): Range {
  const [r, c] = ownerOf(owners, addr);
  const cell = slotCell(sheet, r, c);
  return { top: r, left: c, bottom: r + (cell?.rowSpan ?? 1) - 1, right: c + (cell?.colSpan ?? 1) - 1 };
}

/** One step from a cell, leaving a merged cell from its far edge, clamped to the grid. */
export function step(sheet: Sheet, owners: Map<string, Addr>, addr: Addr, dr: number, dc: number): Addr {
  const span = spanOf(sheet, owners, addr);
  const [r, c] = addr;
  const nextRow = dr > 0 ? span.bottom + 1 : dr < 0 ? span.top - 1 : r;
  const nextCol = dc > 0 ? span.right + 1 : dc < 0 ? span.left - 1 : c;
  const clamped: Addr = [
    Math.max(0, Math.min(rowCount(sheet) - 1, nextRow)),
    Math.max(0, Math.min(sheet.columns.length - 1, nextCol)),
  ];
  return ownerOf(owners, clamped);
}

/** The bounding range of a selection, grown to cover any merged cell at either end. */
export function selectionRange(sheet: Sheet, owners: Map<string, Addr>, sel: Selection): Range {
  const a = spanOf(sheet, owners, sel.anchor);
  const b = spanOf(sheet, owners, sel.focus);
  return {
    top: Math.min(a.top, b.top),
    left: Math.min(a.left, b.left),
    bottom: Math.max(a.bottom, b.bottom),
    right: Math.max(a.right, b.right),
  };
}

export const isSingleCell = (sheet: Sheet, owners: Map<string, Addr>, sel: Selection) => {
  const range = selectionRange(sheet, owners, sel);
  const span = spanOf(sheet, owners, sel.focus);
  return range.top === span.top && range.left === span.left && range.bottom === span.bottom && range.right === span.right;
};

export function rangeCells(sheet: Sheet, order: number[], range: Range): (Cell | null)[][] {
  const rows: (Cell | null)[][] = [];
  for (let r = range.top; r <= range.bottom; r++) {
    const row: (Cell | null)[] = [];
    for (let c = range.left; c <= range.right; c++) {
      row.push(cellAt(sheet, order, [r, c]));
    }
    rows.push(row);
  }
  return rows;
}

export type Stats = { count: number; sum?: number; average?: number };

export function rangeStats(cells: (Cell | null)[][]): Stats {
  let count = 0;
  let sum = 0;
  let numbers = 0;
  for (const cell of cells.flat()) {
    if (!cell || isEmpty(cell.v)) {
      continue;
    }
    count++;
    if (typeof cell.v === "number") {
      sum += cell.v;
      numbers++;
    }
  }
  if (numbers === 0) {
    return { count };
  }
  return { count, sum, average: sum / numbers };
}

export const toTsv = (cells: (Cell | null)[][]) => cells.map((row) => row.map((c) => shownText(c)).join("\t")).join("\n");

const csvField = (v: Cell["v"] | undefined) => {
  if (v === null || v === undefined) {
    return "";
  }
  const text = typeof v === "boolean" ? (v ? "TRUE" : "FALSE") : String(v);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** The table range in sheet order, header first, raw values, RFC 4180. Columns without a header are left out. */
export function toCsv(sheet: Sheet): string {
  const table = sheet.table;
  if (!table) {
    return "";
  }
  const columns: number[] = [];
  for (let c = table.firstCol; c <= table.lastCol; c++) {
    if (!isEmpty(slotCell(sheet, table.head, c)?.v)) {
      columns.push(c);
    }
  }
  const lines: string[] = [];
  for (const r of [table.head, ...Array.from({ length: table.last - table.first + 1 }, (_, i) => table.first + i)]) {
    lines.push(columns.map((c) => csvField(slotCell(sheet, r, c)?.v)).join(","));
  }
  return `${lines.join("\r\n")}\r\n`;
}

/** Tables whose first column carries pictures can also be drawn as a wall of covers. */
export function hasCovers(sheet: Sheet) {
  const table = sheet.table;
  if (!table) {
    return false;
  }
  for (let r = table.first; r <= table.last; r++) {
    if (slotCell(sheet, r, table.firstCol)?.picture) {
      return true;
    }
  }
  return false;
}

export function rowPicture(sheet: Sheet, order: number[], r: number) {
  for (let c = 0; c < sheet.columns.length; c++) {
    const picture = cellAt(sheet, order, [r, c])?.picture;
    if (picture) {
      return picture;
    }
  }
  return null;
}
