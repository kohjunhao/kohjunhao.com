import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";

export const metadata: Metadata = {
  title: "Games",
  description:
    "What I'm playing — Steam, Switch, PS5. Full integration lands in a later ship; this is the placeholder.",
};

export default function GamesPage() {
  return (
    <PageShell>
      <section className="mb-10">
        <SectionHeader index="03" title="Games" right="pending · v5 step 8" />
        <p className="prose-aizome mt-5">
          A public log of what I&rsquo;m playing &mdash; Steam sessions,
          Switch hours, the occasional retro rabbit hole. The page is scoped
          but not yet live while Steam integration is wired up.
        </p>
      </section>

      <section className="mb-10">
        <Hairline />
        <div className="py-10 mono text-[0.72rem] tracking-[0.2em] uppercase text-muted text-center">
          ─ steam integration pending ─
        </div>
        <Hairline />
      </section>
    </PageShell>
  );
}
