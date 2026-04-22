import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";
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
  const byCat = categoryOrder
    .map((cat) => ({
      cat,
      items: curated.filter((i) => i.category === cat),
    }))
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
          <span className="mono text-[0.66rem] tracking-[0.2em] uppercase text-muted">
            {curated.length} objects
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          A running shelf of things whose design or utility earned their
          place. Kept for as long as they deserve to be kept. Click any entry
          for the short note.
        </p>
      </section>

      <div className="mt-10">
        {byCat.map(({ cat, items }) => (
          <section key={cat} className="mb-10">
            <div className="flex items-baseline justify-between mb-3">
              <span className="mono text-[0.64rem] tracking-[0.22em] uppercase text-accent">
                {cat}
              </span>
              <span className="mono text-[0.6rem] tracking-[0.2em] text-muted">
                {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <Hairline />
            <ul>
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/curated/${item.slug}`}
                    className="group grid grid-cols-[1.5fr_1fr_auto] gap-4 items-baseline py-3 border-b border-rule active:scale-[0.996] transition-transform duration-150"
                  >
                    <div>
                      <span className="font-serif text-[1.02rem] text-ink group-hover:text-accent transition-colors">
                        {item.name}
                      </span>
                      <span className="font-serif italic text-[0.82rem] text-muted ml-3">
                        — {item.maker}
                      </span>
                    </div>
                    <span className="font-serif italic text-[0.85rem] text-muted leading-snug hidden sm:inline">
                      &ldquo;{item.note}&rdquo;
                    </span>
                    <span className="mono text-[0.62rem] tracking-[0.15em] text-muted whitespace-nowrap">
                      {item.price ?? "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
