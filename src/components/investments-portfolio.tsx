import Link from "next/link";
import { Hairline } from "./hairline";
import { investments, investmentSlug } from "@/lib/stock";

export function InvestmentsPortfolio() {
  const featuredSet = new Set(
    investments.filter((i) => i.featured).map((i) => i.name)
  );
  const sorted = [...investments].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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
          A–Z · {String(sorted.length).padStart(2, "0")}
        </span>
      </div>
      <Hairline />

      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-0">
        {sorted.map((inv, i) => {
          const isFeat = featuredSet.has(inv.name);
          return (
            <Link
              key={inv.name}
              href={`/investments/${investmentSlug(inv.name)}`}
              className="group grid grid-cols-[2.25rem_1fr_auto] gap-2 py-1.5 border-b border-rule items-baseline hover:opacity-80 transition-opacity"
            >
              <span className="mono text-[0.58rem] text-muted tracking-[0.18em] tabular-nums">
                {String(i + 1).padStart(3, "0")}
              </span>
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
              <span className="mono text-[0.6rem] text-muted">→</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
