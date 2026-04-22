import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";
import { movies } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Movies",
  description: "A chronological filmstrip of what I've watched.",
};

function tint(rec: string): { bg: string; fg: string } {
  if (rec === "highly") return { bg: "bg-accent", fg: "text-canvas" };
  if (rec === "recommended") return { bg: "bg-ink", fg: "text-canvas" };
  return { bg: "bg-surface", fg: "text-muted" };
}

export default function MoviesPage() {
  const sorted = [...movies].sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
  const mustWatch = movies.filter((m) => m.rec === "highly");

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          05 / movies
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Movies
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.2em] uppercase text-muted">
            filmstrip
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          Chronological. Indigo cells are must-watch. Tap any cell for the
          note.
        </p>
      </section>

      <div className="mt-10">
        <div className="flex gap-1 mb-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-2 bg-surface border border-rule flex-shrink-0"
            />
          ))}
        </div>

        <div className="overflow-x-auto pb-1.5">
          <div className="flex gap-1">
            {sorted.map((m) => {
              const t = tint(m.rec);
              return (
                <Link
                  href={`/movies/${m.slug}`}
                  key={m.slug}
                  title={`dir. ${m.director}`}
                  className={`w-[10.25rem] h-[7.75rem] p-[14px] flex flex-col justify-between flex-shrink-0 active:scale-[0.98] transition-transform duration-150 ${t.bg} ${t.fg}`}
                >
                  <div className="mono text-[1.6rem] tabular-nums tracking-[0.02em]">
                    {m.year}
                  </div>
                  <div className="font-serif text-[0.82rem] font-medium leading-[1.2]">
                    {m.title}
                  </div>
                  <div className="mono text-[0.52rem] tracking-[0.2em] uppercase opacity-70">
                    dir. {m.director}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex gap-1 mt-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-2 bg-surface border border-rule flex-shrink-0"
            />
          ))}
        </div>
      </div>

      <section className="mt-14">
        <SectionHeader
          index="01"
          title="Must watch"
          right={String(mustWatch.length).padStart(2, "0")}
        />
        <Hairline className="mt-4" />
        <ul className="pt-3 grid sm:grid-cols-2 gap-x-8 gap-y-0">
          {mustWatch.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/movies/${m.slug}`}
                className="group flex justify-between py-1.5 border-b border-rule active:scale-[0.996] transition-transform"
              >
                <span className="font-serif text-[0.95rem] text-ink group-hover:text-accent transition-colors">
                  {m.title}
                </span>
                <span className="mono text-[0.64rem] tracking-[0.15em] text-muted tabular-nums">
                  {m.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
