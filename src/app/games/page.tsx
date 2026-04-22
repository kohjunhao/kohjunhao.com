import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";
import { games, recLabel, type Recommendation } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Games",
  description:
    "What I play and what I'd pass to a friend. Steam hours curated by hand, Steam Web API wiring pending.",
};

const tiers: Recommendation[] = ["highly", "recommended", "skip"];
const tierBadge: Record<Recommendation, string> = {
  highly: "A /",
  recommended: "B /",
  skip: "C /",
};

export default function GamesPage() {
  const currently = games.find((g) => g.currentlyPlaying) ?? games[0];
  const topPlayed = [...games].sort((a, b) => b.hours - a.hours).slice(0, 10);
  const maxHours = Math.max(...topPlayed.map((g) => g.hours));

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          06 / games
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Games
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-muted">
            {games.length} logged
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          What I play and what I&rsquo;d pass to a friend. Steam hours curated
          by hand — live API wiring pending. Tap any row for the note.
        </p>
      </section>

      {currently && (
        <Link
          href={`/games/${currently.slug}`}
          className="group mt-10 px-5 py-4 bg-surface border border-rule flex flex-wrap items-center justify-between gap-3 active:scale-[0.996] transition-transform"
        >
          <div className="flex items-center gap-3">
            <span className="relative w-2 h-2 rounded-full bg-accent">
              <span
                className="absolute -inset-1 rounded-full border border-accent opacity-50"
                style={{ animation: "pulse-ring 2s infinite" }}
              />
            </span>
            <span className="mono text-[0.6rem] tracking-[0.22em] uppercase text-accent">
              currently playing
            </span>
            <span className="font-serif text-[1.02rem] text-ink group-hover:text-accent transition-colors">
              {currently.title}
            </span>
          </div>
          <span className="mono text-[0.6rem] tracking-[0.18em] uppercase text-muted">
            {currently.platform} · {currently.hours}h logged
          </span>
        </Link>
      )}

      <section className="mt-12">
        <SectionHeader
          index="01"
          title="Most played"
          right="top 10 · by hours"
        />
        <Hairline className="mt-4" />
        <ul className="pt-1">
          {topPlayed.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/games/${g.slug}`}
                className="group grid grid-cols-[1fr_3fr_auto] gap-4 py-3 items-center border-b border-rule active:scale-[0.996] transition-transform"
              >
                <span className="font-serif text-[0.94rem] text-ink truncate group-hover:text-accent transition-colors">
                  {g.title}
                </span>
                <div className="relative h-0.5 bg-rule">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-accent"
                    style={{ width: `${(g.hours / maxHours) * 100}%` }}
                  />
                </div>
                <span className="mono text-[0.68rem] text-muted tabular-nums tracking-[0.08em]">
                  {g.hours}h
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <SectionHeader index="02" title="Recommendations" />
        <div className="mt-4">
          {tiers.map((tier) => {
            const list = games.filter((g) => g.rec === tier);
            if (list.length === 0) return null;
            return (
              <div key={tier} className="mb-7">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent font-medium">
                    {tierBadge[tier]}
                  </span>
                  <span className="font-serif text-[1.1rem] font-medium text-ink">
                    {recLabel[tier].label}
                  </span>
                </div>
                <Hairline />
                <ul>
                  {list.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/games/${g.slug}`}
                        className="group grid grid-cols-[1fr_auto] gap-4 py-3 items-baseline border-b border-rule active:scale-[0.996] transition-transform"
                      >
                        <div>
                          <span className="font-serif text-[0.98rem] text-ink group-hover:text-accent transition-colors">
                            {g.title}
                          </span>
                          {g.note && (
                            <span className="mono text-[0.58rem] tracking-[0.18em] uppercase text-muted ml-3">
                              — {g.note}
                            </span>
                          )}
                        </div>
                        <span className="mono text-[0.6rem] tracking-[0.18em] uppercase text-muted">
                          {g.hours}h
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
