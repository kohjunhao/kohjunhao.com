import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { ProjectDetail } from "@/components/project-detail";
import { getProject } from "@/lib/stock";

type Params = { slug: string };

export default async function InterceptedProject(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <Modal wide={Boolean(project.embed)}>
      <ProjectDetail project={project} contextual />
    </Modal>
  );
}
