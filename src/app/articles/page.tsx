import type { Metadata } from "next";
import { SheetApp } from "@/components/sheet-app";
import { buildWriting } from "@/sheet/writing";
import { workbook } from "@/sheet/tabs";

export const metadata: Metadata = {
  title: "Writing",
  description: "Four essays on DeFi, 2022, first published on Paragraph.",
};

export default function WritingPage() {
  return <SheetApp sheet={buildWriting()} book={workbook()} active="writing" label="Writing" />;
}
