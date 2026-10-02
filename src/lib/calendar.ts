import activity from "@/data/activity.json";

export const METRICS = {
  prompts: "Prompts",
  commits: "Commits",
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
  /** The newest day with data. */
  through: string;
  /** Seven per week, Monday first, so the grid fills column by column. */
  days: CalendarDay[];
  monthLabels: { week: number; label: string }[];
  totals: {
    prompts: number;
    commits: number;
    repos: number;
    daysWorked: number;
    spanDays: number;
  };
  record: { date: string; prompts: number };
};

const DAY_MS = 86_400_000;
const DAYS_PER_WEEK = 7;
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

export function shortDay(iso: string) {
  const d = toDate(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function buildCalendar(): Calendar {
  const perDay = activity.days as Record<string, number[]>;
  const start = mondayOf(toDate(activity.from));
  const end = toDate(activity.through);
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
      };
      days.push({
        date: iso,
        future: date.getTime() > end.getTime(),
        counts,
        levels: {
          prompts: promptLevel(counts.prompts),
          commits: commitLevel(counts.commits),
        },
      });
    }
  }

  const record = days.reduce((best, day) => (day.counts.prompts > best.counts.prompts ? day : best));

  return {
    weeks,
    through: activity.through,
    days,
    monthLabels,
    totals: {
      prompts: activity.prompts,
      commits: activity.commits,
      repos: activity.repos,
      daysWorked: Object.keys(perDay).length,
      spanDays: Math.round((toDate(activity.through).getTime() - toDate(activity.from).getTime()) / DAY_MS) + 1,
    },
    record: { date: record.date, prompts: record.counts.prompts },
  };
}
