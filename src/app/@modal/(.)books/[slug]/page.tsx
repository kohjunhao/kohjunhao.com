import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { BookDetail } from "@/components/book-detail";
import { getBook } from "@/lib/stock";

type Params = { slug: string };

export default async function InterceptedBook(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const book = getBook(slug);
  if (!book) notFound();
  return (
    <Modal>
      <BookDetail book={book} />
    </Modal>
  );
}
