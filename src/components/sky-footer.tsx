import Link from "next/link";
import { buildCalendar, shortDay } from "@/lib/calendar";
import { sections, site } from "@/lib/site";

type FooterLink = { label: string; href?: string; icon?: string };

const SOURCE = "https://github.com/kohjunhao/kohjunhao.com";
const ART_CREDIT =
  "https://commons.wikimedia.org/wiki/File:View_of_the_town_and_roads_of_Singapore_from_the_government_hill_published_1828.jpg";

const ELSEWHERE: FooterLink[] = [
  {
    label: "X",
    href: site.links.twitter,
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Telegram",
    href: site.links.telegram,
    icon: "M21.6 3.3 2.7 10.6c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.9 5.7c.2.6.4.9.9.9.4 0 .6-.2.9-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8l3.2-15.2c.3-1.3-.5-1.9-1.4-1.6zM9.4 14.3l8.9-5.6c.4-.3.8-.1.5.2l-7.4 6.7-.3 3.1z",
  },
  {
    label: "GitHub",
    href: site.links.github,
    icon: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
  },
  {
    label: "LinkedIn",
    href: site.links.linkedin,
    icon: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
  { label: "Paragraph", href: site.links.paragraph },
];

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  { heading: "Site", links: [{ label: "Log", href: "/" }, ...sections] },
  {
    heading: "Building",
    links: [
      { label: "FullMarks", href: "https://fullmarks.sg" },
      { label: "Groundcrew Robotics", href: "https://groundcrewrobotics.com" },
      { label: "Ouroboros Capital" },
      { label: "Yuzu Money" },
    ],
  },
  { heading: "Elsewhere", links: ELSEWHERE },
];

const isExternal = (href: string) => href.startsWith("http");

function FooterItem({ label, href }: FooterLink) {
  if (!href) {
    return <li>{label}</li>;
  }
  if (isExternal(href)) {
    return (
      <li>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href}>{label}</Link>
    </li>
  );
}

function LineIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function SkyFooter() {
  const through = buildCalendar().through;

  return (
    <footer className="sky">
      <div className="sky-grain" aria-hidden />

      <div className="sky-inner">
        <div className="sky-grid">
          <div className="sky-brand">
            <p className="sky-name">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" aria-hidden>
                <path d="M14 0Q15.2 12.8 28 14Q15.2 15.2 14 28Q12.8 15.2 0 14Q12.8 12.8 14 0Z" />
              </svg>
              {site.name}
            </p>
            <p className="sky-tagline">Ships things. This is the log.</p>
            <ul className="sky-facts">
              <li>
                <LineIcon>
                  <path d="M8 14.5s4.5-4.1 4.5-8a4.5 4.5 0 0 0-9 0c0 3.9 4.5 8 4.5 8z" />
                  <circle cx="8" cy="6.5" r="1.6" />
                </LineIcon>
                {site.location}
              </li>
              <li>
                <LineIcon>
                  <path d="M1 6.2 8 3l7 3.2-7 3.2-7-3.2z" />
                  <path d="M4 7.9v3.3c0 .9 1.8 1.8 4 1.8s4-.9 4-1.8V7.9" />
                  <path d="M15 6.2v3.6" />
                </LineIcon>
                Studying {site.education.degree} at the {site.education.school}
              </li>
            </ul>
            <div className="sky-icons">
              {ELSEWHERE.filter((link) => link.icon).map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map(({ heading, links }) => (
            <div key={heading}>
              <h2 className="sky-heading">{heading}</h2>
              <ul className="sky-list">
                {links.map((link) => (
                  <FooterItem key={link.label} {...link} />
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="sky-heading">Colophon</h2>
            <p className="sky-colophon">
              Set in Cal Sans and EB Garamond. The view below is Singapore from Government Hill, drawn by Robert
              James Elliot and{" "}
              <a href={ART_CREDIT} target="_blank" rel="noopener noreferrer">
                published in 1828
              </a>
              .
            </p>
          </div>
        </div>

        <ul className="sky-bottom">
          <li>{site.location}</li>
          <li>
            Updated {shortDay(through)} {through.slice(0, 4)}
          </li>
          <li>
            <a href={SOURCE} target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          </li>
        </ul>
      </div>

      {/* Served as drawn: the image optimiser would re-encode the engraving's fine lines. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="sky-art"
        src="/footer/singapore-1828.webp"
        width="2400"
        height="840"
        alt=""
        loading="lazy"
      />
    </footer>
  );
}
