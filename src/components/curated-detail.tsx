import type { CuratedItem } from "@/lib/stock";
import { DetailShell, DetailProse } from "./detail-shell";

export function CuratedDetail({ item }: { item: CuratedItem }) {
  const meta = [item.maker, item.category, item.price]
    .filter(Boolean)
    .join(" · ");
  return (
    <DetailShell
      eyebrow={`object · ${item.category.toLowerCase()}`}
      meta={meta}
      title={item.name}
      subtitle={item.note}
    >
      {item.bodyNote && <DetailProse text={item.bodyNote} />}
      {item.url && (
        <div className="mt-6">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[0.7rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
          >
            {item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
          </a>
        </div>
      )}
    </DetailShell>
  );
}
