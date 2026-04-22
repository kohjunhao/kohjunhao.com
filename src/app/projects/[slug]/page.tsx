import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProjectDetail } from "@/components/project-detail";
import {
  DetailCrumb,
  DetailSiblings,
  neighbors,
} from "@/components/detail-nav";
import { projects, getProject } from "@/lib/stock";

type Params = { slug: string };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) return { title: "Not found" };
  return { title: p.name, description: p.note };
}

export default async function ProjectPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next, index } = neighbors(projects, slug);

  return (
    <PageShell wide={Boolean(project.embed)}>
      <DetailCrumb
        parentHref="/projects"
        parentLabel="all projects"
        position={`${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`}
      />
      <ProjectDetail project={project} />
      <DetailSiblings
        parentHref="/projects"
        parentLabel="in flight"
        prev={prev ? { href: `/projects/${prev.slug}`, label: prev.name } : null}
        next={next ? { href: `/projects/${next.slug}`, label: next.name } : null}
      />
    </PageShell>
  );
}
