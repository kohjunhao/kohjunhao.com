import type { Metadata } from "next";
import { SheetApp } from "@/components/sheet-app";
import { buildGames } from "@/sheet/games";
import { workbook } from "@/sheet/tabs";

export const metadata: Metadata = {
  title: "Games",
  description: "The video games and board games I have played.",
};

export default function GamesPage() {
  return <SheetApp sheet={buildGames()} book={workbook()} active="games" label="Games" />;
}
