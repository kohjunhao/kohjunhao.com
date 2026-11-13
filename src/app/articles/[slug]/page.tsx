import { Marked } from "marked";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CanvasPage } from "@/components/canvas-page";
import { Handles } from "@/components/icons";
import { articles, formatDate, getArticle, paragraphUrl } from "@/lib/articles";
import { workbook } from "@/sheet/tabs";

type Params = { slug: string };

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Raw HTML in an essay is dropped, and a picture standing alone in its paragraph becomes a
// figure captioned with its alt text.
const markdown = new Marked({
  renderer: {
    html: () => "",
    paragraph({ tokens }) {
      const [only] = tokens;
      if (tokens.length !== 1 || only.type !== "image") {
        return false;
      }
      const alt = escapeHtml(only.text.replace(/\\(.)/g, "$1"));
      const caption = alt ? `<figcaption>${alt}</figcaption>` : "";
      return `<figure><img src="${escapeHtml(only.href)}" alt="${alt}" decoding="async">${caption}</figure>\n`;
    },
  },
});

function renderEssay(source: string) {
  const html = markdown.parse(source, { async: false });
  return html.replace(/<(script|iframe)\b[\s\S]*?(<\/\1>|$)/gi, "");
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) {
    return { title: "Not found" };
  }
  return {
    title: article.title,
    description: article.description,
    openGraph: { type: "article", publishedTime: article.date },
  };
}

export default async function ArticlePage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) {
    notFound();
  }

  const index = articles.indexOf(article);
  const older = articles[index + 1];
  const newer = articles[index - 1];

  return (
    <CanvasPage book={workbook()} active="writing" nameBox="Text 1" text={article.title}>
      <article className="textbox">
        <Handles />
        <h1>{article.title}</h1>
        <p className="meta">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true"> · </span>
          {article.minutes} min read
          <span aria-hidden="true"> · </span>
          <a href={paragraphUrl(article)} target="_blank" rel="noopener noreferrer">
            First published on Paragraph
          </a>
        </p>

        <div className="prose" dangerouslySetInnerHTML={{ __html: renderEssay(article.markdown) }} />

        <nav className="pager" aria-label="More essays">
          {older && (
            <Link href={`/articles/${older.slug}`}>
              <small>Older</small>
              {older.title}
            </Link>
          )}
          {newer && (
            <Link href={`/articles/${newer.slug}`} className="newer">
              <small>Newer</small>
              {newer.title}
            </Link>
          )}
        </nav>
      </article>
    </CanvasPage>
  );
}
