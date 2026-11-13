import { columnRange, type Cell, type Column, type CoverShape, type RowKind, type Sheet, type Slot, type View } from "./model";
import { int } from "./format";

const GAP_COLUMN: Column = { width: 24, narrow: true };
const PIVOT_COLUMNS: Column[] = [{ width: 150 }, { width: 84 }];

export type PivotBlock =
  | { kind: "counts"; title: string; items: { label: string; count: number; fx: string }[] }
  | { kind: "total"; label: string; value: number; text: string; fx: string };

export type TableSpec = {
  slug: string;
  columns: (Column & { name: string })[];
  body: (Cell | null)[][];
  bodyKind?: RowKind;
  pivot?: PivotBlock[];
  defaultView?: View;
  coverShape?: CoverShape;
};

const HEAD_ROW = 0;
const FIRST_ROW = 1;

/** The range of one table column, such as `C2:C606`, for the formulas beside the table. */
export const bodyRange = (col: number, rows: number) => columnRange(col, FIRST_ROW, rows);

export const countIf = (col: number, rows: number, value: string) => `=COUNTIF(${bodyRange(col, rows)},"${value}")`;

export const numberCell = (n: number, text = int(n)): Cell => ({ v: n, text, align: "right" });

/** A sheet whose table header is row 1, with an optional pivot block one gap column to its right. */
export function tableSheet(spec: TableSpec): Sheet {
  const tableCols = spec.columns.length;
  const head: Slot[] = spec.columns.map((c) => ({ v: c.name, role: "head" }));
  const rows: Slot[][] = [head, ...spec.body];
  const rowKinds: Sheet["rowKinds"] = { [HEAD_ROW]: "head" };

  if (spec.bodyKind) {
    for (let r = FIRST_ROW; r <= spec.body.length; r++) {
      rowKinds[r] = spec.bodyKind;
    }
  }

  const columns: Column[] = spec.columns.map(({ width, mobileWidth }) => ({ width, mobileWidth }));
  if (spec.pivot) {
    columns.push(GAP_COLUMN, ...PIVOT_COLUMNS);
    placePivot(rows, tableCols + 1, spec.pivot);
  }

  return {
    slug: spec.slug,
    columns,
    rows: rows.map((row) => padRow(row, columns.length)),
    rowKinds,
    table: { head: HEAD_ROW, first: FIRST_ROW, last: spec.body.length, firstCol: 0, lastCol: tableCols - 1 },
    defaultView: spec.defaultView,
    coverShape: spec.coverShape,
  };
}

function padRow(row: Slot[], width: number) {
  return Array.from({ length: width }, (_, c) => row[c] ?? null);
}

function placePivot(rows: Slot[][], col: number, blocks: PivotBlock[]) {
  let r = 0;
  const put = (label: Cell, value: Cell | "covered") => {
    rows[r] ??= [];
    rows[r][col] = label;
    rows[r][col + 1] = value;
    r++;
  };

  for (const block of blocks) {
    if (block.kind === "total") {
      put({ v: block.label, role: "label" }, { v: block.value, text: block.text, fx: block.fx, role: "total", align: "right" });
      r++;
      continue;
    }

    put({ v: block.title, role: "head", colSpan: 2 }, "covered");
    const most = Math.max(...block.items.map((i) => i.count));
    for (const item of block.items) {
      put({ v: item.label }, { ...numberCell(item.count), fx: item.fx, bar: item.count / most });
    }
    r++;
  }
}

/** Counts per key, most first, ties alphabetical. */
export function tally(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
