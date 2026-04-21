import type { Article } from "@/lib/articles";
import { Hairline } from "./hairline";

export function ArticleBody({ article }: { article: Article }) {
  const paragraphs = article.body.split(/\n\n+/);

  return (
    <article className="prose-aizome mx-auto">
      <header className="mb-10">
        <div className="mono text-[0.7rem] text-accent tracking-wider mb-5">
          {article.tags.map((t) => `#${t}`).join("  ·  ")}
        </div>
        <h1 className="font-serif text-[2.1rem] leading-[1.1] font-medium tracking-tight text-ink mb-3">
          {article.title}
        </h1>
        <p className="text-muted italic text-[1.05rem] leading-snug">
          {article.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 mono text-[0.7rem] text-muted tracking-wider uppercase">
          <span>{article.dateLabel}</span>
          <span>
            <span className="opacity-60">PUBLISHED IN</span>{" "}
            {article.venueUrl ? (
              <a
                href={article.venueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent"
              >
                {article.venue}
              </a>
            ) : (
              article.venue
            )}
          </span>
        </div>
      </header>
      <Hairline className="mb-10" />
      <div>
        {paragraphs.map((p, i) => {
          if (p.startsWith("## ")) {
            return <h2 key={i}>{p.slice(3)}</h2>;
          }
          if (p.startsWith("### ")) {
            return <h3 key={i}>{p.slice(4)}</h3>;
          }
          if (p.startsWith("- ")) {
            const items = p.split("\n").map((line) => line.replace(/^- /, ""));
            return (
              <ul
                key={i}
                className="list-disc pl-5 my-5 space-y-1.5 marker:text-accent"
              >
                {items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{renderInline(p)}</p>;
        })}
      </div>
    </article>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
