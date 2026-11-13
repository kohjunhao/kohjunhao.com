/**
 * The sky behind the 1828 plate at any minute of a Singapore day: its colour, where the sun or
 * moon sits, and the moon's phase.
 *
 * Everything lives inside this one function because the home page inlines its source
 * (`${plateModel}`) in a script that paints the sky before React loads, so a night visit never
 * flashes cream first. Nothing in here may refer to a name outside the function.
 */
export function plateModel() {
  type Rgb = [r: number, g: number, b: number];

  const NIGHT: Rgb = [38, 49, 88];
  const DAWN: Rgb = [232, 198, 187];
  const DAY: Rgb = [247, 244, 234];
  const DUSK: Rgb = [241, 196, 150];
  const KEYS: [hour: number, sky: Rgb][] = [
    [0, NIGHT],
    [5.6, NIGHT],
    [6.5, DAWN],
    [7.6, DAY],
    [17.2, DAY],
    [18.5, DUSK],
    [19.35, NIGHT],
    [24, NIGHT],
  ];

  const SUNRISE = 6.85;
  const SUNSET = 19.05;
  const MINUTES_PER_HOUR = 60;
  const MINUTES_PER_DAY = 1440;

  // How dark the sky is, read off its red channel: 38 is full night, 178 and up is daylight.
  const NIGHT_RED = 38;
  const TWILIGHT_RED_SPAN = 140;

  const SYNODIC_DAYS = 29.530588;
  const DAY_MS = 864e5;
  const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

  const MIN_ORB_RADIUS = 16;
  const ORB_RADIUS_PER_WIDTH = 0.026;
  const SUN_SCALE = 1.15;
  const MOON_SCALE = 0.9;
  const MOONLIGHT = "#f1eede";

  function skyAt(minute: number): Rgb {
    const h = minute / MINUTES_PER_HOUR;
    for (let i = 1; i < KEYS.length; i++) {
      if (h > KEYS[i][0]) {
        continue;
      }
      const [a, from] = KEYS[i - 1];
      const [b, to] = KEYS[i];
      const k = (h - a) / (b - a || 1);
      return [0, 1, 2].map((j) => Math.round(from[j] + (to[j] - from[j]) * k)) as Rgb;
    }
    return KEYS[0][1];
  }

  /** 0 in daylight, 1 at full night. Stars fade in with it. */
  function darkness(sky: Rgb) {
    return 1 - Math.min(1, Math.max(0, (sky[0] - NIGHT_RED) / TWILIGHT_RED_SPAN));
  }

  /**
   * Where the sun or moon sits, as fractions of the plate's width and height. `arc` runs from 0
   * when it rises to 1 when it sets.
   */
  function orbAt(minute: number) {
    const h = minute / MINUTES_PER_HOUR;
    const isDay = h >= SUNRISE && h <= SUNSET;
    const arc = isDay ? (h - SUNRISE) / (SUNSET - SUNRISE) : ((h - SUNSET + 24) % 24) / (24 - SUNSET + SUNRISE);
    return {
      body: isDay ? ("sun" as const) : ("moon" as const),
      arc,
      x: 0.05 + 0.9 * arc,
      y: 0.6 - 0.5 * Math.sin(Math.PI * arc),
    };
  }

  /** Yellow overhead, orange near the horizon. */
  function sunColor(arc: number) {
    const low = Math.pow(1 - Math.sin(Math.PI * arc), 2);
    return `rgb(240,${Math.round(178 - low * 70)},${Math.round(64 - low * 10)})`;
  }

  /** `k` is 1 at new moon and -1 at full moon; the lit share of the disc is (1 - k) / 2. */
  function moonPhase(ms: number) {
    const age = (((ms - KNOWN_NEW_MOON_MS) / DAY_MS) % SYNODIC_DAYS + SYNODIC_DAYS) % SYNODIC_DAYS;
    return { k: Math.cos((2 * Math.PI * age) / SYNODIC_DAYS), waning: age > SYNODIC_DAYS / 2 };
  }

  /** The disc's radius in pixels on a plate this wide. */
  function orbRadius(plateWidth: number, body: "sun" | "moon") {
    const base = Math.max(MIN_ORB_RADIUS, plateWidth * ORB_RADIUS_PER_WIDTH);
    return body === "sun" ? base * SUN_SCALE : Number((base * MOON_SCALE).toFixed(1));
  }

  // An SVG a little larger than the disc, centred on the orb's anchor point.
  function svgBox(r: number, inner: string) {
    const d = (r * 2 + 4).toFixed(1);
    const o = (-r - 2).toFixed(1);
    return `<svg width="${d}" height="${d}" viewBox="${o} ${o} ${d} ${d}" style="left:${o}px;top:${o}px">${inner}</svg>`;
  }

  function sunSvg(r: number, color: string) {
    return svgBox(r, `<circle r="${r.toFixed(1)}" fill="${color}"/>`);
  }

  function moonSvg(r: number, ms: number) {
    const { k, waning } = moonPhase(ms);
    const rx = (r * Math.abs(k)).toFixed(2);
    const flip = waning ? -1 : 1;
    const lit = `M0,${-r}A${r},${r} 0 0,1 0,${r}A${rx},${r} 0 0,${k > 0 ? 0 : 1} 0,${-r}Z`;
    return svgBox(
      r,
      `<circle r="${r}" fill="${MOONLIGHT}" opacity=".12"/><path transform="scale(${flip},1)" d="${lit}" fill="${MOONLIGHT}"/>`,
    );
  }

  /** `21:04` */
  function clock(minute: number) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(Math.floor(minute / MINUTES_PER_HOUR))}:${pad(Math.round(minute) % MINUTES_PER_HOUR)}`;
  }

  /** The minute of the day it is in Singapore, 0 to 1439. */
  function singaporeMinute(date: Date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Singapore",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return (part("hour") % 24) * MINUTES_PER_HOUR + part("minute");
  }

  /** Everything the page needs to draw one minute, as ready-to-apply strings. */
  function frame(minute: number, width: number, height: number, ms: number) {
    const sky = skyAt(minute);
    const orb = orbAt(minute);
    const r = orbRadius(width, orb.body);
    const svg = orb.body === "sun" ? sunSvg(r, sunColor(orb.arc)) : moonSvg(r, ms);
    return {
      sky: `rgb(${sky.join(",")})`,
      night: darkness(sky).toFixed(2),
      transform: `translate(${(width * orb.x).toFixed(1)}px,${(height * orb.y).toFixed(1)}px)`,
      svg,
      clock: clock(minute),
    };
  }

  return {
    MINUTES_PER_DAY,
    skyAt,
    darkness,
    orbAt,
    orbRadius,
    sunColor,
    moonPhase,
    clock,
    singaporeMinute,
    frame,
  };
}

export type PlateModel = ReturnType<typeof plateModel>;
export type PlateFrame = ReturnType<PlateModel["frame"]>;
