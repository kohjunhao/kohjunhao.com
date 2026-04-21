import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Hairline } from "@/components/hairline";
import { site } from "@/lib/site";
import { investments } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Resume",
  description: "Background, education, and focus areas.",
};

export default function ResumePage() {
  return (
    <PageShell>
      {/* Header */}
      <section className="mb-10">
        <SectionHeader index="07" title="Resume" right="background" />
        <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-6 items-baseline">
          <div>
            <div className="font-serif text-[1.7rem] font-medium leading-tight">
              {site.name}
            </div>
            <div className="mono text-[0.72rem] text-muted tracking-wider uppercase mt-1">
              {site.tagline} &middot; {site.location}
            </div>
          </div>
          <div className="mono text-[0.68rem] text-muted tracking-wider uppercase">
            v. {site.lastUpdated}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-12">
        <SectionHeader index="·" title="Education" />
        <Hairline className="mt-4" />
        <div className="pt-4 grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-6">
          <div>
            <div className="font-serif text-[1.05rem]">
              {site.education.school}
            </div>
            <div className="mono text-[0.7rem] text-muted tracking-wider uppercase mt-1">
              {site.education.degree} &middot; {site.education.focus}
            </div>
          </div>
          <div className="mono text-[0.7rem] text-muted tracking-wider uppercase whitespace-nowrap">
            {site.education.years}
          </div>
        </div>
      </section>

      {/* Practice */}
      <section className="mb-12">
        <SectionHeader index="·" title="Practice" />
        <Hairline className="mt-4" />
        <div className="pt-4 grid gap-5">
          <Role
            title="Angel investor"
            venue="Personal capital · crypto, DeFi, AI"
            years="2023 – Present"
            bullets={[
              `${investments.length} early-stage cheques across infrastructure, DeFi, and AI`,
              "Technical diligence on consensus, tokenomics, and go-to-market",
              "Mentoring founders from pre-seed through first product",
            ]}
          />
          <Role
            title="Writing · 0xvega"
            venue="Paragraph · long-form DeFi research"
            years="2022 – Present"
            bullets={[
              "Analytical write-ups on ve-models, L2 scaling, and DeFi primitives",
              "Published via paragraph.com/@0xvega",
            ]}
          />
        </div>
      </section>

      {/* Focus */}
      <section className="mb-12">
        <SectionHeader index="·" title="Focus" />
        <Hairline className="mt-4" />
        <div className="pt-4 grid sm:grid-cols-3 gap-6">
          <FocusColumn
            label="Blockchain"
            items={[
              "Consensus mechanisms",
              "Smart contracts",
              "Interoperability",
              "Scalability",
            ]}
          />
          <FocusColumn
            label="Computer Science"
            items={[
              "Distributed systems",
              "Cryptography",
              "Algorithms",
              "System design",
            ]}
          />
          <FocusColumn
            label="Finance"
            items={[
              "Market structure",
              "Risk assessment",
              "Tokenomics",
              "DeFi protocols",
            ]}
          />
        </div>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <SectionHeader index="·" title="Contact" />
        <Hairline className="mt-4" />
        <ul className="pt-4 grid gap-2">
          <ContactRow label="X / Twitter" handle={`@${site.handle.x}`} href={site.links.twitter} />
          <ContactRow label="Telegram" handle={`@${site.handle.telegram}`} href={site.links.telegram} />
          <ContactRow label="LinkedIn" handle={`/in/${site.handle.linkedin}`} href={site.links.linkedin} />
          <ContactRow label="GitHub" handle={`@${site.handle.github}`} href={site.links.github} />
          <ContactRow label="Paragraph" handle={`@${site.handle.paragraph}`} href={site.links.paragraph} />
        </ul>
      </section>
    </PageShell>
  );
}

function Role({
  title,
  venue,
  years,
  bullets,
}: {
  title: string;
  venue: string;
  years: string;
  bullets: string[];
}) {
  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-x-6 gap-y-2">
      <div>
        <div className="font-serif text-[1.05rem]">{title}</div>
        <div className="mono text-[0.7rem] text-muted tracking-wider uppercase mt-0.5">
          {venue}
        </div>
        <ul className="mt-3 grid gap-1">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] gap-3 font-serif text-[0.98rem] leading-snug"
            >
              <span className="mono text-[0.7rem] text-accent tracking-wider pt-1">
                ·
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mono text-[0.7rem] text-muted tracking-wider uppercase whitespace-nowrap sm:text-right">
        {years}
      </div>
    </div>
  );
}

function FocusColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="mono text-[0.66rem] text-accent tracking-wider uppercase mb-2">
        {label}
      </div>
      <ul className="grid gap-1">
        {items.map((it) => (
          <li key={it} className="font-serif text-[0.98rem] leading-snug">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  label,
  handle,
  href,
}: {
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <li className="grid grid-cols-[8rem_1fr_auto] items-baseline gap-4 py-1.5 border-b border-rule">
      <span className="mono text-[0.7rem] text-muted tracking-wider uppercase">
        {label}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-serif text-[1rem] hover:text-accent transition-colors"
      >
        {handle}
      </a>
      <span
        aria-hidden
        className="mono text-[0.68rem] text-muted tracking-wider"
      >
        ↗
      </span>
    </li>
  );
}
