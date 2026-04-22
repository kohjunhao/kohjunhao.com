import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProjectDetail } from "@/components/project-detail";
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

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/projects"
          className="mono text-[0.66rem] tracking-[0.22em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
        >
          ← all projects
        </Link>
      </div>
      <ProjectDetail project={project} />
    </PageShell>
  );
}
