import { site } from "@/lib/site";
import { articles } from "@/lib/articles";
import { HankoSeal } from "./hanko-seal";

export function StatusFooter() {
  const lastDispatch = [...articles].sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0];
  const dispatchLabel = lastDispatch
    ? `${dispatchAgo(lastDispatch.date)} · @${site.handle.paragraph}`
    : "—";

  const socials: [string, string][] = [
    ["paragraph", site.links.paragraph],
    ["x", site.links.twitter],
    ["telegram", site.links.telegram],
    ["github", site.links.github],
    ["linkedin", site.links.linkedin],
  ];

  return (
    <footer className="mt-24 mb-10">
      <div className="hairline mb-8" aria-hidden />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-end">
        <div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted mb-1.5">
                LAST UPDATED
              </div>
              <div className="font-serif text-[0.88rem] text-ink leading-snug">
                {site.lastUpdated}
              </div>
            </div>
            <div>
              <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted mb-1.5">
                LAST DISPATCH
              </div>
              <div className="font-serif text-[0.88rem] text-ink leading-snug">
                {dispatchLabel}
              </div>
            </div>
          </div>

          <div className="mt-7 mono text-[0.62rem] tracking-[0.22em] uppercase text-muted flex gap-5 flex-wrap">
            {socials.map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
          <div className="mt-3 font-serif text-[0.78rem] italic text-muted">
            Aizome. 藍染. &ldquo;dyed in indigo.&rdquo;
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <HankoSeal size={72} />
          <div className="mono text-[0.56rem] tracking-[0.22em] uppercase text-muted">
            印 · build {site.lastUpdated.replace(/\./g, "")}
          </div>
        </div>
      </div>
    </footer>
  );
}

function dispatchAgo(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 14) return `${days}d ago`;
  if (days < 90) return `${Math.floor(days / 7)}w ago`;
  if (days < 730) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
