"use client";

import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type CSSProperties } from "react";
import { int, upToOneDecimal } from "@/sheet/format";
import {
  cellAt,
  displayOrder,
  fillSheet,
  hasCovers,
  isSingleCell,
  mergeOwners,
  nextSort,
  ownerOf,
  rangeCells,
  rangeStats,
  rowCount,
  rowPicture,
  selectionRange,
  selectionReducer,
  step,
  toCsv,
  toTsv,
  type Range,
  type Selection,
  type Sort,
} from "@/sheet/grid";
import { address, colLetter, fxText, shownText, type Addr, type Picture, type Sheet, type View } from "@/sheet/model";
import type { Book, TabId } from "@/sheet/tabs";
import { tint } from "@/lib/tint";
import { FormulaBar } from "./formula-bar";
import { Frame, FrameContext } from "./frame";
import { columnStyle, GridBody } from "./grid-body";
import { Handles, SearchIcon } from "./icons";
import { TabBar } from "./tab-bar";

/** The flexible empty column on the right never shrinks below this. */
const FILLER_MIN = 24;

const MOVES: Record<string, Addr> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

type Props = { sheet: Sheet; book: Book; active?: TabId; label: string };

export function SheetApp({ sheet, book, active, label }: Props) {
  const download = useCallback(() => {
    const url = URL.createObjectURL(new Blob([toCsv(sheet)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `koh-jun-hao-${sheet.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sheet]);

  const filled = useMemo(() => fillSheet(sheet), [sheet]);

  return (
    <Frame book={book} onDownload={sheet.table ? download : undefined}>
      <SheetView sheet={filled} usedColumns={sheet.columns.length} book={book} active={active} label={label} />
    </Frame>
  );
}

const initialSelection = (sheet: Sheet): Selection => {
  const at: Addr = sheet.select ?? (sheet.table ? [sheet.table.first, sheet.table.firstCol] : [0, 0]);
  return { anchor: at, focus: at };
};

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

const PRINTABLE = /^[\p{L}\p{N}]$/u;

function SheetView({ sheet, usedColumns, book, active, label }: Props & { usedColumns: number }) {
  const { notifyViewOnly } = useContext(FrameContext);
  const router = useRouter();
  const [selection, dispatch] = useReducer(selectionReducer, sheet, initialSelection);
  const [sort, setSort] = useState<Sort>(null);
  const [find, setFind] = useState("");
  const [findOpen, setFindOpen] = useState(false);
  const [view, setView] = useState<View>(sheet.defaultView ?? "rows");
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  // The cell selected on load would otherwise open with its picture sitting over the data.
  const [touched, setTouched] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const selBox = useRef<HTMLDivElement>(null);
  const findInput = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const pointerType = useRef("mouse");
  const reveal = useRef(false);
  const painted = useRef<Element[]>([]);

  const owners = useMemo(() => mergeOwners(sheet), [sheet]);
  const order = useMemo(() => displayOrder(sheet, sort, find), [sheet, sort, find]);
  const range = selectionRange(sheet, owners, selection);
  const single = isSingleCell(sheet, owners, selection);
  const focus = ownerOf(owners, selection.focus);
  const focusCell = cellAt(sheet, order, focus);
  const covers = hasCovers(sheet);
  const lastCol = sheet.columns.length - 1;
  const lastRow = rowCount(sheet) - 1;

  const nameBox = single ? address(focus) : `${address([range.top, range.left])}:${address([range.bottom, range.right])}`;

  // The selection box and the header highlight are drawn straight onto the DOM, so moving
  // the selection never re-renders a cell.
  const place = useRef(() => {});
  useLayoutEffect(() => {
    place.current = () => {
      const grid = table.current;
      const box = selBox.current;
      if (!grid || !box) {
        return;
      }
      painted.current = paintHeaders(grid, range, painted.current);
      const tl = cellElement(grid, ownerOf(owners, [range.top, range.left]));
      const br = cellElement(grid, ownerOf(owners, [range.bottom, range.right]));
      if (!tl || !br) {
        box.hidden = true;
        return;
      }
      const top = rowTop(tl);
      const left = tl.offsetLeft;
      box.hidden = false;
      box.style.transform = `translate(${left}px, ${top}px)`;
      box.style.width = `${br.offsetLeft + br.offsetWidth - left}px`;
      box.style.height = `${rowTop(br) + br.offsetHeight - top}px`;

      const focusEl = cellElement(grid, focus);
      if (reveal.current && scroller.current && focusEl) {
        revealCell(scroller.current, grid, focusEl, focus[0], sheet.table?.head);
      }
      reveal.current = false;
    };
  });

  const [top, left, bottom, right] = [range.top, range.left, range.bottom, range.right];
  useLayoutEffect(() => {
    if (view === "rows") {
      place.current();
    }
  }, [top, left, bottom, right, order, view]);

  useEffect(() => {
    const grid = table.current;
    if (!grid || view !== "rows") {
      return;
    }
    const observer = new ResizeObserver(() => place.current());
    observer.observe(grid);
    return () => observer.disconnect();
  }, [view]);

  const select = (anchor: Addr, focusAt?: Addr) => dispatch({ type: "set", anchor, focus: focusAt });

  function openLink() {
    const href = focusCell?.href;
    if (!href) {
      return;
    }
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function copy() {
    const text = toTsv(rangeCells(sheet, order, range));
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function onGridKey(e: KeyboardEvent) {
    const move = MOVES[e.key];
    if (move) {
      e.preventDefault();
      reveal.current = true;
      dispatch({ type: "move", to: (at) => step(sheet, owners, at, move[0], move[1]), extend: e.shiftKey });
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const col = e.key === "Home" ? 0 : usedColumns - 1;
      reveal.current = true;
      dispatch({ type: "move", to: ([r]) => ownerOf(owners, [r, col]), extend: e.shiftKey });
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      openLink();
      return;
    }
    if (e.key === "Escape") {
      dispatch({ type: "collapse" });
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
      e.preventDefault();
      copy();
      return;
    }
    if (!e.metaKey && !e.ctrlKey && !e.altKey && PRINTABLE.test(e.key)) {
      notifyViewOnly();
    }
  }

  const keyHandler = useRef(onGridKey);
  useLayoutEffect(() => {
    keyHandler.current = onGridKey;
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isEditable(e.target) || document.querySelector("dialog[open]")) {
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        setFindOpen(true);
        requestAnimationFrame(() => findInput.current?.focus());
        return;
      }
      const target = e.target as Element;
      const inGrid = target === document.body || scroller.current?.contains(target);
      const nativeLink = e.key === "Enter" && target.closest("a");
      if (inGrid && !nativeLink) {
        setTouched(true);
        keyHandler.current(e);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function addrFrom(target: EventTarget | null): Addr | null {
    const td = (target as Element | null)?.closest?.("td[data-c]");
    const tr = td?.closest("tr[data-r]");
    if (!td || !tr) {
      return null;
    }
    return [Number(tr.getAttribute("data-r")), Number(td.getAttribute("data-c"))];
  }

  function onPointerDown(e: React.PointerEvent) {
    setTouched(true);
    pointerType.current = e.pointerType;
    const target = e.target as Element;

    const letter = target.closest("thead th[data-c]");
    if (letter) {
      const c = Number(letter.getAttribute("data-c"));
      select([lastRow, c], [0, c]);
      return;
    }
    const rowHead = target.closest("th.rn");
    if (rowHead) {
      const r = Number(rowHead.closest("tr")?.getAttribute("data-r"));
      select([r, lastCol], [r, 0]);
      return;
    }
    const at = addrFrom(target);
    if (!at || e.pointerType !== "mouse" || e.button !== 0) {
      return;
    }
    dragging.current = true;
    if (e.shiftKey) {
      dispatch({ type: "extend", focus: ownerOf(owners, at) });
      return;
    }
    select(ownerOf(owners, at));
  }

  function onPointerOver(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") {
      return;
    }
    const at = addrFrom(e.target);
    if (!at) {
      return;
    }
    setHoverRow(at[0]);
    if (dragging.current && e.buttons === 1) {
      dispatch({ type: "extend", focus: ownerOf(owners, at) });
    }
  }

  useEffect(() => {
    const stop = () => {
      dragging.current = false;
    };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  function onClick(e: React.MouseEvent) {
    const at = addrFrom(e.target);
    if (!at) {
      return;
    }
    if (pointerType.current !== "mouse") {
      select(ownerOf(owners, at));
    }
    const td = (e.target as Element).closest("td");
    if (td?.classList.contains("sortable")) {
      setSort((s) => nextSort(s, at[1]));
    }
  }

  const hoverPicture = hoverRow === null ? null : rowPicture(sheet, order, hoverRow);
  const floating: { picture: Picture; from: "hover" | "selection" } | null = hoverPicture
    ? { picture: hoverPicture, from: "hover" }
    : (() => {
        const picture = touched ? rowPicture(sheet, order, focus[0]) : null;
        return picture ? { picture, from: "selection" as const } : null;
      })();

  const visible = order.filter((r) => r >= 0).length;
  const total = sheet.table ? sheet.table.last - sheet.table.first + 1 : 0;
  const stats = single ? null : rangeStats(rangeCells(sheet, order, range));

  const tableWidth = sheet.columns.reduce((s, c) => s + c.width, FILLER_MIN);
  const tableWidthPhone = sheet.columns.reduce((s, c) => s + (c.mobileWidth ?? c.width), FILLER_MIN);

  return (
    <>
      <FormulaBar nameBox={nameBox} text={fxText(focusCell)} finding={findOpen}>
        <div className="fxtools">
          <button
            type="button"
            className="iconbtn findtoggle"
            aria-label="Find"
            aria-expanded={findOpen}
            onClick={() => {
              setFindOpen((open) => !open);
              requestAnimationFrame(() => findInput.current?.focus());
            }}
          >
            <SearchIcon />
          </button>
          <input
            ref={findInput}
            className="find"
            type="search"
            placeholder="Find"
            aria-label="Find in this sheet"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter") {
                scroller.current?.focus();
              }
            }}
          />
          {covers && (
            <div className="switch" role="group" aria-label="View">
              {(["rows", "covers"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                  {v === "rows" ? "Rows" : "Covers"}
                </button>
              ))}
            </div>
          )}
        </div>
      </FormulaBar>

      <div className="gridarea">
        <div
          ref={scroller}
          className={view === "covers" ? "gridwrap covers-view" : "gridwrap"}
          tabIndex={0}
          aria-label={`${label} sheet`}
          role="region"
        >
          {view === "rows" ? (
            <div className="sheet">
              <table
                ref={table}
                className="grid"
                role="grid"
                aria-label={label}
                style={{ "--min": `${tableWidth}px`, "--min-m": `${tableWidthPhone}px` } as CSSProperties}
                onPointerDown={onPointerDown}
                onPointerOver={onPointerOver}
                onPointerLeave={() => setHoverRow(null)}
                onClick={onClick}
                onDoubleClick={notifyViewOnly}
              >
                <colgroup>
                  <col className="c-rn" />
                  {sheet.columns.map((c, i) => (
                    <col key={i} style={columnStyle(c.width, c.mobileWidth)} />
                  ))}
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th className="corner" aria-hidden="true" />
                    {sheet.columns.map((c, i) => (
                      <th key={i} data-c={i} scope="col" className={c.narrow ? "narrow" : undefined}>
                        {colLetter(i)}
                      </th>
                    ))}
                    <th className="filler" aria-hidden="true" />
                  </tr>
                </thead>
                <GridBody sheet={sheet} order={order} sort={sort} />
              </table>
              <div ref={selBox} className="selbox" hidden aria-hidden="true" />
            </div>
          ) : (
            <Covers sheet={sheet} order={order} focusRow={focus[0]} onSelect={(at) => select(at)} />
          )}
        </div>

        {view === "rows" && floating && (
          <figure className={floating.from === "selection" ? "float selected" : "float"} style={{ background: floating.picture.tint }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- covers are pre-sized files; the optimiser would only re-encode them */}
            <img src={floating.picture.src} width={floating.picture.w} height={floating.picture.h} alt={floating.picture.alt} loading="lazy" decoding="async" />
            {floating.from === "selection" && <Handles />}
          </figure>
        )}
      </div>

      <TabBar tabs={book.tabs} active={active}>
        <Status stats={stats} find={find} visible={visible} total={total} />
      </TabBar>
    </>
  );
}

function Status({ stats, find, visible, total }: { stats: ReturnType<typeof rangeStats> | null; find: string; visible: number; total: number }) {
  if (stats) {
    return (
      <>
        <span>
          Count <b>{int(stats.count)}</b>
        </span>
        {stats.sum !== undefined && (
          <span>
            Sum <b>{upToOneDecimal(stats.sum)}</b>
          </span>
        )}
        {stats.average !== undefined && (
          <span>
            Average <b>{upToOneDecimal(stats.average)}</b>
          </span>
        )}
      </>
    );
  }
  if (!total) {
    return null;
  }
  if (find.trim()) {
    return (
      <span>
        <b>{int(visible)}</b> of {int(total)}
      </span>
    );
  }
  return (
    <span>
      Count <b>{int(total)}</b>
    </span>
  );
}

function Covers({ sheet, order, focusRow, onSelect }: { sheet: Sheet; order: number[]; focusRow: number; onSelect: (at: Addr) => void }) {
  const table = sheet.table;
  if (!table) {
    return null;
  }
  return (
    <ul className={sheet.coverShape === "portrait" ? "covers portrait" : "covers"} aria-label="Covers">
      {order.map((src, i) => {
        if (src < 0) {
          return null;
        }
        const r = table.first + i;
        const titleCell = cellAt(sheet, order, [r, table.firstCol]);
        const title = shownText(titleCell);
        const picture = rowPicture(sheet, order, r);
        return (
          <li key={src} className={r === focusRow ? "on" : undefined}>
            <button type="button" onClick={() => onSelect([r, table.firstCol])}>
              <span className="art" style={{ background: picture?.tint ?? tint(title) }}>
                {picture ? (
                  // eslint-disable-next-line @next/next/no-img-element -- covers are pre-sized files; the optimiser would only re-encode them
                  <img src={picture.src} width={picture.w} height={picture.h} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="bare">{title}</span>
                )}
              </span>
              <span className="title">{title}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function cellElement(grid: HTMLTableElement, [r, c]: Addr) {
  return grid.tBodies[0]?.rows[r]?.querySelector<HTMLElement>(`td[data-c="${c}"]`) ?? null;
}

/** A row's top edge; a sticky header cell's own offset moves while it sticks, its row's does not. */
const rowTop = (cell: HTMLElement) => (cell.parentElement as HTMLTableRowElement).offsetTop;

/** Highlights the column letters and row numbers of a range, and returns them so the next call can clear them. */
function paintHeaders(grid: HTMLTableElement, range: Range, previous: Element[]) {
  for (const el of previous) {
    el.classList.remove("on");
  }
  const painted: Element[] = [];
  const letters = grid.tHead?.rows[0]?.cells;
  const body = grid.tBodies[0]?.rows;
  if (!letters || !body) {
    return painted;
  }
  for (let c = range.left; c <= range.right; c++) {
    const th = letters[c + 1];
    if (th) {
      painted.push(th);
    }
  }
  for (let r = range.top; r <= range.bottom; r++) {
    const th = body[r]?.cells[0];
    if (th) {
      painted.push(th);
    }
  }
  for (const el of painted) {
    el.classList.add("on");
  }
  return painted;
}

function revealCell(view: HTMLElement, grid: HTMLTableElement, cell: HTMLElement, r: number, head: number | undefined) {
  const lettersHeight = grid.tHead?.offsetHeight ?? 0;
  const headRow = head === undefined ? null : grid.tBodies[0]?.rows[head];
  const stickyTop = lettersHeight + (headRow && r > head! ? headRow.offsetHeight : 0);
  const stickyLeft = grid.tBodies[0]?.rows[0]?.cells[0]?.offsetWidth ?? 0;

  const top = rowTop(cell);
  const bottom = top + cell.offsetHeight;
  const left = cell.offsetLeft;
  const right = left + cell.offsetWidth;

  if (top < view.scrollTop + stickyTop) {
    view.scrollTop = top - stickyTop;
  } else if (bottom > view.scrollTop + view.clientHeight) {
    view.scrollTop = bottom - view.clientHeight;
  }
  if (left < view.scrollLeft + stickyLeft) {
    view.scrollLeft = left - stickyLeft;
  } else if (right > view.scrollLeft + view.clientWidth) {
    view.scrollLeft = right - view.clientWidth;
  }
}
