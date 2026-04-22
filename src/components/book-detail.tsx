import type { Book } from "@/lib/stock";
import { DetailShell, DetailEmpty, DetailProse } from "./detail-shell";
import { recLabel } from "@/lib/stock";

export function BookDetail({ book }: { book: Book }) {
  return (
    <DetailShell
      eyebrow={`book · ${recLabel[book.rec].label.toLowerCase()}`}
      meta={`${book.author} · ${book.year}`}
      title={book.title}
      subtitle={book.note ? `"${book.note}"` : undefined}
    >
      {book.bodyNote ? (
        <>
          <DetailProse text={book.bodyNote} />
          <div className="mt-10 pt-4 border-t border-rule flex justify-between mono text-[0.58rem] tracking-[0.22em] uppercase text-muted">
            <span>read · {book.year}</span>
            <span>verdict · {recLabel[book.rec].label}</span>
          </div>
        </>
      ) : (
        <DetailEmpty prompt="Every book on the shelf is clickable. Some have notes; some are still being read. Both are honest states." />
      )}
    </DetailShell>
  );
}
