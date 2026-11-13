import data from "@/content/articles.json";
import { counted, yearSpan } from "./format";

// Built by scripts/build-articles.mjs from the essays first published on Paragraph, newest first.
export type Article = {
  slug: string;
  title: string;
  date: string;
  description: string;
  minutes: number;
  markdown: string;
};

export const PARAGRAPH_URL = "https://paragraph.com/@0xvega";

export const articles: Article[] = data;

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/** `4 essays from 2022.` */
export const writingSummary = `${counted(articles.length, "essay", "essays")} from ${yearSpan(articles.map((a) => a.date))}.`;

export const readingTime = (a: Article) => `${a.minutes} min`;
