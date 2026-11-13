"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { foldName, type FoldId } from "@/lib/folds";

/** Opens the fold (or section) with this id and scrolls to it. False when the page has none. */
export function openFold(id: string, behavior: ScrollBehavior) {
  const target = document.getElementById(id);
  if (!target) {
    return false;
  }
  if (target instanceof HTMLDetailsElement) {
    target.open = true;
  }
  target.scrollIntoView({ behavior, block: "start" });
  return true;
}

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/** A link to a home page fold. On the home page it opens the fold in place; elsewhere it goes to `/#id`. */
export function FoldLink({ fold, className, children }: { fold: FoldId; className?: string; children?: ReactNode }) {
  const onHome = usePathname() === "/";

  function onClick(e: MouseEvent) {
    if (!onHome || !isPlainClick(e)) {
      return;
    }
    if (openFold(fold, "smooth")) {
      e.preventDefault();
    }
  }

  return (
    <Link href={`/#${fold}`} className={className} onClick={onClick}>
      {children ?? foldName(fold)}
    </Link>
  );
}
