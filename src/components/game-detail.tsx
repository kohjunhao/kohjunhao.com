import type { Game } from "@/lib/stock";
import { DetailShell, DetailEmpty, DetailProse } from "./detail-shell";

export function GameDetail({ game }: { game: Game }) {
  const tier =
    game.rec === "highly"
      ? "must play"
      : game.rec === "recommended"
      ? "recommend"
      : game.rec === "skip"
      ? "skip"
      : "logged";

  return (
    <DetailShell
      eyebrow={`game · ${tier}`}
      meta={`${game.platform} · ${game.hours}h logged${
        game.currentlyPlaying ? " · currently playing" : ""
      }`}
      title={game.title}
    >
      {game.note ? (
        <DetailProse text={game.note} />
      ) : (
        <DetailEmpty prompt="Hours logged, no words written. Sometimes the game just is." />
      )}
    </DetailShell>
  );
}
