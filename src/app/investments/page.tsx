import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { Hairline } from "@/components/hairline";
import { investments } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Investments",
  description:
    "Angel portfolio — early-stage cheques into crypto, DeFi, and AI founders.",
};

export default function InvestmentsPage() {
  const featured = investments.filter((i) => i.featured);
  const rest = investments
    .filter((i) => !i.featured)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageShell>
      {/* Summary */}
      <section className="mb-10">
        <SectionHeader
          index="04"
          title="Investments"
          right={`${investments.length} companies`}
        />
        <p className="prose-aizome mt-5">
          Small cheques written as an angel into founders at the edges of
          crypto, DeFi, and AI. I look for teams solving a specific technical
          problem, not narratives chasing a market. Below is the current
          portfolio &mdash; featured entries first, then the full ledger.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6 mono text-[0.72rem] text-muted tracking-wider uppercase">
          <Stat label="Total" value={String(investments.length).padStart(2, "0")} />
          <Stat label="Featured" value={String(featured.length).padStart(2, "0")} />
          <Stat label="Thesis" value="Infra · AI · DeFi" />
          <Stat label="Stage" value="Pre-seed · Seed" />
        </div>
      </section>

      {/* Featured */}
      <section className="mb-14">
        <SectionHeader index="·" title="Featured" right="spotlight" />
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {featured.map((inv) => (
            <a
              key={inv.name}
              href={inv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-surface/60 hover:bg-surface border border-rule px-5 py-4 transition-colors active:scale-[0.985] duration-150"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-[1.08rem] group-hover:text-accent transition-colors">
                  {inv.name}
                </span>
                <span
                  aria-hidden
                  className="mono text-[0.68rem] text-muted tracking-wider opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all"
                >
                  ↗
                </span>
              </div>
              {inv.note && (
                <div className="mono text-[0.68rem] text-muted tracking-wider mt-1.5 uppercase">
                  {inv.note}
                </div>
              )}
              {inv.url && (
                <div className="font-serif text-[0.85rem] text-muted/80 italic mt-1">
                  {inv.url.replace(/^https?:\/\//, "")}
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Full ledger */}
      <section className="mb-10">
        <SectionHeader
          index="·"
          title="Portfolio"
          right="A–Z"
        />
        <div className="mt-5">
          <LedgerList>
            {rest.map((inv, i) => (
              <LedgerRow
                key={inv.name}
                data={{
                  left: String(i + 1).padStart(3, "0"),
                  mid: inv.name,
                  right: inv.url ? "↗" : "",
                  href: inv.url,
                }}
                tabular
              />
            ))}
          </LedgerList>
        </div>
      </section>

      {/* Thesis */}
      <section className="mb-12">
        <SectionHeader index="·" title="Thesis" />
        <div className="mt-5 prose-aizome">
          <p className="mb-0">What I look for in a founder / team:</p>
        </div>
        <Hairline className="mt-4 mb-3" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
          {[
            ["Technical depth", "Built the thing, not commissioned it"],
            ["Edge", "Something non-obvious they've seen first"],
            ["Sustainable tokenomics", "Revenue path, not emissions path"],
            ["Clear market pull", "Users who would pay cash, not just tokens"],
          ].map(([k, v]) => (
            <li key={k} className="grid grid-cols-[auto_1fr] gap-3 py-1.5">
              <span className="mono text-[0.7rem] text-accent tracking-wider uppercase">
                ·
              </span>
              <div>
                <span className="font-serif text-[0.98rem]">{k}</span>
                <span className="mono text-[0.66rem] text-muted tracking-wider ml-2 uppercase">
                  {v}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="opacity-60">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
