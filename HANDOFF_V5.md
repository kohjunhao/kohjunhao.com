# V5 Handoff — Koh Jun Hao Personal Site

**For: Claude (Claude Design / Claude Code)**
**From: Koh Jun Hao**
**Repo: https://github.com/kohjunhao/kohjunhao.com**
**Stack: Next.js 16 (App Router, Turbopack) · Tailwind 4 · Motion · Three.js · cmdk · TypeScript · Vercel (intended)**

---

## 0. Role

You are being handed v4 of my personal site. Ship **v5** in one tight pass. Don't over-build — this is a *personal site*, not a product launch. Restraint is the brand.

**Read this file top-to-bottom before touching code.** Then read `/src/app/design/page.tsx` and `/src/app/globals.css` so you internalize the design system. Don't skip that.

Use subagents where they genuinely parallelize work. Don't fan out for show.

---

## 1. What the site is

Personal site for **Koh Jun Hao** — CS student at NUS, Singapore-based crypto angel investor (73 portfolio companies), long-form writer on DeFi/AI (publishes at paragraph.com/@0xvega).

**Emotional register:** *the way you feel picking up a premium Japanese notebook in a stationery shop.* Restrained. Considered. Every detail earned. Not flashy — but every flashy site looks generic next to it.

**Two audiences:**
1. **Founders and operators** who land on it after a warm intro and want to understand if I'm real, thoughtful, and the kind of person they'd put on their cap table.
2. **My future self** — a durable record of what I've thought, read, watched, played, and backed.

---

## 2. The design system — "Aizome" — is LOCKED

**Do not redesign. Do not re-palette. Do not swap fonts. Do not add a sans-serif.**

`src/app/design/page.tsx` is the canonical source of truth. Summary:

**Palette (light)**
- `--canvas: #FAFAF7` · `--surface: #F0EEE8` · `--ink: #0E0E0E`
- `--muted: #7A756E` · `--accent: #2B4A6F` · `--rule: #E0DCD2`

**Palette (dark)**
- `--canvas: #121210` · `--surface: #1C1B18` · `--ink: #EDEAE0`
- `--muted: #8A847A` · `--accent: #6E93C4` · `--rule: #2A2823`

**Typography**: Source Serif 4 (prose + headings, weights 400/500/600) + JetBrains Mono (numerics, labels, addresses). **No sans-serif, ever.**

**Spacing**: 4pt scale. Radii: 0/4/8 only. Shadows: hairline rules only, no drop shadows.

**Motif**: mono-numeric ledger. Every section opens with `01 /`, `02 /` in mono, accent color. Footer has the status ledger (LAST UPDATED · LOCATION · STATUS · LAST DISPATCH) + hanko seal.

If you find yourself reaching for a new color, font weight, or radius — stop. The discipline is the product.

---

## 3. What's already built (v4)

### Routes

```
/                 Home — hero + ASCII icosahedron + index + recent articles
/design           Meta-page documenting the Aizome system
/articles         4 real articles, open in modal
/articles/[slug]  Full-page article view
/blog             Shorter notes (1 placeholder)
/projects         Things built (1 placeholder)
/investments      73-company portfolio (featured spotlight + A–Z ledger + thesis)
/books            20 books across 3 recommendation tiers
/movies           15 films across 3 recommendation tiers
/resume           Education, practice, focus, contact
```

### Article modal pattern (keep this)
Clicking any `/articles/{slug}` from the list opens it in a large modal (~90vw/92vh on desktop, full-screen on mobile) via Next.js **intercepted parallel routes** (`src/app/@modal/(.)articles/[slug]/page.tsx`). Direct URL still renders full-page. Reuse this pattern for any new detail page.

### Craft layer already shipped (do not remove, extend if relevant)
1. **Washi dotted background** — faint indigo dots on 24px grid via `radial-gradient` in `globals.css`
2. **Self-drawing hairline rules** — `scaleX: 0 → 1` on scroll-in (`SelfDrawingRule` + Motion `useInView`)
3. **Spring physics** on ledger rows and nav links. `{ type: "spring", bounce: 0 }`. **Bounce is always 0.**
4. **Command palette (⌘K)** — cmdk dialog with Sections / Articles / Elsewhere. Keep simple.
5. **Hanko seal (印)** — SVG with feTurbulence grain, muted crimson `#8B3A3A`, rotates ~3.5° at rest, hover reveals build timestamp.
6. **Three.js + ASCII hero** — low-poly icosahedron rendered through `AsciiEffect` in JetBrains Mono on canvas. Cursor-tracked rotation. **In v5 you will replace this with the Inception top (see §4.A).**

### Files to know
- `src/lib/site.ts` — site config, nav, links, education
- `src/lib/articles.ts` — article data
- `src/lib/stock.ts` — books, movies, 73 investments (and a `Game` type that's currently unused — you'll revive this)
- `src/components/` — kebab-case components. `"use client"` where needed.
- `src/app/globals.css` — tokens + prose styles

---

## 4. The commission — what v5 must deliver

**Theme of v5: *one unforgettable moment on the home page, one missing surface restored with real data, and two small polish passes.***

That's it. Four items. Don't add more.

### A. The signature hero moment — Inception ASCII spinning top

**Replace the current ASCII icosahedron** on the home page with an interactive 3D **spinning top**, rendered through the same `AsciiEffect` so it stays in monospaced characters and Aizome-indigo.

**Behavior:**
- On mount, the top is **spinning upright and true** (just like Cobb's totem — the moment you want to hold on to)
- Cursor / finger can **push** it — click and drag across the top transfers angular momentum in the XZ plane, causing it to lean and precess (traces a cone)
- Friction slowly damps the precession; eventually the top **tips over** and comes to rest on its side
- Click the fallen top to **reset** — it snaps back upright, true, spinning again
- Idle for ~60 seconds without interaction: top continues spinning true indefinitely (this is the "reality is still holding" state)
- Small mono caption below: `figure i · totem · tap to knock`

**Implementation notes:**
- Geometry: a simple classical top. `CylinderGeometry` tapered, or composite: a cone pointing down (the tip), a cylinder stem, a small disk crown. Hand-model it — it should read instantly as a spinning top.
- Rendered through the existing `AsciiEffect` setup in `src/components/ascii-hero.tsx`. Same charset ` ·:-+=*▒▓█`, same mono font, same indigo color.
- **Physics**: do NOT pull in a full physics engine. Hand-roll a simple state machine:
  - `spinning` (autonomous, `rotation.y += speed * dt`, upright)
  - `perturbed` (user pushed — lean angle > 0, precession rate function of lean, damping over time)
  - `fallen` (lean angle ≥ ~88°, snaps to lying down, rotation stops)
  - `spinning` again on click
- Use Motion's springs for the lean/unlean transitions (`{ type: "spring", stiffness: 180, damping: 20 }`). Spin itself is a simple rAF loop.
- Mobile: same interaction via touch. Smaller (180px vs 240px). On `prefers-reduced-motion`: static rendering of the top, upright, no spin, no interaction.
- Performance: this runs on every page visit via the home page. Dynamically import three.js (already done in v4). Drop to 10fps when tab is backgrounded.

**Why this move:** The Inception top is a meditation on *what's real*. A crypto operator's site is built in a field where that question matters every day. The top is quiet (one object, no flash), referential (cinema literacy signal), and meaningful (the site holds up as long as you can't knock it over). Exactly the kind of detail that makes someone screenshot and send to a friend.

**Accept no substitutes:** the spinning top is the v5 hero. Don't replace it with a Matrix rain or a globe or anything else. If the Inception totem doesn't fit what you want to build, build it anyway — it fits what *I* want.

---

### B. Restore `/games` with real Steam data

Bring back the `/games` page. Design it exactly like `/books` and `/movies` — three tiers (highly recommend / recommend / skip), mono-ledger rows, real content.

**Steam integration (server-side):**
- Fetch via Steam Web API:
  - `GetRecentlyPlayedGames` — last 6 played with hours
  - `GetOwnedGames` with `include_played_free_games=true` — all owned, sorted by playtime_forever, take top 15
  - `GetPlayerSummaries` — for "currently playing" badge if live
- Needs environment variables: `STEAM_API_KEY` and `STEAM_ID` (17-digit SteamID64)
- If env vars are missing, render a graceful empty state with a mono note: `─ steam integration pending ─`. Don't crash the page.
- Cache with Next.js ISR at 10-minute revalidation (`export const revalidate = 600`).
- Persist the last good fetch to disk or memory — if Steam is down, serve stale rather than erroring.

**Manual overrides:**
- Keep a `manualGames: Game[]` array in `stock.ts` for non-Steam games (Switch, PS5, retro). Merge these into the list with a `platform` field.
- Extend the `Game` type:
  ```ts
  type Game = {
    title: string;
    platform: "steam" | "switch" | "ps5" | "xbox" | "retro" | "other";
    hours?: number;
    lastPlayed?: string;
    rec: Recommendation;
    note?: string;
    steamAppId?: number;
  };
  ```

**Page layout:**
- Top section: **Currently playing** — if Steam says they're in a game right now, a mono pulse dot + title. Otherwise: last-played game with "last session" timestamp.
- Middle: **Most played (all-time)** — top 10 by hours, horizontal mono bar chart (hairline bars in accent color, hours in mono tabular-nums on the right).
- Bottom: **Tiered recommendations** — same as /books and /movies format.

**Ask the user** for their Steam ID and API key when you get to this step. Say: *"I need two environment variables to wire Steam. Please give me your SteamID64 (17-digit number from steamcommunity.com/my → About) and a Steam Web API key from steamcommunity.com/dev/apikey. If you don't want to set this up now, I'll ship the manual version and you can add the env vars later."*

**Add `/games` back to the nav** in `src/lib/site.ts`. That bumps the nav to 9 items — adjust the grid at `src/components/nav.tsx` to `md:grid-cols-9` or drop `/blog` from the nav (blog can still be linked from home) to keep 8. Recommend: **keep all 9**, adjust grid to wrap gracefully.

---

### C. View Transitions — ink-bleed between pages

Wire up the View Transitions API on route changes. Next.js 16 supports it natively via `useViewTransition` or the CSS `view-transition-name` mechanism.

- Default: a 400ms opacity + 4px translateY crossfade. Cubic-bezier `(0.22, 0.61, 0.36, 1)`.
- Heading (`h1` and the topbar `Koh Jun Hao` link) gets a `view-transition-name` so it morphs between pages instead of fading.
- Honor `prefers-reduced-motion` — skip the transition entirely.
- Test on back/forward nav too.

Don't over-design this. It's a polish pass, not a feature.

---

### D. 404 page — one small moment

Build `app/not-found.tsx`:
- Hanko seal SVG expanded to ~128px center screen, wobbling in place (subtle spring rotation oscillation)
- One line of serif: `この道はない。` with English translation `This path does not exist.` below in muted italic
- Mono link `← return to index` with draw-in underline on hover
- Same dotted washi background as rest of site
- Uses only Aizome tokens

That's the whole page. Three elements and whitespace.

---

## 5. Skills to use

- **`make-interfaces-feel-better`** — the animation bible. Read `animations.md`, `surfaces.md`, `typography.md`. Spring configs = `{ type: "spring", bounce: 0, duration: 0.3 }`. Scale-on-press = `0.96`. Enter animation = opacity + y(12px) + blur(4px), stagger 100ms. Follow religiously.
- **`ui-ux-pro-max`** — accessibility reference. Every new interactive piece must meet WCAG AA contrast, be keyboard-navigable, and respect `prefers-reduced-motion`.
- **Ignore `hyperframes`** (video-only) and **`kami`** (different design system).

---

## 6. Subagent playbook

Use at most **three** subagents, in parallel where possible:

- **Agent 1 — Steam API researcher**: studies the three Steam Web API endpoints, returns a typed client (`src/lib/steam.ts`) with `getRecentlyPlayed()`, `getOwnedGames()`, `getPlayerSummary()`. Tests with a fake key to make sure it fails gracefully.
- **Agent 2 — Spinning top physicist**: prototypes the lean/precession state machine in a scratch file. Returns tuning numbers (friction, lean threshold, spring params) that look right. You then integrate into `src/components/ascii-hero.tsx`.
- **Agent 3 — View Transitions + 404**: implements C and D in one pass. Small enough to bundle.

Don't fan out for research that's already done in this doc.

---

## 7. Non-negotiables

- **Build must pass**: `npm run build` completes with zero TS errors.
- **All routes return 200**: curl sweep every route at the end.
- **Aizome tokens only**: grep the repo for hex colors — should only find CSS variables and the hanko crimson `#8B3A3A`. If you add a new color, justify in a comment.
- **Accessibility**: spinning top has a static fallback under `prefers-reduced-motion`. Games page degrades gracefully without Steam env vars. Every click target ≥ 44px on mobile.
- **Mobile**: test at 375px width. The spinning top must still feel good on touch.
- **Performance**: Lighthouse mobile ≥ 90. Three.js stays lazy-imported. No CLS.

---

## 8. Content I already have (in the repo)

- **73 investments** in `src/lib/stock.ts` — 8 featured with notes, 65 by name only
- **4 articles** in `src/lib/articles.ts` with hand-written bodies
- **20 books + 15 movies** in `stock.ts`, tiered
- **Bio**: NUS CS 2022–2026, Singapore, 73 angel cheques, writes as @0xvega on Paragraph
- **Handles**: `@kohjunhao` on X, Telegram, LinkedIn, GitHub

**What I need to give you for v5:**
- `STEAM_API_KEY` environment variable
- `STEAM_ID` environment variable (17-digit SteamID64)
- Any non-Steam games (Switch / PS5 / retro) to seed the manual list
- The three-tier rec for each game (highly / recommended / skip)

Ask me for these when you get to §4.B. If I'm slow to respond, proceed with manual-only and env var stubs.

---

## 9. Order of operations

1. Read `src/app/design/page.tsx` and `src/app/globals.css` (10 min)
2. `npm install && npm run dev` — confirm v4 runs
3. Fan out Agents 1 and 2 in parallel
4. Integrate Agent 2's output into `src/components/ascii-hero.tsx` — rename to `ascii-top.tsx` if cleaner, rewire on the home page
5. Integrate Agent 1's output, ask user for Steam env vars, build `/games` page
6. Run Agent 3 for view transitions + 404
7. Final sweep: Lighthouse, build, commit per-section (A, B, C, D), open PR

---

## 10. Voice & tone for any new copy

- Serif prose is plain, specific, unshowy. "This site collects the work" not "A journey through my passions."
- Mono labels are terse, uppercase, tracking-wider. "LAST UPDATED" not "Recently updated on"
- Avoid: "passionate", "innovative", "cutting-edge", any LinkedIn adjective
- Prefer: specific numbers, specific names, specific dates

OK words: *ledger, dispatch, notation, margin, operator, custody, seal, washi, ink, figure, totem*.
Off-brand: *journey, passionate, cutting-edge, revolutionary, disruptive, bleeding-edge, next-gen*.

---

## 11. When you're done

Leave me:
- Atomic commits per section (A, B, C, D)
- A short `V5_NOTES.md` flagging any decisions I should review
- A Lighthouse summary
- The bundle size delta (v5 vs v4)

Open a PR titled `v5: inception totem, games, view transitions, 404` with a 200-word summary. **Don't merge — let me review.**

---

*Aizome. 藍染. "dyed in indigo."*
