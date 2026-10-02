"use client";

import { useState, type CSSProperties } from "react";
import { METRICS, shortDay, type Calendar, type CalendarDay, type Metric } from "@/lib/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEVELS = [0, 1, 2, 3, 4];

const METRIC_CAPTION: Record<Metric, string> = {
  prompts: "Darker means more prompts typed at a coding agent.",
  commits: "Darker means more commits.",
};

type Stat = {
  tag: string;
  value: string;
  /** Shown small after the value, as in 149/195. */
  of?: string;
  label: string;
};

const number = (n: number) => n.toLocaleString("en-US");
const plural = (n: number, word: string) => `${number(n)} ${word}${n === 1 ? "" : "s"}`;
const index = (i: number) => String(i + 1).padStart(2, "0");

function longDay(iso: string) {
  return `${WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()]} ${shortDay(iso)}`;
}

function daySummary(day: CalendarDay) {
  const parts = [
    day.counts.prompts > 0 && plural(day.counts.prompts, "prompt"),
    day.counts.commits > 0 && plural(day.counts.commits, "commit"),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "nothing recorded";
}

function stats({ totals, record }: Calendar): Stat[] {
  return [
    { tag: "prompts", value: number(totals.prompts), label: "prompts typed" },
    { tag: "commits", value: number(totals.commits), label: `commits, ${totals.repos} repos` },
    { tag: "days", value: number(totals.daysWorked), of: number(totals.spanDays), label: "days with activity" },
    { tag: shortDay(record.date), value: number(record.prompts), label: "prompts on the busiest day" },
  ];
}

export function Activity({ calendar }: { calendar: Calendar }) {
  const [metric, setMetric] = useState<Metric>("prompts");
  const [hovered, setHovered] = useState<CalendarDay | null>(null);
  const weeks = { "--weeks": calendar.weeks } as CSSProperties;
  const span = `${shortDay(calendar.days[0].date)} to ${shortDay(calendar.through)} ${calendar.through.slice(0, 4)}`;

  return (
    <section className="v3-frame v3-activity" aria-labelledby="activity">
      <div className="v3-activity-head">
        <h2 id="activity" className="v3-label">
          Activity
        </h2>
        <span className="v3-caption">{span}, one square per day</span>
      </div>

      <div className="v3-toggle" role="group" aria-label="What the squares count">
        {(Object.keys(METRICS) as Metric[]).map((m) => (
          <button key={m} type="button" className="v3-pill" aria-pressed={metric === m} onClick={() => setMetric(m)}>
            {METRICS[m]}
          </button>
        ))}
      </div>

      <div className="v3-months" style={weeks} aria-hidden>
        {calendar.monthLabels.map(({ week, label }) => (
          <span key={week} style={{ gridColumnStart: week + 1 }}>
            {label}
          </span>
        ))}
      </div>

      <div className="v3-grid" style={weeks} onMouseLeave={() => setHovered(null)}>
        {calendar.days.map((d) => {
          if (d.future) {
            return <span key={d.date} className="v3-day" data-future />;
          }
          return (
            <span
              key={d.date}
              className="v3-day"
              data-level={d.levels[metric]}
              onMouseEnter={() => setHovered(d)}
              onClick={() => setHovered(d)}
            />
          );
        })}
      </div>

      <div className="v3-readout-row">
        <p className="v3-readout" aria-live="polite">
          {hovered ? (
            <>
              <b>{longDay(hovered.date)}.</b> {daySummary(hovered)}
            </>
          ) : (
            METRIC_CAPTION[metric]
          )}
        </p>
        <div className="v3-legend" aria-hidden>
          less
          {LEVELS.map((level) => (
            <span key={level} className="v3-day" data-level={level} />
          ))}
          more
        </div>
      </div>

      <dl className="v3-cards">
        {stats(calendar).map((stat, i) => (
          <div key={stat.label} className="v3-card">
            <dt className="v3-card-label">{stat.label}</dt>
            <dd className="v3-card-n">
              {stat.value}
              {stat.of && <small>/{stat.of}</small>}
            </dd>
            <dd className="v3-card-meta">
              <span className="v3-chip" aria-hidden>
                {index(i)}
              </span>
              <span>{stat.tag}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
