import Link from "next/link";
import { FoldLink } from "@/components/fold-link";
import { Fold } from "@/components/fold";
import { HomeFolds } from "@/components/home-folds";
import { LogList } from "@/components/log-list";
import { Plate } from "@/components/plate";
import { PAINT_NOW } from "@/components/plate-paint";
import { CompanyList, EssayList } from "@/components/rows";
import { articles, writingSummary } from "@/lib/articles";
import { int, oneDecimal } from "@/lib/format";
import { lead } from "@/lib/lead";
import { logMonths, logSummary } from "@/lib/log";
import { companies, portfolioSummary } from "@/lib/portfolio";
import { filmHours, shelves } from "@/lib/shelf";
import { site } from "@/lib/site";

const STRIP_LENGTH = 14;

const CONTACT = [
  { label: "Telegram", href: site.links.telegram },
  { label: "X", href: site.links.twitter },
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Paragraph", href: site.links.paragraph },
];

const { films, games, books } = shelves;
const strip = films.items.filter((f) => f.cover).slice(0, STRIP_LENGTH);
const shelfSummary = `${int(films.items.length)} films, ${int(games.items.length)} games, ${int(books.items.length)} books.`;

function Lead() {
  return (
    <p className="lead">
      {lead.map((part, i) => {
        if (typeof part === "string") {
          return part;
        }
        if ("fold" in part) {
          return (
            <FoldLink key={i} fold={part.fold}>
              {part.text}
            </FoldLink>
          );
        }
        return (
          <a key={i} href={part.href}>
            {part.text}
          </a>
        );
      })}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <Plate />
      <script dangerouslySetInnerHTML={{ __html: PAINT_NOW }} />

      <div className="grid">
        <div className="lab">About</div>
        <Lead />

        <div className="lab">Index</div>
        <div className="index">
          <Fold id="log" summary={logSummary}>
            <LogList months={logMonths} />
          </Fold>

          <Fold id="portfolio" summary={portfolioSummary}>
            <CompanyList companies={companies} />
            <Link className="link after" href="/investments">
              Open the full list
            </Link>
          </Fold>

          <Fold id="shelf" summary={shelfSummary}>
            <div className="shelf">
              <Link href="/films">
                Films <span>{`${int(films.items.length)}, ${oneDecimal(filmHours)} hours`}</span>
              </Link>
              <Link href="/games">
                Games <span>{int(games.items.length)}</span>
              </Link>
              <Link href="/books">
                Books <span>{int(books.items.length)}</span>
              </Link>
            </div>
            <div className="strip">
              {strip.map((f) => (
                <Link key={f.key} href="/films">
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized covers; the optimiser would only re-encode them */}
                  <img src={f.cover!.src} width={f.cover!.w} height={f.cover!.h} alt={f.title} loading="lazy" decoding="async" />
                </Link>
              ))}
            </div>
          </Fold>

          <Fold id="writing" summary={writingSummary}>
            <EssayList articles={articles} />
          </Fold>
        </div>

        <div className="lab c" id="contact">
          Contact
        </div>
        <div className="contact">
          {CONTACT.map((c) => (
            <a key={c.label} href={c.href}>
              {c.label}
            </a>
          ))}
        </div>
      </div>
      <HomeFolds />
    </>
  );
}
