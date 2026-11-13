import { plateModel, type PlateFrame } from "@/lib/plate";

export const PLATE_IDS = {
  plate: "plate",
  orb: "plate-orb",
  hour: "plate-hour",
  clock: "plate-clock",
} as const;

type PlateIds = typeof PLATE_IDS;

/**
 * Writes one frame onto the plate's elements. Self-contained, like the model, because the page
 * also inlines it to paint before React loads.
 */
export function applyFrame(f: PlateFrame, minute: number, ids: PlateIds) {
  const plate = document.getElementById(ids.plate);
  const orb = document.getElementById(ids.orb);
  const hour = document.getElementById(ids.hour) as HTMLInputElement | null;
  const clock = document.getElementById(ids.clock);
  if (!plate || !orb || !hour || !clock) {
    return;
  }
  plate.style.setProperty("--sky", f.sky);
  plate.style.setProperty("--night", f.night);
  orb.style.left = f.left;
  orb.style.top = f.top;
  orb.style.width = f.size;
  orb.style.height = f.size;
  orb.innerHTML = f.svg;
  hour.value = String(minute);
  clock.textContent = f.clock;
}

/** The inline script: paints the current Singapore minute the moment the plate's markup exists. */
export const PAINT_NOW = `(function(m,apply,ids){var t=new Date(),min=m.singaporeMinute(t);apply(m.frame(min,t.getTime()),min,ids);})((${plateModel})(),${applyFrame},${JSON.stringify(PLATE_IDS)});`;
