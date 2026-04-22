import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { MovieDetail } from "@/components/movie-detail";
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

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/movies"
          className="mono text-[0.66rem] tracking-[0.2em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
        >
          ← all movies
        </Link>
      </div>
      <MovieDetail movie={movie} />
    </PageShell>
  );
}
