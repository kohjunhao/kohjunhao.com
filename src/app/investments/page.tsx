import type { Metadata } from "next";
import { SheetApp } from "@/components/sheet-app";
import { buildPortfolio } from "@/sheet/portfolio";
import { workbook } from "@/sheet/tabs";

export const metadata: Metadata = {
  title: "Investments",
  description: "The companies Koh Jun Hao has written angel cheques into.",
};

export default function InvestmentsPage() {
  return <SheetApp sheet={buildPortfolio()} book={workbook()} active="portfolio" label="Portfolio" />;
}
