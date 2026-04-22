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
    return (
      <span
        aria-hidden
        className="mono text-[0.66rem] tracking-[0.28em] uppercase text-muted w-8"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="mono text-[0.66rem] tracking-[0.28em] uppercase text-muted hover:text-accent transition-colors active:scale-[0.96] duration-150"
    >
      {theme === "dark" ? "☾ dark" : "☀ light"}
    </button>
  );
}
