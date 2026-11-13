import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";

const ORIGIN = "https://kohjunhao.com";
const PAGES = ["", "/films", "/books", "/games", "/investments", "/articles"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.map((path) => ({ url: `${ORIGIN}${path}` }));
  const essays = articles.map((a) => ({ url: `${ORIGIN}/articles/${a.slug}` }));
  return [...pages, ...essays];
}
