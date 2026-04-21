# V5 Handoff — Koh Jun Hao Personal Site

**For: Claude (Claude Design / Claude Code)**
**From: Koh Jun Hao**
**Repo: https://github.com/kohjunhao/kohjunhao.com**
**Stack: Next.js 16 (App Router, Turbopack) · Tailwind 4 · Motion · Three.js · cmdk · TypeScript · Vercel (intended)**

---

## 0. Role

You are being handed v4 of my personal site. Your job is to ship **v5** — one comprehensive pass that takes the site from "well-crafted but still mostly text-and-ledger" to **"unmistakably alive with bespoke interactive graphics, while preserving the Aizome design language exactly."**

**Read this file top-to-bottom before touching any code.** Then spend your first 10 minutes reading `/src/app/design/page.tsx` and `/src/app/globals.css` so you internalize the design system rules. Do not skip this step.

Use subagents aggressively for independent work (research, content scraping, single-visualization builds). Use skills where relevant — I've called out specific ones below.

---

## 1. What the site is

Personal site for **Koh Jun Hao** — CS student at NUS, Singapore-based crypto angel investor (73 portfolio companies), long-form writer on DeFi/AI (publishes at paragraph.com/@0xvega).

**The site has two audiences:**
1. **Founders and operators** who land on it after a warm intro or tweet and want to understand if I'm real, thoughtful, and the kind of person they'd want on their cap table / collaborating with.
2. **My future self** — a durable record of what I've thought, read, watched, and backed.

**The emotional register I want:** *the way you feel picking up a premium Japanese notebook at a stationery store.* Restrained. Confident. Every detail considered. Not flashy — but every flashy site looks generic next to it.

---

## 2. The design system — "Aizome" — is LOCKED

**Do not redesign. Do not re-palette. Do not swap fonts. Do not add a sans-serif.**

Instead, read `src/app/design/page.tsx` which is the canonical source of truth, and follow it exactly. Summary:

**Palette (light)**
- `--canvas: #FAFAF7` · `--surface: #F0EEE8` · `--ink: #0E0E0E`
- `--muted: #7A756E` · `--accent: #2B4A6F` · `--rule: #E0DCD2`

**Palette (dark)**
- `--canvas: #121210` · `--surface: #1C1B18` · `--ink: #EDEAE0`
- `--muted: #8A847A` · `--accent: #6E93C4` · `--rule: #2A2823`

**Typography**: Source Serif 4 (prose + headings, weights 400/500/600) + JetBrains Mono (numerics, labels, addresses). **No sans-serif, ever.**

**Spacing**: 4pt scale. Radii: 0/4/8 only (no large radii). Shadows: only hairline rules, no drop shadows.

**Motif**: mono-numeric ledger. Every section opens with `01 /`, `02 /` in mono, accent color. Footer has the status ledger (LAST UPDATED · LOCATION · STATUS · LAST DISPATCH) + hanko seal.

**Enforcement rule**: any new component you add must be auditable against these tokens. If you find yourself reaching for a new color, a new font weight, or a new radius, stop and reconsider. The discipline is the product.

---

## 3. What's already built (v4)

### Routes
```
/                     Home — hero, ASCII scene, index, recent articles
/design               Meta-page documenting the Aizome system
/articles             List of Paragraph articles (4 seeded)
/articles/[slug]      Full-page article view
/blog                 Shorter personal notes (1 placeholder)
/projects             Things built (1 placeholder)
/investments          73-company portfolio (featured spotlight + A-Z ledger)
/books                20 books across 3 recommendation tiers
/movies               15 films across 3 recommendation tiers
/resume               Education, practice, focus areas, contact
```

### Article modal (keep this)
Clicking any `/articles/{slug}` from the list opens it in a large modal (~90vw/92vh on desktop, full-screen on mobile) via Next.js **intercepted parallel routes** (`src/app/@modal/(.)articles/[slug]/page.tsx`). Direct URL navigation still renders full-page. Use this same pattern for `/blog/[slug]` and `/investments/[slug]` in v5 if you add detail pages.

### Craft layer already shipped
1. **Washi dotted background** — faint indigo dots on 24px grid via `radial-gradient` in `globals.css`
2. **Self-drawing hairline rules** — `scaleX: 0 → 1` on scroll-in via `SelfDrawingRule` + Motion's `useInView`
3. **Spring physics** — `LedgerRow` has hover x-shift, left accent bar, scale-on-press; nav links have draw-in underline. Use `{ type: "spring", bounce: 0 }` on any new animation. **Bounce must always be 0** per MIFB.
4. **Command palette** — `⌘K` opens cmdk dialog with Sections / Articles / Elsewhere groups
5. **Hanko seal (印)** — SVG with feTurbulence grain filter, muted crimson `#8B3A3A`, rotates ~3.5° at rest, springs to straighter on hover, reveals build timestamp
6. **Three.js + ASCII hero** — low-poly icosahedron lit with key/rim/ambient, rendered through `AsciiEffect` in JetBrains Mono on canvas. Cursor-tracked rotation with autonomous drift.

Do not remove any of these. Extend them.

### Files to know
- `src/lib/site.ts` — site config, nav entries, links, education. Single source of truth.
- `src/lib/articles.ts` — article data, typed. Add new articles here.
- `src/lib/stock.ts` — books, movies, 73 investments, games type. Add new entries here.
- `src/components/` — all components live here. Named in kebab-case. Use "use client" when needed.
- `src/app/globals.css` — tokens + prose styles.

### Known gaps (fix in v5)
- Bio on home page is my placeholder voice — the user can give you their actual voice if you ask. Default behavior: leave the factual scaffolding, improve the flow and specificity.
- `/blog` and `/projects` have one placeholder row each. Either add real content (ask the user) or design the empty state beautifully.
- `/games` route was removed but the type survives in `stock.ts`. Decide whether to revive or delete.
- `/contact` is not a page — lives at the bottom of `/resume`. Consider whether to promote.

---

## 4. The commission — what v5 must deliver

**Theme of v5: *The site becomes legible as data, not just copy.***

Build **four bespoke interactive visualizations** (A-D below) plus **three craft enhancements** (E-G). Every visualization must honor Aizome tokens, work in both light and dark mode, be mobile-responsive (tablet+ can be richer, mobile must at minimum show a static fallback), and respect `prefers-reduced-motion`.

### A. Investments → "Constellation" view

Reimagine the `/investments` page. The 73 portfolio companies become a **rotating 3D constellation**:

- A slowly-rotating sphere/globe made of 73 points in 3D space (use `@react-three/fiber`)
- Each point is a small indigo dot with the company name rendered as mono text label (always camera-facing)
- Featured companies (the 8 flagged with `featured: true`) are larger and slightly brighter
- Connection lines between points share a category — infer from the note field or ask the user for a category taxonomy
- Cursor drags rotate the view; click a company to open a modal (intercepted parallel route) with its note and URL
- Below the constellation, keep the current ledger as a fallback / accessible view
- Mobile: static 2D force-directed graph (use `d3-force`), same tokens

Reference: "interactive dark graphic showing how culture flows between cities — a globe that rotates with cities connected by lines." That's the *spirit* — but our version uses Aizome tokens, not a dark background.

### B. Books → "Thematic map"

Reimagine `/books` as a **force-directed thematic network**:

- Each book is a node (title in serif, author in mono below)
- Tags are shared themes (crypto, venture, psychology, product, strategy) — derive from title/author or add a `tags: string[]` field to the `Book` type in `stock.ts`
- Edges connect books sharing a tag
- Tier is encoded in node opacity (highly: 100%, recommended: 70%, skip: 30%)
- Click a book → modal with a short excerpt I'd want to say (seed with placeholder copy in square brackets I can replace)
- Hovering a tag label in a side legend highlights all connected books, dims others
- Keep the current tier-list as a secondary view below the graph

### C. Articles → "Reading river"

Enhance `/articles` and the article modal:

- On the list view, articles flow down the page like a river of ledger entries, but with a **connected sparkline on the left** showing when each was published (mono axis, indigo bars)
- Inside the article modal, add a **scroll-linked reading-progress rail** on the right edge — a thin indigo hairline that fills top-down as the reader scrolls
- At the end of each article, a **"related" footer** renders the other articles as small ledger cards with a shared-tag line between them
- When you close an article modal, a subtle ink-bleed View Transition animates back to the list

### D. Resume → "Operator ledger"

Reimagine `/resume` as **an interactive account statement**:

- Top: a horizontal timeline (2022 → present) with mono year ticks; education bar + practice bars layered as hairline rules
- Hovering a year reveals what was happening (investments made that year, articles published)
- Focus areas rendered as a small **radar chart** in mono/indigo — one axis per focus (Blockchain, CS, Finance), the "value" per axis is the count of investments/articles tagged to it
- Contact section stays as-is

### E. View Transitions API — ink-bleed navigation

Wire up Next.js 16's support for `view-transition` on route changes. Every page navigation should feel like **wet ink bleeding between sheets**:
- Default cross-fade at 400ms cubic-bezier
- Heading text gets a `view-transition-name` so it morphs between pages where it persists
- Honor `prefers-reduced-motion`

### F. Cmd-K palette — level up

Current ⌘K is basic nav. In v5:
- Add a **"recent" group** showing the last 5 routes the visitor viewed (localStorage)
- Add a **jump-to-subsection** behavior: typing `#` shows all section headers across the site
- Add **keyboard shortcuts** — `g` then `i` jumps to Investments, `g` then `a` to Articles, etc. (vim-like)
- Every result has a subtle enter animation (staggered 20ms) using Motion, following MIFB's `type: spring, bounce: 0` rule

### G. 404 page — one-off moment of craft

Design an `app/not-found.tsx` that's a small moment in itself:
- The hanko seal SVG expanded to center screen, wobbling slightly
- A single line of serif: "この道はない。" (this path does not exist) + English below
- A mono `← return to index` link with draw-in underline
- Dotted washi background

---

## 5. Skills to use

- **`make-interfaces-feel-better`** — the animation bible. Read `animations.md`, `surfaces.md`, `typography.md`. Follow religiously. Spring configs = `{ type: "spring", bounce: 0, duration: 0.3 }`. Scale-on-press = `0.96`. Enter animation = opacity + y(12px) + blur(4px), stagger 100ms.
- **`ui-ux-pro-max`** — reference for accessibility and patterns. Every new visualization must meet WCAG AA contrast, keyboard-navigable, `prefers-reduced-motion` respected.
- **`hyperframes`** — IGNORE unless I ask you to produce video content. This site is not video.
- **`kami`** — IGNORE. That's a different design system (warm parchment). Aizome is the locked system here.

---

## 6. Subagent playbook

**Use subagents aggressively** — this is a large commission and parallelism is your ally.

Suggested fan-outs (run in parallel via multiple `Agent` tool calls in one message):

- **Agent 1 — Constellation researcher**: studies force-directed 3D layouts with @react-three/fiber, returns a minimal working example adapted to Aizome tokens
- **Agent 2 — Category taxonomist**: reads the 73 investments in `stock.ts`, proposes a category taxonomy (e.g. L1/L2, Stablecoin, DeFi primitive, AI, Infra/tooling), returns a patched `stock.ts`
- **Agent 3 — Book tagger**: reads the 20 books in `stock.ts`, proposes thematic tags, returns patched `stock.ts`
- **Agent 4 — Paragraph scraper**: tries to fetch more article bodies from `paragraph.com/@0xvega` so the article modal content is richer (currently only 4 articles with my hand-written bodies)
- **Agent 5 — 404 designer**: given the Aizome system, proposes three 404 concepts with ASCII mocks; you pick one and build it

For agents that write code, always verify their output compiles before integrating.

---

## 7. Non-negotiables

- **Build must pass**: `npm run build` completes with zero TS errors at the end.
- **Routes all return 200**: run a final `curl` sweep of every route.
- **Aizome tokens only**: grep the repo for hex colors — should only find tokens and the hanko crimson `#8B3A3A`. If you add new colors, justify in a comment.
- **Accessibility**: every visualization has a text-only fallback. Every click target ≥ 44px on mobile. Every animated element respects `prefers-reduced-motion`.
- **Performance**: Lighthouse score ≥ 90 on mobile. Dynamically import heavy libraries (three.js is already lazy-loaded — keep it that way). No cumulative layout shift.
- **Mobile-first**: test at 375px width. If a visualization can't work on mobile, render a static fallback with the same data in ledger form.

---

## 8. Content I have that you might need

- **73 investments**: already in `stock.ts`. 8 featured with notes; 65 by name only. If you add categories/stages, derive or ask me.
- **4 articles**: in `articles.ts` with hand-written bodies. My Paragraph handle is `0xvega` if you want to try to scrape more.
- **20 books + 15 movies**: in `stock.ts`, all tiered.
- **Bio facts**: NUS CS 2022–2026, Singapore, 73 angel cheques, writes as @0xvega. Handle `@kohjunhao` on X, Telegram, LinkedIn, GitHub.
- **Ask me for**: actual voice on bio paragraphs, project list if I have one, blog posts to seed, category taxonomies if you'd rather I author them than derive.

---

## 9. Order of operations I recommend

1. Read `/src/app/design/page.tsx` and `/src/app/globals.css` (10 min)
2. `npm install && npm run dev` — confirm v4 runs
3. Fan out 5 agents as listed in §6 (parallel)
4. Build Section A (Investments constellation) — biggest single artifact, unblocks the most
5. Build Sections B, C in parallel after A
6. Build D (Resume), E (View Transitions), F (Cmd-K upgrades), G (404) serially
7. Final sweep: accessibility audit, Lighthouse, build, commit, open PR (or commit to main if I told you to)

---

## 10. Voice & tone for any new copy

- Serif prose is plain, specific, unshowy. "This site collects the work" not "A journey through my passions."
- Mono labels are terse, uppercase, tracking-wider. "LAST UPDATED" not "Recently updated on"
- Avoid: "passionate", "innovative", "cutting-edge", any adjective you'd expect on LinkedIn
- Prefer: specific numbers, specific names, specific dates

Words that are OK: *ledger, dispatch, notation, margin, operator, custody, seal, washi, ink, figure, plate*. Words that are off-brand: *journey, passionate, cutting-edge, revolutionary, disruptive, bleeding-edge, next-gen*.

---

## 11. When you're done

Leave me:
- A clear commit log with atomic commits per section (A, B, C, D, E, F, G)
- A short `V5_NOTES.md` explaining any decisions that need my review
- A Lighthouse run summary
- The Three.js bundle size delta (v5 vs v4)

Then open a PR titled `v5: constellation, thematic map, reading river, operator ledger` with a 200-word summary. Don't merge — let me review.

---

*Aizome. 藍染. "dyed in indigo."*
