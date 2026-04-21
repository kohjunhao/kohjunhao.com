import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Long-form research on DeFi, Web3, and crypto markets. Published at Paragraph, archived here.",
};

export default function ArticlesPage() {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageShell>
      <section className="mb-8">
        <SectionHeader index="01" title="Articles" right={`${articles.length} entries`} />
        <p className="prose-aizome mt-5">
          Long-form research, mostly on DeFi and the structure of markets.
          Originally published at{" "}
          <a
            href="https://paragraph.com/@0xvega"
            target="_blank"
            rel="noopener noreferrer"
          >
            paragraph.com/@0xvega
          </a>
          . Click any entry to open it in-place.
        </p>
      </section>

      <section className="mb-10">
        <LedgerList>
          {sorted.map((a, i) => (
            <LedgerRow
              key={a.slug}
              data={{
                left: String(i + 1).padStart(2, "0"),
                mid: a.title,
                note: a.subtitle,
                right: a.dateLabel,
                href: `/articles/${a.slug}`,
              }}
              tabular
            />
          ))}
        </LedgerList>
      </section>
    </PageShell>
  );
}
