import { Archivo } from "next/font/google";
import Link from "next/link";
import { ShipLog } from "@/components/ship-log";
import { log } from "@/content/log";
import { buildCalendar } from "@/lib/calendar";
import { site } from "@/lib/site";
import { investments } from "@/lib/stock";
import "./v2.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const SECTIONS = [
  { label: "Log", href: "#log" },
  { label: "Investments", href: "/investments" },
  { label: "Shelf", href: "/books" },
  { label: "Writing", href: "/articles" },
];

const ELSEWHERE = [
  { label: "X", href: site.links.twitter },
  { label: "Telegram", href: site.links.telegram },
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Paragraph", href: site.links.paragraph },
];

export default function Home() {
  const calendar = buildCalendar(log);

  return (
    <div className={`v2 ${archivo.variable}`}>
      <div className="v2-wrap">
        <header className="v2-top">
          <span className="v2-mono">kohjunhao.com</span>
          <nav className="v2-nav v2-mono" aria-label="Sections">
            {SECTIONS.map(({ label, href }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main">
          <h1 className="v2-name">{site.name}</h1>
          <p className="v2-line">
            ships things. <span>This is the log.</span>
          </p>
          <p className="v2-facts">
            Operator at Ouroboros Capital. Building{" "}
            <a href="https://fullmarks.sg" target="_blank" rel="noopener noreferrer">
              FullMarks
            </a>{" "}
            and{" "}
            <a href="https://groundcrewrobotics.com" target="_blank" rel="noopener noreferrer">
              Groundcrew Robotics
            </a>
            . Angel in <Link href="/investments">{investments.length} companies</Link>.
          </p>

          <ShipLog calendar={calendar} entries={log} />
        </main>

        <footer className="v2-foot v2-mono">
          <span>
            {site.name} · {site.location} · Studying {site.education.degree} at the {site.education.school}
          </span>
          <nav aria-label="Elsewhere">
            {ELSEWHERE.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
}
