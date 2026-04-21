import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { LedgerList, LedgerRow } from "@/components/ledger-row";
import { AsciiHero } from "@/components/ascii-hero";
import { RevealStack, RevealChild } from "@/components/reveal";
import { articles } from "@/lib/articles";
import { investments } from "@/lib/stock";
import { site, nav } from "@/lib/site";

export default function Home() {
  const recent = articles.slice(0, 3);
  const investmentCount = investments.length;

  return (
    <PageShell showNav={false}>
      {/* Hero */}
      <section className="pt-6 pb-14">
        <div className="grid md:grid-cols-[1fr_auto] md:gap-10 gap-6 items-start">
          <RevealStack className="min-w-0">
            <RevealChild>
              <div className="mono text-[0.7rem] text-accent tracking-[0.2em] uppercase mb-6">
                00 / home
              </div>
            </RevealChild>
            <RevealChild>
              <h1 className="font-serif text-[clamp(2.25rem,5vw,3.4rem)] leading-[1.05] tracking-tight font-medium">
                Koh Jun Hao
              </h1>
            </RevealChild>
            <RevealChild>
              <p className="mt-4 max-w-2xl text-[1.12rem] leading-relaxed text-muted">
                Computer Science student at{" "}
                <span className="text-ink">
                  {site.education.school}
                </span>
                , writing and investing from {site.location}. Early-stage
                cheques into teams at the edges of crypto, DeFi, and AI &mdash;{" "}
                <span className="text-ink">
                  {investmentCount} companies
                </span>{" "}
                to date. Long-form research published as{" "}
                <a
                  href={site.links.paragraph}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent transition-colors"
                >
                  @{site.handle.paragraph}
                </a>
                .
              </p>
            </RevealChild>
            <RevealChild>
              <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2 mono text-[0.72rem] text-muted tracking-wider uppercase">
                <span className="text-accent">─ now</span>
                <span>{site.location}</span>
                <span className="opacity-40">·</span>
                <span>{site.status}</span>
                <span className="opacity-40">·</span>
                <span className="opacity-80">
                  press{" "}
                  <kbd className="border border-rule px-1 py-[1px] rounded-sm text-[0.62rem] normal-case">
                    ⌘K
                  </kbd>{" "}
                  to navigate
                </span>
              </div>
            </RevealChild>
          </RevealStack>

          <div className="hidden md:flex flex-col items-end gap-2">
            <AsciiHero size={220} />
            <div className="mono text-[0.58rem] text-muted/70 tracking-widest uppercase">
              figure i &middot; seal, rotating
            </div>
          </div>
        </div>

        {/* Mobile ASCII — smaller, below bio */}
        <div className="md:hidden mt-8 flex justify-center">
          <AsciiHero size={180} />
        </div>
      </section>

      {/* Index / ledger of surfaces */}
      <section className="mb-16">
        <SectionHeader index="01" title="Index" right="08 entries" />
        <div className="mt-6">
          <LedgerList>
            {nav.map((n) => (
              <LedgerRow
                key={n.slug}
                data={{
                  left: n.index,
                  mid: n.label,
                  right: (n.note ?? "").toUpperCase(),
                  href: `/${n.slug}`,
                }}
                tabular
              />
            ))}
          </LedgerList>
        </div>
      </section>

      {/* Recent articles */}
      <section className="mb-16">
        <SectionHeader
          index="02"
          title="Recent articles"
          href="/articles"
          right={`${articles.length} total`}
        />
        <div className="mt-6">
          <LedgerList>
            {recent.map((a, i) => (
              <LedgerRow
                key={a.slug}
                data={{
                  left: String(i + 1).padStart(2, "0"),
                  mid: a.title,
                  note: a.subtitle,
                  right: a.dateLabel,
                  href: `/articles/${a.slug}`,
                }}
                tabular
              />
            ))}
          </LedgerList>
          <div className="mt-5">
            <Link
              href="/articles"
              className="group inline-flex items-baseline gap-2 mono text-[0.72rem] text-accent tracking-wider uppercase active:scale-[0.96] transition-transform duration-150"
            >
              <span className="relative">
                all articles
                <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
              <span aria-hidden className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* About / contact */}
      <section className="mb-10">
        <SectionHeader index="03" title="Elsewhere" />
        <div className="mt-6 prose-aizome">
          <p>
            I publish most long-form research at{" "}
            <a
              href={`https://paragraph.com/@${site.handle.paragraph}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              paragraph.com/@{site.handle.paragraph}
            </a>
            . Shorter notes live on this site&rsquo;s blog. For the system that
            typesets all of it, see{" "}
            <Link href="/design">the Aizome design notes</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
