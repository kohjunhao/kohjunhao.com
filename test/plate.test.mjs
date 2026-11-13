import assert from "node:assert/strict";
import { test } from "node:test";
import { plateModel } from "../src/lib/plate.ts";

const m = plateModel();
const at = (h, min = 0) => h * 60 + min;
const lit = (ms) => (1 - m.moonPhase(ms).k) / 2;

test("the sky is cream by day, indigo at night and amber at dusk", () => {
  assert.deepEqual(m.skyAt(at(12)), [247, 244, 234]);
  assert.deepEqual(m.skyAt(at(2)), [38, 49, 88]);
  assert.deepEqual(m.skyAt(at(18, 30)), [241, 196, 150]);
});

test("the sky blends between keys before dawn", () => {
  const sky = m.skyAt(at(6));
  const night = [38, 49, 88];
  const dawn = [232, 198, 187];
  sky.forEach((v, i) => assert.ok(v > night[i] && v < dawn[i], `channel ${i} is ${v}`));
});

test("darkness is 0 by day and 1 at night", () => {
  assert.equal(m.darkness(m.skyAt(at(12))), 0);
  assert.equal(m.darkness(m.skyAt(at(2))), 1);
});

test("the sun rises at the left, peaks mid-arc and sets at the right", () => {
  const rise = m.orbAt(at(6, 51));
  assert.equal(rise.body, "sun");
  assert.ok(Math.abs(rise.x - 0.05) < 1e-9);

  const peak = m.orbAt(at(12, 57));
  assert.ok(Math.abs(peak.y - 0.1) < 1e-9);

  const set = m.orbAt(at(19, 3));
  assert.equal(set.body, "sun");
  assert.ok(Math.abs(set.x - 0.95) < 1e-9);
});

test("the moon takes over after sunset", () => {
  assert.equal(m.orbAt(at(21)).body, "moon");
  assert.equal(m.orbAt(at(3)).body, "moon");
});

test("the sun is orange at the horizon and yellow overhead", () => {
  assert.equal(m.sunColor(0), "rgb(240,108,54)");
  assert.equal(m.sunColor(0.5), "rgb(240,178,64)");
});

test("the moon phase matches known new and full moons", () => {
  assert.ok(lit(Date.UTC(2024, 0, 11, 11, 57)) < 0.02, "new moon, 11 Jan 2024");
  assert.ok(lit(Date.UTC(2024, 0, 25, 17, 54)) > 0.98, "full moon, 25 Jan 2024");
  assert.equal(m.moonPhase(Date.UTC(2024, 0, 18)).waning, false);
  assert.equal(m.moonPhase(Date.UTC(2024, 0, 29)).waning, true);
});

test("the clock reads hours and minutes", () => {
  assert.equal(m.clock(0), "00:00");
  assert.equal(m.clock(at(21, 4)), "21:04");
  assert.equal(m.clock(m.MINUTES_PER_DAY - 1), "23:59");
});

test("Singapore time is UTC plus eight, wrapping past midnight", () => {
  assert.equal(m.singaporeMinute(new Date("2026-11-13T13:04:00Z")), at(21, 4));
  assert.equal(m.singaporeMinute(new Date("2026-11-13T16:30:00Z")), at(0, 30));
});

test("a frame draws a sun by day and a moon by night", () => {
  const ms = Date.UTC(2026, 10, 13);
  const noon = m.frame(at(12), ms);
  assert.equal(noon.sky, "rgb(247,244,234)");
  assert.equal(noon.night, "0.00");
  assert.match(noon.svg, /<circle r="1" fill="rgb\(240,/);
  assert.doesNotMatch(noon.svg, /<path/);
  assert.equal(noon.size, "calc(max(16px, 2.6cqw) * 2.3)");

  const night = m.frame(at(21), ms);
  assert.equal(night.night, "1.00");
  assert.match(night.svg, /<path transform="scale\(-?1,1\)"/);
  assert.equal(night.size, "calc(max(16px, 2.6cqw) * 1.8)");
  assert.equal(night.clock, "21:00");
});

test("a frame places the orb as percentages of the plate", () => {
  const rise = m.frame(at(6, 51), 0);
  assert.equal(rise.left, "5.00%");
  assert.equal(rise.top, "60.00%");
});

test("the pixel radius grows with the plate above a floor", () => {
  assert.equal(m.orbRadius(1000, "sun"), 26 * 1.15);
  assert.equal(m.orbRadius(300, "moon"), 16 * 0.9);
});

test("the model runs from its own source, as the inline script runs it", () => {
  const copy = new Function(`return (${plateModel})()`)();
  const ms = Date.UTC(2026, 10, 13);
  assert.deepEqual(copy.frame(at(21, 4), ms), m.frame(at(21, 4), ms));
});
