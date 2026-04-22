"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export type HomeLedgerEntry = {
  index: string;
  label: string;
  note: string;
  count: string;
  href: string;
};

export function HomeLedger({ entries }: { entries: HomeLedgerEntry[] }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <span className="mono text-[0.62rem] tracking-[0.3em] uppercase text-muted">
          — the ledger —
        </span>
        <span className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
          {String(entries.length).padStart(2, "0")} entries
        </span>
      </div>
      <div className="hairline" aria-hidden />
      <motion.ul
        className="grid"
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {entries.map((e) => (
          <motion.li
            key={e.href}
            variants={{
              hidden: { opacity: 0, y: 6, filter: "blur(2px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  type: "spring" as const,
                  duration: 0.45,
                  bounce: 0,
                },
              },
            }}
          >
            <Link
              href={e.href}
              className="group relative grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[2.5rem_1fr_auto_3rem] gap-3 sm:gap-5 items-baseline py-4 border-b border-rule cursor-default active:scale-[0.995] transition-transform duration-150"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[54%] w-[2px] bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              />
              <span className="mono text-[0.7rem] tracking-[0.2em] text-accent">
                {e.index}
              </span>
              <span className="font-serif text-[1.18rem] sm:text-[1.3rem] font-medium tracking-[-0.005em] text-ink group-hover:text-accent transition-colors duration-200">
                {e.label}
              </span>
              <span className="hidden sm:inline font-serif italic text-[0.86rem] text-muted leading-snug">
                {e.note}
              </span>
              <span className="mono text-[0.68rem] tracking-[0.15em] text-muted text-right tabular-nums">
                {e.count}
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
