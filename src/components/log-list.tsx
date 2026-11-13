import Link from "next/link";
import type { LogMonth, LogRow } from "@/lib/log";

const THUMB = { width: 220, height: 138 };

function RowLink({ link }: { link: NonNullable<LogRow["link"]> }) {
  if (link.href.startsWith("/")) {
    return (
      <Link className="link" href={link.href}>
        {link.text}
      </Link>
    );
  }
  return (
    <a className="link" href={link.href}>
      {link.text}
    </a>
  );
}

function Row({ row }: { row: LogRow }) {
  return (
    <details className="row">
      <summary>
        <span className="when">{row.when}</span>
        <span className="title">{row.title}</span>
        {row.status ? (
          <span className={row.status.tone === "failed" ? "st bad" : "st"}>{row.status.label}</span>
        ) : (
          <span />
        )}
        <span className="pm" aria-hidden="true" />
      </summary>
      <div className="more">
        <div>
          <p>{row.deck}</p>
          {row.link && <RowLink link={row.link} />}
        </div>
        {row.image && (
          // eslint-disable-next-line @next/next/no-img-element -- pre-sized thumbnails; the optimiser would only re-encode them
          <img src={row.image} width={THUMB.width} height={THUMB.height} alt="" loading="lazy" decoding="async" />
        )}
      </div>
    </details>
  );
}

/** Month headings, newest first, each over one-line rows that open to their write-up. */
export function LogList({ months }: { months: LogMonth[] }) {
  return months.map((month) => (
    <div key={month.key}>
      <div className="month">{month.name}</div>
      {month.rows.map((row) => (
        <Row key={row.key} row={row} />
      ))}
    </div>
  ));
}
