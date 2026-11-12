import type { CSSProperties } from "react";
import { DEFAULT_STATUS, KINDS, type LogEntry } from "@/content/log";
import { shortDay } from "@/lib/calendar";

const ROWS = 7;

export function Departures({ entries }: { entries: LogEntry[] }) {
  return (
    <section className="dep" aria-labelledby="departures">
      <div className="dep-inner">
        <div className="sec-head">
          <h2 id="departures">
            Departures. <span>The latest things out of port.</span>
          </h2>
          <a className="sec-more" href="#log">
            All {entries.length}
          </a>
        </div>

        <div className="dep-cols" aria-hidden>
          <span>Date</span>
          <span>Cargo</span>
          <span>What left</span>
          <span>Status</span>
        </div>
        <ol className="dep-board">
          {entries.slice(0, ROWS).map((entry, i) => (
            <li key={`${entry.date}-${entry.title}`} className="dep-row" style={{ "--i": i } as CSSProperties}>
              <time dateTime={entry.date}>{shortDay(entry.date)}</time>
              <span className="dep-kind">{KINDS[entry.kind]}</span>
              <span className="dep-title">{entry.title}</span>
              <span className="dep-status" data-plain={entry.status ? undefined : true}>
                {entry.status ?? DEFAULT_STATUS}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
