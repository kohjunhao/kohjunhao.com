import { Marked } from "marked";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Side } from "@/components/side";
import { articles, getArticle, readingTime } from "@/lib/articles";
import { fullDate } from "@/lib/format";

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
      return `<figure><img src="${escapeHtml(only.href)}" alt="${alt}" loading="lazy" decoding="async">${caption}</figure>\n`;
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
    return {};
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
    <div className="grid">
      <Side back="writing">
        <time dateTime={article.date}>{fullDate(article.date)}</time>
        <span>{readingTime(article)}</span>
      </Side>
      <article className="essay">
        <h1 className="page-name">{article.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: renderEssay(article.markdown) }} />

        <nav className="pager">
          {older && (
            <Link href={`/articles/${older.slug}`}>
              <small>Older</small>
              <span className="title">{older.title}</span>
            </Link>
          )}
          {newer && (
            <Link href={`/articles/${newer.slug}`} className="newer">
              <small>Newer</small>
              <span className="title">{newer.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
