import activity from "@/data/activity.json";
import { investments } from "@/lib/stock";
import { site } from "@/lib/site";
import { fullDate } from "./format";
import { companiesLink, ventures } from "./links";
import type { Cell, Sheet, Slot } from "./model";

export function buildAbout(): Sheet {
  const pairs: ([string, Cell] | null)[] = [
    ["Name", { v: site.name }],
    ["Role", { v: "Analyst at Ouroboros Capital" }],
    [
      "Building",
      {
        v: "FullMarks and Groundcrew Robotics",
        parts: [ventures.fullmarks, " and ", ventures.groundcrew],
      },
    ],
    ["Investing", { v: `Angel in ${investments.length} companies. Pre-seed and seed cheques.`, parts: ["Angel in ", companiesLink(), ". Pre-seed and seed cheques."] }],
    ["Education", { v: `${site.education.school}, ${site.education.degree}` }],
    ["Based in", { v: site.location }],
    null,
    ["X", { v: `@${site.handle.x}`, href: site.links.twitter }],
    ["Telegram", { v: `@${site.handle.telegram}`, href: site.links.telegram }],
    ["GitHub", { v: `github.com/${site.handle.github}`, href: site.links.github }],
    ["LinkedIn", { v: `linkedin.com/in/${site.handle.linkedin}`, href: site.links.linkedin }],
    ["Paragraph", { v: `paragraph.com/@${site.handle.paragraph}`, href: site.links.paragraph }],
    null,
    ["Why a spreadsheet", { v: "Most of it already was one." }],
    ["Counting since", { v: activity.from, text: fullDate(activity.from) }],
    ["Covers", { v: "Open Library, Steam and Wikipedia" }],
    ["Type", { v: "Inter and JetBrains Mono" }],
  ];

  const rows: Slot[][] = pairs.map((pair) => (pair ? [{ v: pair[0], role: "key" }, pair[1]] : [null, null]));

  return {
    slug: "about",
    columns: [{ width: 170, mobileWidth: 120 }, { width: 560, mobileWidth: 300 }],
    rows,
    select: [0, 1],
  };
}
