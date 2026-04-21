import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { books, recLabel, type Recommendation } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Books",
  description:
    "A public reading list — books I've read, with honest recommendations.",
};

const tiers: Recommendation[] = ["highly", "recommended", "skip"];

export default function BooksPage() {
  const byTier = Object.fromEntries(
    tiers.map((t) => [t, books.filter((b) => b.rec === t)])
  ) as Record<Recommendation, typeof books>;

  return (
    <PageShell>
      <section className="mb-10">
        <SectionHeader index="05" title="Books" right={`${books.length} read`} />
        <p className="prose-aizome mt-5">
          A public record of what I&rsquo;ve read, grouped by how strongly
          I&rsquo;d pass it on. Not a review blog &mdash; a shelf.
        </p>
      </section>

      {tiers.map((tier, ti) => {
        const list = byTier[tier];
        if (list.length === 0) return null;
        const meta = recLabel[tier];
        return (
          <section key={tier} className="mb-12">
            <SectionHeader
              index={meta.glyph}
              title={meta.label}
              right={`${list.length} books`}
            />
            <div className="mt-5">
              <LedgerList>
                {list.map((b, i) => (
                  <LedgerRow
                    key={b.title}
                    data={{
                      left: String(i + 1).padStart(2, "0"),
                      mid: b.title,
                      note: b.author,
                      right: ti === 0 ? "MUST READ" : ti === 2 ? "SKIP" : "",
                    }}
                    tabular
                  />
                ))}
              </LedgerList>
            </div>
          </section>
        );
      })}
    </PageShell>
  );
}
