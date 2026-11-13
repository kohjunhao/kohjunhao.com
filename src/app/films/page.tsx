import { ShelfPage, shelfMetadata } from "@/components/shelf-page";

export const metadata = shelfMetadata("films");

export default function FilmsPage() {
  return <ShelfPage id="films" />;
}
