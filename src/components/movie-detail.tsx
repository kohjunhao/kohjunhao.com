import type { Movie } from "@/lib/stock";
import { DetailShell, DetailEmpty, DetailProse } from "./detail-shell";
import { recLabel } from "@/lib/stock";

export function MovieDetail({ movie }: { movie: Movie }) {
  return (
    <DetailShell
      eyebrow={`film · ${recLabel[movie.rec].label.toLowerCase()}`}
      meta={`dir. ${movie.director} · ${movie.year}`}
      title={movie.title}
    >
      {movie.note ? (
        <DetailProse text={movie.note} />
      ) : (
        <DetailEmpty prompt="No notes written yet — the film's been seen, the opinion hasn't settled." />
      )}
    </DetailShell>
  );
}
