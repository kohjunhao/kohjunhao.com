import Link from "next/link";
import { memo, type CSSProperties, type ReactNode } from "react";
import { inTableBody, rowCount, sourceRow, type Sort } from "@/sheet/grid";
import { isCell, shownText, type Cell, type Inline, type Sheet, type Slot } from "@/sheet/model";

const ROLE_CLASS: Record<NonNullable<Cell["role"]>, string> = {
  name: "name",
  intro: "intro",
  label: "lab",
  total: "tot",
  head: "hd",
  month: "month",
  key: "key",
  link: "link",
};

function CellLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link className="xref" href={href}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function InlinePart({ part }: { part: Inline }) {
  if (typeof part === "string") {
    return part;
  }
  return <CellLink href={part.href}>{part.text}</CellLink>;
}

function Content({ cell }: { cell: Cell }) {
  const text = shownText(cell);
  let body: ReactNode = cell.parts ? cell.parts.map((p, i) => <InlinePart key={i} part={p} />) : text;

  if (cell.href) {
    body = <CellLink href={cell.href}>{body}</CellLink>;
  }
  if (cell.sub) {
    body = (
      <>
        <b className="main">{body}</b>
        <span className="sub">{cell.sub}</span>
      </>
    );
  }
  if (cell.format) {
    body = <span className="band">{body}</span>;
  }
  if (cell.role === "intro") {
    body = <div>{body}</div>;
  }

  return (
    <>
      {cell.bar !== undefined && <span className="databar" style={{ width: `${cell.bar * 100}%` }} aria-hidden="true" />}
      {cell.thumb && (
        // eslint-disable-next-line @next/next/no-img-element -- thumbnails are pre-sized files; the optimiser would only re-encode them
        <img className="thumb" src={cell.thumb.src} width={cell.thumb.w} height={cell.thumb.h} alt={cell.thumb.alt} loading="lazy" decoding="async" />
      )}
      {cell.bar !== undefined ? <span className="num">{body}</span> : body}
    </>
  );
}

function cellClass(sheet: Sheet, c: number, cell: Cell | null, sortable: boolean, sort: Sort) {
  const classes: string[] = [];
  if (sheet.columns[c]?.narrow) {
    classes.push("wk");
  }
  if (c === sheet.todayColumn) {
    classes.push("today");
  }
  if (!cell) {
    return classes.join(" ");
  }
  if (cell.role) {
    classes.push(ROLE_CLASS[cell.role]);
  }
  if (cell.format) {
    classes.push("fmt", `f-${cell.format}`);
  }
  if (cell.fill) {
    classes.push(cell.fill.startsWith("bar") ? `bar b-${cell.fill}` : `heat ${cell.fill}`);
  }
  if (cell.align) {
    classes.push("right");
  }
  if (cell.thumb) {
    classes.push(shownText(cell) ? "has-logo" : "has-thumb");
  }
  if (cell.bar !== undefined) {
    classes.push("has-bar");
  }
  if (sortable) {
    classes.push("sortable");
    if (sort?.column === c) {
      classes.push(sort.direction);
    }
  }
  return classes.join(" ");
}

type RowProps = { sheet: Sheet; r: number; src: number; sort?: Sort };

const Row = memo(function Row({ sheet, r, src, sort = null }: RowProps) {
  const kind = sheet.rowKinds?.[r];
  const isHead = sheet.table?.head === r;
  const cells: ReactNode[] = [];

  for (let c = 0; c < sheet.columns.length; c++) {
    const slot: Slot | undefined = inTableBody(sheet, r, c) ? (src < 0 ? null : sheet.rows[src][c]) : sheet.rows[r]?.[c];
    if (slot === "covered") {
      continue;
    }
    const cell = isCell(slot) ? slot : null;
    const sortable = Boolean(isHead && cell && cell.v !== null && sheet.table && c >= sheet.table.firstCol && c <= sheet.table.lastCol);
    cells.push(
      <td
        key={c}
        data-c={c}
        className={cellClass(sheet, c, cell, sortable, sort) || undefined}
        colSpan={cell?.colSpan}
        rowSpan={cell?.rowSpan}
      >
        {cell && <Content cell={cell} />}
      </td>,
    );
  }

  return (
    <tr data-r={r} className={kind ? `k-${kind}` : undefined}>
      <th className="rn" scope="row">
        {r + 1}
      </th>
      {cells}
      <td className="filler" aria-hidden="true" />
    </tr>
  );
});

export const GridBody = memo(function GridBody({ sheet, order, sort }: { sheet: Sheet; order: number[]; sort: Sort }) {
  const rows: ReactNode[] = [];
  for (let r = 0; r < rowCount(sheet); r++) {
    rows.push(<Row key={r} sheet={sheet} r={r} src={sourceRow(sheet, order, r)} sort={sheet.table?.head === r ? sort : undefined} />);
  }
  return <tbody>{rows}</tbody>;
});

export function columnStyle(width: number, mobileWidth?: number) {
  return { "--w": `${width}px`, "--wm": mobileWidth ? `${mobileWidth}px` : undefined } as CSSProperties;
}
