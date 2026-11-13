"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { plateModel } from "@/lib/plate";
import { applyFrame, PLATE_IDS } from "./plate-paint";

const model = plateModel();

// The server cannot know the visitor's clock, so its HTML shows noon. The inline script that
// follows the plate repaints it before first paint, and React never re-renders these values.
const NOON = 12 * 60;
const SERVER = model.frame(NOON, 0);

const LIVE_REFRESH_MS = 30_000;

const IMAGE = {
  small: "/plate/singapore-1828-1300.webp",
  large: "/plate/singapore-1828-2600.webp",
  width: 2600,
  height: 787,
};
// The plate is at most 1176px wide; on phones it crops a 3.3 to 1 picture into a 2.05 to 1 frame,
// so the picture is drawn about 1.61 times the screen's width.
const IMAGE_SIZES = "(max-width: 820px) 161vw, 1176px";

const STAR_COUNT = 26;
const STAR_SEED = 7;
// Stars sit in the top 46% of the plate, where the engraving is open sky.
const STAR_BAND = 46;

/** A fixed scatter of stars, the same on every build. */
function scatterStars() {
  let seed = STAR_SEED;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: STAR_COUNT }, () => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * STAR_BAND).toFixed(2)}%`,
    size: rand() > 0.8 ? 2 : 1,
  }));
}

const STARS = scatterStars();

export function Plate() {
  // The minute the slider is held at, or null to follow the clock.
  const [scrubbed, setScrubbed] = useState<number | null>(null);

  useEffect(() => {
    if (scrubbed !== null) {
      applyFrame(model.frame(scrubbed, Date.now()), scrubbed, PLATE_IDS);
      return;
    }
    const paintNow = () => {
      const now = new Date();
      const minute = model.singaporeMinute(now);
      applyFrame(model.frame(minute, now.getTime()), minute, PLATE_IDS);
    };
    paintNow();
    const timer = window.setInterval(paintNow, LIVE_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [scrubbed]);

  return (
    <>
      <figure
        id={PLATE_IDS.plate}
        className="plate"
        style={{ "--sky": SERVER.sky, "--night": SERVER.night } as CSSProperties}
        suppressHydrationWarning
      >
        <div className="stars">
          {STARS.map((s, i) => (
            <i key={i} style={{ left: s.left, top: s.top, "--s": `${s.size}px` } as CSSProperties} />
          ))}
        </div>
        <div
          id={PLATE_IDS.orb}
          className="orb"
          style={{ left: SERVER.left, top: SERVER.top, width: SERVER.size, height: SERVER.size }}
          dangerouslySetInnerHTML={{ __html: SERVER.svg }}
          suppressHydrationWarning
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- two pre-sized WebP files; the optimiser would only re-encode them */}
        <img
          src={IMAGE.small}
          srcSet={`${IMAGE.small} 1300w, ${IMAGE.large} 2600w`}
          sizes={IMAGE_SIZES}
          width={IMAGE.width}
          height={IMAGE.height}
          alt="An 1828 engraving of Singapore harbour"
          fetchPriority="high"
        />
      </figure>
      <div className="under">
        <span className="t">
          {scrubbed !== null && (
            <button type="button" onClick={() => setScrubbed(null)}>
              Back to now
            </button>
          )}
          <input
            id={PLATE_IDS.hour}
            type="range"
            min={0}
            max={model.MINUTES_PER_DAY - 1}
            step={1}
            defaultValue={NOON}
            aria-label="Hour of the day"
            onChange={(e) => setScrubbed(Number(e.currentTarget.value))}
            suppressHydrationWarning
          />
          <span>
            Singapore{" "}
            <b id={PLATE_IDS.clock} suppressHydrationWarning>
              {SERVER.clock}
            </b>
          </span>
        </span>
      </div>
    </>
  );
}
