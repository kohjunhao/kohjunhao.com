"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { nav } from "@/lib/site";
import { Hairline } from "./hairline";
import { CommandPalette } from "./command-palette";

export function SiteNav() {
  const reduce = useReducedMotion();
  return (
    <nav className="mb-14" aria-label="Primary">
      <Hairline />
      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-3 py-5"
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.035 } },
        }}
      >
        {nav.map((n) => (
          <motion.li
            key={n.slug}
            variants={{
              hidden: { opacity: 0, y: 6, filter: "blur(2px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { type: "spring" as const, duration: 0.4, bounce: 0 },
              },
            }}
          >
            <Link
              href={`/${n.slug}`}
              className="group inline-flex items-baseline gap-1.5 hover:text-accent transition-colors active:scale-[0.96] duration-150"
            >
              <span className="mono text-[0.68rem] text-accent/80 tracking-wider group-hover:text-accent transition-colors">
                {n.index}
              </span>
              <span className="font-serif text-[0.98rem] relative">
                {n.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]" />
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
      <Hairline />
    </nav>
  );
}

export function TopBar() {
  return (
    <header className="pt-8 pb-6 flex items-baseline justify-between gap-4">
      <Link
        href="/"
        className="font-serif text-[1.05rem] tracking-tight hover:text-accent transition-colors active:scale-[0.96] duration-150"
      >
        Koh Jun Hao
      </Link>
      <div className="flex items-baseline gap-4">
        <CommandPalette />
      </div>
    </header>
  );
}
