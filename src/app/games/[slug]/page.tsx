import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { GameDetail } from "@/components/game-detail";
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

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/games"
          className="mono text-[0.66rem] tracking-[0.2em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
        >
          ← all games
        </Link>
      </div>
      <GameDetail game={game} />
    </PageShell>
  );
}
