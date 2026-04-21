"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SelfDrawingRule } from "./reveal";

export type LedgerRowData = {
  left: string;
  mid: string;
  right?: string;
  href?: string;
  note?: string;
};

const rowVariants = {
  hidden: { opacity: 0, y: 6, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, duration: 0.45, bounce: 0 },
  },
};

export function LedgerRow({
  data,
  tabular = false,
}: {
  data: LedgerRowData;
  tabular?: boolean;
}) {
  const reduce = useReducedMotion();

  const inner = (
    <motion.div
      className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-3 px-3 -mx-3 rounded-sm cursor-default"
      variants={rowVariants}
      whileHover={reduce ? undefined : { x: 3 }}
      whileTap={reduce || !data.href ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[2px] bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
      />
      <span className="mono text-[0.72rem] text-accent tracking-wider">
        {data.left}
      </span>
      <span className="font-serif text-[1.02rem] leading-snug">
        <span className="group-hover:text-accent transition-colors duration-200">
          {data.mid}
        </span>
        {data.note && (
          <span className="block mono text-[0.7rem] text-muted mt-0.5 tracking-wider">
            {data.note}
          </span>
        )}
      </span>
      {data.right && (
        <span
          className={`${
            tabular ? "mono tabular-nums" : "mono"
          } text-[0.72rem] text-muted tracking-wider`}
        >
          {data.right}
        </span>
      )}
    </motion.div>
  );

  return (
    <>
      {data.href ? <Link href={data.href}>{inner}</Link> : inner}
      <div className="hairline" aria-hidden />
    </>
  );
}

export function LedgerList({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-5% 0px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.04 } },
      }}
    >
      <SelfDrawingRule />
      {children}
    </motion.div>
  );
}
