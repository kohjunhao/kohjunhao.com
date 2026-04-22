import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { MovieDetail } from "@/components/movie-detail";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
import { movies, getMovie } from "@/lib/stock";

type Params = { slug: string };

export async function generateStaticParams() {
  return movies.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const m = getMovie(slug);
  if (!m) return { title: "Not found" };
  return { title: m.title, description: `dir. ${m.director} · ${m.year}` };
}

export default async function MoviePage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const movie = getMovie(slug);
  if (!movie) notFound();

  const sorted = [...movies].sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
  const { prev, next, index } = neighbors(sorted, slug);

  return (
    <PageShell>
      <DetailCrumb
        parentHref="/movies"
        parentLabel="all movies"
        position={`${String(index + 1).padStart(2, "0")} / ${String(movies.length).padStart(2, "0")}`}
      />
      <MovieDetail movie={movie} />
      <DetailSiblings
        parentHref="/movies"
        parentLabel="the filmstrip"
        prev={prev ? { href: `/movies/${prev.slug}`, label: prev.title } : null}
        next={next ? { href: `/movies/${next.slug}`, label: next.title } : null}
      />
    </PageShell>
  );
}
