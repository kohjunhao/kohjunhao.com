import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { movies, recLabel, type Recommendation } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Movies",
  description:
    "A watch list — films I've seen, with honest recommendations.",
};

const tiers: Recommendation[] = ["highly", "recommended", "skip"];

export default function MoviesPage() {
  const byTier = Object.fromEntries(
    tiers.map((t) => [t, movies.filter((m) => m.rec === t)])
  ) as Record<Recommendation, typeof movies>;

  return (
    <PageShell>
      <section className="mb-10">
        <SectionHeader index="06" title="Movies" right={`${movies.length} seen`} />
        <p className="prose-aizome mt-5">
          A log of what I&rsquo;ve watched, grouped by recommendation. Mostly
          sci-fi, tech, and finance &mdash; the shapes of the future, rendered.
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
              right={`${list.length} films`}
            />
            <div className="mt-5">
              <LedgerList>
                {list.map((m, i) => (
                  <LedgerRow
                    key={m.title}
                    data={{
                      left: String(i + 1).padStart(2, "0"),
                      mid: m.title,
                      note: m.year,
                      right: ti === 0 ? "MUST WATCH" : ti === 2 ? "SKIP" : "",
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
