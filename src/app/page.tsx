import { SheetApp } from "@/components/sheet-app";
import { buildLog } from "@/sheet/log";
import { workbook } from "@/sheet/tabs";

export default function Home() {
  return <SheetApp sheet={buildLog()} book={workbook()} active="log" label="Log" />;
}
