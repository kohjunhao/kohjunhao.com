import type { Metadata } from "next";
import { CompanyList } from "@/components/rows";
import { PageHead, Side } from "@/components/side";
import { foldName } from "@/lib/folds";
import { companies, portfolioSummary, sectorCounts } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: foldName("portfolio"),
  description: portfolioSummary,
};

export default function InvestmentsPage() {
  return (
    <div className="grid">
      <Side back="portfolio" />
      <div>
        <PageHead name={foldName("portfolio")} lines={[portfolioSummary, sectorCounts]} />
        <CompanyList companies={companies} />
      </div>
    </div>
  );
}
