import Image from "next/image";
import Link from "next/link";
import { KINDS, type LogEntry } from "@/content/log";
import { shortDay } from "@/lib/calendar";

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

const THUMB_WIDTH = 800;
const THUMB_HEIGHT = 500;

const entryCount = (n: number) => `${n} ${n === 1 ? "entry" : "entries"}`;

function byMonth(entries: LogEntry[]) {
  const groups = new Map<string, LogEntry[]>();
  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return [...groups.entries()];
}

function monthName(key: string) {
  return MONTH_NAMES[Number(key.slice(5)) - 1];
}

function Title({ entry }: { entry: LogEntry }) {
  if (!entry.href) {
    return <>{entry.title}</>;
  }
  if (entry.href.startsWith("http")) {
    return (
      <a href={entry.href} target="_blank" rel="noopener noreferrer">
        {entry.title}
        <span className="v3-out" aria-hidden>
          {" "}
          ↗
        </span>
      </a>
    );
  }
  return <Link href={entry.href}>{entry.title}</Link>;
}

export function LogFeed({ entries }: { entries: LogEntry[] }) {
  const months = byMonth(entries);
  const oldest = entries[entries.length - 1];

  return (
    <section className="v3-frame v3-log" id="log" aria-labelledby="log-heading">
      <div className="v3-activity-head">
        <h2 id="log-heading" className="v3-label">
          Log
        </h2>
        <span className="v3-caption">
          {entryCount(entries.length)} since {monthName(oldest.date.slice(0, 7))} {oldest.date.slice(0, 4)}, newest first
        </span>
      </div>

      {months.map(([month, monthEntries]) => (
        <div key={month} className="v3-month">
          <div className="v3-month-head">
            <h3>
              {monthName(month)} <span>{month.slice(0, 4)}</span>
            </h3>
            <span className="v3-caption">{entryCount(monthEntries.length)}</span>
          </div>
          {monthEntries.map((entry) => (
            <article key={`${entry.date}-${entry.title}`} className="v3-entry">
              <div className="v3-entry-when">
                <time dateTime={entry.date}>{shortDay(entry.date)}</time>
                {entry.until && <span>to {shortDay(entry.until)}</span>}
              </div>
              <div className="v3-entry-kind">{KINDS[entry.kind]}</div>
              <div className="v3-entry-body">
                <h4 className="v3-entry-title">
                  <Title entry={entry} />
                </h4>
                <p className="v3-entry-deck">{entry.deck}</p>
              </div>
              {entry.image && (
                <div className="v3-entry-img">
                  <Image
                    src={`/log/${entry.image}.jpg`}
                    alt=""
                    width={THUMB_WIDTH}
                    height={THUMB_HEIGHT}
                    sizes="(max-width: 640px) 100vw, 220px"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}
