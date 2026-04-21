"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A hairline rule that draws itself from left to right when it enters the
 * viewport. Digital echo of ink spreading across washi.
 */
export function SelfDrawingRule({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`h-px bg-rule origin-left ${className}`}
      initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    />
  );
}

/**
 * Generic stagger container — children marked with <RevealChild> fade-up into
 * place with 100ms stagger. Honors prefers-reduced-motion.
 */
export function RevealStack({
  children,
  stagger = 0.08,
  delayChildren = 0,
  className = "",
}: {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealChild({
  children,
  className = "",
  y = 10,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring" as const, duration: 0.55, bounce: 0 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
