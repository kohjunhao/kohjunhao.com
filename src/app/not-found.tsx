import { SheetApp } from "@/components/sheet-app";
import { buildNotFound } from "@/sheet/not-found";
import { workbook } from "@/sheet/tabs";

export default function NotFound() {
  return <SheetApp sheet={buildNotFound()} book={workbook()} label="Not found" />;
}
