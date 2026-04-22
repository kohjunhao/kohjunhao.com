import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description: "Long-form DeFi research. Originally at paragraph.com/@0xvega.",
};

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 230));
}

export default function ArticlesPage() {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const [feature, ...archive] = sorted;

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          01 / articles
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Articles
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.2em] uppercase text-muted">
            long-form
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          Research on DeFi and the structure of markets. Originally at{" "}
          <a
            href="https://paragraph.com/@0xvega"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-1 underline-offset-2"
          >
            paragraph.com/@0xvega
          </a>
          , archived here for permanence.
        </p>
      </section>

      {feature && (
        <Link
          href={`/articles/${feature.slug}`}
          className="group block mt-12 bg-surface border-l-2 border-accent px-7 py-8 sm:px-9 sm:py-10 transition-colors hover:bg-surface/70 active:scale-[0.995] duration-150"
        >
          <div className="mono text-[0.6rem] tracking-[0.24em] uppercase text-accent mb-3">
            feature · {feature.dateLabel}
          </div>
          <h2 className="font-serif text-[clamp(1.6rem,3.5vw,2rem)] font-medium tracking-[-0.015em] leading-[1.15] text-ink">
            {feature.title}
          </h2>
          <p className="mt-2 font-serif italic text-[0.98rem] text-muted">
            {feature.subtitle}
          </p>
          <p className="mt-5 font-serif text-[1rem] leading-[1.7] text-ink max-w-[36rem]">
            {feature.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-5 flex-wrap">
            <span className="mono text-[0.7rem] tracking-[0.18em] uppercase text-accent group-hover:underline decoration-1 underline-offset-2">
              read in modal →
            </span>
            <span className="mono text-[0.58rem] tracking-[0.2em] uppercase text-muted">
              {readingMinutes(feature.body)} min · {feature.tags.join(" · ")}
            </span>
          </div>
        </Link>
      )}

      <section className="mt-14">
        <SectionHeader
          index="01"
          title="Archive"
          right={`${String(archive.length).padStart(2, "0")} entries`}
        />
        <Hairline className="mt-4" />
        <ul>
          {archive.map((a, i) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="group grid grid-cols-[2.25rem_1fr_auto_auto] gap-3 sm:gap-5 items-baseline py-3.5 border-b border-rule active:scale-[0.995] transition-transform duration-150"
              >
                <span className="mono text-[0.68rem] text-muted tracking-[0.15em]">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-serif text-[1.02rem] text-ink group-hover:text-accent transition-colors">
                    {a.title}
                  </div>
                  <div className="font-serif italic text-[0.82rem] text-muted mt-0.5 leading-snug">
                    {a.subtitle}
                  </div>
                </div>
                <span className="mono text-[0.64rem] tracking-[0.15em] uppercase text-muted hidden sm:inline">
                  {readingMinutes(a.body)} min
                </span>
                <span className="mono text-[0.64rem] tracking-[0.15em] uppercase text-muted">
                  {a.dateLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
