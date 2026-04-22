import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { InvestmentDetail } from "@/components/investment-detail";
import { getInvestment } from "@/lib/stock";

type Params = { slug: string };

export default async function InterceptedInvestment(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const inv = getInvestment(slug);
  if (!inv) notFound();
  return (
    <Modal>
      <InvestmentDetail inv={inv} />
    </Modal>
  );
}
