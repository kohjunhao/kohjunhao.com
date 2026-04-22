import Link from "next/link";
import { Hairline } from "./hairline";

export type DetailNeighbor = { href: string; label: string } | null;

/**
 * Header breadcrumb for a detail page — places the item in context of the
 * collection it belongs to, with position and parent link.
 */
export function DetailCrumb({
  parentHref,
  parentLabel,
  position,
}: {
  parentHref: string;
  parentLabel: string;
  position?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-6">
      <Link
        href={parentHref}
        className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
      >
        ← {parentLabel}
      </Link>
      {position && (
        <span className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
          {position}
        </span>
      )}
    </div>
  );
}

/**
 * Prev/next sibling row, shown at the bottom of a detail page. Either side
 * may be null at collection edges; the whole row stays laid out for rhythm.
 */
export function DetailSiblings({
  prev,
  next,
  parentHref,
  parentLabel,
}: {
  prev: DetailNeighbor;
  next: DetailNeighbor;
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <div className="mt-16">
      <Hairline />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-8 py-6 items-baseline">
        {prev ? (
          <Link
            href={prev.href}
            className="group min-w-0 sm:text-left text-center"
          >
            <div className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted mb-1">
              ← previous
            </div>
            <div className="font-serif text-[0.95rem] text-ink group-hover:text-accent transition-colors truncate">
              {prev.label}
            </div>
          </Link>
        ) : (
          <span />
        )}

        <Link
          href={parentHref}
          className="mono text-[0.62rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4 sm:self-center text-center"
        >
          {parentLabel}
        </Link>

        {next ? (
          <Link
            href={next.href}
            className="group min-w-0 sm:text-right text-center"
          >
            <div className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted mb-1">
              next →
            </div>
            <div className="font-serif text-[0.95rem] text-ink group-hover:text-accent transition-colors truncate">
              {next.label}
            </div>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

/**
 * Compute prev/next neighbors in an ordered collection by slug. `slugOf`
 * defaults to reading a `slug` property; pass an override for collections
 * that don't have one (e.g. investments, which derive a slug from `name`).
 */
export function neighbors<T>(
  items: T[],
  currentSlug: string,
  slugOf: (t: T) => string = (t: T) => (t as { slug?: string }).slug ?? ""
): { prev: T | null; next: T | null; index: number } {
  const index = items.findIndex((t) => slugOf(t) === currentSlug);
  const prev = index > 0 ? items[index - 1] : null;
  const next =
    index >= 0 && index < items.length - 1 ? items[index + 1] : null;
  return { prev, next, index };
}
