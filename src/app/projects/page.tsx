import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { projects } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I'm building and operating.",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <section className="mb-8">
        <SectionHeader index="03" title="Projects" right={`${projects.length} entries`} />
        <p className="prose-aizome mt-5">
          Things I&rsquo;m building and operating. A mix of shipping products,
          experiments, and systems I maintain for myself.
        </p>
      </section>

      <section className="mb-10">
        <LedgerList>
          {projects.map((p) => (
            <LedgerRow
              key={p.index}
              data={{
                left: p.index,
                mid: p.name,
                note: p.note,
                right: p.status,
              }}
              tabular
            />
          ))}
        </LedgerList>
      </section>
    </PageShell>
  );
}
