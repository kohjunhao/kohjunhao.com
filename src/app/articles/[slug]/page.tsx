import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ArticleBody } from "@/components/article-body";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
import { articles, getArticle } from "@/lib/articles";

type Params = { slug: string };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.title,
    description: article.subtitle,
  };
}

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const { prev, next, index } = neighbors(sorted, slug);

  return (
    <PageShell>
      <DetailCrumb
        parentHref="/articles"
        parentLabel="all articles"
        position={`${String(index + 1).padStart(2, "0")} / ${String(articles.length).padStart(2, "0")}`}
      />
      <ArticleBody article={article} />
      <DetailSiblings
        parentHref="/articles"
        parentLabel="the archive"
        prev={prev ? { href: `/articles/${prev.slug}`, label: prev.title } : null}
        next={next ? { href: `/articles/${next.slug}`, label: next.title } : null}
      />
    </PageShell>
  );
}
