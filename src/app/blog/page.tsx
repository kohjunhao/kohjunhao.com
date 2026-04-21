import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { blogPosts } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Blog",
  description: "Shorter personal notes.",
};

export default function BlogPage() {
  return (
    <PageShell>
      <section className="mb-8">
        <SectionHeader index="02" title="Blog" right={`${blogPosts.length} entries`} />
        <p className="prose-aizome mt-5">
          Shorter notes and thinking-out-loud. Long-form research lives in{" "}
          <a href="/articles">Articles</a>.
        </p>
      </section>

      <section className="mb-10">
        <LedgerList>
          {blogPosts.map((p) => (
            <LedgerRow
              key={p.index}
              data={{
                left: p.index,
                mid: p.title,
                note: p.note,
                right: p.date,
              }}
              tabular
            />
          ))}
        </LedgerList>
      </section>
    </PageShell>
  );
}
