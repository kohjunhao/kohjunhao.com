# kohjunhao.com

Koh Jun Hao's personal site. One cream page: the 1828 engraving of Singapore harbour across the
top, its sky following the hour in Singapore, then a sentence about him and four folds for the
log of what he has made, his angel investments, the films, games and books he has finished, and
four essays. Next.js 16, App Router, deployed on Vercel from `main`.

## Run it

```bash
npm install
npm run dev
npm test
```

## How it is built

The data lives in `src/content/` and `src/data/`. Each kind of content has one typed model in
`src/lib/`, and both the home page fold and the full page read from it:

- `log.ts` groups the log by month and gives each entry its date, status and link.
- `shelf.ts` describes the films, games and books as columns and rows, with their covers.
- `portfolio.ts` lists the companies A to Z with their sectors and counts. Notes, years and
  links in `stock.ts` never reach a page.
- `articles.ts` holds the essays.

`src/lib/format.ts` formats dates and counts. `src/lib/plate.ts` is the sky: its colour at any
minute, where the sun or moon sits, and the moon's phase. The home page inlines that model in a
script that paints the sky before first paint, so a night visit never flashes cream. The tests
in `test/` cover both files and run on Node's built-in test runner.

The pages are in `src/app/`, the parts they share in `src/components/` and the stylesheet in
`src/app/site.css`.

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
- `scripts/build-logos.mjs`: company logos into `public/logos/`.

Also:

- `scripts/build-plate.mjs data/raw/singapore-1828.jpg` crops and levels the raw scan of the
  engraving into `public/plate/` at two widths, and renders the dusk plate for the share card.
- `scripts/fetch-articles.mjs` pulls the essays from Paragraph as Markdown into
  `data/raw/articles/`; `scripts/build-articles.mjs` turns them into `src/content/articles.json`.
- `scripts/build-log-media.mjs` makes the thumbnails for the log from `scripts/log-media.json`.
- `scripts/shot.mjs` screenshots pages with the installed Chrome.

`data/raw/` is gitignored: it holds the private sheet export, commit emails, raw essays and the
raw scan.

## Type

Newsreader for the serif and Geist for everything else, both loaded from Google Fonts by
`next/font`. The share card draws with a static Newsreader file in `src/og/` (SIL Open Font
License, see `src/og/OFL-Newsreader.txt`).
