import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { BookDetail } from "@/components/book-detail";
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

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/books"
          className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
        >
          ← all books
        </Link>
      </div>
      <BookDetail book={book} />
    </PageShell>
  );
}
