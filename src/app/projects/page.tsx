import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Hairline } from "@/components/hairline";
import { projects, type ProjectStatus } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I'm building, quietly and in public.",
};

const STATUS: Record<ProjectStatus, { label: string; color: string }> = {
  shipping: { label: "shipping", color: "bg-accent" },
  exploring: { label: "exploring", color: "bg-ink" },
  paused: { label: "paused", color: "bg-muted" },
  dormant: { label: "dormant", color: "bg-muted opacity-60" },
};

export default function ProjectsPage() {
  const inFlight = projects.filter((p) => p.status === "shipping" || p.status === "exploring").length;

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          03 / projects
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Projects
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-muted">
            {String(inFlight).padStart(2, "0")} · in flight
          </span>
        </div>
        <p className="mt-4 max-w-[38rem] font-serif italic text-[1.05rem] leading-[1.65] text-muted">
          Things I&rsquo;m building, quietly and in public. Click a project to
          read the notes written alongside it. Empty entries are still
          works-in-progress.
        </p>
      </section>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {Object.entries(STATUS).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${v.color}`} />
            <span className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
              {v.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Hairline />
        <ul>
          {projects.map((p, i) => {
            const content = (
              <div className="grid grid-cols-[2rem_0.75rem_1fr_auto_auto_1.5rem] gap-4 py-4 items-center border-b border-rule group cursor-default active:scale-[0.996] transition-transform duration-150">
                <span className="mono text-[0.68rem] text-muted tracking-[0.18em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${
                    STATUS[p.status].color
                  }`}
                />
                <div className="min-w-0">
                  <span className="font-serif text-[1.08rem] text-ink font-medium group-hover:text-accent transition-colors">
                    {p.name}
                  </span>
                  <span className="font-serif italic text-[0.82rem] text-muted ml-3">
                    {p.note}
                  </span>
                </div>
                <span className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted hidden sm:inline">
                  {STATUS[p.status].label}
                </span>
                <span className="mono text-[0.62rem] tracking-[0.18em] text-muted">
                  {p.year}
                </span>
                <span
                  className={`mono text-[0.72rem] tracking-[0.1em] ${
                    p.article ? "text-accent" : "text-muted opacity-30"
                  }`}
                >
                  {p.article ? "→" : "·"}
                </span>
              </div>
            );
            return (
              <li key={p.name}>
                {p.article ? (
                  <Link
                    href={`/articles/${p.article}`}
                    aria-label={`Read ${p.name}`}
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 pt-4 border-t border-rule flex flex-wrap justify-between gap-3 mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
        <span>arrow → links to the write-up · dot = status</span>
        <span>⌘K to navigate</span>
      </div>
    </PageShell>
  );
}
