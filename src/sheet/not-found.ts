import type { Sheet } from "./model";

export function buildNotFound(): Sheet {
  return {
    slug: "not-found",
    columns: [{ width: 120 }, { width: 420, mobileWidth: 300 }],
    rows: [
      [{ v: "#REF!", format: "bad", fx: "=PAGE()" }, { v: "This cell points at a page that does not exist." }],
      [null, null],
      [{ v: "Back to the log", href: "/" }, null],
    ],
    select: [0, 0],
  };
}
