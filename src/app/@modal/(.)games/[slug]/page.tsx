import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { GameDetail } from "@/components/game-detail";
import { getGame } from "@/lib/stock";

type Params = { slug: string };

export default async function InterceptedGame(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const game = getGame(slug);
  if (!game) notFound();
  return (
    <Modal>
      <GameDetail game={game} />
    </Modal>
  );
}
