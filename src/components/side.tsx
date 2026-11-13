import Link from "next/link";
import type { ReactNode } from "react";
import type { FoldId } from "@/lib/folds";
import { FoldLink } from "./fold-link";

/** The grey label column of an inner page: the way back to its fold, then anything else it lists. */
export function Side({ back, children }: { back: FoldId; children?: ReactNode }) {
  return (
    <aside className="side">
      <FoldLink fold={back} className="back" />
      {children}
    </aside>
  );
}

/** A sibling page in the label column, in ink when it is the current page. */
export function SideLink({ href, current, children }: { href: string; current: boolean; children: ReactNode }) {
  return (
    <Link href={href} className={current ? "here" : undefined} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}

/** The page's name in the lead serif, with its grey summary lines. */
export function PageHead({ name, lines }: { name: string; lines: string[] }) {
  return (
    <header className="page-head">
      <h1 className="page-name">{name}</h1>
      {lines.map((line) => (
        <p key={line} className="page-sum">
          {line}
        </p>
      ))}
    </header>
  );
}
