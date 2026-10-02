import Link from "next/link";
import { sections, site } from "@/lib/site";

export function TopBar() {
  return (
    <header className="v3-frame v3-top">
      <Link href="/" className="v3-wordmark">
        {site.name}
      </Link>
      <nav className="v3-nav" aria-label="Sections">
        {sections.map(({ label, href }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <a className="v3-hi" href={site.links.telegram} target="_blank" rel="noopener noreferrer">
        Say hi
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M4.5 2.5 8 6l-3.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </header>
  );
}
