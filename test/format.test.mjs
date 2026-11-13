import assert from "node:assert/strict";
import { test } from "node:test";
import { counted, dayMonth, dayRange, fullDate, int, monthName, oneDecimal, tally, yearSpan } from "../src/lib/format.ts";

test("dates read as day and short month", () => {
  assert.equal(dayMonth("2026-11-12"), "12 Nov");
  assert.equal(dayMonth("2026-04-01"), "1 Apr");
  assert.equal(fullDate("2015-06-06"), "6 Jun 2015");
  assert.equal(monthName("2026-09-30"), "September");
});

test("a range names the month once, or twice across a month end", () => {
  assert.equal(dayRange("2026-11-06", "2026-11-07"), "6 to 7 Nov");
  assert.equal(dayRange("2026-07-30", "2026-08-02"), "30 Jul to 2 Aug");
  assert.equal(dayRange("2025-11-06", "2026-11-07"), "6 Nov to 7 Nov");
});

test("numbers use thousands separators", () => {
  assert.equal(int(605), "605");
  assert.equal(int(3863), "3,863");
  assert.equal(oneDecimal(3863.69), "3,863.7");
  assert.equal(oneDecimal(2), "2.0");
});

test("counts pick the singular only for one", () => {
  assert.equal(counted(1, "essay", "essays"), "1 essay");
  assert.equal(counted(4, "essay", "essays"), "4 essays");
  assert.equal(counted(0, "essay", "essays"), "0 essays");
  assert.equal(counted(1006, "film", "films"), "1,006 films");
});

test("a year span collapses to one year when they match", () => {
  assert.equal(yearSpan(["2022-06-30", "2022-04-25"]), "2022");
  assert.equal(yearSpan(["2023-01-01", "2021-12-31"]), "2021 to 2023");
});

test("tally sorts by count and keeps first-seen order for ties", () => {
  assert.deepEqual(tally(["b", "a", "b", "c", "a", "b", "d"]), [
    ["b", 3],
    ["a", 2],
    ["c", 1],
    ["d", 1],
  ]);
});
