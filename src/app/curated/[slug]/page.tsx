import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { CuratedDetail } from "@/components/curated-detail";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
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

  const { prev, next, index } = neighbors(curated, slug);

  return (
    <PageShell>
      <DetailCrumb
        parentHref="/curated"
        parentLabel="all objects"
        position={`${String(index + 1).padStart(2, "0")} / ${String(curated.length).padStart(2, "0")}`}
      />
      <CuratedDetail item={item} />
      <DetailSiblings
        parentHref="/curated"
        parentLabel="the shelf"
        prev={prev ? { href: `/curated/${prev.slug}`, label: prev.name } : null}
        next={next ? { href: `/curated/${next.slug}`, label: next.name } : null}
      />
    </PageShell>
  );
}
