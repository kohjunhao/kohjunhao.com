import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Side } from "@/components/side";
import { log } from "@/content/log";
import { getProject, projects } from "@/lib/stock";

type Params = { slug: string };

const entryFor = (slug: string) => log.find((e) => e.href === `/projects/${slug}`);

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) {
    return {};
  }
  return { title: project.name, description: entryFor(slug)?.deck };
}

export default async function ProjectPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="embed">
      <div className="grid">
        <Side back="log" />
        <h1 className="title">{project.name}</h1>
      </div>
      <iframe src={project.embed} title={project.name} />
    </div>
  );
}
