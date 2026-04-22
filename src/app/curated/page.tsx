import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { curated, type CuratedCategory } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Curated",
  description:
    "Objects worth keeping — a running shelf of products whose design or utility earned their place.",
};

const categoryOrder: CuratedCategory[] = [
  "Stationery",
  "Tools",
  "Hardware",
  "Wearables",
  "Home",
];

export default function CuratedPage() {
  const grouped = categoryOrder
    .map((cat) => ({ cat, items: curated.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          07 / curated
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Curated
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-muted">
            {curated.length} objects
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          A running shelf of things whose design or utility earned their
          place. Each tile is a small note on why it stays. Tap for the
          longer thought.
        </p>
      </section>

      <div className="mt-12 space-y-14">
        {grouped.map(({ cat, items }) => (
          <section key={cat}>
            <div className="flex items-baseline justify-between mb-5">
              <div className="flex items-baseline gap-4">
                <span className="mono text-[0.6rem] tracking-[0.22em] uppercase text-accent">
                  {cat}
                </span>
                <span className="flex-1 h-px bg-rule w-24" />
              </div>
              <span className="mono text-[0.58rem] tracking-[0.22em] text-muted">
                {String(items.length).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/curated/${item.slug}`}
                  className="group flex flex-col bg-surface border border-rule p-5 min-h-[11rem] transition-colors hover:bg-canvas active:scale-[0.99] duration-150"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="mono text-[0.56rem] tracking-[0.22em] uppercase text-muted">
                      {item.maker}
                    </span>
                    <span className="mono text-[0.56rem] tracking-[0.22em] text-muted">
                      {item.price ?? "—"}
                    </span>
                  </div>
                  <div className="font-serif text-[1.15rem] font-medium tracking-[-0.01em] text-ink leading-snug group-hover:text-accent transition-colors">
                    {item.name}
                  </div>
                  <p className="mt-2 font-serif italic text-[0.88rem] text-muted leading-[1.45]">
                    &ldquo;{item.note}&rdquo;
                  </p>
                  <div className="mt-auto pt-4 flex items-baseline justify-between">
                    <span className="mono text-[0.54rem] tracking-[0.22em] uppercase text-muted">
                      {item.category}
                    </span>
                    <span className="mono text-[0.72rem] text-muted group-hover:text-accent transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
