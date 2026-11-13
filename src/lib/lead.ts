import type { FoldId } from "./folds";
import { companyCount } from "./portfolio";
import { site } from "./site";

/** A run of text, or a link inside it. `fold` names a home page fold the link opens. */
export type Inline = string | { text: string; href: string } | { text: string; fold: FoldId };

/** The sentence under the plate, also used as the site's description and on the share card. */
export const lead: Inline[] = [
  "Analyst at Ouroboros Capital. Building ",
  { text: "FullMarks", href: site.links.fullmarks },
  " and ",
  { text: "Groundcrew Robotics", href: site.links.groundcrew },
  ". Angel in ",
  { text: companyCount, fold: "portfolio" },
  ".",
];

export const leadText = lead.map((part) => (typeof part === "string" ? part : part.text)).join("");
