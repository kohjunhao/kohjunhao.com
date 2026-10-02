import type { CSSProperties } from "react";
import { cover, hash, tint, type Book } from "@/lib/shelf";

const WIDTH = { min: 44, max: 72 };
const HEIGHT = { min: 200, max: 260 };
const LIGHT_BACKGROUND = 0.55;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const between = (n: number, { min, max }: { min: number; max: number }) => min + (n % (max - min + 1));

/** Relative luminance of a #rrggbb colour, 0 for black to 1 for white. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function readMonth(read: string | null) {
  if (!read) {
    return null;
  }
  return `${MONTHS[Number(read.slice(5, 7)) - 1]} ${read.slice(0, 4)}`;
}

export function Spine({ book }: { book: Book }) {
  const art = cover("books", book.slug);
  const color = art?.color ?? tint(book.slug);
  const month = readMonth(book.read);
  const size = {
    "--spine": color,
    "--w": between(hash(book.slug, 1), WIDTH),
    "--h": between(hash(book.slug, 2), HEIGHT),
  } as CSSProperties;
  const label = [book.title, book.author && `by ${book.author}`, month && `read ${month}`].filter(Boolean).join(", ");

  return (
    <li className="v3-slot">
      <button
        type="button"
        className="v3-spine"
        style={size}
        data-ink={luminance(color) > LIGHT_BACKGROUND ? "dark" : "light"}
        aria-label={label}
      >
        <span className="v3-spine-title">{book.title}</span>
        {book.author && <span className="v3-spine-author">{book.author}</span>}
      </button>

      <div className="v3-spine-card" aria-hidden>
        {art && (
          // eslint-disable-next-line @next/next/no-img-element -- covers are already 240px webp; the optimiser would only re-encode them
          <img src={art.src} width={art.w} height={art.h} alt="" loading="lazy" decoding="async" />
        )}
        <b>{book.title}</b>
        {book.author && <span>{book.author}</span>}
        {month && <span className="v3-spine-when">Read {month}</span>}
      </div>
    </li>
  );
}
