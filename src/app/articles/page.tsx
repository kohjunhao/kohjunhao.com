import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { articles, formatDate } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Writing",
  description: "Four essays on DeFi, 2022, first published on Paragraph.",
};

export default function ArticlesPage() {
  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />

      <main id="main" className="v3-frame v3-writing">
        <div className="v3-activity-head">
          <h1 className="v3-label">Writing</h1>
          <span className="v3-caption">Four essays on DeFi, 2022, first published on Paragraph</span>
        </div>

        <ol className="v3-essays">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/articles/${a.slug}`} className="v3-essay">
                <span className="v3-essay-when">
                  <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.minutes} min
                </span>
                <span className="v3-essay-body">
                  <span className="v3-essay-title">{a.title}</span>
                  <span className="v3-essay-deck">{a.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
