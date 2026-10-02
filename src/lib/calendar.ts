import activity from "@/data/activity.json";
import type { LogEntry } from "@/content/log";

export const METRICS = {
  prompts: "Prompts",
  commits: "Commits",
  shipped: "Shipped",
} as const;

export type Metric = keyof typeof METRICS;

export type CalendarDay = {
  date: string;
  future: boolean;
  counts: Record<Metric, number>;
  /** 0 is an empty day, 4 is the darkest square. */
  levels: Record<Metric, number>;
};

export type Calendar = {
  weeks: number;
  /** Seven per week, Monday first, so the grid fills column by column. */
  days: CalendarDay[];
  monthLabels: { week: number; label: string }[];
  totals: {
    prompts: number;
    commits: number;
    repos: number;
    daysWorked: number;
    spanDays: number;
    entries: number;
  };
  record: { date: string; prompts: number };
};

const DAY_MS = 86_400_000;
const DAYS_PER_WEEK = 7;
const MAX_LEVEL = 4;
const COMMITS = 0;
const PROMPTS = 1;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY_MS);

function mondayOf(d: Date) {
  const daysSinceMonday = (d.getUTCDay() + 6) % DAYS_PER_WEEK;
  return addDays(d, -daysSinceMonday);
}

// Splits the days that have any activity into four equal groups, so the
// darkest square means "top quarter of days", whatever the raw numbers are.
function quantileLevel(values: number[]) {
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  const cut = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
  const cuts = [cut(0.25), cut(0.5), cut(0.75)];

  return (v: number) => (v === 0 ? 0 : 1 + cuts.filter((c) => v > c).length);
}

// Most days ship one thing, so quartiles would paint every square the same.
const shippedLevel = (v: number) => (v === 0 ? 0 : Math.min(MAX_LEVEL, v + 1));

export function buildCalendar(log: LogEntry[]): Calendar {
  const perDay = activity.days as Record<string, number[]>;
  const shipped: Record<string, number> = {};
  for (const entry of log) {
    shipped[entry.date] = (shipped[entry.date] ?? 0) + 1;
  }

  const logDays = log.flatMap((entry) => [entry.date, entry.until ?? entry.date]).sort();
  const first = [activity.from, logDays[0]].sort()[0];
  const last = [activity.through, logDays.at(-1) ?? activity.through].sort().at(-1) as string;

  const start = mondayOf(toDate(first));
  const end = toDate(last);
  const weeks = Math.floor((mondayOf(end).getTime() - start.getTime()) / (DAY_MS * DAYS_PER_WEEK)) + 1;

  const promptLevel = quantileLevel(Object.values(perDay).map((v) => v[PROMPTS]));
  const commitLevel = quantileLevel(Object.values(perDay).map((v) => v[COMMITS]));

  const days: CalendarDay[] = [];
  const monthLabels: Calendar["monthLabels"] = [];

  for (let week = 0; week < weeks; week++) {
    const monday = addDays(start, week * DAYS_PER_WEEK);
    const previousMonday = addDays(monday, -DAYS_PER_WEEK);
    if (week === 0 || monday.getUTCMonth() !== previousMonday.getUTCMonth()) {
      monthLabels.push({ week, label: MONTHS[monday.getUTCMonth()] });
    }

    for (let offset = 0; offset < DAYS_PER_WEEK; offset++) {
      const date = addDays(monday, offset);
      const iso = toIso(date);
      const counts = {
        prompts: perDay[iso]?.[PROMPTS] ?? 0,
        commits: perDay[iso]?.[COMMITS] ?? 0,
        shipped: shipped[iso] ?? 0,
      };
      days.push({
        date: iso,
        future: date.getTime() > end.getTime(),
        counts,
        levels: {
          prompts: promptLevel(counts.prompts),
          commits: commitLevel(counts.commits),
          shipped: shippedLevel(counts.shipped),
        },
      });
    }
  }

  const record = days.reduce((best, day) => (day.counts.prompts > best.counts.prompts ? day : best));

  return {
    weeks,
    days,
    monthLabels,
    totals: {
      prompts: activity.prompts,
      commits: activity.commits,
      repos: activity.repos,
      daysWorked: Object.keys(perDay).length,
      spanDays: Math.round((toDate(activity.through).getTime() - toDate(activity.from).getTime()) / DAY_MS) + 1,
      entries: log.length,
    },
    record: { date: record.date, prompts: record.counts.prompts },
  };
}
