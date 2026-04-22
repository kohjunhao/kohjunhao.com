"use client";

import { useState } from "react";
import Link from "next/link";
import { Hairline } from "./hairline";
import { investments, investmentSlug, type Investment } from "@/lib/stock";

type Sort = "az" | "sector";

export function InvestmentsPortfolio() {
  const [sort, setSort] = useState<Sort>("sector");
  const featuredSet = new Set(
    investments.filter((i) => i.featured).map((i) => i.name)
  );

  const sectorOrder: Investment["sector"][] = [
    "Infrastructure",
    "DeFi",
    "AI",
    "DePIN",
    "Applications",
  ];
  const bySector = sectorOrder.map((sec) => ({
    sector: sec,
    items: investments
      .filter((i) => i.sector === sec)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));

  return (
    <section className="mt-14">
      <div className="flex items-baseline gap-4 mb-4 flex-wrap">
        <span className="font-serif text-[1.2rem] font-medium">
          <span className="mono text-[0.66rem] text-accent mr-3 tracking-[0.22em]">
            ·&nbsp;/
          </span>
          Portfolio
        </span>
        <div className="ml-auto flex border border-rule">
          {(
            [
              ["sector", "By sector"],
              ["az", "A–Z"],
            ] as [Sort, string][]
          ).map(([k, label], i) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`px-3 py-1 mono text-[0.6rem] tracking-[0.22em] uppercase transition-colors duration-150 ${
                sort === k
                  ? "bg-ink text-canvas"
                  : "text-muted hover:text-ink"
              } ${i > 0 ? "border-l border-rule" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Hairline />

      {sort === "az" ? (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-0">
          {[...investments]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((inv, i) => {
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
      ) : (
        <div className="pt-4 grid gap-8">
          {bySector.map(({ sector, items }) => (
            <div key={sector}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent">
                  {sector}
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
      )}
    </section>
  );
}
