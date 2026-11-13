import type { Metadata } from "next";
import { SheetApp } from "@/components/sheet-app";
import { buildFilms } from "@/sheet/films";
import { workbook } from "@/sheet/tabs";

export const metadata: Metadata = {
  title: "Films",
  description: "Every film and show I have watched.",
};

export default function FilmsPage() {
  return <SheetApp sheet={buildFilms()} book={workbook()} active="films" label="Films" />;
}
