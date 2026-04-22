import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";

export const metadata: Metadata = {
  title: "Design — Aizome",
  description:
    "The Aizome design system: tokens, primitives, motif, principles. The system that powers kohjunhao.com.",
};

type Token = { name: string; value: string; note: string };

const paletteLight: Token[] = [
  { name: "canvas", value: "#F0EEE9", note: "paper" },
  { name: "surface", value: "#E8E4DB", note: "inset" },
  { name: "ink", value: "#1B1A17", note: "body" },
  { name: "muted", value: "#6D6A62", note: "secondary" },
  { name: "accent", value: "#3A4A7A", note: "aizome indigo" },
  { name: "rule", value: "#D9D5CC", note: "hairline" },
  { name: "hanko", value: "#8B3A3A", note: "seal red" },
  { name: "totem", value: "#C48A42", note: "warm amber" },
];

const paletteDark: Token[] = [
  { name: "canvas", value: "#14161A", note: "sumi night" },
  { name: "surface", value: "#1A1D24", note: "inset" },
  { name: "ink", value: "#E7E4DA", note: "moonlight" },
  { name: "muted", value: "#8A8C92", note: "stone" },
  { name: "accent", value: "#8AA0D0", note: "washed aizome" },
  { name: "rule", value: "#2A2E36", note: "hairline" },
  { name: "hanko", value: "#8B3A3A", note: "seal red" },
  { name: "totem", value: "#D9A860", note: "warm amber" },
];

const spaceScale: [string, string][] = [
  ["2", "inline whitespace"],
  ["4", "tight stacking"],
  ["8", "small gaps"],
  ["12", "list row padding"],
  ["16", "paragraph rhythm"],
  ["24", "component to component"],
  ["32", "section breathing"],
  ["48", "section to section"],
  ["64", "chapter breaks"],
  ["96", "page margins"],
  ["128", "hero whitespace · the 間"],
];

const manifesto: [string, string][] = [
  ["Restraint is the material.", "間 (ma) carries meaning. Let it. One accent per view."],
  ["Serif carries ideas; mono carries metadata.", "Never reverse the hierarchy. No sans-serif."],
  ["Hairlines, not containers.", "1px rules do the work of cards. Shadows are a last resort."],
  ["Every page is a ledger.", "Indexed rows, thin rules. Books to investments to articles share the same vocabulary."],
  ["Motion is an index finger, not a dance.", "Animation points; it doesn't perform. The totem is the only sustained motion."],
];

const components: [string, string][] = [
  ["SectionHeader", "Mono index + serif title + right-aligned mono annotation. Section-level scaffolding."],
  ["Hairline", "1px rule at the `rule` token. 16–24px vertical rhythm. Never shadow, never box."],
  ["LedgerRow", "Left index · title · trailing meta. The only list pattern. Spring physics on hover."],
  ["StatusFooter", "Four-cell site-wide sign-off. LAST UPDATED · LOCATION · STATUS · LAST DISPATCH + hanko."],
  ["Modal", "Intercepted overlay, 90%/fit. Close on backdrop / Esc / back button. Direct URL still renders full-page."],
  ["HankoSeal", "SVG seal with feTurbulence grain, 印 character, 3.5° wobble. Site-wide personal mark."],
  ["Totem", "Hand-authored ASCII spinning top. The Inception reference. Drag-to-knock, tap-to-reset."],
];

const antiPatterns: string[] = [
  "Drop shadows. Use hairlines or inset rules instead.",
  "Large radii. Nothing over 8pt. Flat is the rule.",
  "Sans-serif. Serif carries thought; mono carries facts. No exceptions.",
  "A second accent in a single view. If a page needs more emphasis, the page is doing too much.",
  "Pure white or pure black canvas. The canvas always has warmth.",
  "Autoplay / hover-only interactivity. Every motion asks for consent.",
];

export default function DesignPage() {
  return (
    <PageShell>
      {/* 00 — hero */}
      <section className="mb-14">
        <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-4">
          · / design system
        </div>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,3.2rem)] font-medium tracking-tight leading-[1.05]">
          Aizome
        </h1>
        <p className="mt-5 max-w-[42rem] font-serif italic text-[1.08rem] leading-[1.65] text-muted">
          Named for 藍染 — the Japanese indigo dye used on paper and cloth for
          centuries. The design system that powers this site: the same
          palette, the same cadence, the same care as the kind of book
          you&rsquo;d keep. Every page on{" "}
          <span className="text-ink">kohjunhao.com</span> is typeset in it.
        </p>
      </section>

      {/* 01 — Manifesto */}
      <section className="mb-14">
        <SectionHeader index="01" title="Manifesto" right="5 rules" />
        <ul className="mt-6 grid gap-3">
          {manifesto.map(([rule, why], i) => (
            <li
              key={i}
              className="grid grid-cols-[2.25rem_1fr] gap-4 items-baseline py-3 border-b border-rule"
            >
              <span className="mono text-[0.62rem] tracking-[0.2em] uppercase text-accent">
                {String(i + 1).padStart(2, "0")} /
              </span>
              <div>
                <div className="font-serif text-[1.05rem] text-ink leading-snug">
                  {rule}
                </div>
                <div className="font-serif italic text-[0.86rem] text-muted mt-1 leading-[1.5]">
                  {why}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 02 — Palette */}
      <section className="mb-14">
        <SectionHeader index="02" title="Palette" right="8 + 8 tokens" />
        <p className="mt-4 font-serif italic text-[0.95rem] text-muted max-w-[40rem]">
          Two palettes, light and dark, each eight tokens. Canvas is never
          pure white. Neutrals carry a warm undertone.
        </p>
        <div className="mt-8 grid md:grid-cols-2 gap-10">
          <PaletteColumn label="LIGHT · day" tokens={paletteLight} />
          <PaletteColumn label="DARK · night" tokens={paletteDark} />
        </div>
      </section>

      {/* 03 — Typography */}
      <section className="mb-14">
        <SectionHeader index="03" title="Typography" right="2 families" />
        <div className="mt-6 grid gap-6">
          <TypeSpecimen
            label="Serif · Source Serif 4"
            family="font-serif"
            samples={[
              ["500 · display", "text-[2.1rem] leading-[1.05] tracking-tight font-medium", "A quiet interface."],
              ["500 · heading", "text-[1.3rem] font-medium", "Mechanisms and motivations."],
              ["400 · body", "text-[1.0625rem] leading-relaxed", "Curve is an AMM that focuses on pools with similar asset types."],
              ["400 italic · caption", "text-[1rem] italic text-muted", "originally published at Paragraph"],
            ]}
          />
          <Hairline />
          <TypeSpecimen
            label="Mono · JetBrains Mono"
            family="mono"
            samples={[
              ["500 · label", "text-[0.72rem] tracking-wider uppercase text-accent", "01 / INDEX"],
              ["400 · numerals", "text-[0.95rem] tabular-nums", "BTC    67,412.08    +2.14%"],
              ["400 · address", "text-[0.85rem] text-muted", "0x4a2f…9f1b"],
            ]}
          />
        </div>
      </section>

      {/* 04 — Spacing */}
      <section className="mb-14">
        <SectionHeader index="04" title="Spacing" right="4pt scale" />
        <p className="mt-4 font-serif italic text-[0.95rem] text-muted max-w-[40rem]">
          Every measurement is a multiple of 4. The scale is sparse on
          purpose — limited options force confident decisions.
        </p>
        <div className="mt-6 grid gap-2">
          {spaceScale.map(([val, note]) => (
            <div
              key={val}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-4"
            >
              <span className="mono text-[0.66rem] tracking-[0.18em] text-accent">
                {val}pt
              </span>
              <div
                className="h-px bg-accent"
                style={{ width: `${Math.min(Number(val), 180)}px` }}
              />
              <span className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
                {note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — Motif */}
      <section className="mb-14">
        <SectionHeader index="05" title="Motif" right="mono-numeric ledger" />
        <p className="mt-4 font-serif italic text-[0.95rem] text-muted max-w-[40rem]">
          The signature: every section indexed like a ledger row. The footer
          renders a four-cell status ledger with a hanko seal. It&rsquo;s the
          smallest idiomatic move that says &ldquo;operator, not designer.&rdquo;
        </p>
        <div className="mt-6 bg-surface border border-rule p-6 sm:p-8">
          <div className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent mb-3">
            01 / EXAMPLE SECTION
          </div>
          <div className="font-serif text-[1.3rem] font-medium mb-4">
            Section title here
          </div>
          <Hairline />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mono text-[0.58rem] tracking-[0.2em] uppercase mt-4">
            {[
              ["LAST UPDATED", "2026.04.22"],
              ["LOCATION", "SINGAPORE"],
              ["STATUS", "SHIPPING"],
              ["LAST DISPATCH", "8w AGO"],
            ].map(([k, v]) => (
              <div key={k}>
                <span className="text-muted opacity-60">{k}</span>{" "}
                <span className="text-ink">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Components */}
      <section className="mb-14">
        <SectionHeader index="06" title="Components" right="7 primitives" />
        <div className="mt-5">
          {components.map(([name, desc]) => (
            <div
              key={name}
              className="grid grid-cols-[8rem_1fr] sm:grid-cols-[10rem_1fr] gap-4 py-3 border-b border-rule"
            >
              <span className="mono text-[0.6rem] tracking-[0.2em] uppercase text-accent">
                {name}
              </span>
              <span className="font-serif text-[0.95rem] text-ink leading-[1.55]">
                {desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 07 — Anti-patterns */}
      <section className="mb-12">
        <SectionHeader index="07" title="Anti-patterns" right="don't" />
        <ul className="mt-6 grid gap-2">
          {antiPatterns.map((line, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] gap-4 py-2 font-serif text-[0.98rem] text-ink leading-snug"
            >
              <span className="mono text-[0.66rem] text-accent tracking-[0.2em]">
                ×
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 pt-4 border-t border-rule flex flex-wrap justify-between gap-3 mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
        <span>Aizome · v1.0 · 2026</span>
        <span className="font-serif italic normal-case tracking-normal text-[0.82rem]">
          designed in the open.
        </span>
      </div>
    </PageShell>
  );
}

function PaletteColumn({ label, tokens }: { label: string; tokens: Token[] }) {
  return (
    <div>
      <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted mb-4">
        {label}
      </div>
      <div className="grid gap-2">
        {tokens.map((t) => (
          <div
            key={t.name}
            className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3"
          >
            <span
              className="h-8 w-8 border border-rule"
              style={{ background: t.value }}
              aria-hidden
            />
            <div>
              <div className="font-serif text-[0.9rem] text-ink">{t.name}</div>
              <div className="font-serif italic text-[0.72rem] text-muted">
                {t.note}
              </div>
            </div>
            <span className="mono text-[0.62rem] tracking-[0.2em] uppercase text-muted">
              {t.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeSpecimen({
  label,
  family,
  samples,
}: {
  label: string;
  family: string;
  samples: [string, string, string][];
}) {
  return (
    <div>
      <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted mb-3">
        {label}
      </div>
      <div className="grid gap-3">
        {samples.map(([weight, cls, text], i) => (
          <div
            key={i}
            className="grid sm:grid-cols-[9rem_1fr] gap-3 items-baseline"
          >
            <span className="mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
              {weight}
            </span>
            <span className={`${family} ${cls}`}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
