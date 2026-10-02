import type { CSSProperties } from "react";
import { cover, tint, type ShelfKind } from "@/lib/shelf";

export type TileRatio = "portrait" | "landscape";

/** Title length bands for the bare tile; shorter titles set larger. */
function lengthBand(title: string) {
  if (title.length <= 12) {
    return "s";
  }
  if (title.length <= 22) {
    return "m";
  }
  if (title.length <= 36) {
    return "l";
  }
  return "xl";
}

export function Tile({
  kind,
  slug,
  title,
  year,
  caption,
  ratio = "portrait",
}: {
  kind: ShelfKind;
  slug: string;
  title: string;
  year?: number | null;
  caption?: string;
  ratio?: TileRatio;
}) {
  const art = cover(kind, slug);

  if (!art) {
    return (
      <div className="v3-tile v3-tile-bare" data-ratio={ratio} style={{ "--tint": tint(slug) } as CSSProperties}>
        <span className="v3-tile-title" data-len={lengthBand(title)}>
          {title}
        </span>
        <span className="v3-tile-foot">
          {year && <span>{year}</span>}
          {caption && <span>{caption}</span>}
        </span>
      </div>
    );
  }

  return (
    <div className="v3-tile" data-ratio={ratio} style={{ "--tint": art.color ?? tint(slug) } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element -- covers are already 240px webp; the optimiser would only re-encode them */}
      <img src={art.src} width={art.w} height={art.h} alt="" loading="lazy" decoding="async" />
      <span className="v3-tile-cap">
        <b>{title}</b>
        {(year || caption) && <span>{[year, caption].filter(Boolean).join(", ")}</span>}
      </span>
    </div>
  );
}
