export function GridMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="3" fill="#fff" stroke="#101114" strokeWidth="1.4" />
      <path d="M1 7.5h18M1 13h18M7.5 1v18M13 1v18" stroke="#101114" strokeWidth="1" opacity=".28" />
      <rect x="7.5" y="7.5" width="5.5" height="5.5" fill="#ffe14d" stroke="#101114" strokeWidth="1.4" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2" y="5.2" width="8" height="5.6" rx="1.2" fill="currentColor" />
      <path d="M3.8 5.2V3.6a2.2 2.2 0 0 1 4.4 0v1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2.5v7.5M4.8 7 8 10.2 11.2 7M3 12.8h10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="m10.2 10.2 3.3 3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** The eight square handles drawn around a selected picture or text box. */
export function Handles() {
  return (
    <>
      {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((at) => (
        <span key={at} className={`handle h-${at}`} aria-hidden="true" />
      ))}
    </>
  );
}
