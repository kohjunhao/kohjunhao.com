import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { ArticleBody } from "@/components/article-body";
import { getArticle } from "@/lib/articles";

type Params = { slug: string };

export default async function InterceptedArticle(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <Modal>
      <ArticleBody article={article} />
    </Modal>
  );
}
