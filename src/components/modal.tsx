"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const close = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
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
        className="absolute inset-0 bg-ink/30 backdrop-blur-[3px] cursor-default"
      />
      <div
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
          type="button"
          onClick={close}
          aria-label="Close article"
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
