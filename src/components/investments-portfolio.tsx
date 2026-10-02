import Link from "next/link";
import { Hairline } from "./hairline";
import { investments, investmentSlug, type Investment } from "@/lib/stock";

const CATEGORY_ORDER: NonNullable<Investment["category"]>[] = [
  "Crypto",
  "Frontier Tech",
];

export function InvestmentsPortfolio() {
  const featuredSet = new Set(
    investments.filter((i) => i.featured).map((i) => i.name)
  );
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: investments
      .filter((i) => i.category === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="mt-14">
      <div className="flex items-baseline gap-4 mb-4 flex-wrap">
        <span className="font-serif text-[1.2rem] font-medium">
          <span className="mono text-[0.66rem] text-accent mr-3 tracking-[0.22em]">
            ·&nbsp;/
          </span>
          Portfolio
        </span>
        <span className="ml-auto mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
          {String(investments.length).padStart(2, "0")} companies
        </span>
      </div>
      <Hairline />

      <div className="pt-4 grid gap-8">
        {groups.map(({ category, items }) => (
          <div key={category}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent">
                {category}
              </span>
              <span className="mono text-[0.6rem] tracking-[0.22em] text-muted">
                {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 border-t border-rule pt-1">
              {items.map((inv) => {
                const isFeat = featuredSet.has(inv.name);
                return (
                  <Link
                    key={inv.name}
                    href={`/investments/${investmentSlug(inv.name)}`}
                    className="group grid grid-cols-[1fr_auto] gap-2 py-1 border-b border-rule items-baseline hover:opacity-80 transition-opacity"
                  >
                    <span
                      className={`font-serif text-[0.88rem] ${
                        isFeat ? "text-accent font-medium" : "text-ink"
                      } group-hover:text-accent transition-colors`}
                    >
                      {inv.name}
                      {isFeat && (
                        <sup className="mono text-[0.5rem] text-accent tracking-[0.22em] ml-1">
                          ★
                        </sup>
                      )}
                    </span>
                    <span className="mono text-[0.58rem] text-muted">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
