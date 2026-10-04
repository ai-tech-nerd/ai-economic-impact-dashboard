# AI Economic Impact Dashboard

## Project Architecture and Technical Reference

**Version:** 1.2
**Date:** 2026-10-03
**Status:** Technical source of truth for documentation syncs. Facts below were verified against the code and data on the date above (data counts as of 2026-10-03). Items that could not be fully verified are marked **VERIFY**.

- **Live site:** https://aishift.michaelkristof.com (custom domain via `public/CNAME`)
- **GitHub Pages URL:** https://ai-tech-nerd.github.io/ai-economic-impact-dashboard/
- **Repository:** https://github.com/ai-tech-nerd/ai-economic-impact-dashboard

---

## 1. System Overview

The dashboard is a fully static React single-page application. There is no backend, no database, and no server-side rendering. All content is data-driven: the SPA fetches static JSON files at runtime and computes every chart, counter, and table client-side.

```
┌─────────────────────────── GitHub repository ───────────────────────────┐
│  src/ (React + TypeScript)      public/data/verified/*.json (datasets)  │
│  public/data/source-archive/    public/CNAME                            │
│  (static provenance pages)                                              │
└───────────────┬─────────────────────────────────────────────────────────┘
                │  push to main
                ▼
   .github/workflows/deploy.yml
   (npm ci → validate-job-categories → build → prerender-seo → og/generate → Pages)
                │
                ▼
┌──────────────────── GitHub Pages (aishift.michaelkristof.com) ──────────┐
│  index.html → React SPA (BrowserRouter + 404.html fallback)                                    │
│      │ runtime fetch                                                    │
│      ├── /data/verified/*.json          (7 datasets, useData hook)      │
│      ├── /data/source-archive/archive-manifest.json  (archive list)     │
│      └── /data/source-archive/<slug>/index.html      (static pages,     │
│                                          linked from the SPA, no React) │
└─────────────────────────────────────────────────────────────────────────┘
```

**Routing (changed 2026-08-11):** the app uses `BrowserRouter` with the spa-github-pages pattern — `public/404.html` redirects unknown paths to `/?/...` and a decoder in `index.html` restores the path before React mounts. This gives real, Google-indexable URLs (`/predictions`), which HashRouter's fragment URLs (`/#/predictions`) could never be. A shim in `index.html` rewrites legacy `#/` links (including old embeds) to path URLs. Do NOT revert to HashRouter — it made every page invisible to crawlers.

**Per-route static HTML (added 2026-08-11):** `scripts/prerender-seo.mjs` runs after `vite build` in the deploy workflow. For each of the six main routes it copies `dist/index.html`, rewrites the `<title>`, meta description, canonical, and og:/twitter: tags (via `applyHead()`), and injects substantive static HTML into `<div id="root">` — headline stats, top-company tables, timeline summaries, and the "Data updated" line, all generated from the verified JSON at build time. React replaces the static content the moment it mounts (progressive enhancement, not cloaking — the static content mirrors what the app renders). GitHub Pages resolves extensionless URLs to `.html` files, so `/predictions` is served from `dist/predictions.html` with **HTTP 200 and real content in the raw source**; `404.html` covers deeper links not pre-rendered. Since 2026-10-03 the script also writes a static page for every company (`dist/companies/<id>.html`, Section 4.6). **KEEP IN SYNC:** each route's title/description exists in two places — the `<Seo>` component call in `src/pages/*.tsx` and the `ROUTES` table in `scripts/prerender-seo.mjs`. Changing one without the other makes the crawler view and the client view disagree.

Two content systems coexist:

1. **The SPA** (`src/`), which renders all interactive pages from the JSON datasets.
2. **The source archive** (`public/data/source-archive/`), a set of self-contained static HTML provenance pages, one per event, with their own shared CSS. The SPA links out to them; they are not React routes.

---

## 2. Tech Stack

Versions are the semver ranges in `package.json` (v1.0.0).

| Component | Technology | Version |
|---|---|---|
| UI framework | React / React DOM | ^19.2.4 |
| Language | TypeScript | ~5.9.3 |
| Build tool | Vite (`@vitejs/plugin-react` ^6.0.0) | ^8.0.0 |
| Styling | Tailwind CSS (PostCSS pipeline, `@tailwindcss/postcss`) | ^4.2.1 |
| Charts | Recharts | ^3.8.0 |
| Animation | Framer Motion | ^12.38.0 |
| Routing | react-router-dom (BrowserRouter + 404 fallback) | ^7.13.1 |
| SEO / head tags | react-helmet-async | ^3.0.0 |
| Tables | @tanstack/react-table | ^8.21.3 |
| Dates | date-fns | ^4.1.0 |
| Viewport detection | react-intersection-observer | ^10.0.3 |
| Linting | ESLint 9 + typescript-eslint 8 | ^9.39.4 |

NPM scripts: `dev` (vite), `build` (`tsc -b && vite build`), `lint` (eslint), `preview` (vite preview).

TypeScript is strict mode (`strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `noEmit`; bundler module resolution) via `tsconfig.app.json` (src) and `tsconfig.node.json` (vite.config.ts). `vite.config.ts` sets `base: '/'` (custom-domain root, not a project subpath).

Note: `CHANGELOG.md` (1.0.0 entry) says "React 18"; the installed dependency is React 19. The changelog wording is stale.

---

## 3. Repository Layout

```
ai-economic-impact-dashboard/
├── .claude/
│   ├── launch.json              Dev server config (name "dashboard", vite on port 5173)
│   └── settings.local.json
├── .github/workflows/
│   ├── deploy.yml               Build + prerender + deploy to GitHub Pages on push to main
│   ├── research.yml             Automation Workflow A runner (weekly cron live + manual dispatch)
│   ├── sheet-prep.yml           One-shot staging-sheet prep (manual dispatch, dry-run default)
│   └── tracker-append.yml       Push a reviewed payload to the live tracker sheet (manual dispatch, dry-run default)
├── automation/                  Workflow A: queries.yml, research.py, sheet_prep.py, tracker_append.py, payloads/, tests/, README.md
├── scripts/
│   ├── prerender-seo.mjs        Post-build per-route and per-company static HTML, meta injection, sitemap (Section 4.6)
│   ├── job-categories.mjs       The 13 canonical job categories
│   ├── validate-job-categories.mjs  Deploy gate: fails on a non-canonical jobTypes value
│   └── og/                      Share-image generation: cards.mjs, site-data.mjs, generate.mjs (Section 4.7)
├── src/                         React application (see Section 4)
│   ├── App.tsx                  Routing (site, /embed/*, /widget/*)
│   ├── main.tsx                 Entry point
│   ├── index.css                Tailwind entry
│   ├── pages/                   Route components (+ pages/embeds/)
│   ├── components/              dashboard/, layout/, shared/, ui/
│   ├── hooks/                   useData, useAnimatedValue, usePageTracking, useTimelinePlayback
│   ├── content/                 learning-content.ts (Learn & Prepare copy)
│   ├── types/index.ts           All shared TypeScript interfaces
│   └── utils/                   constants.ts, dataTransformers.ts, formatters.ts
├── public/
│   ├── CNAME                    aishift.michaelkristof.com
│   ├── 404.html                 spa-github-pages fallback (encodes unknown paths to /?/...)
│   ├── robots.txt, sitemap.xml  Crawler directives + a 6-route sitemap (the deployed sitemap is regenerated by prerender-seo, Section 4.6)
│   └── data/
│       ├── verified/            CANONICAL runtime datasets (7 datasets + meta.json, Section 5)
│       └── source-archive/      Static provenance pages (Section 6)
├── data/                        LEGACY/stale copy (pending/, schemas/, verified/) - see gotcha 10.1
├── docs/                        Project docs (this file, PRD.md, about-the-dashboard.md,
│   │                            automation-implementation-plan.md, ai-shift-automation-brief.md,
│   │                            search-terms, data/ research refs)
├── notes/                       Mandatory task-by-task work logs (Section 9)
├── dist/                        Build output (gitignored)
├── _ignore/                     Untracked local working dir (source PDFs, raw captures) - do not modify
├── assets/                      Untracked local working dir (reference docs, CSVs) - do not modify
├── index.html                   SPA shell: meta/OG tags, Google Analytics gtag, Inter font
├── vite.config.ts, tsconfig*.json, eslint.config.js, postcss.config.js
├── CLAUDE.md, AGENTS.md, CHANGELOG.md, README.md
└── package.json                 v1.0.0
```

`_ignore/` and `assets/` are intentionally untracked working directories (git shows them as `??`; they are not in `.gitignore`). Project rules forbid modifying or deleting them.

---

## 4. Frontend Architecture

### 4.1 Routing map (`src/App.tsx`)

All routes live under `BrowserRouter` (real path URLs; legacy `#/` links redirected by the index.html shim). `AppContent` branches on `location.pathname` prefix into three render modes.

**Main site (Header + Footer chrome):**

| Route | Component | Data props |
|---|---|---|
| `/` | `DashboardPage` | events, plannedEvents, creationEvents |
| `/predictions` | `PredictionsPage` | predictions |
| `/timeline` | `TimelinePage` | events, plannedEvents, creationEvents |
| `/ai-advances` | `AITimelinePage` | milestones |
| `/companies/:id?` | `CompanyPage` | events, plannedEvents, creationEvents, companies, milestones |
| `/learn` | `LearningPage` | (static content from `src/content/learning-content.ts`) |

**Embed routes** (`/embed/*`, wrapped in `EmbedLayout` instead of Header/Footer, for iframe embedding of full pages): `/embed/dashboard`, `/embed/predictions`, `/embed/timeline`, `/embed/ai-advances`, `/embed/companies/:id?`, `/embed/learn`.

**Widget routes** (`/widget/*`, no wrapper at all, minimal single-component embeds from `src/pages/embeds/`):

| Route | Component |
|---|---|
| `/widget/stats` | `StatsEmbed` |
| `/widget/trend` | `TrendWidget` |
| `/widget/job-types` | `JobTypesWidget` |
| `/widget/industry` | `IndustryWidget` |
| `/widget/planned` | `PlannedWidget` |
| `/widget/creation` | `CreationWidget` |
| `/widget/companies` | `CompaniesWidget` |

Navigation items are defined in `src/utils/constants.ts` (`NAV_ITEMS`).

### 4.2 Data flow (`src/hooks/useData.ts`)

- `const BASE = import.meta.env.BASE_URL;` then `fetch(`${BASE}data/verified/<file>.json`)`.
- One `Promise.all` fetches all seven datasets on mount. `job-displacement-events.json` and `ai-milestones.json` are required (a failure sets the app-level error state); the other five (`company-profiles`, `predictions`, `planned-layoffs`, `ai-job-creation`, `jobs-never-created`) each carry `.catch(() => [])` so a missing file degrades to an empty array instead of breaking the app.
- Events are tagged `status: 'verified'` by default if the field is absent.
- The hook returns `{ events, plannedEvents, creationEvents, neverCreated, milestones, companies, predictions, loading, error }`; App passes slices down as props. There is no state library and no caching layer.
- **`getHeroBreakdown` (`src/utils/dataTransformers.ts`) is the single source for the hero numbers**, used by both the dashboard and `/widget/stats`: `total` (= layoffs + realized never-created), `layoffs`, `neverCreated`, `robotics`, `jobsCreated`, top industry, top job type, `plannedCuts`, and `futureNeverCreated`. Helpers `getCountedNeverCreated` (verified and not `isProjection`), `getFutureNeverCreated` (verified and `isProjection`), and `sumNeverCreated` feed it. Disputed entries are in neither group.

`SourceArchive.tsx` separately fetches `${BASE}data/source-archive/archive-manifest.json` to render the filterable archive list on the dashboard, and `DashboardPage.tsx` separately fetches `${BASE}data/verified/meta.json` for the "Data updated: <date>" indicator (missing file degrades silently — the indicator just doesn't render).

### 4.3 Page and component inventory

- `src/pages/`: `DashboardPage`, `PredictionsPage`, `TimelinePage` (slider/story playback via `useTimelinePlayback`; its running counter includes realized never-created), `AITimelinePage`, `CompanyPage` (list + `CompanyDetail` drill-down; company list is derived from the union of companies found in milestones, displacement, planned, and creation data, since `company-profiles.json` is currently empty), `LearningPage`, plus `pages/embeds/` (`StatsEmbed`, `ChartWidgets`).
- `src/components/dashboard/`: `TotalCounter` (the themed hero: takes `HeroData` from `getHeroBreakdown` and a `HeroTheme` of dark, light, or transparent; also holds the `/widget/stats` embed snippets), `TrendLine` (stacked areas: Robotics, Software AI, Jobs Never Created, so the top edge equals the headline), `JobTypesChart`, `IndustryBreakdown`, `CompanyTable`, `ChatGPTGrowthChart`, `SourceArchive`, `JobsNeverCreatedCard` (marks future estimates).
- `src/components/layout/`: `Header`, `Footer`, `PageLayout`, `EmbedLayout`.
- `src/components/shared/`: `AnimatedNumber`, `ChartContainer`, `SourceCitation`, `Seo`, `RoboticsBadge` (also exports `isRobotics`).
- `src/components/ui/`: `EmbedButton`, `CardEmbedButton`.
- `src/utils/dataTransformers.ts`: all aggregation functions (`getTotalJobsCut`, `getTopJobTypes`, `getIndustryBreakdown`, `getMonthlyTrend`, `getCumulativeTrend`, `getCompanySummary`, date filters). **Every aggregation filters out `isProjection` events** (see Section 5.2). Industry names are normalized through the `INDUSTRY_GROUP` map (e.g. "Financial Technology" → "Finance").
- `src/utils/constants.ts`: `JOB_TYPE_LABELS`, `INDUSTRY_COLORS`, `CHART_COLORS`, `TIMELINE_START = '2022-11-30'` (ChatGPT launch), `NAV_ITEMS`.
- `src/hooks/usePageTracking.ts`: fires a `gtag` `page_view` event on every route change (`location.pathname`; Google Analytics is loaded in `index.html`).

### 4.4 Embed/widget system

`EmbedButton` generates a copy-paste iframe snippet hardcoded to the production origin (path URL since the BrowserRouter change; old `#/embed` snippets still work via the hash shim):

```
https://aishift.michaelkristof.com/embed{path}
```

wrapped in `<iframe ... width="100%" height="700">`. The `/widget/stats` snippets (in `TotalCounter`) are separate: path URLs (`/widget/stats`, with `?theme=light` or `?theme=transparent`), default `height="560"`, with guidance of about 400 full width, 560 in a blog column, and 730 on narrow or mobile layouts (measured, no horizontal overflow from 375 to 1100 px). `/embed/*` pages keep page chrome minus Header/Footer (via `EmbedLayout`); `/widget/*` routes render a single chart or stat block with no wrapper for tight inline embedding. All embeds share the same `useData` fetch, so they always reflect the deployed JSON.

### 4.5 Documented gotcha: counter animation pauses when hidden

`useAnimatedValue` drives `AnimatedNumber` / `TotalCounter` with `requestAnimationFrame` (ease-out cubic over a default 2000 ms). Browsers throttle or suspend `requestAnimationFrame` in hidden/background tabs and hidden preview panes, so a counter can appear frozen mid-animation at a wrong-looking number. **This is not a data bug.** Verify totals by fetching the served JSON, not by reading a mid-animation screenshot (lesson recorded in `notes/research-backfill-2026-08/README.md`).

### 4.6 SEO subsystem (added 2026-08-11)

Search-facing naming: the home H1 and titles are search-phrase-led ("Jobs Lost to AI", "Will AI Take My Job?...", "Companies Replacing Workers With AI..."); "AI Economic Impact Dashboard" is the `alternateName` in structured data. The moving parts:

| Piece | Location | Role |
|---|---|---|
| `<Seo>` component | `src/components/shared/Seo.tsx` | Per-route `<title>`, meta description, canonical, og: tags (including `og:image`), and `twitter:title` / `twitter:description` / `twitter:image` via react-helmet-async (provider in `App.tsx`); every main page calls it. A `shareImage(path)` mapping picks the image: `/` → `/og/index.png`, `/companies/<id>` → `/og/company/<id>.png`, other routes → `/og/<route>.png` |
| Prerender script | `scripts/prerender-seo.mjs` | Build-time per-route static HTML; `applyHead()` writes every head tag (title, description, canonical, og:, twitter:) for routes and company pages; its `ROUTES` table must stay in sync with the `<Seo>` calls |
| Static company pages | `scripts/prerender-seo.mjs` | Writes 147 pages `dist/companies/<id>.html`, each with its own title, description, canonical, share image, and static content. Because GitHub Pages may resolve `/companies` to the `companies/` folder (while `/companies.html` also exists), it also writes `dist/companies/index.html` as a mirror of the companies listing page. The company list comes from `companyRecords()` in `scripts/og/site-data.mjs` |
| `sitemap.xml` / `robots.txt` | `public/` (robots), generated sitemap in `dist/` | `prerender-seo.mjs` generates `dist/sitemap.xml` at deploy: 153 urls (6 routes + 147 company pages), `lastmod` = `meta.dataLastUpdated`. Robots allows all and points at the sitemap |
| JSON-LD | inline in `index.html` | `@graph` with `WebSite` (+ `alternateName`) and `Dataset` nodes |
| Canonical strategy | `Seo.tsx` (`path` prop) + prerender | Canonical is always `https://aishift.michaelkristof.com<path>`; embed/widget variants of a page pass the main-site path so crawlers canonicalize to it |
| Hash-link shim | inline script in `index.html` | Rewrites legacy HashRouter URLs (`/#/predictions`, `/#/embed/dashboard`, `/#/widget/stats`) to path URLs via `history.replaceState`, so old links and embeds keep working |

### 4.7 Social share images (added 2026-10-03)

`scripts/og/` renders 1200x630 share images at deploy, from live data, with no browser:

| File | Role |
|---|---|
| `cards.mjs` | satori + resvg card templates (`dashboardCard`, `routeCard`, `companyCard`, `archiveCard`), Inter font loaded from `@fontsource/inter`, `renderPng()` |
| `site-data.mjs` | Shared data loader (the six verified datasets plus the archive manifest) and `companyRecords()`, which mirrors the Companies page list by parsing `COMPANY_DISPLAY` and `COUNTRY_SLUGS` out of `src/pages/CompanyPage.tsx` (it throws if the parse fails, so a refactor of that file breaks the build loudly) |
| `generate.mjs` | Writes `dist/og/<route>.png` (6 section pages), `dist/og/company/<id>.png` (147), and `dist/og/archive/<dir>.png` (131), and injects share tags into the deployed copies of the static archive pages |

About 284 images, roughly 50 seconds and 31 MB per run. Image paths are fixed so `prerender-seo.mjs` and `Seo.tsx` can reference them without waiting for generation. Archive cards show our own summary without quotation marks (not a quote). LinkedIn and Facebook cache link previews for about 7 days; re-scrape changed links with LinkedIn Post Inspector or the Facebook Sharing Debugger.

---

## 5. Data Architecture

### 5.1 Location and conventions

Canonical datasets live in **`public/data/verified/`** (Vite copies `public/` into `dist/` at build time). Counts as of 2026-10-03:

| File | Entries | ID scheme | Notes |
|---|---|---|---|
| `job-displacement-events.json` | 96 | `evt-NNN` | All 96 counted (328,106 jobs, 81 companies); none currently `isProjection` |
| `planned-layoffs.json` | 15 | `plan-NNN` | 151,900 planned jobs, never counted in the headline |
| `ai-job-creation.json` | 16 | `create-NNN` | `ai-adoption-roles` and `support` categories |
| `jobs-never-created.json` | 3 | `never-NNN` | IBM, Klarna, DBS (Section 5.9) |
| `ai-milestones.json` | 420 | `ms-NNN` and `ms-bNNN` | `b` prefix = pre-2022 historical backfill entries |
| `company-profiles.json` | 0 | `[]` | Empty array; company pages derive from other datasets |
| `predictions.json` | 9 | `pred-NNN` | Across the four timeframe buckets; re-grounded "As of Aug 2026" (see 5.7) |
| `meta.json` | n/a | n/a | `{ dataLastUpdated: "YYYY-MM-DD" }` + a `_comment`; drives the dashboard's "Data updated" indicator (see 5.8) |

Shared conventions across datasets:

- **Date-sorted arrays:** events and milestones are stored in ascending `date` order (ISO `YYYY-MM-DD`). Verified programmatically.
- **Sequential ids** per file; new entries take the next number.
- **Hedged numbers preserved in prose:** `description` / `reasonGiven` keep the source's exact phrasing ("~65 roles (~32% of global workforce)"); the numeric `jobsCut` field holds a single integer.
- **`jobsCut: 0` means undisclosed count**, and the UI shows "Undisclosed" (e.g. IBM creation entry). 3 displacement events currently carry 0.
- **`jobTypes` values are canonical slugs** (13 categories, `scripts/job-categories.mjs`; labels in `JOB_TYPE_LABELS`). Deploy fails on any other value (`scripts/validate-job-categories.mjs`). An event can carry more than one category (35 do), so category counts sum to more than the event total. AI Job Creation `jobTypes` are role descriptions and are not normalized.
- **`aiReplacement: boolean`** flags whether AI is a stated replacement driver.
- **Every entry carries `sources[]`** ({url, title, publisher, date}) and `verificationStatus` (all currently "verified").
- **Attribution rule ("THE RULE"):** an event only enters the dataset if AI is attributed by the company itself (statement, exec quote, memo, earnings call, SEC filing) or by reporting holding documented proof. Journalist framing alone does not qualify; an explicit company denial is a hard fail. See Sections 8 and 10.

### 5.2 job-displacement-events.json

TypeScript shape: `DisplacementEvent` in `src/types/index.ts`. Core fields: `id, company (slug), companyName, date, jobsCut, jobTypes[], jobTypesDetail?, displacementMode?, industry, region, country, aiReplacement, reasonGiven?, description, sources[], verificationStatus, isProjection?, aiToolsMentioned?, notes?`. `jobTypes` holds canonical category slugs; `jobTypesDetail?: string[]` keeps the source's original wording (shown as chips on company pages). `displacementMode?: 'software' | 'robotics'`: absent means software AI; `'robotics'` marks layoffs from robots or autonomous systems (owner ruling 2026-10-02, same attribution gate). Tagged: evt-025 UPS (20,000), evt-062 Ocado (1,000), and plan-011 UPS in planned.

**`isProjection: true` excludes an event from all totals and charts** (`dataTransformers.ts` filters it everywhere). No layoff event uses it today: IBM's projected 7,800 (evt-007, with its duplicate plan-001) was moved to `jobs-never-created.json` on 2026-10-02, as was Klarna (evt-023, plan-008). The flag is still honored by the transformers and is now used by Jobs Never Created entries (Section 5.9).

Abbreviated real example:

```json
{
  "id": "evt-001",
  "company": "meta",
  "companyName": "Meta",
  "date": "2022-11-09",
  "jobsCut": 11000,
  "jobTypes": ["company-wide"],
  "industry": "Technology",
  "region": "North America",
  "country": "US",
  "aiReplacement": true,
  "reasonGiven": "AI-Driven Restructuring: Zuckerberg noted the need to ... \"AI discovery engine\" ...",
  "description": "Meta cut 11,000 jobs across all departments. ...",
  "sources": [{ "url": "https://about.fb.com/news/2022/11/...", "title": "Meta layoffs",
                "publisher": "News Source", "date": "2022-11-09" }],
  "verificationStatus": "verified"
}
```

### 5.3 planned-layoffs.json

Same `DisplacementEvent` shape (including `displacementMode` and `jobTypesDetail`) plus: `status` ("announced" | "hiring-freeze" are the values in use; the type also allows "verified" and "creation"), `timeline?` (free text, e.g. "Ongoing (5-year period)"), `jobsAlreadyCut?`. Planned totals are displayed separately and never added to the displaced-jobs headline number.

```json
{
  "id": "plan-002",
  "company": "vodafone", "companyName": "Vodafone", "date": "2023-05-16",
  "jobsCut": 11000, "jobTypes": ["administrative", "operations"],
  "jobTypesDetail": ["Corporate", "Operations"],
  "industry": "Telecommunications", "region": "Global", "country": "UK",
  "aiReplacement": true,
  "description": "New CEO Margherita Della Valle announced 11,000 cuts over three years ...",
  "sources": [{ "url": "https://www.reuters.com/business/media-telecom/...", "publisher": "Reuters", "...": "..." }],
  "verificationStatus": "verified",
  "status": "announced",
  "timeline": "Over 3 years (by ~2026)"
}
```

### 5.4 ai-job-creation.json

Same base shape with `status: "creation"`, `jobsCut: 0`, `aiReplacement: false`, plus creation-specific fields:

- `jobsCreated: number` (0 = undisclosed, shown as "Undisclosed" and excluded from the creation headline total)
- `jobRolesCreated: string` (free-text role summary)
- `creationCategory: "ai-adoption-roles" | "support"` per the owner's tech-transition framework: direct AI-adoption hiring (e.g. Box, Thomson Reuters) vs support-industry jobs created around AI build-out (data centers, chip fabs). Present on every entry.
- `context: string`

```json
{
  "id": "create-002",
  "company": "cloudflare", "companyName": "Cloudflare", "date": "2025-09-22",
  "jobsCut": 0, "aiReplacement": false, "status": "creation",
  "jobTypes": ["Engineering", "AI infrastructure"],
  "jobRolesCreated": "Engineering / AI infrastructure",
  "jobsCreated": 1111,
  "creationCategory": "ai-adoption-roles",
  "context": "Cloudflare announced plans to hire 1,111 interns in 2026 ...",
  "sources": [{ "url": "https://blog.cloudflare.com/...", "publisher": "Cloudflare", "...": "..." }],
  "verificationStatus": "verified"
}
```

### 5.5 ai-milestones.json

420 entries covering 1943 through 2026-10-02. `type` enum (6 values, counts): `model-release` (113), `breakthrough` (99), `company-launch` (98), `regulation` (41), `partnership` (40), `acquisition` (29).

**Dominant schema** (319 entries): `id, company, date, type, name, description, category, significance ("high"|"medium"|"low"), sources[]`. A further 33 entries add an optional `types: MilestoneType[]` array for multi-type milestones (the scalar `type` remains the primary); e.g. OpenAI Dots carries company-launch + model-release so it appears under both filters.

```json
{
  "id": "ms-b001",
  "company": "academic", "date": "1943-01-01", "type": "breakthrough",
  "name": "McCulloch-Pitts Artificial Neuron",
  "description": "...first mathematical model of a neuron...",
  "category": "research", "significance": "high",
  "sources": [{ "url": "...", "title": "...", "publisher": "...", "date": "1943-01-01" }]
}
```

**Legacy schema (19 entries, unchanged on 2026-10-03):** 17 entries use an older shape with `title`, `amount`, and a singular `source` string instead of `name`/`sources[]`/`category`/`significance`; 2 hybrid entries carry both old and new fields. The `AIMilestone` type keeps `title?`, `amount?`, `source?` optional for this reason. New entries must use the dominant schema; the 19 legacy entries are a known normalization backlog.

**`publicRelease?: boolean` (added 2026-08-11):** optional flag rendering a "Public release" badge on the AI Advances page; 6 entries carry it as of 2026-10-03. The AI Advances page sorts newest-first by default with an order toggle. The ChatGPT launch milestone (ms-029, 2022-11-30) is a "company-launch"-type entry that was enriched on 2026-08-11 — it does not appear under the Model Releases filter, which is why earlier audits "missed" it.

### 5.6 company-profiles.json

Currently an empty array. The `CompanyProfile` interface (`id, name, industry, headquarters, website?, description, aiProducts[], acquisitions[], fundingRounds[], totalJobsDisplaced, events[]`) is defined and wired through `useData` and `CompanyPage`, but the page falls back to deriving its company list from milestones + displacement + planned + creation data when no profile exists. Populating profiles is future work.

### 5.7 predictions.json

9 entries, `pred-NNN` (2 each for 3-months / 6-months / 12-months, 3 for 3-5-years — an entry-level white-collar prediction was added 2026-08-11). Shape: `id, timeframe ("3-months" | "6-months" | "12-months" | "3-5-years"), targetDate, createdDate, jobType, industry, estimatedJobsAtRisk {low, mid, high}, riskLevel ("high"|"medium"|"low"), basis, methodology, sources[] (string URLs, may be empty), confidence (0-1)`.

**Basis convention (2026-08-11 rewrite):** every `basis` opens with the grounding date ("As of Aug 2026: ..."), all figures are labeled projections, and the set is re-grounded against observed run-rates on a roughly quarterly cadence (the Aug 2026 pass revised short-horizon ranges DOWN to match actuals).

### 5.8 meta.json

`{ "dataLastUpdated": "YYYY-MM-DD" }` plus an embedded `_comment` stating the contract: **every commit that changes files in `public/data/verified/` must bump `dataLastUpdated`** — manually today, and by the publish automation (Workflow B) once built. `DashboardPage.tsx` renders it as "Data updated: <date>"; the prerender script injects the same line into the static HTML.

### 5.9 jobs-never-created.json

Added 2026-10-02 (owner-approved name): work given to AI or robots instead of new hires or replacements. Typed as `NeverCreatedEntry` in `src/types/index.ts`. Fields: `id` (`never-NNN`), `company`, `companyName`, `date`, `context`, `jobsNeverCreated`, `estimateBasis` (plain-language math), `displacementMode` (`'software' | 'robotics'`), `status` (`'verified' | 'disputed'`), `isProjection?`, `quote`, `description`, `sources[]`.

- **Gate:** a company-stated number, or a company-stated ratio applied to a stated or official baseline, with the math in `estimateBasis`. A figure the company disputes is entered as `disputed` (shown flagged) or not entered at all (e.g. Amazon 600K).
- **Counting:** `status: 'verified'` and not `isProjection` counts toward the headline total (Klarna 1,200). `isProjection: true` entries are future multi-year estimates, shown but never counted (IBM 7,800 over five years, DBS 4,000 over three years). `disputed` entries are excluded from both groups.
- **Current entries (3):** never-001 IBM (7,800, CEO-stated 30% of about 26,000 back-office roles), never-002 Klarna (1,200, 5,000 to 3,800 via freeze and attrition), never-003 DBS (4,000, contract and temp roles not renewed).
- Never added to the layoff totals. `getHeroBreakdown` sums it into `total` only through `getCountedNeverCreated`. The headline as of 2026-10-03 is 329,306 (328,106 layoffs + 1,200).

---

## 6. Source Archive Subsystem

Location: `public/data/source-archive/`. Purpose: durable, copyright-safe provenance for every tracked event — meta facts, a verbatim short excerpt, a full-page screenshot, and the live source link. 131 event pages as of 2026-10-03 (96 main, 15 planned, 16 created, 4 never), all in excerpt-only format.

### 6.1 Directory anatomy

```
public/data/source-archive/
├── archive-manifest.json        Machine-readable index (131 entries) - drives the SPA list
├── index.html, app.js, style.css   Legacy standalone archive index + filter JS + SHARED CSS
├── HANDOVER.md                  Older subsystem doc (partly stale: says 78 pages, full-text era)
├── txt/                         89 full-article .txt files - kept intentionally as a LOCAL
│                                archive (owner decision 2026-08-10); not linked from any page
└── YYYY-MM-DD-company/          One directory per event
    ├── index.html               Self-contained page (links ../style.css)
    └── YYYY-MM-DD-company-screenshot.png
```

`style.css` is still load-bearing (every event page links it). The root `index.html` + `app.js` standalone archive index is legacy: the SPA's `SourceArchive` component replaced it and page back-links now point to the dashboard (`/`), not the archive index. **VERIFY** whether the root archive `index.html` should be retired or kept reachable.

### 6.2 Manifest schema (`archive-manifest.json`)

JSON array, one object per page:

```json
{
  "dir_name": "2022-11-09-meta",
  "old_slug": "meta-20260113",          // optional; only on the 89 pages renamed from the old scheme
  "date": "2022-11-09",
  "company": "Meta",
  "jobs": "11,000",                     // STRING - hedged phrasing preserved ("~4,000 (<5%)")
  "category": "Across all departments",
  "tab": "main",                        // "main" (96) | "planned" (15) | "created" (16) | "never" (4)
  "type": "layoff",                     // free text: layoff, hiring-freeze, created, never-created, ...
  "reason": "AI-Driven Restructuring: ...",
  "source_url": "https://about.fb.com/news/2022/11/...",
  "screenshot_file": "2022-11-09-meta-screenshot.png",
  "article_file": "2022-11-09-meta.txt" // "" for post-migration pages with no txt file
}
```

The SPA's `SourceArchive` component consumes exactly these fields and maps `tab` to its filter tabs (All / Jobs Displaced / Planned-Announced / Jobs Created / Jobs Never Created). Never-created pages use a teal palette (the `never-*` color tokens in the SPA), distinct from Robotics (violet) and Planned (amber).

### 6.3 Page anatomy (reference: `2026-05-13-cisco/index.html`)

Top to bottom, every page contains:

1. Dark header bar ("AI Job Loss -- Source Archive", links to `/`)
2. "Back to dashboard" link (`href="/"`)
3. `h1.event-heading` company name (planned/created/never-created pages add a colored badge)
4. `.meta-grid`: Date, Jobs Affected, Category, Type
5. "Details" section (`.reason-text`): the attribution reason, quotes preserved
6. `.source-row`: "Source ↗ domain.com" linking the live article
7. `.article-section`: article headline + "Published: YYYY-MM-DD" + excerpt body
8. `.screenshot-accordion`: collapsed by default; full-page PNG + "Captured from: <url>" caption
9. `.archived-stamp`: "Archived on <Month D, YYYY>"
10. `.event-nav`: prev/next links to neighboring event pages

### 6.4 Excerpt format specification

The article body is **excerpt-only** (copyright remediation completed 2026-08-10, all pages):

- One verbatim excerpt of the article's opening, **75 words maximum**, ending on a sentence boundary
- Wrapped in curly double quotes (" ... ") inside a `<p>`
- Followed by the fixed provenance note: `<p><em>Excerpt shown for provenance. Read the full article at the source link above.</em></p>`
- Headline and published date are retained verbatim above the excerpt
- No other article text is reproduced anywhere on the page (full text lives only in the unlinked local `txt/` folder)

### 6.5 Slug and navigation conventions

- **Slug:** `YYYY-MM-DD-company` (lowercase, hyphenated, punctuation stripped), e.g. `2026-05-13-cisco`. Same-day collisions append `-planned`, `-created`, or `-layoff` (e.g. `2023-05-01-ibm` vs `2023-05-01-ibm-planned`).
- **Screenshot:** `<slug>-screenshot.png` inside the page directory; full-page capture of the source article.
- **Nav chain:** every page's prev/next links form a single chain ordered by directory date across ALL tabs (main, planned, created, never interleaved chronologically). Adding a page means regenerating its own nav plus rewriting the nav lines of both date-neighbors; the proven approach is a finalize script that rebuilds manifest + nav together rather than hand-editing (see Section 9).
- Hiring-freeze convention (legacy, from HANDOVER.md): freeze companies may carry an asterisk in the display name and a "*HIRING FREEZE" prefix in the reason.

### 6.6 Screenshot tooling

- Primary: `npx playwright screenshot --channel chrome <url> <out.png>` (uses system Chrome; no browser download).
- Bot-walled sources (DataDome, "Are you a robot?"): fallback chain direct capture → consent-banner dismissal → Firecrawl scrape/screenshot. This chain achieved zero manual captures in the August 2026 backfill.
- If everything fails: flag "Needs Manual Capture"; the owner captures in a logged-in browser and drops the PNG into the page folder. Never publish a broken/block-page capture.

---

## 7. Build and Deploy

- **Trigger:** push to `main`, or manual `workflow_dispatch` (`.github/workflows/deploy.yml`).
- **Steps (updated 2026-10-03):** checkout → Node 20 (npm cache) → `npm ci` → `node scripts/validate-job-categories.mjs` (fails the deploy on a non-canonical job category) → `npm run build` (`tsc -b && vite build`) → `node scripts/prerender-seo.mjs` (per-route and per-company static HTML plus `dist/sitemap.xml`, Section 4.6) → `node scripts/og/generate.mjs` (share images, Section 4.7) → configure-pages → upload `dist/` artifact → `deploy-pages`. The old `cp -r data/verified dist/data/verified` legacy step has been **removed**.
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`; concurrency group `pages`.
- **Serving:** GitHub Pages with custom domain `aishift.michaelkristof.com` via `public/CNAME` (copied into `dist/` by Vite). `vite.config.ts` `base: '/'` matches the custom-domain root. Pages' extensionless resolution serves `/predictions` from `predictions.html` (HTTP 200) and company pages from `companies/<id>.html`; `404.html` handles everything else.
- **Data in the build:** Vite copies all of `public/` (including `data/verified/` and the entire `source-archive/`) into `dist/`; the prerender script then reads the same JSON to generate the static route HTML.
- Local production check: `npm run build && npm run preview`.

---

## 8. Automation Architecture (Workflow A live; B and C pending)

Status as of 2026-10-03: **Workflow A (research → staging) is built, validated, and on a weekly schedule.** It lives in `automation/`, runs via `.github/workflows/research.yml`, and was validated by a dry run (35053235405) and a live run (35468244974); the **cron has been live since 2026-09-19 (Mondays 06:00 CT)**. It sweeps four categories: `losses`, `planned`, `created`, `never`. **Sheet prep is scripted** (`automation/sheet_prep.py`, idempotent) with its own manual-dispatch workflow `.github/workflows/sheet-prep.yml` (dry-run default); it also creates the "Jobs Never Created" staging tab. The digest send path and Sheets reads are verified live; the staging **append** path stays **UNTESTED** until a run actually stages rows (a quiet week stages zero by design; see automation/README.md's verified-vs-UNTESTED section). **Workflows B (publish) and C (advances) are not yet built.** Spec of record: `docs/automation-implementation-plan.md` (v1.0, approved) layered over `docs/ai-shift-automation-brief.md` (schemas, attribution gate, acceptance criteria); the n8n/always-on-machine design is retired. Environment details, spreadsheet IDs, and hostnames are deliberately excluded from this document.

### 8.0 Implementation facts (verified in code, 2026-08-11)

- **Model and cost caps:** `research.py` defaults to `claude-sonnet-5` (`RESEARCH_MODEL` env-overridable) with hard per-category spend caps: `WEB_SEARCH_MAX_USES` (default 10) and `MAX_OUTPUT_TOKENS` (default 10,000), bounding a 4-category run to ≤48 web searches / ≤40k output tokens; every run logs actual usage per category (web_search_requests, input/output tokens). **Cost-control principle: pipelines never default to premium models** — the 2026-08-11 dry runs on the premium tier burned ~$36 across two runs; Sonnet with caps bounds a full run to roughly $1-3.
- **Streaming is required.** A non-streaming web-search request can exceed the SDK's HTTP timeout, which then **retries silently** — the 2026-08-11 dry run burned the workflow's entire 45-minute budget (and much of the ~$36) that way. `research.py` uses `client.messages.stream(...)`; keep it that way.
- **Tab resolution is by title/alias first, gid as fallback** (`tab_aliases` per category), because sheet gids change when tabs are recreated. The AI Advances tab has no gid at all — it is created by `sheet_prep.py` and always resolved by title.
- **Control column is "Archive Status", not "Status".** Earlier revisions appended a plain "Status" control column, which collides with the Planned/Announced tab's business `Status` column. `sheet_prep.py` renames only the exact `Approval / Status / Archive Link` sequence to `Archive Status`, never a business column.
- **`--categories` flag** (workflow default `losses,planned,created,never`): selects which sweeps run; `advances` is deliberately excluded from the default because it belongs to the weekly Workflow C cadence. `research.yml` exposes `window`, `dry_run`, and `categories` as dispatch inputs.
- **Cadence (owner decision 2026-08-11): weekly, Mondays 6:00 AM CT** (`cron: 0 11 * * 1`, enabled 2026-09-19), not the every-2-days cadence in the original brief.
- **Transport retry:** `research.py` wraps every Sheets call in `retry_transport` (3 attempts, a fresh service and connection per retry). The TLS connection goes stale during the long research sweeps and the first Sheets call afterward can die with `ssl.SSLEOFError`, which googleapiclient does not retry. Transport errors only; API errors (quota, permissions) still raise immediately.
- **Scope:** the losses and planned task text and query bank cover robot and autonomous-system layoffs (owner ruling 2026-10-02); the `never` category has its own queries in `queries.yml` and task text in `research.py`.
- **Tracker utility:** `automation/tracker_append.py` plus `.github/workflows/tracker-append.yml` (manual dispatch, `dry_run` defaults to true, payload is a committed file in `automation/payloads/`). A payload may contain, in execution order: `create_tabs`, appends, edits, `set_columns` (insert a column and match-and-fill; ambiguous rows are skipped and reported), and guarded `deletes` (skipped unless the match is exact). Always dry-run first; **appends are not idempotent**, so never re-run a payload live. The tracker sheet now has a "Category" column (canonical labels, next to "Job Position/Category") on Losses and Planned/Announced, and a "Jobs Never Created" tab. The future publish workflow must fill Category on new rows.

### 8.1 Three GitHub Actions workflows

| Workflow | Schedule | Function |
|---|---|---|
| **A - Research** | weekly, Mondays 6:00 AM CT (cron live) + manual dispatch | Query-bank sweep (config file `automation/queries.yml`) → LLM structuring → attribution gate → dedup → append candidate rows to the staging sheet → email digest |
| **B - Publish** | daily, 7:00 AM CT + manual dispatch (not yet built) | Poll staging for Approved+unpublished rows; per row: append to live tracker sheet → generate dashboard JSON entry (next id, schema conventions, `creationCategory`) → Playwright screenshot with the bot-wall fallback chain → archive.org Save Page Now (SPN2) → generate excerpt archive page + manifest + nav rebuild → **bump `meta.json` `dataLastUpdated`** → single commit → Pages auto-deploys → stamp row Published + archive link |
| **C - Advances** | weekly, Mon 6:00 AM CT | Milestone sweep across the 6 types → staging "AI Advances" tab → approved rows appended to `ai-milestones.json` (no archive pages or screenshots) |

Sequential processing per row (no parallel captures); idempotent (Published rows never reprocessed); the commit is the last step so nothing half-publishes.

### 8.2 Staging-sheet control columns (appended to every tab)

| Column | Writer | Values |
|---|---|---|
| `Confidence` | automation | 0-100 from the gate |
| `Attribution` | automation | who said it ("CEO memo", "10-K", "spokesperson") |
| `Quote` | automation | the decisive verbatim quote |
| `Approval` | **owner** (dropdown) | blank · Approved · Rejected · Needs Edit |
| `Archive Status` | automation | blank · Published YYYY-MM-DD · Needs Manual Capture (renamed from "Status" — see 8.0, it collided with the Planned tab's business Status column) |
| `Archive Link` | automation | URL of the generated archive page |

Owner approval is the only path to publication (Stage 2, manual veto point). The owner may edit any cell before approving; row content at publish time is what ships. Rejected rows stay as dedup records. Data tabs keep the live tracker's column order; a new "AI Advances" tab uses `Date | Company | Type | Name | Description | Category | Significance | Source Link` with `Type` restricted to the 6 milestone values.

### 8.3 Attribution gate (THE RULE, encoded)

1. Valid attribution: company statement, named exec quote, internal memo, press release, earnings call, SEC filing, or a journalist holding documented proof. Invalid alone: journalist framing, anonymous sources, third-party inference.
2. Targeted denial check per company; an explicit company denial is a hard fail regardless of framing (the Verizon/Zillow/Etsy pattern).
3. Confidence below 70 never reaches staging; 70-84 is staged with a warning flag.
4. Company phrases like "advances in technology" may count at model judgment, but the exact phrase is always preserved so the owner can overrule (the Darrow ruling).

Global field rules carried from the brief: ISO dates; hedged number phrasing preserved verbatim; reasons are 1-3 factual sentences with a direct quote when available; dedup key = normalized company + event month + count bucket, checked against staging (including Rejected), live tracker, and dashboard JSON.

### 8.4 Secrets (names only)

As implemented in `research.yml` / `sheet-prep.yml` / automation/README.md: `ANTHROPIC_API_KEY`, `GOOGLE_SA_KEY`, `SHEET_STAGING_ID`, `SHEET_TRACKER_ID`, `DIGEST_TO`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, plus `ARCHIVE_ORG_S3_KEYS` (not used by Workflow A; needed at build-order step 4 for Workflow B Save Page Now). `DIGEST_TO` must be a real mailbox (the owner's), not the service-account address (see gotcha 20). Sheet IDs are secrets too — never hardcoded. Estimated running cost ~$5-10/month.

### 8.5 Dry-run/testing approach (build order)

1. Sheet prep script (control columns, dropdowns, AI Advances tab). 2. Workflow A with schedule OFF, 2-3 manual audited runs; re-run must stage zero. 3. Enable A (**done 2026-09-19**). 4. Workflow B against a single approved test row end-to-end, including a paywalled row landing in Needs Manual Capture rather than half-publishing. 5. Enable B. 6. Workflow C. 7. Retire the manual process; `notes/` pipeline docs become the runbook. Acceptance criteria: brief section 18.

---

## 9. Operational Runbook Pointers

- **Dev server:** `.claude/launch.json` defines configuration "dashboard": node runs `node_modules/.bin/vite --port 5173`. Equivalent manual command: `npm run dev`.
- **Validation patterns used in past syncs (reuse these):**
  - JSON integrity: parse each dataset with Python/Node, check entry counts, id sequence, date ordering, and recompute totals (sum of `jobsCut` excluding `isProjection`) before and after edits.
  - Archive validation script: per-page structural checks (meta grid, excerpt word count ≤75, provenance note, screenshot accordion, nav links resolve) across all pages, plus `npm run build` as the final gate.
  - Nav chain: never hand-edit prev/next in place; rebuild the chain (a finalize script regenerates manifest + all affected neighbor nav lines) after adding pages.
  - Verify rendered numbers by fetching served JSON, not by screenshots of animated counters (Section 4.5).
- **notes/ directory convention (mandatory per CLAUDE.md):** every task gets `notes/<task-name>/README.md` with problem statement, approaches attempted (including failures), current state, verified constraints, lessons, next steps, and a `tests/` subfolder for evidence. `notes/README.md` is the index; check it before starting work. Update `CHANGELOG.md` after every significant change and `CLAUDE.md` after every correction.
- **Sheet sync:** reviewed rows and edits go to the live tracker through `automation/tracker_append.py` / the Tracker Append workflow (Section 8, dry-run first). Paste-ready TSV rows remain a fallback in sessions without that path.

---

## 10. Known Gotchas and Lessons Learned

1. **Dual data directories (partially resolved 2026-08-11).** Repo-root `data/verified/` is a stale legacy copy while `public/data/verified/` is canonical (96 events / 420 milestones). The deploy workflow's stale `cp -r data/verified dist/data/verified` step has been **removed** (replaced by the prerender step). Remaining: the stale root `data/` directory (`pending/`, `schemas/`, `verified/`) still exists pending owner-approved deletion (file-deletion rules apply), and `CLAUDE.md`'s Key Files / Data Architecture sections still point at `data/verified/` and cite "207 milestones" (stale; its routing section is updated, but the tech-stack table also still says HashRouter).
2. **BrowserRouter + 404.html fallback is the routing setup** (since 2026-08-11) — deep links work via the spa-github-pages redirect; do not revert to HashRouter (kills SEO).
3. **`isProjection` entries are excluded from every total.** No layoff event uses it today (IBM evt-007 moved to Jobs Never Created); the flag now marks future Never-Created estimates (IBM, DBS). Adding a projection without the flag inflates the headline number.
4. **Counter animations freeze in hidden panes** (requestAnimationFrame throttling). Not a data bug; verify against the JSON.
5. **Bot-wall fallback chain:** direct Playwright (`--channel chrome`) → consent-banner dismissal → Firecrawl. Firecrawl handled Reuters/CNN/Fast Company/Axios but NOT NYT or Bloomberg; those need manual logged-in capture.
6. **Wayback often archives block pages, not articles**, for DataDome-protected sites (Reuters/Bloomberg/NYT/Axios). Do not treat a Wayback snapshot as valid provenance without opening it.
7. **Journalist framing never overrides company statements** (THE RULE). Verizon's AI framing was aggregator inference and the company explicitly denied it; companies actively resist the AI label. Adversarial verification struck 9 of 26 researched events in the August backfill. The dashboard's credibility depends on this gate.
8. **Parallel subagents sharing a scratchpad must use uniquely named work files** - two agents collided on shared `excerpts.json`/`extract.py` names (twice, across two sessions). Mandate per-agent filenames up front.
9. **Canonical-source rule for conflicts:** where an archive page (built from the actual article) disagrees with the tracking sheet, the archive wins.
10. **macOS tooling:** `pip3 install --user` is blocked by PEP 668 on this machine; use a venv. Google Drive spreadsheet reads via markdown export are lossy; export as xlsx and parse with openpyxl.
11. **Archive `txt/` folder is intentional** (owner decision 2026-08-10): 89 full-text article files kept as a local archive, not linked from any page, `article_file` manifest fields left in place. Do not delete, and do not link them (copyright).
12. **`_ignore/` and `assets/` are untracked on purpose.** Do not modify, delete, or commit them.
13. **Legacy milestone schema:** 19 entries (17 pure + 2 hybrid) still use `title`/`amount`/`source` fields; UI code and types tolerate both. Normalize only as a deliberate task.
14. **`company-profiles.json` is empty**; the Companies page works by derivation. Anything that assumes profiles exist will silently get `[]`.
15. **Sheet-tab gids are unstable.** Google Sheets tab gids change when a tab is deleted and recreated; the automation resolves tabs by title/alias first (`tab_aliases` in `research.py`) and only falls back to gid. Never hardcode a gid as the sole reference.
16. **GitHub Pages extensionless resolution + duplicated route titles.** `/predictions` is served from `dist/predictions.html` (HTTP 200) generated by `scripts/prerender-seo.mjs`; route titles/descriptions live in BOTH the `<Seo>` calls (`src/pages/*.tsx`) and the script's `ROUTES` table — edit both or crawlers and users see different metadata. Deep links (`/companies/openai`) still go through `404.html`.
17. **Automation streaming requirement.** Non-streaming Anthropic web-search requests can exceed the SDK HTTP timeout and retry silently; the 2026-08-11 dry run burned the workflow's whole 45-minute budget that way, part of the ~$36 the two premium-tier dry runs cost that day. `research.py` must keep using `client.messages.stream(...)`, and research pipelines default to `claude-sonnet-5` with spend caps, never a premium model (Section 8.0).
18. **WebFetch summaries can fabricate tables.** A summarized fetch of a page can invent table rows. Read image tables directly (view the image) and do not trust a fetch summary for figures.
19. **Stale-TLS `SSLEOFError` on the first Sheets call after a long sweep.** Seen on 2 of the first 3 live runs (35467651099 and the first scheduled Monday run 35628847733). Fixed by `retry_transport` in `research.py` (Section 8.0); the rerun (35646051383) was clean.
20. **`DIGEST_TO` must be a real mailbox.** It was set to the service-account address (@...iam.gserviceaccount.com) and the live run's digest bounced (NXDOMAIN); reset to the owner's mailbox on 2026-09-20.
21. **`json.dump` must preserve the original formatting** (`indent`, `ensure_ascii`) when editing dataset files from Python, or the whole file is rewritten and the diff becomes unreviewable.
22. **GitHub Pages `/companies.html` vs `companies/` folder.** Now that company pages exist as `dist/companies/<id>.html`, `/companies` may resolve to the folder, so `prerender-seo.mjs` also writes `companies/index.html` as a mirror of the listing page (Section 4.6).
23. **Headline vs H1.** The H1 "Jobs Lost to AI" is an SEO choice; the headline number is "Total Jobs Displaced by AI" (layoffs + realized Jobs Never Created, via `getHeroBreakdown`). Planned cuts, future never-created estimates, and AI job creation are shown but never counted. Keep the dashboard, widget, timeline, SEO copy, and share images on the same helper or formula.

---

## Verification Notes (VERIFY list)

| # | Item | Status |
|---|---|---|
| 1 | Deploy workflow stale `cp -r data/verified ...` step | **RESOLVED 2026-08-11:** step removed from `deploy.yml` (replaced by the prerender step). Remaining: the stale repo-root `data/verified/` directory itself is still present, pending owner-approved deletion (file-deletion rules apply) |
| 2 | Root archive `index.html`/`app.js` retirement status | Open — back-links now bypass it; owner intent for the standalone index unconfirmed |
| 3 | Excerpt "sentence boundary + curly quotes" rule | Open — consistently observed in generated pages and session notes, but not codified in a spec file in the repo (the prerender script does not touch archive pages) |
| 4 | `CLAUDE.md` / CHANGELOG stale wording | **PARTIALLY RESOLVED:** `CLAUDE.md`'s routing section now documents BrowserRouter (2026-08-11). Still stale: its tech-stack table ("HashRouter"), Key Files / Data Architecture (`data/verified/`, "207 milestones"), and the CHANGELOG 1.0.0 "React 18" wording. Corrections need owner approval per project rules |
| 5 | Automation Workflow C schedule/calibration details | Open — from the approved plan document; final values may change at build time |
| 6 | Staging-sheet append path (Workflow A) | Open: UNTESTED live until a run actually stages rows; reads, retry, and digest send are verified |

## Document History

| Version | Date | Change |
|---|---|---|
| 1.1 | 2026-08-11 | BrowserRouter + 404 fallback, per-route prerender, SEO subsystem, meta.json contract, Workflow A build status |
| 1.2 | 2026-10-03 | Jobs Never Created dataset and `getHeroBreakdown` hero; robotics `displacementMode`, `jobTypesDetail`, 13 canonical job categories and deploy validation; themed `TotalCounter`, `RoboticsBadge`, stacked `TrendLine`, `/widget/stats` embed sizing; share-image subsystem (`scripts/og/`), static company pages, generated sitemap, per-page og/twitter tags; archive `never` tab; deploy order updated; weekly cron live, `retry_transport`, `tracker_append.py`; new gotchas 18-23; counts refreshed |

*End of document.*
