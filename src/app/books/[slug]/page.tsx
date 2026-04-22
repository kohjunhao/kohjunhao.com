import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { BookDetail } from "@/components/book-detail";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
import { books, getBook } from "@/lib/stock";

type Params = { slug: string };

export async function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const b = getBook(slug);
  if (!b) return { title: "Not found" };
  return { title: b.title, description: b.note ?? b.author };
}

export default async function BookPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const book = getBook(slug);
  if (!book) notFound();

  const { prev, next, index } = neighbors(books, slug);

  return (
    <PageShell>
      <DetailCrumb
        parentHref="/books"
        parentLabel="all books"
        position={`${String(index + 1).padStart(2, "0")} / ${String(books.length).padStart(2, "0")}`}
      />
      <BookDetail book={book} />
      <DetailSiblings
        parentHref="/books"
        parentLabel="the shelf"
        prev={prev ? { href: `/books/${prev.slug}`, label: prev.title } : null}
        next={next ? { href: `/books/${next.slug}`, label: next.title } : null}
      />
    </PageShell>
  );
}
