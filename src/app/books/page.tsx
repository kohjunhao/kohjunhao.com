import { ShelfPage, shelfMetadata } from "@/components/shelf-page";

export const metadata = shelfMetadata("books");

export default function BooksPage() {
  return <ShelfPage id="books" />;
}
