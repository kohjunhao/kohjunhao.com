import type { Metadata } from "next";
import { SHELF_ORDER, shelves, type ShelfId } from "@/lib/shelf";
import { ShelfView } from "./shelf-view";
import { PageHead, Side, SideLink } from "./side";

export const shelfMetadata = (id: ShelfId): Metadata => ({
  title: shelves[id].name,
  description: shelves[id].summary,
});

export function ShelfPage({ id }: { id: ShelfId }) {
  const shelf = shelves[id];
  return (
    <div className="grid">
      <Side back="shelf">
        {SHELF_ORDER.map((s) => (
          <SideLink key={s} href={`/${s}`} current={s === id}>
            {shelves[s].name}
          </SideLink>
        ))}
      </Side>
      <div>
        <PageHead name={shelf.name} lines={[shelf.summary]} />
        <ShelfView shelf={shelf} />
      </div>
    </div>
  );
}
