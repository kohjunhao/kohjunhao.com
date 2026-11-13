import { boardGames, games, type ShelfKind } from "@/lib/shelf";
import type { Sheet } from "./model";
import { coverPicture } from "./pictures";
import { countIf, tableSheet } from "./table";

const KIND = 1;
const SHELVES: { kind: ShelfKind; label: string; items: typeof games }[] = [
  { kind: "games", label: "Video game", items: games },
  { kind: "boardGames", label: "Board game", items: boardGames },
];

export function buildGames(): Sheet {
  const n = games.length + boardGames.length;

  return tableSheet({
    slug: "games",
    defaultView: "covers",
    columns: [
      { name: "Title", width: 320, mobileWidth: 220 },
      { name: "Kind", width: 140 },
    ],
    body: SHELVES.flatMap((shelf) =>
      shelf.items.map((g) => [{ v: g.title, picture: coverPicture(shelf.kind, g.slug, g.title) }, { v: shelf.label }]),
    ),
    pivot: [
      {
        kind: "counts",
        title: "By kind",
        items: SHELVES.map((s) => ({ label: s.label, count: s.items.length, fx: countIf(KIND, n, s.label) })),
      },
    ],
  });
}
