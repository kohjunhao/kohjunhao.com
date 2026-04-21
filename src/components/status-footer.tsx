"use client";

import { site } from "@/lib/site";
import { articles } from "@/lib/articles";
import { Hairline } from "./hairline";
import { HankoSeal } from "./hanko-seal";

export function StatusFooter() {
  const lastDispatch = [...articles].sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0];

  return (
    <footer className="mt-24 mb-10">
      <Hairline />
      <div className="pt-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="mono text-[0.68rem] text-muted tracking-wider grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-5">
          <div className="flex items-baseline gap-2">
            <span className="opacity-60">LAST UPDATED</span>
            <span className="text-ink">{site.lastUpdated}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="opacity-60">LOCATION</span>
            <span className="text-ink">{site.location.toUpperCase()}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="opacity-60">STATUS</span>
            <span className="text-ink">{site.status.toUpperCase()}</span>
          </div>
          {lastDispatch && (
            <div className="flex items-baseline gap-2">
              <span className="opacity-60">LAST DISPATCH</span>
              <span className="text-ink">
                {lastDispatch.dateLabel} · {lastDispatch.venue.toLowerCase()}
              </span>
            </div>
          )}
        </div>
        <HankoSeal timestamp={`built ${site.lastUpdated}`} />
      </div>
      <div className="mono text-[0.64rem] text-muted/60 tracking-wider pt-4">
        &copy; {new Date().getFullYear()} Koh Jun Hao &middot; typeset in the
        Aizome system
      </div>
    </footer>
  );
}
