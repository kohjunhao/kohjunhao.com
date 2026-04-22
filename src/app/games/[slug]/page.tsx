import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { GameDetail } from "@/components/game-detail";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
import { games, getGame } from "@/lib/stock";

type Params = { slug: string };

export async function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const g = getGame(slug);
  if (!g) return { title: "Not found" };
  return { title: g.title, description: `${g.platform} · ${g.hours}h` };
}

export default async function GamePage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const game = getGame(slug);
  if (!game) notFound();

  const sorted = [...games].sort((a, b) => b.hours - a.hours);
  const { prev, next, index } = neighbors(sorted, slug);

  return (
    <PageShell>
      <DetailCrumb
        parentHref="/games"
        parentLabel="all games"
        position={`${String(index + 1).padStart(2, "0")} / ${String(games.length).padStart(2, "0")}`}
      />
      <GameDetail game={game} />
      <DetailSiblings
        parentHref="/games"
        parentLabel="the log"
        prev={prev ? { href: `/games/${prev.slug}`, label: prev.title } : null}
        next={next ? { href: `/games/${next.slug}`, label: next.title } : null}
      />
    </PageShell>
  );
}
