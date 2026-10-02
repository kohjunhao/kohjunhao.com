# kohjunhao.com

Koh Jun Hao's personal site: a log of what shipped, an activity calendar, the films, books
and games on his shelf, his angel investments and four essays. Next.js 16, App Router,
deployed on Vercel from `main`.

## Run it

```bash
npm install
npm run dev
```

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
- `scripts/build-logos.mjs`: company logos for the investments page into `public/logos/`.

Also:

- `scripts/fetch-articles.mjs` pulls the essays from Paragraph as Markdown into
  `data/raw/articles/`; `scripts/build-articles.mjs` turns them into `src/content/articles.json`.
- `scripts/build-footer-art.mjs` recolours the 1828 engraving in the footer.
- `scripts/build-log-media.mjs` makes the thumbnails for the log from `scripts/log-media.json`.
- `scripts/shot.mjs` screenshots pages with the installed Chrome.

`data/raw/` is gitignored: it holds the private sheet export, commit emails and raw essays.

## Type

Cal Sans v2 (SIL Open Font License, see `src/fonts/OFL-CalSans.txt`) for the site and
EB Garamond for the footer. The footer picture is Robert James Elliot's "View of the town
and roads of Singapore from the Government Hill", published 1828, public domain.
