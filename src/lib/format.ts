// No imports here: the tests load this file straight into Node.

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** `3,863` */
export const int = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

/** `3,863.7` */
export const oneDecimal = (n: number) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** `1 essay`, `4 essays`, `1,006 films` */
export const counted = (n: number, one: string, many: string) => `${int(n)} ${n === 1 ? one : many}`;

/** `12 Nov` */
export function dayMonth(iso: string) {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]}`;
}

/** `6 to 7 Nov`, or `30 Jul to 2 Aug` across a month end. */
export function dayRange(from: string, until: string) {
  const a = toDate(from);
  const b = toDate(until);
  const sameMonth = a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
  const start = sameMonth ? String(a.getUTCDate()) : dayMonth(from);
  return `${start} to ${dayMonth(until)}`;
}

/** `6 Jun 2015` */
export function fullDate(iso: string) {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** `November` */
export const monthName = (iso: string) => LONG_MONTHS[toDate(iso).getUTCMonth()];

/** `2026-11`, to group days by month across years. */
export const monthKey = (iso: string) => iso.slice(0, 7);

export const yearOf = (iso: string) => toDate(iso).getUTCFullYear();

/** `2022`, or `2021 to 2023` when the years differ. */
export function yearSpan(isos: string[]) {
  const years = isos.map(yearOf);
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first} to ${last}`;
}

/** Counts per label, most first; ties keep the order they first appear in. */
export function tally(labels: string[]): [label: string, count: number][] {
  const counts = new Map<string, number>();
  for (const label of labels) {
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export const hostName = (url: string) => new URL(url).hostname.replace(/^www\./, "");
