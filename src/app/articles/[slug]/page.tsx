import { Marked } from "marked";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { articles, formatDate, getArticle, paragraphUrl } from "@/lib/articles";

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
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />

      <main id="main" className="v3-frame v3-reading">
        <article className="v3-column">
          <header>
            <h1 className="v3-reading-title">{article.title}</h1>
            <p className="v3-reading-meta">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span aria-hidden> · </span>
              {article.minutes} min read
              <span aria-hidden> · </span>
              <a href={paragraphUrl(article)} target="_blank" rel="noopener noreferrer">
                Published on Paragraph
              </a>
            </p>
          </header>

          <div className="v3-prose" dangerouslySetInnerHTML={{ __html: renderEssay(article.markdown) }} />
        </article>

        <nav className="v3-column v3-pager" aria-label="More essays">
          {older && (
            <Link href={`/articles/${older.slug}`} className="v3-pager-link">
              <span className="v3-caption">Previous</span>{" "}
              {older.title}
            </Link>
          )}
          {newer && (
            <Link href={`/articles/${newer.slug}`} className="v3-pager-link v3-pager-next">
              <span className="v3-caption">Next</span>{" "}
              {newer.title}
            </Link>
          )}
        </nav>
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
