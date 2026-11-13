const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const DAY_MS = 86_400_000;
export const WEEK_MS = 7 * DAY_MS;

export const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

export const int = (n: number) => n.toLocaleString("en-GB");

export const oneDecimal = (n: number) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const upToOneDecimal = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 1 });

/** `12 Nov` */
export function dayMonth(iso: string) {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** `6 Jun 2015` */
export function fullDate(iso: string) {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** `6 to 7 Nov`, or `30 Jul to 2 Aug` across a month end. */
export function dayRange(from: string, until: string) {
  const a = toDate(from);
  const b = toDate(until);
  const start = a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}` : dayMonth(from);
  return `${start} to ${dayMonth(until)}`;
}

export const monthName = (d: Date) => MONTHS[d.getUTCMonth()];

export function mondayOf(d: Date) {
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - daysSinceMonday * DAY_MS);
}

export const hostName = (url: string) => new URL(url).hostname.replace(/^www\./, "");
