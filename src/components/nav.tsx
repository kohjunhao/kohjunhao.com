"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { CommandPalette } from "./command-palette";

/**
 * V6 topbar — consolidated. Name + location on the left, ⌘K affordance on
 * the right. No second row of nav links; the home ledger and command
 * palette ARE the navigation.
 */
export function TopBar() {
  return (
    <header className="pt-8 pb-8 flex items-center justify-between gap-4">
      <Link
        href="/"
        className="font-serif text-[1.125rem] font-medium tracking-tight hover:text-accent transition-colors active:scale-[0.96] duration-150"
      >
        {site.name}
        <span className="text-muted italic font-normal"> · {site.location}</span>
      </Link>
      <CommandPalette />
    </header>
  );
}
