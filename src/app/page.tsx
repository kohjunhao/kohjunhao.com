import Link from "next/link";
import { Activity } from "@/components/activity";
import { LogFeed } from "@/components/log-feed";
import { TopBar } from "@/components/top-bar";
import { log } from "@/content/log";
import { buildCalendar } from "@/lib/calendar";
import { sections, site } from "@/lib/site";
import { investments } from "@/lib/stock";

const SECTION_COUNTS: Partial<Record<string, number>> = {
  "/investments": investments.length,
};

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="v3-rule" aria-hidden />

      <main id="main">
        <section className="v3-frame v3-intro">
          <div>
            <h1 className="v3-label">{site.name}</h1>
            <p className="v3-line">Ships things. This is the log.</p>
            <p className="v3-facts">
              Analyst at Ouroboros Capital. Building{" "}
              <a href="https://fullmarks.sg" target="_blank" rel="noopener noreferrer">
                FullMarks
              </a>{" "}
              and{" "}
              <a href="https://groundcrewrobotics.com" target="_blank" rel="noopener noreferrer">
                Groundcrew Robotics
              </a>
              . Angel in <Link href="/investments">{investments.length} companies</Link>.
            </p>
          </div>

          <nav className="v3-rows" aria-label="Pages">
            {sections.map(({ label, href }) => (
              <Link key={href} href={href} className="v3-row">
                <span>
                  {label}
                  {SECTION_COUNTS[href] !== undefined && (
                    <>
                      {" "}
                      <span className="v3-row-count">{SECTION_COUNTS[href]}</span>
                    </>
                  )}
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path
                    d="M5.5 3 9.5 7l-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </nav>
        </section>

        <div className="v3-rule" aria-hidden />
        <Activity calendar={buildCalendar()} />

        <div className="v3-rule" aria-hidden />
        <LogFeed entries={log} />
      </main>

      <div className="v3-rule" aria-hidden />
    </>
  );
}
