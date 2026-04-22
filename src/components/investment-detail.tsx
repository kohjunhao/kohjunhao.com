import type { Investment } from "@/lib/stock";
import { DetailShell, DetailEmpty, DetailProse } from "./detail-shell";

export function InvestmentDetail({ inv }: { inv: Investment }) {
  const meta = [inv.sector, inv.year, inv.featured ? "featured" : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <DetailShell
      eyebrow={inv.featured ? "investment · featured" : "investment"}
      meta={meta}
      title={inv.name}
      subtitle={inv.note}
    >
      {inv.url ? (
        <>
          <DetailProse
            text={`${inv.note ?? inv.name} — an early cheque into this team; follow the thesis live at the link below.`}
          />
          <div className="mt-6">
            <a
              href={inv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-[0.7rem] tracking-[0.2em] uppercase text-accent hover:underline decoration-1 underline-offset-4"
            >
              {inv.url.replace(/^https?:\/\//, "")} ↗
            </a>
          </div>
        </>
      ) : (
        <DetailEmpty prompt="Part of the broader portfolio. Full thesis notes aren't public for this one yet." />
      )}
    </DetailShell>
  );
}
