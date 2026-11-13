import type { Metadata } from "next";
import { EssayList } from "@/components/rows";
import { PageHead, Side } from "@/components/side";
import { articles, PARAGRAPH_URL, writingSummary } from "@/lib/articles";
import { foldName } from "@/lib/folds";

export const metadata: Metadata = {
  title: foldName("writing"),
  description: writingSummary,
};

export default function ArticlesPage() {
  return (
    <div className="grid">
      <Side back="writing" />
      <div>
        <PageHead name={foldName("writing")} lines={[writingSummary]} />
        <div className="table">
          <EssayList articles={articles} />
        </div>
        <a className="link after" href={PARAGRAPH_URL}>
          More on Paragraph
        </a>
      </div>
    </div>
  );
}
