import { ShelfPage, shelfMetadata } from "@/components/shelf-page";

export const metadata = shelfMetadata("games");

export default function GamesPage() {
  return <ShelfPage id="games" />;
}
