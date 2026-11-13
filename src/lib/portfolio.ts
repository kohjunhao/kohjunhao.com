import { investments, type Investment } from "./stock";
import { counted, tally } from "./format";

type Sector = NonNullable<Investment["sector"]>;

/** All a page may show of an investment. Notes, years, links and featured flags stay private. */
export type Company = { name: string; sector: Sector };

export const companies: Company[] = investments
  .map((i) => ({ name: i.name, sector: i.sector ?? "Applications" }))
  .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

const categories = tally(investments.map((i) => i.category ?? "Crypto"));

/** `89 companies` */
export const companyCount = counted(companies.length, "company", "companies");

/** `89 companies. 73 crypto, 16 frontier tech.` */
export const portfolioSummary = `${companyCount}. ${categories.map(([name, n]) => `${n} ${name.toLowerCase()}`).join(", ")}.`;

/** `Applications 35, DeFi 25, Infrastructure 19, DePIN 5, AI 5`, ties in A to Z list order. */
export const sectorCounts = tally(companies.map((c) => c.sector))
  .map(([sector, n]) => `${sector} ${n}`)
  .join(", ");
