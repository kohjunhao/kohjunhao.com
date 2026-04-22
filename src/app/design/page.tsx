import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Hairline } from "@/components/hairline";

export const metadata: Metadata = {
  title: "Design — Aizome",
  description:
    "The Aizome design system: tokens, primitives, and principles. The system that powers this site.",
};

const palette: [string, string, string][] = [
  ["paper", "#F0EEE9", "canvas"],
  ["ink", "#1B1A17", "body"],
  ["rule", "#D9D5CC", "hairline"],
  ["muted", "#6D6A62", "secondary"],
  ["aizome", "#3A4A7A", "accent · once per view"],
];

const primitives: [string, string][] = [
  ["ledger row", "A left index, a title, a trailing meta. The only list pattern on this site. 1px rule between, not boxes."],
  ["section header", "Mono index + serif title + right-aligned mono annotation. Section-level scaffolding."],
  ["hairline", "1px rule, 16–24px vertical rhythm above and below. Never shadow; never box."],
  ["hanko", "128px red square seal, gentle wobble animation, Japanese-character signature. Site-wide personal mark."],
  ["totem", "Hand-authored ASCII spinning top. The Inception reference. Does not fall."],
];

const principles: [string, string][] = [
  ["Restraint is the material.", "If a line, a box, or a flourish is not earning its keep, remove it. One accent color per view, one gesture per section."],
  ["Serif carries ideas; mono carries metadata.", "Never reverse the hierarchy. Mono is for labels, counts, and timestamps."],
  ["Hairlines, not containers.", "Use 1px rules instead of cards. Boxes are a last resort."],
  ["Every page is a ledger.", "Indexed rows with thin rules. The visual vocabulary does not change from books to investments to articles."],
  ["Motion is an index finger, not a dance.", "Animation points; it does not perform. View transitions are 400ms crossfades. The totem is the only sustained motion on the site."],
];

export default function DesignPage() {
  return (
    <PageShell>
      <section className="mb-2">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          · / design system
        </div>
        <h1 className="font-serif text-[clamp(2.25rem,5vw,2.75rem)] font-medium tracking-tight leading-tight">
          Aizome
        </h1>
        <p className="mt-3 max-w-[40rem] font-serif italic text-[1.05rem] leading-[1.6] text-muted">
          The design system that powers this site. Named for 藍染 — indigo-dyed
          thread. Same palette, same cadence, same care as the kind of book
          you&rsquo;d keep.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="mono text-[0.7rem] text-accent">01 /</span>
          <span className="font-serif text-[1.2rem] font-medium">Palette</span>
        </div>
        <Hairline />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {palette.map(([name, hex, use]) => (
            <div key={name}>
              <div
                className="h-24 border border-rule"
                style={{ background: hex }}
              />
              <div className="font-serif text-[0.9rem] text-ink font-medium mt-2">
                {name}
              </div>
              <div className="mono text-[0.58rem] tracking-[0.2em] uppercase text-muted mt-0.5">
                {hex}
              </div>
              <div className="font-serif italic text-[0.78rem] text-muted mt-0.5">
                {use}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="mono text-[0.7rem] text-accent">02 /</span>
          <span className="font-serif text-[1.2rem] font-medium">Type</span>
        </div>
        <Hairline />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
              serif · Source Serif 4
            </div>
            <div className="font-serif text-[3rem] font-medium tracking-[-0.015em] mt-2 text-ink leading-none">
              Aa
            </div>
            <div className="font-serif text-[1rem] text-ink mt-2">
              The quiet forge of small weekly acts.
            </div>
            <div className="font-serif italic text-[0.85rem] text-muted mt-1">
              used for body, headings, and titles.
            </div>
          </div>
          <div>
            <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
              mono · JetBrains Mono
            </div>
            <div className="mono text-[3rem] mt-2 text-ink leading-none">Aa</div>
            <div className="mono text-[0.82rem] text-ink mt-3 tracking-[0.08em]">
              meta · timestamps · counts
            </div>
            <div className="font-serif italic text-[0.85rem] text-muted mt-1">
              used for metadata, never headings.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="mono text-[0.7rem] text-accent">03 /</span>
          <span className="font-serif text-[1.2rem] font-medium">
            Primitives
          </span>
        </div>
        <Hairline />
        <div className="mt-2">
          {primitives.map(([name, desc]) => (
            <div
              key={name}
              className="grid grid-cols-[10rem_1fr] gap-3 py-3 border-b border-rule"
            >
              <span className="mono text-[0.62rem] tracking-[0.18em] uppercase text-accent">
                {name}
              </span>
              <span className="font-serif text-[0.94rem] text-ink leading-[1.55]">
                {desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="mono text-[0.7rem] text-accent">04 /</span>
          <span className="font-serif text-[1.2rem] font-medium">
            Principles
          </span>
        </div>
        <Hairline />
        <ol className="list-none pl-0 mt-2">
          {principles.map(([k, v], i) => (
            <li
              key={i}
              className="grid grid-cols-[2.5rem_1fr] gap-4 py-3.5 border-b border-rule"
            >
              <span className="mono text-[0.62rem] tracking-[0.18em] text-accent pt-1">
                {String(i + 1).padStart(2, "0")} /
              </span>
              <div>
                <div className="font-serif text-[1.02rem] text-ink">{k}</div>
                <div className="font-serif italic text-[0.86rem] text-muted mt-1 leading-[1.5]">
                  {v}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12 pt-4 border-t border-rule flex justify-between items-baseline mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
        <span>Aizome · v1.0 · 2026</span>
        <span className="font-serif italic normal-case tracking-normal text-[0.82rem]">
          designed in the open.
        </span>
      </div>
    </PageShell>
  );
}
