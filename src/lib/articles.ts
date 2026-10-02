import data from "@/content/articles.json";

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

export const paragraphUrl = (article: Article) => `${PARAGRAPH_URL}/${article.slug}`;

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
