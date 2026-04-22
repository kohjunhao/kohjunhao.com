"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, site } from "@/lib/site";
import { articles } from "@/lib/articles";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const openExternal = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        title="Search (⌘K)"
        className="mono text-[0.66rem] tracking-[0.28em] uppercase text-muted hover:text-accent transition-colors active:scale-[0.96] duration-150"
      >
        <span>⌘K</span>
        <span className="hidden sm:inline"> · search</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="cmd-shell"
            className="fixed inset-0 z-[60] flex items-start justify-center pt-[14vh] px-4"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
          >
            <button
              type="button"
              aria-label="Close palette"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/30 backdrop-blur-[3px] cursor-default"
            />
            <motion.div
              key="cmd-dialog"
              initial={
                reduce
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: -8, filter: "blur(3px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 0, y: -8, filter: "blur(3px)" }
              }
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              className="relative w-full max-w-[36rem] bg-canvas border border-rule"
            >
              <Command label="Site navigator" className="w-full">
                <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                  <span className="mono text-[0.68rem] text-accent tracking-wider">
                    →
                  </span>
                  <Command.Input
                    autoFocus
                    aria-label="Search site"
                    placeholder="Jump to a section, article, or link…"
                    className="flex-1 bg-transparent outline-none font-serif text-[1rem] text-ink placeholder:text-muted/70"
                  />
                  <kbd className="mono text-[0.6rem] text-muted tracking-wider border border-rule px-1.5 py-[1px] rounded-sm">
                    ESC
                  </kbd>
                </div>
                <div className="hairline" />
                <Command.List className="max-h-[50vh] overflow-y-auto py-2">
                  <Command.Empty className="px-4 py-5 mono text-[0.7rem] text-muted tracking-wider">
                    ─ no match ─
                  </Command.Empty>

                  <Command.Group
                    heading="Sections"
                    className="[&_[cmdk-group-heading]]:mono [&_[cmdk-group-heading]]:text-[0.6rem] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2"
                  >
                    <CommandRow onSelect={() => go("/")} left="00" label="Home" />
                    {nav.map((n) => (
                      <CommandRow
                        key={n.slug}
                        onSelect={() => go(`/${n.slug}`)}
                        left={n.index}
                        label={n.label}
                        hint={n.note}
                      />
                    ))}
                  </Command.Group>

                  <Command.Group
                    heading="Articles"
                    className="[&_[cmdk-group-heading]]:mono [&_[cmdk-group-heading]]:text-[0.6rem] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2"
                  >
                    {articles.map((a, i) => (
                      <CommandRow
                        key={a.slug}
                        onSelect={() => go(`/articles/${a.slug}`)}
                        left={String(i + 1).padStart(2, "0")}
                        label={a.title}
                        hint={a.dateLabel}
                      />
                    ))}
                  </Command.Group>

                  <Command.Group
                    heading="Elsewhere"
                    className="[&_[cmdk-group-heading]]:mono [&_[cmdk-group-heading]]:text-[0.6rem] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2"
                  >
                    <CommandRow
                      onSelect={() =>
                        openExternal(
                          `https://paragraph.com/@${site.handle.paragraph}`
                        )
                      }
                      left="↗"
                      label="Paragraph"
                      hint={`@${site.handle.paragraph}`}
                    />
                    <CommandRow
                      onSelect={() =>
                        openExternal(`https://x.com/${site.handle.x}`)
                      }
                      left="↗"
                      label="X"
                      hint={`@${site.handle.x}`}
                    />
                  </Command.Group>
                </Command.List>
                <div className="hairline" />
                <div className="flex items-center justify-between px-4 py-2 mono text-[0.58rem] text-muted tracking-wider uppercase">
                  <span>Aizome navigator</span>
                  <span className="flex items-center gap-2">
                    <kbd className="border border-rule px-1 py-[1px]">↑↓</kbd>
                    <span>move</span>
                    <kbd className="border border-rule px-1 py-[1px]">↵</kbd>
                    <span>open</span>
                  </span>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const CommandPaletteTrigger = CommandPalette;

function CommandRow({
  onSelect,
  left,
  label,
  hint,
}: {
  onSelect: () => void;
  left: string;
  label: string;
  hint?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="
        group grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-3 px-4 py-2
        cursor-default border-l-2 border-transparent
        data-[selected=true]:bg-surface data-[selected=true]:border-accent
        aria-selected:bg-surface
        transition-colors duration-100
      "
    >
      <span className="mono text-[0.7rem] text-accent tracking-wider">
        {left}
      </span>
      <span className="font-serif text-[0.98rem] leading-snug text-ink group-data-[selected=true]:text-accent">
        {label}
      </span>
      {hint && (
        <span className="mono text-[0.6rem] text-muted tracking-wider uppercase">
          {hint}
        </span>
      )}
    </Command.Item>
  );
}
