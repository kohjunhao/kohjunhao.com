"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      window.localStorage.setItem("theme", next);
    } catch {}
  };

  if (!theme) {
    return <span aria-hidden className="inline-block w-[1.25rem] h-[1.25rem]" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group inline-flex items-center justify-center size-6 text-muted hover:text-accent active:scale-[0.92] transition-all duration-150 border border-rule hover:border-accent rounded-sm"
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="w-[0.95rem] h-[0.95rem]"
      aria-hidden
    >
      <circle cx="8" cy="8" r="2.6" fill="currentColor" stroke="none" />
      <g strokeLinecap="round">
        <line x1="8" y1="1.5" x2="8" y2="3.4" />
        <line x1="8" y1="12.6" x2="8" y2="14.5" />
        <line x1="1.5" y1="8" x2="3.4" y2="8" />
        <line x1="12.6" y1="8" x2="14.5" y2="8" />
        <line x1="3.4" y1="3.4" x2="4.8" y2="4.8" />
        <line x1="11.2" y1="11.2" x2="12.6" y2="12.6" />
        <line x1="3.4" y1="12.6" x2="4.8" y2="11.2" />
        <line x1="11.2" y1="4.8" x2="12.6" y2="3.4" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-[0.95rem] h-[0.95rem]"
      aria-hidden
      fill="currentColor"
    >
      <path d="M6 2.4A6.3 6.3 0 0 0 9 14.4a6.3 6.3 0 0 0 5.5-3.2A5.3 5.3 0 0 1 6 2.4Z" />
    </svg>
  );
}
