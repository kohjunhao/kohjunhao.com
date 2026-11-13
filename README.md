# kohjunhao.com

Koh Jun Hao's personal site, built as one working spreadsheet. Each page is a sheet tab: the
log of what shipped, the films, books and games he has finished, his angel investments, four
essays and an About sheet. Cells select, ranges total in the status bar, headers sort and Find
filters. Next.js 16, App Router, deployed on Vercel from `main`.

## Run it

```bash
npm install
npm run dev
```

## How it is built

Every sheet is data. `src/sheet/model.ts` defines one `Sheet` shape (columns, rows of cells,
an optional table range), and each tab has a pure builder beside it (`log.ts`, `films.ts`,
`books.ts`, `games.ts`, `portfolio.ts`, `writing.ts`, `about.ts`, `not-found.ts`) that turns
the content files into a `Sheet` on the server. `src/sheet/grid.ts` holds the grid logic:
selection, sort, Find, merged cells, status-bar sums and the CSV export.
`src/components/sheet-app.tsx` draws any `Sheet` and never branches on which one it is.
Essays and the two embedded projects sit on a gridded canvas instead
(`src/components/canvas-page.tsx`).

## Data

Everything on the site comes from generated files under `src/data/` and `src/content/`, so
the pages themselves hold no numbers.

```bash
npm run data
```

runs, in order:

- `scripts/build-activity.mjs`: commits per day across local repos and prompts per day from
  the coding-agent history, into `src/data/activity.json`. Counts only.
- `scripts/build-shelf.mjs`: the public columns of the private shelf sheet
  (`data/raw/shelf.json`, not in the repo) into `src/data/shelf.json`.
- `scripts/build-shelf-covers.mjs`: cover art for the shelf from Open Library, the Steam store
  and English Wikipedia into `public/shelf/`, with `src/data/covers.json` as the manifest.
- `scripts/build-logos.mjs`: company logos for the portfolio sheet into `public/logos/`.

Also:

- `scripts/fetch-articles.mjs` pulls the essays from Paragraph as Markdown into
  `data/raw/articles/`; `scripts/build-articles.mjs` turns them into `src/content/articles.json`.
- `scripts/build-log-media.mjs` makes the thumbnails for the log from `scripts/log-media.json`.
- `scripts/shot.mjs` screenshots pages with the installed Chrome.

`data/raw/` is gitignored: it holds the private sheet export, commit emails and raw essays.

## Type

Inter for the cells and the interface, JetBrains Mono for the name box and the formula bar,
both loaded from Google Fonts by `next/font`. The share card draws with static Inter files in
`src/fonts/` (SIL Open Font License, see `src/fonts/OFL-Inter.txt`).
