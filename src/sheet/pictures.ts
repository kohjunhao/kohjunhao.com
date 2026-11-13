import { cover, type ShelfKind } from "@/lib/shelf";
import { tint } from "@/lib/tint";
import type { Picture } from "./model";

export function coverPicture(kind: ShelfKind, slug: string, title: string): Picture | undefined {
  const art = cover(kind, slug);
  if (!art) {
    return undefined;
  }
  return { src: art.src, w: art.w, h: art.h, alt: `Cover of ${title}`, tint: art.color ?? tint(slug) };
}
