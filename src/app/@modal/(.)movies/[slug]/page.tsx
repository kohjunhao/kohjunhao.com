import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { MovieDetail } from "@/components/movie-detail";
import { getMovie } from "@/lib/stock";

type Params = { slug: string };

export default async function InterceptedMovie(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const movie = getMovie(slug);
  if (!movie) notFound();
  return (
    <Modal>
      <MovieDetail movie={movie} />
    </Modal>
  );
}
