import type { Metadata } from "next";
import { SheetApp } from "@/components/sheet-app";
import { buildAbout } from "@/sheet/about";
import { workbook } from "@/sheet/tabs";

export const metadata: Metadata = {
  title: "About",
  description: "Who Koh Jun Hao is, and why his site is a spreadsheet.",
};

export default function AboutPage() {
  return <SheetApp sheet={buildAbout()} book={workbook()} active="about" label="About" />;
}
