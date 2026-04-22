"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { CommandPaletteTrigger } from "./command-palette";

export function TopBar() {
  return (
    <header className="pt-8 pb-8 flex items-baseline justify-between gap-4">
      <Link
        href="/"
        className="group flex items-baseline gap-3 hover:opacity-80 transition-opacity active:scale-[0.98] duration-150"
      >
        <span className="font-serif text-[1.18rem] font-medium tracking-tight text-ink">
          {site.name}
        </span>
        <span className="font-serif text-[0.92rem] italic text-muted">
          · {site.location}
        </span>
      </Link>
      <CommandPaletteTrigger />
    </header>
  );
}
