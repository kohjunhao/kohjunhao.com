import type { ReactNode } from "react";
import type { Book, TabId } from "@/sheet/tabs";
import { FormulaBar } from "./formula-bar";
import { Frame } from "./frame";
import { TabBar } from "./tab-bar";

/** A page drawn as one object sitting on the sheet's gridlines: an essay or an embedded project. */
export function CanvasPage({
  book,
  active,
  nameBox,
  text,
  children,
}: {
  book: Book;
  active: TabId;
  nameBox: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <Frame book={book}>
      <FormulaBar nameBox={nameBox} text={text} />
      <main className="canvas">{children}</main>
      <TabBar tabs={book.tabs} active={active} />
    </Frame>
  );
}
