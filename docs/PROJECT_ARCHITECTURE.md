# AI Economic Impact Dashboard

## Project Architecture and Technical Reference

**Version:** 1.0
**Date:** 2026-08-11
**Status:** Technical source of truth for documentation syncs. Facts below were verified against the code and data on the date above. Items that could not be fully verified are marked **VERIFY**.

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
   .github/workflows/deploy.yml  (npm ci → tsc -b && vite build → Pages)
                │
                ▼
┌──────────────────── GitHub Pages (aishift.michaelkristof.com) ──────────┐
│  index.html → React SPA (BrowserRouter + 404.html fallback)                                    │
│      │ runtime fetch                                                    │
│      ├── /data/verified/*.json          (6 datasets, useData hook)      │
│      ├── /data/source-archive/archive-manifest.json  (archive list)     │
│      └── /data/source-archive/<slug>/index.html      (static pages,     │
│                                          linked from the SPA, no React) │
└─────────────────────────────────────────────────────────────────────────┘
```

**Routing (changed 2026-08-11):** the app uses `BrowserRouter` with the spa-github-pages pattern — `public/404.html` redirects unknown paths to `/?p=...` and a decoder in `index.html` restores the path before React mounts. This gives real, Google-indexable URLs (`/predictions`), which HashRouter's fragment URLs (`/#/predictions`) could never be. A shim in `index.html` rewrites legacy `#/` links (including old embeds) to path URLs. Do NOT revert to HashRouter — it made every page invisible to crawlers.

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
│   └── deploy.yml               Build + deploy to GitHub Pages on push to main
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
│   └── data/
│       ├── verified/            CANONICAL runtime datasets (6 JSON files, Section 5)
│       └── source-archive/      Static provenance pages (Section 6)
├── data/                        LEGACY/stale copy (pending/, schemas/, verified/) - see gotcha 10.1
├── docs/                        Project docs (this file, about-the-dashboard.md,
│   │                            ai-shift-automation-brief.md, search-terms, data/ research refs)
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
- One `Promise.all` fetches all six datasets on mount. `job-displacement-events.json` and `ai-milestones.json` are required (a failure sets the app-level error state); the other four (`company-profiles`, `predictions`, `planned-layoffs`, `ai-job-creation`) each carry `.catch(() => [])` so a missing file degrades to an empty array instead of breaking the app.
- Events are tagged `status: 'verified'` by default if the field is absent.
- The hook returns `{ events, plannedEvents, creationEvents, milestones, companies, predictions, loading, error }`; App passes slices down as props. There is no state library and no caching layer.

`SourceArchive.tsx` separately fetches `${BASE}data/source-archive/archive-manifest.json` to render the filterable archive list on the dashboard.

### 4.3 Page and component inventory

- `src/pages/`: `DashboardPage`, `PredictionsPage`, `TimelinePage` (slider/story playback via `useTimelinePlayback`), `AITimelinePage`, `CompanyPage` (list + `CompanyDetail` drill-down; company list is derived from the union of companies found in milestones, displacement, planned, and creation data, since `company-profiles.json` is currently empty), `LearningPage`, plus `pages/embeds/` (`StatsEmbed`, `ChartWidgets`).
- `src/components/dashboard/`: `TotalCounter`, `TrendLine`, `JobTypesChart`, `IndustryBreakdown`, `CompanyTable`, `ChatGPTGrowthChart`, `SourceArchive`.
- `src/components/layout/`: `Header`, `Footer`, `PageLayout`, `EmbedLayout`.
- `src/components/shared/`: `AnimatedNumber`, `ChartContainer`, `SourceCitation`.
- `src/components/ui/`: `EmbedButton`, `CardEmbedButton`.
- `src/utils/dataTransformers.ts`: all aggregation functions (`getTotalJobsCut`, `getTopJobTypes`, `getIndustryBreakdown`, `getMonthlyTrend`, `getCumulativeTrend`, `getCompanySummary`, date filters). **Every aggregation filters out `isProjection` events** (see Section 5.2). Industry names are normalized through the `INDUSTRY_GROUP` map (e.g. "Financial Technology" → "Finance").
- `src/utils/constants.ts`: `JOB_TYPE_LABELS`, `INDUSTRY_COLORS`, `CHART_COLORS`, `TIMELINE_START = '2022-11-30'` (ChatGPT launch), `NAV_ITEMS`.
- `src/hooks/usePageTracking.ts`: fires a `gtag` `page_view` event on every hash-route change (Google Analytics is loaded in `index.html`).

### 4.4 Embed/widget system

`EmbedButton` generates a copy-paste iframe snippet hardcoded to the production origin:

```
https://aishift.michaelkristof.com/#/embed{path}
```

wrapped in `<iframe ... width="100%" height="700">`. `/embed/*` pages keep page chrome minus Header/Footer (via `EmbedLayout`); `/widget/*` routes render a single chart or stat block with no wrapper for tight inline embedding. All embeds share the same `useData` fetch, so they always reflect the deployed JSON.

### 4.5 Documented gotcha: counter animation pauses when hidden

`useAnimatedValue` drives `AnimatedNumber` / `TotalCounter` with `requestAnimationFrame` (ease-out cubic over a default 2000 ms). Browsers throttle or suspend `requestAnimationFrame` in hidden/background tabs and hidden preview panes, so a counter can appear frozen mid-animation at a wrong-looking number. **This is not a data bug.** Verify totals by fetching the served JSON, not by reading a mid-animation screenshot (lesson recorded in `notes/research-backfill-2026-08/README.md`).

---

## 5. Data Architecture

### 5.1 Location and conventions

Canonical datasets live in **`public/data/verified/`** (Vite copies `public/` into `dist/` at build time). Counts as of 2026-08-11:

| File | Entries | ID scheme | Notes |
|---|---|---|---|
| `job-displacement-events.json` | 96 | `evt-NNN` | 95 displayed + 1 `isProjection` |
| `planned-layoffs.json` | 17 | `plan-NNN` | status: 15 `announced`, 2 `hiring-freeze` |
| `ai-job-creation.json` | 14 | `create-NNN` | 8 `ai-adoption-roles`, 6 `support` |
| `ai-milestones.json` | 370 | `ms-NNN` and `ms-bNNN` | `b` prefix = pre-2022 historical backfill entries |
| `company-profiles.json` | 0 | `[]` | Empty array; company pages derive from other datasets |
| `predictions.json` | 8 | `pred-NNN` | Two per timeframe bucket |

Shared conventions across datasets:

- **Date-sorted arrays:** events and milestones are stored in ascending `date` order (ISO `YYYY-MM-DD`). Verified programmatically.
- **Sequential ids** per file; new entries take the next number.
- **Hedged numbers preserved in prose:** `description` / `reasonGiven` keep the source's exact phrasing ("~65 roles (~32% of global workforce)"); the numeric `jobsCut` field holds a single integer.
- **`jobsCut: 0` means undisclosed count**, and the UI shows "Undisclosed" (e.g. IBM creation entry). 3 displacement events currently carry 0.
- **`aiReplacement: boolean`** flags whether AI is a stated replacement driver.
- **Every entry carries `sources[]`** ({url, title, publisher, date}) and `verificationStatus` (all currently "verified").
- **Attribution rule ("THE RULE"):** an event only enters the dataset if AI is attributed by the company itself (statement, exec quote, memo, earnings call, SEC filing) or by reporting holding documented proof. Journalist framing alone does not qualify; an explicit company denial is a hard fail. See Sections 8 and 10.

### 5.2 job-displacement-events.json

TypeScript shape: `DisplacementEvent` in `src/types/index.ts`. Core fields: `id, company (slug), companyName, date, jobsCut, jobTypes[], industry, region, country, aiReplacement, reasonGiven?, description, sources[], verificationStatus, isProjection?, aiToolsMentioned?, notes?`.

**`isProjection: true` excludes an event from all totals and charts** (`dataTransformers.ts` filters it everywhere). Exactly one entry uses it: evt-007, IBM's projected 7,800 (also represented in planned-layoffs). That is why the site shows 95 events / 328,995 jobs while the file holds 96 entries.

Abbreviated real example:

```json
{
  "id": "evt-001",
  "company": "meta",
  "companyName": "Meta",
  "date": "2022-11-09",
  "jobsCut": 11000,
  "jobTypes": ["general"],
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

Same `DisplacementEvent` shape plus: `status` ("announced" | "hiring-freeze" are the values in use; the type also allows "verified" and "creation"), `timeline?` (free text, e.g. "Ongoing (5-year period)"), `jobsAlreadyCut?`. Planned totals are displayed separately and never added to the displaced-jobs headline number.

```json
{
  "id": "plan-001",
  "company": "ibm", "companyName": "IBM", "date": "2023-05-01",
  "jobsCut": 7800, "jobTypes": ["Back-office", "Human Resources"],
  "industry": "Technology", "region": "Global", "country": "US",
  "aiReplacement": true,
  "description": "CEO Arvind Krishna: 'I could easily see 30% ... replaced by AI ...'",
  "sources": [{ "url": "https://www.reuters.com/technology/...", "publisher": "Reuters", "...": "..." }],
  "verificationStatus": "verified",
  "status": "hiring-freeze",
  "timeline": "Ongoing (5-year period)"
}
```

### 5.4 ai-job-creation.json

Same base shape with `status: "creation"`, `jobsCut: 0`, `aiReplacement: false`, plus creation-specific fields:

- `jobsCreated: number` (0 = undisclosed, shown as "Undisclosed" and excluded from the creation headline total)
- `jobRolesCreated: string` (free-text role summary)
- `creationCategory: "ai-adoption-roles" | "support"` per the owner's tech-transition framework: direct AI-adoption hiring (e.g. Box, Thomson Reuters) vs support-industry jobs created around AI build-out (data centers, chip fabs). Present on all 14 entries.
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

370 entries covering 1943 through 2026-08-08. `type` enum (6 values, counts): `breakthrough` (94), `company-launch` (93), `model-release` (85), `regulation` (38), `partnership` (34), `acquisition` (26).

**Dominant schema** (319 entries): `id, company, date, type, name, description, category, significance ("high"|"medium"|"low"), sources[]`. A further 32 entries add an optional `types: MilestoneType[]` array for multi-type milestones (the scalar `type` remains the primary).

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

**Legacy schema (19 entries):** 17 entries use an older shape with `title`, `amount`, and a singular `source` string instead of `name`/`sources[]`/`category`/`significance`; 2 hybrid entries carry both old and new fields. The `AIMilestone` type keeps `title?`, `amount?`, `source?` optional for this reason. New entries must use the dominant schema; the 19 legacy entries are a known normalization backlog.

### 5.6 company-profiles.json

Currently an empty array. The `CompanyProfile` interface (`id, name, industry, headquarters, website?, description, aiProducts[], acquisitions[], fundingRounds[], totalJobsDisplaced, events[]`) is defined and wired through `useData` and `CompanyPage`, but the page falls back to deriving its company list from milestones + displacement + planned + creation data when no profile exists. Populating profiles is future work.

### 5.7 predictions.json

8 entries, `pred-NNN`. Shape: `id, timeframe ("3-months" | "6-months" | "12-months" | "3-5-years"), targetDate, createdDate, jobType, industry, estimatedJobsAtRisk {low, mid, high}, riskLevel ("high"|"medium"|"low"), basis, methodology, sources[] (string URLs, may be empty), confidence (0-1)`.

---

## 6. Source Archive Subsystem

Location: `public/data/source-archive/`. Purpose: durable, copyright-safe provenance for every tracked event — meta facts, a verbatim short excerpt, a full-page screenshot, and the live source link. 126 event pages as of 2026-08-11, all in excerpt-only format.

### 6.1 Directory anatomy

```
public/data/source-archive/
├── archive-manifest.json        Machine-readable index (126 entries) - drives the SPA list
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
  "tab": "main",                        // "main" (95) | "planned" (17) | "created" (14)
  "type": "layoff",                     // free text: layoff, hiring-freeze, created, ...
  "reason": "AI-Driven Restructuring: ...",
  "source_url": "https://about.fb.com/news/2022/11/...",
  "screenshot_file": "2022-11-09-meta-screenshot.png",
  "article_file": "2022-11-09-meta.txt" // "" for post-migration pages with no txt file
}
```

The SPA's `SourceArchive` component consumes exactly these fields and maps `tab` to its filter tabs (All / Jobs Displaced / Planned-Announced / Jobs Created).

### 6.3 Page anatomy (reference: `2026-05-13-cisco/index.html`)

Top to bottom, every page contains:

1. Dark header bar ("AI Job Loss -- Source Archive", links to `/`)
2. "Back to dashboard" link (`href="/"`)
3. `h1.event-heading` company name (planned/created pages add a colored badge)
4. `.meta-grid`: Date, Jobs Affected, Category, Type
5. "Details" section (`.reason-text`): the attribution reason, quotes preserved
6. `.source-row`: "Source ↗ domain.com" linking the live article
7. `.article-section`: article headline + "Published: YYYY-MM-DD" + excerpt body
8. `.screenshot-accordion`: collapsed by default; full-page PNG + "Captured from: <url>" caption
9. `.archived-stamp`: "Archived on <Month D, YYYY>"
10. `.event-nav`: prev/next links to neighboring event pages

### 6.4 Excerpt format specification

The article body is **excerpt-only** (copyright remediation completed 2026-08-10, all 126 pages):

- One verbatim excerpt of the article's opening, **75 words maximum**, ending on a sentence boundary
- Wrapped in curly double quotes (" ... ") inside a `<p>`
- Followed by the fixed provenance note: `<p><em>Excerpt shown for provenance. Read the full article at the source link above.</em></p>`
- Headline and published date are retained verbatim above the excerpt
- No other article text is reproduced anywhere on the page (full text lives only in the unlinked local `txt/` folder)

### 6.5 Slug and navigation conventions

- **Slug:** `YYYY-MM-DD-company` (lowercase, hyphenated, punctuation stripped), e.g. `2026-05-13-cisco`. Same-day collisions append `-planned`, `-created`, or `-layoff` (e.g. `2023-05-01-ibm` vs `2023-05-01-ibm-planned`).
- **Screenshot:** `<slug>-screenshot.png` inside the page directory; full-page capture of the source article.
- **Nav chain:** every page's prev/next links form a single chain ordered by directory date across ALL tabs (main, planned, created interleaved chronologically). Adding a page means regenerating its own nav plus rewriting the nav lines of both date-neighbors; the proven approach is a finalize script that rebuilds manifest + nav together rather than hand-editing (see Section 9).
- Hiring-freeze convention (legacy, from HANDOVER.md): freeze companies may carry an asterisk in the display name and a "*HIRING FREEZE" prefix in the reason.

### 6.6 Screenshot tooling

- Primary: `npx playwright screenshot --channel chrome <url> <out.png>` (uses system Chrome; no browser download).
- Bot-walled sources (DataDome, "Are you a robot?"): fallback chain direct capture → consent-banner dismissal → Firecrawl scrape/screenshot. This chain achieved zero manual captures in the August 2026 backfill.
- If everything fails: flag "Needs Manual Capture"; the owner captures in a logged-in browser and drops the PNG into the page folder. Never publish a broken/block-page capture.

---

## 7. Build and Deploy

- **Trigger:** push to `main`, or manual `workflow_dispatch` (`.github/workflows/deploy.yml`).
- **Steps:** checkout → Node 20 (npm cache) → `npm ci` → `npm run build` (`tsc -b && vite build`) → `cp -r data/verified dist/data/verified` → configure-pages → upload `dist/` artifact → `deploy-pages`.
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`; concurrency group `pages`.
- **Serving:** GitHub Pages with custom domain `aishift.michaelkristof.com` via `public/CNAME` (copied into `dist/` by Vite). `vite.config.ts` `base: '/'` matches the custom-domain root.
- **Data in the build:** Vite copies all of `public/` (including `data/verified/` and the entire `source-archive/`) into `dist/`. The workflow's extra `cp -r data/verified ...` step is a legacy leftover; see gotcha 10.1.
- Local production check: `npm run build && npm run preview`.

---

## 8. Automation Architecture (approved design, build in progress)

Status: **design approved 2026-08-11, not yet built.** Spec of record: `docs/ai-shift-automation-brief.md` (schemas, attribution gate, acceptance criteria) with its runner/environment sections superseded by the GitHub Actions implementation plan (local automation brief; the n8n/always-on-machine design is retired). Environment details, spreadsheet IDs, and hostnames are deliberately excluded from this document; consult the local automation brief for those.

### 8.1 Three GitHub Actions workflows

| Workflow | Schedule | Function |
|---|---|---|
| **A - Research** | every 2 days, 6:00 AM CT + manual dispatch | Query-bank sweep (config file `automation/queries.yml`) → LLM structuring → attribution gate → dedup → append candidate rows to the staging sheet → email digest |
| **B - Publish** | daily, 7:00 AM CT + manual dispatch | Poll staging for Approved+unpublished rows; per row: append to live tracker sheet → generate dashboard JSON entry (next id, schema conventions, `creationCategory`) → Playwright screenshot with the bot-wall fallback chain → archive.org Save Page Now (SPN2) → generate excerpt archive page + manifest + nav rebuild → single commit → Pages auto-deploys → stamp row Published + archive link |
| **C - Advances** | weekly, Mon 6:00 AM CT | Milestone sweep across the 6 types → staging "AI Advances" tab → approved rows appended to `ai-milestones.json` (no archive pages or screenshots) |

Sequential processing per row (no parallel captures); idempotent (Published rows never reprocessed); the commit is the last step so nothing half-publishes.

### 8.2 Staging-sheet control columns (appended to every tab)

| Column | Writer | Values |
|---|---|---|
| `Confidence` | automation | 0-100 from the gate |
| `Attribution` | automation | who said it ("CEO memo", "10-K", "spokesperson") |
| `Quote` | automation | the decisive verbatim quote |
| `Approval` | **owner** (dropdown) | blank · Approved · Rejected · Needs Edit |
| `Status` | automation | blank · Published YYYY-MM-DD · Needs Manual Capture |
| `Archive Link` | automation | URL of the generated archive page |

Owner approval is the only path to publication (Stage 2, manual veto point). The owner may edit any cell before approving; row content at publish time is what ships. Rejected rows stay as dedup records. Data tabs keep the live tracker's column order; a new "AI Advances" tab uses `Date | Company | Type | Name | Description | Category | Significance | Source Link` with `Type` restricted to the 6 milestone values.

### 8.3 Attribution gate (THE RULE, encoded)

1. Valid attribution: company statement, named exec quote, internal memo, press release, earnings call, SEC filing, or a journalist holding documented proof. Invalid alone: journalist framing, anonymous sources, third-party inference.
2. Targeted denial check per company; an explicit company denial is a hard fail regardless of framing (the Verizon/Zillow/Etsy pattern).
3. Confidence below 70 never reaches staging; 70-84 is staged with a warning flag.
4. Company phrases like "advances in technology" may count at model judgment, but the exact phrase is always preserved so the owner can overrule (the Darrow ruling).

Global field rules carried from the brief: ISO dates; hedged number phrasing preserved verbatim; reasons are 1-3 factual sentences with a direct quote when available; dedup key = normalized company + event month + count bucket, checked against staging (including Rejected), live tracker, and dashboard JSON.

### 8.4 Secrets (names only)

`GOOGLE_SA_KEY`, `ANTHROPIC_API_KEY`, `PERPLEXITY_API_KEY` (optional second engine), `ARCHIVE_ORG_S3_KEYS`, `DIGEST_EMAIL` plus one mail-provider credential. Estimated running cost ~$5-10/month.

### 8.5 Dry-run/testing approach (build order)

1. Sheet prep script (control columns, dropdowns, AI Advances tab). 2. Workflow A with schedule OFF, 2-3 manual audited runs; re-run must stage zero. 3. Enable A. 4. Workflow B against a single approved test row end-to-end, including a paywalled row landing in Needs Manual Capture rather than half-publishing. 5. Enable B. 6. Workflow C. 7. Retire the manual process; `notes/` pipeline docs become the runbook. Acceptance criteria: brief section 18.

---

## 9. Operational Runbook Pointers

- **Dev server:** `.claude/launch.json` defines configuration "dashboard": node runs `node_modules/.bin/vite --port 5173`. Equivalent manual command: `npm run dev`.
- **Validation patterns used in past syncs (reuse these):**
  - JSON integrity: parse each dataset with Python/Node, check entry counts, id sequence, date ordering, and recompute totals (sum of `jobsCut` excluding `isProjection`) before and after edits.
  - Archive validation script: per-page structural checks (meta grid, excerpt word count ≤75, provenance note, screenshot accordion, nav links resolve) across all pages, plus `npm run build` as the final gate.
  - Nav chain: never hand-edit prev/next in place; rebuild the chain (a finalize script regenerates manifest + all affected neighbor nav lines) after adding pages.
  - Verify rendered numbers by fetching served JSON, not by screenshots of animated counters (Section 4.5).
- **notes/ directory convention (mandatory per CLAUDE.md):** every task gets `notes/<task-name>/README.md` with problem statement, approaches attempted (including failures), current state, verified constraints, lessons, next steps, and a `tests/` subfolder for evidence. `notes/README.md` is the index; check it before starting work. Update `CHANGELOG.md` after every significant change and `CLAUDE.md` after every correction.
- **Sheet sync:** in sessions without a Sheets write tool, generate paste-ready TSV rows per tab for the owner; the automation (Section 8) will replace this with a service account.

---

## 10. Known Gotchas and Lessons Learned

1. **Dual data directories.** Repo-root `data/verified/` is a stale legacy copy (64 events / 238 milestones; missing `planned-layoffs.json` and `ai-job-creation.json`) while `public/data/verified/` is canonical (96 / 370). `CLAUDE.md`'s Data Architecture section still points at `data/verified/` and cites "207 milestones" (stale). The deploy workflow still runs `cp -r data/verified dist/data/verified`; because Vite has already created `dist/data/verified` from `public/`, that copy lands nested (`dist/data/verified/verified/`) and the site serves the canonical `public/` files. **VERIFY:** confirm on a live deploy, then remove the workflow step and the stale `data/verified/` copy (with owner approval; file-deletion rules apply).
2. **BrowserRouter + 404.html fallback is the routing setup** (since 2026-08-11) — deep links work via the spa-github-pages redirect; do not revert to HashRouter (kills SEO).
3. **`isProjection` events are excluded from every total** - evt-007 (IBM) is the current example. Adding a projection without the flag inflates the headline number; forgetting the flag exists makes displayed totals look "one event short" of the file count.
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

---

## Verification Notes (VERIFY list)

| # | Item | Why flagged |
|---|---|---|
| 1 | Deploy workflow `cp -r data/verified dist/data/verified` produces a nested unused copy and the repo-root `data/` dir is stale | Inferred from standard `cp -r` semantics + file diffs; confirm against a live deploy log before removing |
| 2 | Root archive `index.html`/`app.js` retirement status | Back-links now bypass it; owner intent for the standalone index unconfirmed |
| 3 | Excerpt "sentence boundary + curly quotes" rule | Consistently observed in generated pages and session notes, but not codified in a spec file in the repo |
| 4 | `CLAUDE.md` Data Architecture section (path `data/verified/`, "207 milestones") and CHANGELOG "React 18" wording are stale | Corrections need owner approval per project rules |
| 5 | Automation Workflow C schedule/calibration details | From the approved plan document; final values may change at build time |

*End of document.*
