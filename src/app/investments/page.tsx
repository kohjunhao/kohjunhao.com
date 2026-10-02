import type { Metadata } from "next";
import { TopBar } from "@/components/top-bar";
import logos from "@/data/logos.json";
import { investments, investmentSlug, type Investment } from "@/lib/stock";
import "./investments.css";

export const metadata: Metadata = {
  title: "Investments",
  description: "The companies Koh Jun Hao has written angel cheques into.",
};

const GROUPS: { category: NonNullable<Investment["category"]>; label: string }[] = [
  { category: "Crypto", label: "Crypto" },
  { category: "Frontier Tech", label: "Frontier tech" },
];

// Quiet paper tints for companies without a logo, picked by the name so a
// company keeps its colour between builds.
const TINTS = ["#efe9dc", "#e6ebe0", "#e3e8ef", "#efe3e3", "#ece6ef", "#e9ecd9", "#e4ecec", "#efe7dd"];
const LOGO_SIZE = 40;

const logoFor = (slug: string): { w: number; h: number } | undefined => (logos as Record<string, { w: number; h: number }>)[slug];

function tint(name: string) {
  let hash = 0;
  for (const ch of name) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 1_000_003;
  }
  return TINTS[hash % TINTS.length];
}

function Mark({ inv }: { inv: Investment }) {
  const slug = investmentSlug(inv.name);
  const logo = logoFor(slug);
  if (!logo) {
    return (
      <span className="inv-mark" style={{ "--tint": tint(inv.name) } as React.CSSProperties} aria-hidden>
        {inv.name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <span className="inv-mark">
      {/* Small files already; the optimiser would only re-encode them. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/logos/${slug}.webp`} alt="" width={LOGO_SIZE} height={LOGO_SIZE} loading="lazy" />
    </span>
  );
}

export default function InvestmentsPage() {
  const groups = GROUPS.map(({ category, label }) => ({
    label,
    items: investments.filter((i) => i.category === category).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />
      <main id="main" className="v3-frame">
        <div className="inv-head">
          <h1 className="v3-label">Investments</h1>
          <span className="v3-caption">angel cheques, pre-seed and seed, no click-through</span>
        </div>
        <p className="inv-sum">{investments.length} companies.</p>

        {groups.map(({ label, items }) => (
          <section key={label} className="inv-group" aria-label={label}>
            <div className="inv-group-head">
              <h2>{label}</h2>
              <span className="v3-caption">{items.length}</span>
            </div>
            <ul className="inv-wall">
              {items.map((inv) => (
                <li key={inv.name} className="inv-tile">
                  <Mark inv={inv} />
                  <div>
                    <div className="inv-name">{inv.name}</div>
                    {inv.year && <div className="inv-year">{inv.year}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="inv-note">Logos appear where the company has a public site on file; the rest show an initial.</p>
      </main>
      <div className="v3-rule" aria-hidden />
    </>
  );
}
