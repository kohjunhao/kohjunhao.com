/** Quiet paper tints for anything without a cover, so a bare tile reads as a book with no jacket. */
export const TINTS = ["#efe9dc", "#e6ebe0", "#e3e8ef", "#efe3e3", "#ece6ef", "#e9ecd9", "#e4ecec", "#efe7dd"];

/** FNV-1a, so a slug gets the same tint and spine size on every build. */
export function hash(text: string, seed = 0): number {
  let h = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function tint(slug: string): string {
  return TINTS[hash(slug) % TINTS.length];
}
