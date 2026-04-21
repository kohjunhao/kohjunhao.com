import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ArticleBody } from "@/components/article-body";
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

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/articles"
          className="mono text-[0.7rem] text-accent tracking-wider uppercase hover:underline"
        >
          ← all articles
        </Link>
      </div>
      <ArticleBody article={article} />
    </PageShell>
  );
}
