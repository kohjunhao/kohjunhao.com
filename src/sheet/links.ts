import { investments } from "@/lib/stock";
import { site } from "@/lib/site";
import type { Inline } from "./model";

export const ventures = {
  fullmarks: { text: "FullMarks", href: site.links.fullmarks },
  groundcrew: { text: "Groundcrew Robotics", href: site.links.groundcrew },
} satisfies Record<string, Inline>;

export const companiesLink = (): Inline => ({ text: `${investments.length} companies`, href: "/investments" });
