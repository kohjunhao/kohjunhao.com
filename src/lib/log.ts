import { log, type LogEntry, type Status } from "@/content/log";
import { counted, dayMonth, dayRange, hostName, monthKey, monthName } from "./format";

/** Failed endings show in red; the rest in grey. An entry with no status shipped and shows none. */
export type Tone = "failed" | "quiet";

const TONES: Record<Status, Tone> = {
  Merged: "quiet",
  Missed: "failed",
  Stopped: "failed",
  "Failed again": "failed",
  "Never shipped": "failed",
  "Since beaten": "failed",
};

export type LogRow = {
  key: string;
  when: string;
  title: string;
  deck: string;
  link: { href: string; text: string } | null;
  image: string | null;
  status: { label: Status; tone: Tone } | null;
};

export type LogMonth = { key: string; name: string; rows: LogRow[] };

function linkText(href: string) {
  if (!href.startsWith("/")) {
    return hostName(href);
  }
  return href === "/investments" ? "Portfolio" : "Open it";
}

function toRow(e: LogEntry): LogRow {
  return {
    key: `${e.date} ${e.title}`,
    when: e.until ? dayRange(e.date, e.until) : dayMonth(e.date),
    title: e.title,
    deck: e.deck,
    link: e.href ? { href: e.href, text: linkText(e.href) } : null,
    image: e.image ? `/log/${e.image}.jpg` : null,
    status: e.status ? { label: e.status, tone: TONES[e.status] } : null,
  };
}

/** Newest month first, entries in log order within it. */
export const logMonths: LogMonth[] = log.reduce<LogMonth[]>((months, e) => {
  const key = monthKey(e.date);
  const current = months.at(-1);
  if (current?.key === key) {
    current.rows.push(toRow(e));
    return months;
  }
  return [...months, { key, name: monthName(e.date), rows: [toRow(e)] }];
}, []);

const newest = log[0];
const oldest = log[log.length - 1];

/** `44 things made since April. Latest 13 Nov.` */
export const logSummary = `${counted(log.length, "thing", "things")} made since ${monthName(oldest.date)}. Latest ${dayMonth(newest.until ?? newest.date)}.`;
