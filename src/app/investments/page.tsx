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

const LOGO_SIZE = 40;

const logoFor = (slug: string): { w: number; h: number } | undefined => (logos as Record<string, { w: number; h: number }>)[slug];

function Name({ inv }: { inv: Investment }) {
  const slug = investmentSlug(inv.name);
  return (
    <li>
      {logoFor(slug) && (
        // Small files already; the optimiser would only re-encode them.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/logos/${slug}.webp`} alt="" width={LOGO_SIZE} height={LOGO_SIZE} loading="lazy" />
      )}
      {inv.name}
      {inv.year && <sup>{inv.year}</sup>}
    </li>
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
      <main id="main" className="v3-frame inv">
        <h1 className="inv-title">
          {investments.length} companies. <span>Angel cheques, pre-seed and seed.</span>
        </h1>

        {groups.map(({ label, items }) => (
          <section key={label} className="inv-group" aria-label={label}>
            <div className="inv-group-head">
              <h2>{label}</h2>
              <span className="v3-caption">{items.length}</span>
            </div>
            <ul className="inv-wall">
              {items.map((inv) => (
                <Name key={inv.name} inv={inv} />
              ))}
            </ul>
          </section>
        ))}
      </main>
      <div className="v3-rule" aria-hidden />
    </>
  );
}
