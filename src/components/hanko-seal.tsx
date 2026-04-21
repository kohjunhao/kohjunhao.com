"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/**
 * Hanko-style SVG seal (印). Muted crimson so it doesn't fight the indigo
 * accent. Rotates ~3deg by default, straightens slightly on hover,
 * revealing a build timestamp below.
 */
export function HankoSeal({
  timestamp,
  className = "",
}: {
  timestamp?: string;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative inline-flex flex-col items-end gap-1 ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.svg
        viewBox="0 0 44 44"
        width={36}
        height={36}
        aria-label="Koh Jun Hao hanko seal"
        animate={
          reduce
            ? {}
            : { rotate: hover ? -1 : -3.5, scale: hover ? 1.04 : 1 }
        }
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="drop-shadow-none"
      >
        <defs>
          <filter id="hanko-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.6"
              numOctaves="2"
              seed="4"
            />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.28" intercept="0" />
            </feComponentTransfer>
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect
          x="1.5"
          y="1.5"
          width="41"
          height="41"
          fill="#8B3A3A"
          rx="1.5"
        />
        <rect
          x="1.5"
          y="1.5"
          width="41"
          height="41"
          fill="#f3f2ed"
          filter="url(#hanko-grain)"
          rx="1.5"
          opacity="0.45"
        />
        <g
          fill="#f3f2ed"
          fontFamily="serif"
          fontWeight="600"
          textAnchor="middle"
          style={{ fontVariantNumeric: "normal" }}
        >
          <text x="22" y="22" fontSize="16" dy="-0.5">
            JH
          </text>
          <text x="22" y="36" fontSize="7.5" letterSpacing="0.5" opacity="0.92">
            印
          </text>
        </g>
      </motion.svg>
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          opacity: hover && !reduce ? 1 : 0,
          y: hover && !reduce ? 0 : -3,
        }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        className="mono text-[0.6rem] tracking-wider text-muted uppercase whitespace-nowrap"
      >
        {timestamp ?? "─"}
      </motion.span>
    </div>
  );
}
