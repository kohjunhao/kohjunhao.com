"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { KINDS, type Kind, type LogEntry } from "@/content/log";
import { METRICS, type Calendar, type CalendarDay, type Metric } from "@/lib/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = [
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
const LEVELS = [0, 1, 2, 3, 4];
const THUMB_WIDTH = 800;
const THUMB_HEIGHT = 500;

const METRIC_CAPTION: Record<Metric, string> = {
  prompts: "Darker means more prompts typed at a coding agent.",
  commits: "Darker means more commits.",
  shipped: "Darker means more things shipped.",
};

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const number = (n: number) => n.toLocaleString("en-US");
const plural = (n: number, word: string) => `${number(n)} ${word}${n === 1 ? "" : "s"}`;

const entryCount = (n: number) => `${number(n)} ${n === 1 ? "entry" : "entries"}`;

function shortDay(iso: string) {
  const d = utc(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

function longDay(iso: string) {
  return `${WEEKDAYS[utc(iso).getUTCDay()]} ${shortDay(iso)}`;
}

function daySummary(day: CalendarDay) {
  const parts = [
    day.counts.prompts > 0 && plural(day.counts.prompts, "prompt"),
    day.counts.commits > 0 && plural(day.counts.commits, "commit"),
    day.counts.shipped > 0 && `${number(day.counts.shipped)} shipped`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "nothing recorded";
}

export function ShipLog({ calendar, entries }: { calendar: Calendar; entries: LogEntry[] }) {
  const [metric, setMetric] = useState<Metric>("prompts");
  const [kind, setKind] = useState<Kind | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [hovered, setHovered] = useState<CalendarDay | null>(null);

  const kindCounts = useMemo(() => {
    const counts = {} as Record<Kind, number>;
    for (const entry of entries) {
      counts[entry.kind] = (counts[entry.kind] ?? 0) + 1;
    }
    return counts;
  }, [entries]);

  const months = useMemo(() => {
    const visible = entries.filter(
      (entry) => (kind === null || entry.kind === kind) && (day === null || entry.date === day),
    );
    const groups = new Map<string, LogEntry[]>();
    for (const entry of visible) {
      const key = entry.date.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    }
    return [...groups.entries()];
  }, [entries, kind, day]);

  const readout = hovered ?? calendar.days.find((d) => d.date === day) ?? null;
  const shippedThatDay = readout ? entries.filter((entry) => entry.date === readout.date) : [];
  const { totals, record } = calendar;

  return (
    <>
      <section className="v2-cal" aria-label="Activity by day">
        <div className="v2-cal-head">
          <span className="v2-mono">
            {shortDay(calendar.days[0].date)} to {shortDay(entries[0].date)} 2026, one square per day
          </span>
          <div className="v2-toggle" role="group" aria-label="What the squares count">
            {(Object.keys(METRICS) as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                className="v2-mono"
                aria-pressed={metric === m}
                onClick={() => setMetric(m)}
              >
                {METRICS[m]}
              </button>
            ))}
          </div>
        </div>

        <div className="v2-months v2-mono" style={{ "--weeks": calendar.weeks } as CSSProperties} aria-hidden>
          {calendar.monthLabels.map(({ week, label }) => (
            <span key={week} style={{ gridColumnStart: week + 1 }}>
              {label}
            </span>
          ))}
        </div>

        <div
          className="v2-grid"
          style={{ "--weeks": calendar.weeks } as CSSProperties}
          onMouseLeave={() => setHovered(null)}
        >
          {calendar.days.map((d) => {
            if (d.future) {
              return <span key={d.date} className="v2-day" data-future />;
            }
            // Only days with an entry are buttons, so a keyboard user tabs
            // through the days that lead somewhere and skips the other 160.
            if (d.counts.shipped === 0) {
              return (
                <span
                  key={d.date}
                  className="v2-day"
                  data-level={d.levels[metric]}
                  onMouseEnter={() => setHovered(d)}
                  onClick={() => setHovered(d)}
                />
              );
            }
            return (
              <button
                key={d.date}
                type="button"
                className="v2-day"
                data-level={d.levels[metric]}
                data-shipped
                aria-label={`${longDay(d.date)}: ${daySummary(d)}`}
                aria-pressed={day === d.date}
                onMouseEnter={() => setHovered(d)}
                onFocus={() => setHovered(d)}
                onBlur={() => setHovered(null)}
                onClick={() => setDay(day === d.date ? null : d.date)}
              />
            );
          })}
        </div>

        <div className="v2-readout-row">
          <p className="v2-readout" aria-live="polite">
            {readout ? (
              <>
                <b>{longDay(readout.date)}.</b> {daySummary(readout)}
                {shippedThatDay.length > 0 && <>: {shippedThatDay.map((e) => e.title).join(" · ")}</>}
              </>
            ) : (
              <>
                {METRIC_CAPTION[metric]}{" "}
                {metric === "prompts" && (
                  <>
                    The record is {number(record.prompts)} in one day, on {shortDay(record.date)}.{" "}
                  </>
                )}
                {metric !== "shipped" && "A dot marks a day something shipped."}
              </>
            )}
          </p>
          <div className="v2-legend v2-mono" aria-hidden>
            less
            {LEVELS.map((level) => (
              <span key={level} className="v2-day" data-level={level} />
            ))}
            more
          </div>
        </div>

        <dl className="v2-stats">
          <div className="v2-stat">
            <dd className="v2-stat-n">{number(totals.prompts)}</dd>
            <dt className="v2-mono">prompts typed</dt>
          </div>
          <div className="v2-stat">
            <dd className="v2-stat-n">{number(totals.commits)}</dd>
            <dt className="v2-mono">commits, {totals.repos} repos</dt>
          </div>
          <div className="v2-stat">
            <dd className="v2-stat-n">
              {totals.daysWorked}
              <small>/{totals.spanDays}</small>
            </dd>
            <dt className="v2-mono">days with activity</dt>
          </div>
          <div className="v2-stat">
            <dd className="v2-stat-n">{totals.entries}</dd>
            <dt className="v2-mono">things logged</dt>
          </div>
        </dl>
      </section>

      <section className="v2-feed" id="log" aria-label="The log">
        <div className="v2-feed-head">
          <h2 className="v2-h2">The log</h2>
          <div className="v2-chips" role="group" aria-label="Filter by kind">
            <button type="button" className="v2-chip v2-mono" aria-pressed={kind === null} onClick={() => setKind(null)}>
              All<small>{entries.length}</small>
            </button>
            {(Object.keys(KINDS) as Kind[]).map((k) => (
              <button
                key={k}
                type="button"
                className="v2-chip v2-mono"
                aria-pressed={kind === k}
                onClick={() => setKind(kind === k ? null : k)}
              >
                {KINDS[k]}
                <small>{kindCounts[k] ?? 0}</small>
              </button>
            ))}
            {day && (
              <button type="button" className="v2-chip v2-chip-day v2-mono" onClick={() => setDay(null)}>
                {shortDay(day)} only<small>clear</small>
              </button>
            )}
          </div>
        </div>

        {months.length === 0 && <p className="v2-empty">Nothing of that kind on that day.</p>}

        {months.map(([month, monthEntries]) => (
          <div key={month}>
            <div className="v2-month">
              <h3>
                {MONTH_NAMES[Number(month.slice(5)) - 1]} <span>{month.slice(0, 4)}</span>
              </h3>
              <span className="v2-mono">{entryCount(monthEntries.length)}</span>
            </div>
            {monthEntries.map((entry) => (
              <Entry key={`${entry.date}-${entry.title}`} entry={entry} />
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

function Entry({ entry }: { entry: LogEntry }) {
  const external = entry.href?.startsWith("http");

  return (
    <article className="v2-entry">
      <div className="v2-entry-date v2-mono">
        <time dateTime={entry.date}>{shortDay(entry.date)}</time>
        {entry.until && <span>to {shortDay(entry.until)}</span>}
      </div>
      <div className="v2-entry-kind v2-mono">{KINDS[entry.kind]}</div>
      <div className="v2-entry-body">
        <h4 className="v2-entry-title">
          {entry.href && external && (
            <a href={entry.href} target="_blank" rel="noopener noreferrer">
              {entry.title}
              <span className="v2-out" aria-hidden>
                {" "}
                ↗
              </span>
            </a>
          )}
          {entry.href && !external && <Link href={entry.href}>{entry.title}</Link>}
          {!entry.href && entry.title}
        </h4>
        <p className="v2-entry-deck">{entry.deck}</p>
      </div>
      {entry.image && (
        <div className="v2-entry-img">
          <Image
            src={`/log/${entry.image}.jpg`}
            alt=""
            width={THUMB_WIDTH}
            height={THUMB_HEIGHT}
            sizes="(max-width: 860px) 100vw, 220px"
          />
        </div>
      )}
    </article>
  );
}
