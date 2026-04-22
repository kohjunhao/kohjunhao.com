/**
 * V7 hanko — SVG seal with procedural grain (feTurbulence), 印 character,
 * optional wobble animation for the 404 page.
 */
export function HankoSeal({
  size = 64,
  wobble = false,
  className = "",
}: {
  size?: number;
  wobble?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{
        color: "var(--hanko)",
        animation: wobble ? "hanko-wobble 3.2s ease-in-out infinite" : "none",
        transformOrigin: "center",
      }}
      aria-hidden
    >
      <defs>
        <filter id="hanko-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feColorMatrix values="0 0 0 0 0.545  0 0 0 0 0.227  0 0 0 0 0.227  0 0 0 0.4 0" />
        </filter>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="4" fill="currentColor" />
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="4"
        fill="currentColor"
        filter="url(#hanko-grain)"
        opacity="0.5"
      />
      <text
        x="50"
        y="66"
        fontSize="54"
        textAnchor="middle"
        fontFamily="serif"
        fill="var(--canvas)"
        fontWeight="600"
      >
        印
      </text>
    </svg>
  );
}
