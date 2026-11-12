import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import type { LogEntry } from "@/content/log";
import { shortDay } from "@/lib/calendar";
import { site } from "@/lib/site";

const ART_WIDTH = 2400;
const ART_HEIGHT = 840;

export function Hero({ latest, companies }: { latest: LogEntry; companies: number }) {
  return (
    <section className="hero">
      <div className="sky-grain" aria-hidden />
      <TopBar tone="sky" />

      <div className="hero-inner">
        <div>
          <p className="hero-eyebrow">Port of {site.location} · 1°17′N 103°51′E</p>
          <h1 className="hero-title">
            {site.name} <span>ships things.</span>
          </h1>
        </div>

        <div className="hero-side">
          <p className="hero-facts">
            Analyst at Ouroboros Capital. Building{" "}
            <a href="https://fullmarks.sg" target="_blank" rel="noopener noreferrer">
              FullMarks
            </a>{" "}
            and{" "}
            <a href="https://groundcrewrobotics.com" target="_blank" rel="noopener noreferrer">
              Groundcrew Robotics
            </a>
            . Angel in <Link href="/investments">{companies} companies</Link>.
          </p>
          <a className="hero-last" href="#log">
            <span className="hero-last-label">Last out of port, {shortDay(latest.date)}</span>
            <span className="hero-last-title">{latest.title}</span>
          </a>
        </div>
      </div>

      <figure className="hero-art">
        {/* Served as drawn: the image optimiser would re-encode the engraving's fine lines. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer/singapore-1828.webp"
          srcSet="/footer/singapore-1828-1200.webp 1200w, /footer/singapore-1828.webp 2400w"
          sizes="100vw"
          width={ART_WIDTH}
          height={ART_HEIGHT}
          alt="Singapore harbour seen from Government Hill, an engraving published in 1828"
          fetchPriority="high"
        />
        <figcaption className="hero-fig" aria-hidden>
          <b>Fig. 1</b>
          Things, being shipped.
        </figcaption>
      </figure>
    </section>
  );
}
