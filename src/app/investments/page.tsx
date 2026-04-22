import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Hairline } from "@/components/hairline";
import { InvestmentsPortfolio } from "@/components/investments-portfolio";
import { investments, investmentSlug } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Investments",
  description:
    "Angel portfolio — early-stage cheques into crypto, DeFi, and AI founders.",
};

export default function InvestmentsPage() {
  const featured = investments.filter((i) => i.featured);

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          05 / investments
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Investments
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.2em] uppercase text-muted">
            {investments.length} companies
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          Small cheques written as an angel into founders at the edges of
          crypto, DeFi, and AI. I look for teams solving a specific technical
          problem, not narratives chasing a market.
        </p>
      </section>

      <section className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-8">
        {[
          ["Total", String(investments.length).padStart(2, "0")],
          ["Featured", String(featured.length).padStart(2, "0")],
          ["Thesis", "Infra · AI · DeFi"],
          ["Stage", "Pre-seed · Seed"],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted mb-1">
              {k}
            </div>
            <div className="font-serif text-[0.95rem] text-ink">{v}</div>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <span className="font-serif text-[1.2rem] font-medium">
            <span className="mono text-[0.66rem] text-accent mr-3">·&nbsp;/</span>
            Featured
          </span>
          <span className="mono text-[0.6rem] tracking-[0.2em] uppercase text-muted">
            spotlight
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {featured.map((inv) => (
            <Link
              key={inv.name}
              href={`/investments/${investmentSlug(inv.name)}`}
              className="group bg-surface border border-rule px-5 py-4 transition-colors hover:bg-surface/70 active:scale-[0.99] duration-150"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-[1.02rem] text-ink group-hover:text-accent transition-colors">
                  {inv.name}
                </span>
                <span className="mono text-[0.68rem] text-muted group-hover:text-accent transition-colors">
                  →
                </span>
              </div>
              {inv.note && (
                <div className="mono text-[0.58rem] tracking-[0.2em] uppercase text-muted mt-1.5">
                  {inv.note}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <InvestmentsPortfolio />

      <section className="mt-14">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="font-serif text-[1.2rem] font-medium">
            <span className="mono text-[0.66rem] text-accent mr-3">·&nbsp;/</span>
            Thesis
          </span>
        </div>
        <Hairline />
        <p className="font-serif italic text-[0.92rem] text-muted mt-3">
          What I look for in a founder / team:
        </p>
        <div className="mt-3 grid sm:grid-cols-2 gap-x-7 gap-y-2">
          {[
            ["Technical depth", "Built the thing, not commissioned it"],
            ["Edge", "Something non-obvious they've seen first"],
            ["Sustainable tokenomics", "Revenue path, not emissions path"],
            ["Clear market pull", "Users who would pay cash, not just tokens"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[auto_1fr] gap-3 py-1.5">
              <span className="mono text-[0.65rem] text-accent">·</span>
              <div>
                <span className="font-serif text-[0.95rem] text-ink">{k}</span>
                <span className="font-serif italic text-[0.82rem] text-muted ml-2">
                  — {v}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
