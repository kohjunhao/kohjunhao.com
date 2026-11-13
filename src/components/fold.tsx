import type { ReactNode } from "react";
import { foldName, type FoldId } from "@/lib/folds";

/** One closed-on-load section of the home index: a name, a one-line summary and a plus sign. */
export function Fold({ id, summary, children }: { id: FoldId; summary: string; children: ReactNode }) {
  return (
    <details className="sec" id={id}>
      <summary>
        <span className="name">{foldName(id)}</span>
        <span className="sum">{summary}</span>
        <span className="pm" aria-hidden="true" />
      </summary>
      <div className="body">{children}</div>
    </details>
  );
}
