"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    // Save the element that opened the modal so we can restore focus later.
    const prevActive = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap — cycle between focusable elements inside the dialog.
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, textarea, select'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the modal on mount.
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Restore focus to whatever opened the modal.
      try {
        prevActive?.focus();
      } catch {}
    };
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        tabIndex={-1}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[3px] cursor-default"
      />
      <div
        ref={dialogRef}
        className="
          relative bg-canvas flex flex-col overflow-hidden
          w-full h-full
          sm:w-[calc(100vw-3rem)] sm:h-[calc(100vh-3rem)]
          md:w-[calc(100vw-5rem)] md:h-[calc(100vh-5rem)]
          lg:max-w-[1400px]
          sm:border sm:border-rule
        "
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="
            absolute top-3 right-3 sm:top-5 sm:right-5 z-20
            size-10 sm:size-9
            flex items-center justify-center
            text-muted hover:text-ink hover:bg-surface
            transition-colors rounded-sm
            mono text-[1.25rem] sm:text-[1rem]
            border border-rule sm:border-transparent
            bg-canvas/80 backdrop-blur-sm
          "
        >
          ×
        </button>
        <div className="overflow-y-auto flex-1 px-6 sm:px-10 md:px-16 lg:px-24 py-10 sm:py-14 md:py-16">
          <div className="mx-auto max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
