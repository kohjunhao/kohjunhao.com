import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CanvasPage } from "@/components/canvas-page";
import { Handles } from "@/components/icons";
import { log } from "@/content/log";
import { getProject, projects } from "@/lib/stock";
import { workbook } from "@/sheet/tabs";

type Params = { slug: string };

const entryFor = (slug: string) => log.find((e) => e.href === `/projects/${slug}`);

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Not found" };
  }
  return { title: project.name, description: entryFor(slug)?.deck };
}

export default async function ProjectPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }
  const entry = entryFor(slug);

  return (
    <CanvasPage book={workbook()} active="log" nameBox="Object 1" text={project.name}>
      <div className="objectwrap">
        {entry && (
          <p className="caption">
            <b>{entry.title}</b>
            <span aria-hidden="true"> · </span>
            {entry.deck}
          </p>
        )}
        <div className="object">
          <Handles />
          <iframe src={project.embed} title={project.name} loading="lazy" />
        </div>
      </div>
    </CanvasPage>
  );
}
