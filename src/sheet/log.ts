import activity from "@/data/activity.json";
import { DEFAULT_STATUS, KINDS, log, type LogEntry } from "@/content/log";
import { site } from "@/lib/site";
import { dayMonth, dayRange, hostName, int, mondayOf, monthName, toDate, WEEK_MS } from "./format";
import { companiesLink, ventures } from "./links";
import { address, columnRange, type Cell, type Column, type Fill, type Format, type Sheet, type Slot } from "./model";

const MAIN: { name: string; column: Column }[] = [
  { name: "Date", column: { width: 96, mobileWidth: 62 } },
  { name: "What", column: { width: 450, mobileWidth: 284 } },
  { name: "Pic", column: { width: 76 } },
  { name: "Kind", column: { width: 92 } },
  { name: "Status", column: { width: 112 } },
  { name: "Link", column: { width: 172 } },
];
const WEEK_COLUMN: Column = { width: 11, narrow: true };

const WHAT = 1;
const FIRST_WEEK = MAIN.length;
const INTRO_SPAN = 4;

const NAME_ROW = 0;
const FIRST_SUMMARY_ROW = 2;
const HEAD_ROW = 6;
const FIRST_ENTRY_ROW = 7;

const THUMB = { w: 63, h: 42 };
const PICTURE = { w: 800, h: 500 };

const STATUS_FORMAT: Record<string, Format> = {
  Merged: "good",
  Missed: "bad",
  "Failed again": "bad",
  Stopped: "warn",
  "Since beaten": "warn",
  "Never shipped": "warn",
  "Third version": "muted",
  "Fourth version": "muted",
};

const BAR_FILL: Record<Format, Fill> = {
  plain: "bar",
  muted: "bar",
  good: "bar",
  bad: "bar-bad",
  warn: "bar-warn",
};

type Metric = "prompts" | "commits" | "shipped";
const COMMITS = 0;
const PROMPTS = 1;

/** The newest day anything happened: the top log entry or the last day of activity data. */
export function lastEditDay() {
  return [log[0].until ?? log[0].date, activity.through].sort().at(-1)!;
}

function weeks() {
  const start = mondayOf(toDate(activity.from));
  const count = Math.round((mondayOf(toDate(lastEditDay())).getTime() - start.getTime()) / WEEK_MS) + 1;
  const weekOf = (iso: string) =>
    Math.max(0, Math.min(count - 1, Math.floor((mondayOf(toDate(iso)).getTime() - start.getTime()) / WEEK_MS)));
  const monday = (w: number) => new Date(start.getTime() + w * WEEK_MS);
  return { count, weekOf, monday };
}

// Splits the weeks with any activity into four equal groups, so the darkest square means
// "top quarter of active weeks", whatever the raw numbers are.
function heatLevel(values: number[]) {
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  const cut = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
  const cuts = [cut(0.25), cut(0.5), cut(0.75)];
  return (v: number) => (v === 0 ? 0 : 1 + cuts.filter((c) => v > c).length);
}

function linkText(href: string) {
  if (!href.startsWith("/")) {
    return hostName(href);
  }
  return href === "/investments" ? "Portfolio!A1" : "Open";
}

function entryRow(e: LogEntry, timeline: (from: number, to: number, fill: Fill) => Slot[], weekOf: (iso: string) => number): Slot[] {
  const status = e.status ?? DEFAULT_STATUS;
  const format = STATUS_FORMAT[status] ?? "plain";
  const src = e.image ? `/log/${e.image}.jpg` : null;

  return [
    { v: e.date, text: e.until ? dayRange(e.date, e.until) : dayMonth(e.date), format: "muted" },
    { v: e.title, sub: e.deck },
    src
      ? { v: null, thumb: { src, ...THUMB, alt: "" }, picture: { src, ...PICTURE, alt: e.title } }
      : null,
    { v: KINDS[e.kind], format: "muted" },
    { v: status, format },
    e.href ? { v: e.href, text: linkText(e.href), href: e.href, role: "link" } : null,
    ...timeline(weekOf(e.date), weekOf(e.until ?? e.date), BAR_FILL[format]),
  ];
}

export function buildLog(): Sheet {
  const { count, weekOf, monday } = weeks();
  const lastWeek = FIRST_WEEK + count - 1;
  const lastEntryRow = FIRST_ENTRY_ROW + log.length - 1;
  const empty = (n: number): Slot[] => Array.from({ length: n }, () => null);
  const covered = (n: number): Slot[] => Array.from({ length: n }, () => "covered" as const);

  const weekly = Array.from({ length: count }, () => ({ commits: 0, prompts: 0, shipped: 0 }));
  for (const [iso, counts] of Object.entries(activity.days as Record<string, number[]>)) {
    weekly[weekOf(iso)].commits += counts[COMMITS];
    weekly[weekOf(iso)].prompts += counts[PROMPTS];
  }
  for (const e of log) {
    weekly[weekOf(e.date)].shipped += 1;
  }

  const monthCells: Slot[] = [];
  for (let w = 0; w < count; w++) {
    const isStart = w === 0 || monthName(monday(w)) !== monthName(monday(w - 1));
    if (!isStart) {
      continue;
    }
    let span = 1;
    while (w + span < count && monthName(monday(w + span)) === monthName(monday(w))) {
      span++;
    }
    monthCells.push({ v: monthName(monday(w)), role: "month", colSpan: span }, ...covered(span - 1));
  }

  const summaries: { label: string; metric: Metric; total: number; fx: (row: number) => string }[] = [
    { label: "Prompts", metric: "prompts", total: activity.prompts, fx: sumWeeks },
    { label: "Commits", metric: "commits", total: activity.commits, fx: sumWeeks },
    { label: "Shipped", metric: "shipped", total: log.length, fx: () => `=COUNTA(${columnRange(WHAT, FIRST_ENTRY_ROW, lastEntryRow)})` },
  ];
  function sumWeeks(row: number) {
    return `=SUM(${address([row, FIRST_WEEK])}:${address([row, lastWeek])})`;
  }

  const summaryRows = summaries.map(({ label, metric, total, fx }, i): Slot[] => {
    const row = FIRST_SUMMARY_ROW + i;
    const level = heatLevel(weekly.map((w) => w[metric]));
    return [
      ...covered(INTRO_SPAN),
      { v: label, role: "label", align: "right" },
      { v: total, text: int(total), fx: fx(row), role: "total", align: "right" },
      ...weekly.map((w): Cell => {
        const lv = level(w[metric]);
        return { v: w[metric], text: "", fx: String(w[metric]), fill: lv ? (`h${lv}` as Fill) : undefined };
      }),
    ];
  });

  const timeline = (from: number, to: number, fill: Fill): Slot[] =>
    Array.from({ length: count }, (_, w) => (w >= from && w <= to ? { v: true, fx: "TRUE", fill } : null));

  const intro: Cell = {
    v: null,
    role: "intro",
    colSpan: INTRO_SPAN,
    rowSpan: 4,
    parts: ["Analyst at Ouroboros Capital. Building ", ventures.fullmarks, " and ", ventures.groundcrew, ". Angel in ", companiesLink(), "."],
  };

  const rows: Slot[][] = [
    [{ v: site.name, role: "name", colSpan: INTRO_SPAN }, ...covered(INTRO_SPAN - 1), ...empty(2 + count)],
    [intro, ...covered(INTRO_SPAN - 1), ...empty(2), ...monthCells],
    ...summaryRows,
    empty(FIRST_WEEK + count),
    [
      ...MAIN.map(({ name }): Cell => ({ v: name, role: "head" })),
      ...Array.from({ length: count }, (): Cell => ({ v: null, role: "head" })),
    ],
    ...log.map((e) => entryRow(e, timeline, weekOf)),
  ];

  const rowKinds: Sheet["rowKinds"] = { [NAME_ROW]: "name", [HEAD_ROW]: "head" };
  for (let r = FIRST_ENTRY_ROW; r <= lastEntryRow; r++) {
    rowKinds[r] = "entry";
  }

  return {
    slug: "log",
    columns: [...MAIN.map((m) => m.column), ...Array.from({ length: count }, () => WEEK_COLUMN)],
    rows,
    rowKinds,
    table: { head: HEAD_ROW, first: FIRST_ENTRY_ROW, last: lastEntryRow, firstCol: 0, lastCol: lastWeek },
    todayColumn: lastWeek,
    select: [FIRST_ENTRY_ROW, WHAT],
  };
}
