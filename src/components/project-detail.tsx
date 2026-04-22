import Link from "next/link";
import type { Project } from "@/lib/stock";

const STATUS_LABEL: Record<Project["status"], string> = {
  shipping: "shipping",
  exploring: "exploring",
  paused: "paused",
  dormant: "dormant",
};

/**
 * Project detail. If the project has an embed URL, the write-up sits on top
 * and an iframe hosts the interactive piece below. If there's only an
 * article, we show the about paragraph and link to the full read.
 */
export function ProjectDetail({
  project,
  contextual = false,
}: {
  project: Project;
  contextual?: boolean;
}) {
  return (
    <article className="w-full">
      <header className="max-w-2xl mx-auto">
        <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-accent mb-3">
          project · {STATUS_LABEL[project.status]} · {project.year}
        </div>
        <h1 className="font-serif text-[clamp(1.6rem,3.5vw,2rem)] font-medium tracking-[-0.015em] leading-[1.18] text-ink">
          {project.name}
        </h1>
        <p className="mt-2 font-serif italic text-[1rem] text-muted leading-[1.45]">
          {project.note}
        </p>
        {project.about && (
          <>
            <div className="my-5 h-px bg-rule" aria-hidden />
            <p className="font-serif text-[1rem] leading-[1.65] text-ink">
              {project.about}
            </p>
          </>
        )}
      </header>

      {project.embed ? (
        <div className="mt-8">
          <div className="flex items-baseline justify-between mb-3 max-w-2xl mx-auto">
            <span className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
              — live simulator —
            </span>
            <a
              href={project.embed}
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted hover:text-accent transition-colors"
            >
              open in new tab ↗
            </a>
          </div>
          <div className="border border-rule bg-ink/5">
            <iframe
              src={project.embed}
              title={`${project.name} simulator`}
              loading="lazy"
              className={`w-full ${contextual ? "h-[72vh]" : "h-[80vh] min-h-[640px]"} block`}
            />
          </div>
        </div>
      ) : project.article ? (
        <div className="mt-8 max-w-2xl mx-auto pt-6 border-t border-rule">
          <Link
            href={`/articles/${project.article}`}
            className="group inline-flex items-baseline gap-2 mono text-[0.66rem] tracking-[0.22em] uppercase text-accent active:scale-[0.96] transition-transform duration-150"
          >
            <span className="relative">
              read the write-up
              <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <div className="mt-8 max-w-2xl mx-auto pt-6 border-t border-rule">
          <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
            ─ write-up pending ─
          </div>
        </div>
      )}
    </article>
  );
}
