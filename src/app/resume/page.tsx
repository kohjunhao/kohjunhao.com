import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Hairline } from "@/components/hairline";
import { site } from "@/lib/site";
import { investments } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Resume",
  description: "Background, education, and focus areas.",
};

export default function ResumePage() {
  const count = investments.length;

  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          · / resume
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
            Resume
          </h1>
          <span className="mono text-[0.66rem] tracking-[0.22em] uppercase text-muted">
            v. {site.lastUpdated}
          </span>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-12">
        {/* Left — colophon */}
        <aside>
          <div className="font-serif text-[1.45rem] font-medium tracking-[-0.01em] text-ink">
            {site.name}
          </div>
          <div className="mono text-[0.62rem] tracking-[0.22em] uppercase text-muted mt-1.5">
            Reading, writing, writing cheques
          </div>
          <div className="mt-8">
            {[
              ["Location", site.location],
              ["Status", `CS student · ${site.education.school}`],
              ["Since", "2022"],
              ["Updated", site.lastUpdated],
            ].map(([k, v]) => (
              <div
                key={k}
                className="py-1.5 border-b border-rule flex justify-between gap-3"
              >
                <span className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
                  {k}
                </span>
                <span className="font-serif text-[0.82rem] text-ink">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-accent mb-2">
              contact
            </div>
            {[
              ["paragraph.com/@0xvega", site.links.paragraph],
              ["x.com/kohjunhao", site.links.twitter],
              ["github.com/kohjunhao", site.links.github],
              ["linkedin/in/kohjunhao", site.links.linkedin],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1 mono text-[0.72rem] text-ink hover:text-accent transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </aside>

        {/* Right — body */}
        <div>
          {/* Education */}
          <section>
            <div className="mono text-[0.64rem] tracking-[0.22em] uppercase text-accent mb-2">
              Education
            </div>
            <Hairline />
            <div className="py-3 grid grid-cols-[1fr_auto] gap-4 items-baseline">
              <div>
                <div className="font-serif text-[1.05rem] text-ink">
                  {site.education.school}
                </div>
                <div className="font-serif italic text-[0.88rem] text-muted mt-0.5">
                  {site.education.degree} — focus on blockchain &amp; distributed
                  systems
                </div>
              </div>
              <div className="mono text-[0.62rem] tracking-[0.18em] uppercase text-muted whitespace-nowrap">
                {site.education.years}
              </div>
            </div>
          </section>

          {/* Practice */}
          <section className="mt-10">
            <div className="mono text-[0.64rem] tracking-[0.22em] uppercase text-accent mb-2">
              Practice
            </div>
            <Hairline />
            {[
              {
                title: "Angel investor",
                venue: "Personal capital",
                years: "2023 — present",
                body: `Wrote ${count} early-stage cheques into founders across crypto infra, DeFi, and AI. Technical diligence on consensus, tokenomics, and go-to-market. Mentor founders from pre-seed through first product.`,
              },
              {
                title: "Writer · 0xvega",
                venue: "Paragraph",
                years: "2022 — present",
                body: "Long-form research on DeFi primitives, ve-models, and L2 scaling. Published at paragraph.com/@0xvega.",
              },
            ].map((r) => (
              <div key={r.title} className="py-4 border-b border-rule">
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-3">
                  <div>
                    <span className="font-serif text-[1rem] text-ink">
                      {r.title}
                    </span>
                    <span className="font-serif italic text-[0.88rem] text-muted ml-2">
                      — {r.venue}
                    </span>
                  </div>
                  <span className="mono text-[0.6rem] tracking-[0.18em] uppercase text-muted whitespace-nowrap">
                    {r.years}
                  </span>
                </div>
                <p className="mt-2 font-serif text-[0.92rem] leading-[1.55] text-ink">
                  {r.body}
                </p>
              </div>
            ))}
          </section>

          {/* Focus */}
          <section className="mt-10">
            <div className="mono text-[0.64rem] tracking-[0.22em] uppercase text-accent mb-2">
              Focus
            </div>
            <Hairline />
            <div className="pt-3 grid grid-cols-3 gap-6">
              {[
                ["Blockchain", ["Consensus", "Smart contracts", "Interop", "Scalability"]],
                ["CS", ["Distributed systems", "Cryptography", "Algorithms", "System design"]],
                ["Finance", ["Market structure", "Risk", "Tokenomics", "DeFi"]],
              ].map(([k, vs]) => (
                <div key={k as string}>
                  <div className="font-serif text-[0.88rem] text-ink font-medium mb-1.5">
                    {k}
                  </div>
                  {(vs as string[]).map((v) => (
                    <div
                      key={v}
                      className="font-serif text-[0.8rem] text-muted leading-[1.55]"
                    >
                      {v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
