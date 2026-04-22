import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { CuratedDetail } from "@/components/curated-detail";
import { getCurated } from "@/lib/stock";

type Params = { slug: string };

export default async function InterceptedCurated(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const item = getCurated(slug);
  if (!item) notFound();
  return (
    <Modal>
      <CuratedDetail item={item} />
    </Modal>
  );
}
