import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { books, type Recommendation } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Books",
  description:
    "A public reading list — books I've read with honest verdicts, kept like a commonplace book.",
};

const tiers: { key: Recommendation; word: string }[] = [
  { key: "highly", word: "must" },
  { key: "recommended", word: "worth" },
  { key: "skip", word: "pass" },
];

export default function BooksPage() {
  const counts = {
    highly: books.filter((b) => b.rec === "highly").length,
    recommended: books.filter((b) => b.rec === "recommended").length,
    skip: books.filter((b) => b.rec === "skip").length,
  };

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          06 / books
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Books
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.2em] uppercase text-muted">
            {counts.highly}·{counts.recommended}·{counts.skip}
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-ink">
          Kept like a commonplace book — each row is a book I&rsquo;ve read and
          what I&rsquo;d say if you asked me at a dinner table.
        </p>
      </section>

      <div className="mt-12">
        {tiers.map(({ key, word }) => {
          const list = books.filter((b) => b.rec === key);
          if (list.length === 0) return null;
          return (
            <section key={key} className="mb-10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent font-medium">
                  {word}
                </span>
                <span className="flex-1 h-px bg-rule" />
                <span className="mono text-[0.66rem] tracking-[0.2em] text-muted">
                  {String(list.length).padStart(2, "0")}
                </span>
              </div>

              <ul>
                {list.map((b) => (
                  <li
                    key={b.slug}
                    className="grid sm:grid-cols-[1.5fr_1fr] gap-4 sm:gap-7 py-2.5 items-baseline"
                  >
                    <div>
                      <div className="font-serif text-[1.05rem] text-ink leading-tight">
                        {b.title}
                      </div>
                      <div className="font-serif italic text-[0.85rem] text-muted mt-1">
                        {b.author}
                      </div>
                    </div>
                    <div className="font-serif italic text-[0.85rem] text-muted border-l border-rule pl-4 leading-[1.5] flex items-baseline gap-3">
                      {b.note ? (
                        <span>&ldquo;{b.note}&rdquo;</span>
                      ) : (
                        <span className="opacity-50">—</span>
                      )}
                      <span className="mono text-[0.58rem] tracking-[0.18em] uppercase text-muted opacity-60 ml-auto whitespace-nowrap">
                        {b.year}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
