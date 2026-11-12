"use client";

import { useState, type CSSProperties } from "react";
import { METRICS, shortDay, type Calendar, type CalendarDay, type Metric } from "@/lib/calendar";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LEVELS = [0, 1, 2, 3, 4];

type Stat = {
  value: string;
  /** Shown small after the value, as in 149/195. */
  of?: string;
  label: string;
};

const number = (n: number) => n.toLocaleString("en-US");
const weekday = (iso: string) => WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];

function stats({ totals }: Calendar, shipped: number): Stat[] {
  return [
    { value: number(shipped), label: "things shipped and written up" },
    { value: number(totals.prompts), label: "prompts typed at a coding agent" },
    { value: number(totals.commits), label: `commits across ${totals.repos} repos` },
    { value: number(totals.daysWorked), of: number(totals.spanDays), label: "days with something done" },
  ];
}

export function Activity({ calendar, shipped }: { calendar: Calendar; shipped: number }) {
  const [metric, setMetric] = useState<Metric>("prompts");
  const [hovered, setHovered] = useState<CalendarDay | null>(null);
  const weeks = { "--weeks": calendar.weeks } as CSSProperties;
  const busiest = calendar.days.find((d) => d.date === calendar.record.date) ?? calendar.days[0];
  const shown = hovered ?? busiest;

  return (
    <section className="v3-frame act" aria-labelledby="activity">
      <div className="sec-head">
        <h2 id="activity">
          Engine room. <span>One square per day since {shortDay(calendar.from)}.</span>
        </h2>
      </div>

      <dl className="act-nums">
        {stats(calendar, shipped).map((stat) => (
          <div key={stat.label}>
            <dd>
              {stat.value}
              {stat.of && <small>/{stat.of}</small>}
            </dd>
            <dt>{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="act-body">
        <div className="act-cal">
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
                  data-on={d.date === shown.date || undefined}
                  onMouseEnter={() => setHovered(d)}
                  onClick={() => setHovered(d)}
                />
              );
            })}
          </div>

          <div className="act-foot">
            <div className="v3-toggle" role="group" aria-label="What the squares count">
              {(Object.keys(METRICS) as Metric[]).map((m) => (
                <button key={m} type="button" className="v3-pill" aria-pressed={metric === m} onClick={() => setMetric(m)}>
                  {METRICS[m]}
                </button>
              ))}
            </div>
            <div className="v3-legend" aria-hidden>
              less
              {LEVELS.map((level) => (
                <span key={level} className="v3-day" data-level={level} />
              ))}
              more
            </div>
          </div>
        </div>

        <div className="act-day" aria-live="polite">
          <p className="act-day-label">{hovered ? weekday(shown.date) : "The busiest day so far"}</p>
          <p className="act-day-date">
            {shortDay(shown.date)} <span>{shown.date.slice(0, 4)}</span>
          </p>
          <dl className="act-day-counts">
            <div>
              <dd>{number(shown.counts.prompts)}</dd>
              <dt>prompts</dt>
            </div>
            <div>
              <dd>{number(shown.counts.commits)}</dd>
              <dt>commits</dt>
            </div>
          </dl>
          <p className="act-day-hint">Point at a square to read that day.</p>
        </div>
      </div>
    </section>
  );
}
