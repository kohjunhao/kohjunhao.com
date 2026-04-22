import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { InvestmentDetail } from "@/components/investment-detail";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
import { investments, investmentSlug, getInvestment } from "@/lib/stock";

type Params = { slug: string };

export async function generateStaticParams() {
  return investments.map((i) => ({ slug: investmentSlug(i.name) }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const i = getInvestment(slug);
  if (!i) return { title: "Not found" };
  return {
    title: i.name,
    description: i.note ?? `${i.sector} portfolio company`,
  };
}

export default async function InvestmentPage(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const inv = getInvestment(slug);
  if (!inv) notFound();

  const sectorOrder = ["Infrastructure", "DeFi", "AI", "DePIN", "Applications"];
  const ordered = [...investments].sort((a, b) => {
    const sa = sectorOrder.indexOf(a.sector ?? "Applications");
    const sb = sectorOrder.indexOf(b.sector ?? "Applications");
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  });
  const { prev, next, index } = neighbors(ordered, slug, (i) =>
    investmentSlug(i.name)
  );

  return (
    <PageShell>
      <DetailCrumb
        parentHref="/investments"
        parentLabel="all investments"
        position={`${String(index + 1).padStart(3, "0")} / ${String(investments.length).padStart(3, "0")}`}
      />
      <InvestmentDetail inv={inv} />
      <DetailSiblings
        parentHref="/investments"
        parentLabel="the portfolio"
        prev={prev ? { href: `/investments/${investmentSlug(prev.name)}`, label: prev.name } : null}
        next={next ? { href: `/investments/${investmentSlug(next.name)}`, label: next.name } : null}
      />
    </PageShell>
  );
}
