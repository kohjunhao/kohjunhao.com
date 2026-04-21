import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";

export const metadata: Metadata = {
  title: "Design — Aizome",
  description:
    "The Aizome design system: Japanese-calm palette, serif + mono typography, mono-numeric ledger motif. The system that typesets this site.",
};

type Token = { name: string; value: string; note: string };

const paletteLight: Token[] = [
  { name: "canvas", value: "#FAFAF7", note: "paper white" },
  { name: "surface", value: "#F0EEE8", note: "soft cream" },
  { name: "ink", value: "#0E0E0E", note: "deep ink" },
  { name: "muted", value: "#7A756E", note: "warm gray" },
  { name: "accent", value: "#2B4A6F", note: "aizome indigo" },
  { name: "rule", value: "#E0DCD2", note: "hairline" },
];

const paletteDark: Token[] = [
  { name: "canvas", value: "#121210", note: "sumi night" },
  { name: "surface", value: "#1C1B18", note: "tea-black" },
  { name: "ink", value: "#EDEAE0", note: "moonlight" },
  { name: "muted", value: "#8A847A", note: "stone" },
  { name: "accent", value: "#6E93C4", note: "washed aizome" },
  { name: "rule", value: "#2A2823", note: "hairline" },
];

const spaceScale = [
  ["2", "inline whitespace between adjacent glyphs"],
  ["4", "tight stacking within a label"],
  ["8", "small gaps; label ↔ value"],
  ["12", "list row padding"],
  ["16", "paragraph-scale rhythm"],
  ["24", "component ↔ component"],
  ["32", "section breathing"],
  ["48", "section ↔ section"],
  ["64", "chapter breaks"],
  ["96", "page top / bottom margin"],
  ["128", "hero whitespace ― the 間"],
];

export default function DesignPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-14">
        <SectionHeader index="00" title="Aizome" right="v0 · 2026" />
        <div className="mt-6 prose-aizome">
          <p>
            <em>Aizome</em> (藍染) is the Japanese indigo dye traditionally used
            on paper and cloth. The system takes its name from the one accent
            colour it permits — a deep, quiet blue — and its philosophy from
            the stationery it admires: restrained, literary, made to last.
          </p>
          <p>
            Every page on <code>kohjunhao.com</code> is typeset in this system.
            This page documents it, and, by existing, demonstrates it.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mb-14">
        <SectionHeader index="01" title="Manifesto" />
        <ul className="mt-6 grid gap-3">
          {[
            ["Whitespace is structural, not decorative.", "間 (ma) carries meaning. Let it."],
            ["One accent, used sparingly.", "Indigo appears on <5% of any page."],
            ["Serif carries thought. Mono carries facts.", "No sans-serif."],
            ["Hairlines, not borders.", "1px rules do the work that shadows would."],
            ["Ledger-honest.", "Numerics are tabular, labelled, and never decorated."],
          ].map(([rule, why], i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
              <span className="mono text-[0.7rem] text-accent tracking-wider">
                0{i + 1} /
              </span>
              <div>
                <div className="font-serif text-[1.05rem] leading-snug">
                  {rule}
                </div>
                <div className="mono text-[0.7rem] text-muted tracking-wider mt-0.5">
                  {why}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Palette */}
      <section className="mb-14">
        <SectionHeader index="02" title="Palette" right="6 + 6 tokens" />
        <p className="prose-aizome mt-5">
          Two palettes, light and dark, each six tokens. The canvas is never
          pure white. Neutrals carry a warm undertone. Accent is aizome indigo
          in light mode; in dark mode it&rsquo;s washed up for contrast.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-10">
          <PaletteColumn label="LIGHT · day" tokens={paletteLight} />
          <PaletteColumn label="DARK · night" tokens={paletteDark} />
        </div>
      </section>

      {/* Typography */}
      <section className="mb-14">
        <SectionHeader index="03" title="Typography" />
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

      {/* Spacing */}
      <section className="mb-14">
        <SectionHeader index="04" title="Spacing" right="4pt scale" />
        <p className="prose-aizome mt-5">
          Every measurement is a multiple of 4. The scale is sparse on purpose —
          limited options force confident decisions.
        </p>
        <div className="mt-6 grid gap-2">
          {spaceScale.map(([val, note]) => (
            <div key={val} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4">
              <span className="mono text-[0.7rem] text-accent tracking-wider">
                {val}pt
              </span>
              <div
                className="h-px bg-accent/80"
                style={{ width: `${Math.min(Number(val), 160)}px` }}
              />
              <span className="mono text-[0.7rem] text-muted tracking-wider uppercase">
                {note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Motif */}
      <section className="mb-14">
        <SectionHeader index="05" title="Motif" right="mono-numeric ledger" />
        <p className="prose-aizome mt-5">
          The system&rsquo;s signature: sections indexed like ledger rows.{" "}
          <code>01 /</code>, <code>02 /</code>, and so on. The footer of every
          page renders a three-cell status ledger. It&rsquo;s the smallest
          idiomatic move that says &ldquo;this site was made by an operator,
          not a designer.&rdquo;
        </p>
        <div className="mt-6 bg-surface p-6 sm:p-8 border border-rule">
          <div className="mono text-[0.75rem] text-accent tracking-wider mb-3">
            01 / EXAMPLE SECTION
          </div>
          <div className="font-serif text-[1.3rem] font-medium mb-4">
            Section title here
          </div>
          <Hairline />
          <div className="grid grid-cols-3 gap-3 mono text-[0.68rem] text-muted tracking-wider mt-4">
            <div>
              <span className="opacity-60">LAST UPDATED</span>{" "}
              <span className="text-ink">2026.04.22</span>
            </div>
            <div>
              <span className="opacity-60">LOCATION</span>{" "}
              <span className="text-ink">SINGAPORE</span>
            </div>
            <div>
              <span className="opacity-60">STATUS</span>{" "}
              <span className="text-ink">SHIPPING</span>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-14">
        <SectionHeader index="06" title="Components" right="5 primitives" />
        <div className="mt-5 prose-aizome">
          <p>
            <strong>SectionHeader</strong> — indexed title, optional meta on
            the right. <strong>Hairline</strong> — 1px rule at <code>rule</code>{" "}
            token. <strong>LedgerRow</strong> — three-column row with mono
            index, serif label, mono metadata. <strong>StatusFooter</strong> —
            three-cell site-wide sign-off. <strong>Modal</strong> — intercepted
            overlay at 70vw, close on backdrop / escape / back.
          </p>
        </div>
      </section>

      {/* Anti-patterns */}
      <section className="mb-10">
        <SectionHeader index="07" title="Anti-patterns" />
        <ul className="mt-6 grid gap-2 prose-aizome">
          {[
            "Drop shadows. Use hairlines or inset rules instead.",
            "Large radii. Nothing over 8pt. Flat is the rule.",
            "Sans-serif. Serif carries thought; mono carries facts.",
            "A second accent. If the page needs emphasis beyond indigo, the page is doing too much.",
            "Pure white or pure black. Canvas always has warmth.",
          ].map((line, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-3">
              <span className="mono text-[0.7rem] text-accent tracking-wider">
                ×
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function PaletteColumn({ label, tokens }: { label: string; tokens: Token[] }) {
  return (
    <div>
      <div className="mono text-[0.68rem] text-muted tracking-wider mb-4">
        {label}
      </div>
      <div className="grid gap-2">
        {tokens.map((t) => (
          <div
            key={t.name}
            className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3"
          >
            <span
              className="h-8 w-8 border border-rule"
              style={{ background: t.value }}
              aria-hidden
            />
            <div>
              <div className="font-serif text-[0.95rem]">{t.name}</div>
              <div className="mono text-[0.66rem] text-muted tracking-wider">
                {t.note}
              </div>
            </div>
            <span className="mono text-[0.7rem] text-muted tracking-wider uppercase">
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
      <div className="mono text-[0.68rem] text-muted tracking-wider mb-3">
        {label}
      </div>
      <div className="grid gap-3">
        {samples.map(([weight, cls, text], i) => (
          <div key={i} className="grid sm:grid-cols-[9rem_1fr] gap-3 items-baseline">
            <span className="mono text-[0.68rem] text-muted tracking-wider uppercase">
              {weight}
            </span>
            <span className={`${family} ${cls}`}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
