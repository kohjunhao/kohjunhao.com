import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CuratedDetail } from "@/components/curated-detail";
import { curated, getCurated } from "@/lib/stock";

type Params = { slug: string };

export async function generateStaticParams() {
  return curated.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCurated(slug);
  if (!c) return { title: "Not found" };
  return { title: c.name, description: c.note };
}

export default async function CuratedItemPage(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const item = getCurated(slug);
  if (!item) notFound();

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/curated"
          className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
        >
          ← all objects
        </Link>
      </div>
      <CuratedDetail item={item} />
    </PageShell>
  );
}
