import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { SHELF_ORDER } from "@/lib/shelf";
import { projects } from "@/lib/stock";

const ORIGIN = "https://kohjunhao.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...SHELF_ORDER.map((id) => `/${id}`),
    "/investments",
    "/articles",
    ...articles.map((a) => `/articles/${a.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${ORIGIN}${path}` }));
}
