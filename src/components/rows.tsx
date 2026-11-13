import Link from "next/link";
import type { Article } from "@/lib/articles";
import { readingTime } from "@/lib/articles";
import { yearOf } from "@/lib/format";
import type { Company } from "@/lib/portfolio";

/** The four-column A to Z list of companies with their sectors in grey. */
export function CompanyList({ companies }: { companies: Company[] }) {
  return (
    <ul className="cos">
      {companies.map((c) => (
        <li key={c.name}>
          <span>{c.name}</span>
          <em>{c.sector}</em>
        </li>
      ))}
    </ul>
  );
}

/** One hairline row per essay: year, title, minutes. */
export function EssayList({ articles }: { articles: Article[] }) {
  return (
    <div className="lines">
      {articles.map((a) => (
        <Link key={a.slug} className="line" href={`/articles/${a.slug}`}>
          <span className="when">{yearOf(a.date)}</span>
          <span className="title">{a.title}</span>
          <span className="st">{readingTime(a)}</span>
        </Link>
      ))}
    </div>
  );
}
