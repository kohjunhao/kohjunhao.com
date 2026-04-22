import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { InvestmentDetail } from "@/components/investment-detail";
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

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/investments"
          className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
        >
          ← all investments
        </Link>
      </div>
      <InvestmentDetail inv={inv} />
    </PageShell>
  );
}
