import type { Metadata } from "next";
import { SheetApp } from "@/components/sheet-app";
import { buildBooks } from "@/sheet/books";
import { workbook } from "@/sheet/tabs";

export const metadata: Metadata = {
  title: "Books",
  description: "Every book I have finished.",
};

export default function BooksPage() {
  return <SheetApp sheet={buildBooks()} book={workbook()} active="books" label="Books" />;
}
