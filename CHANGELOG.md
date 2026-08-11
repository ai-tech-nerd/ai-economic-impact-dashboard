# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-08-11 — SEO/indexing overhaul, predictions refresh, AI Advances improvements

### Changed — Google indexing (BREAKING-ish: router change)
- **HashRouter → BrowserRouter** with the spa-github-pages 404.html fallback: routes are now real, crawlable URLs (/predictions, /companies, ...). Legacy #/ links and embeds redirect via an index.html shim (verified). CLAUDE.md + PROJECT_ARCHITECTURE.md updated — do NOT revert to HashRouter.
- SEO-focused language sitewide: home h1 now "Jobs Lost to AI"; new titles/meta per route ("Will AI Take My Job?...", "Companies Replacing Workers With AI...", etc.); JSON-LD (WebSite + Dataset); sitemap.xml + robots.txt; canonical URLs; embed-snippet buttons emit path URLs
- "Data updated: <date>" indicator on the dashboard, driven by public/data/verified/meta.json (bump on every data commit; publish automation will maintain it)

### Changed — Predictions rewritten as of Aug 2026
- All timeframes re-grounded in current data (Challenger 112,713 AI-cited US cuts YTD; Stanford entry-level findings; Oracle 10-K; Gartner rehire prediction; Goldman/WEF/Bloomberg Intelligence forecasts); short-horizon ranges revised DOWN to match observed run-rates; new entry-level white-collar 3-5yr prediction added (9 total); every entry sourced and labeled as projection

### Changed — AI Advances
- Newest-first by default with an order toggle
- "Public release" badge (new optional publicRelease field; 8 entries flagged)
- ChatGPT milestone (ms-029, 2022-11-30) enriched — it already existed as a "Launch"-type entry (why it was missed under the Model Releases filter); 4 release dates corrected (GPT-3, Claude 3.5 Sonnet, Runway Gen-4, GPT-5.4), 15 prominent dates spot-check-confirmed

### Changed — Automation cadence
- Research schedule set to weekly (Mondays 6:00 AM CT), still disabled pending validation

## [Unreleased] - 2026-08-11 — Official docs + automation build (steps 1–2)

### Added
- **docs/PRD.md** (v1.0) — official product requirements: mission, audience, the five editorial principles (attribution rule, excerpt-only provenance, hedged numbers, adoption-vs-support creation categories, human approval gate), feature/data inventory, pipeline-as-product
- **docs/PROJECT_ARCHITECTURE.md** (v1.0) — combined architecture + technical reference: stack, routing map, all dataset schemas, source-archive spec, deploy, automation design, 14 documented gotchas, VERIFY appendix
- **docs/automation-implementation-plan.md** (v1.0) — approved GitHub Actions automation plan (3 workflows, staging approval dropdowns, query bank from docs/ai-economic-impact-search-terms.md)
- **automation/** — Workflow A build (schedule OFF): queries.yml query bank, sheet_prep.py (control columns + dropdowns + AI Advances tab, idempotent), research.py (research → structuring → attribution gate → dedup → staging → digest; --dry-run needs only ANTHROPIC_API_KEY), 29 offline unit tests (all passing), .github/workflows/research.yml (workflow_dispatch only; cron commented out pending validation)
- automation/README.md carries the owner setup checklist and an explicit verified-vs-UNTESTED status section (live API/Sheets/SMTP paths untested until credentials exist)

## [Unreleased] - 2026-08-11 — June–August research backfill + AI Advances catch-up

### Added
- **9 displacement events** (evt-088–096, Jun–Aug 2026): GitLab, Mews, Darrow, Thomson Reuters, Sprout Social, Uber, Monday.com, Visa (~2,600), Latch/DOOR — total now 328,995 jobs / 95 events / 80 companies
- **2 planned** (plan-016 SAP hiring freeze, plan-017 Wells Fargo "tens of thousands")
- **8 job-creation entries** (create-007–014) with new `creationCategory` field: "ai-adoption-roles" (Box, Thomson Reuters) vs "support" (infrastructure: Meta AWA, Reflection, n8n, Meta Alberta, OpenAI Camellia, SpaceX/Tesla Terafab) per owner's tech-transition framework; field backfilled on the 6 existing entries
- **56 AI milestones** (ms-225–280): AI Advances now covers 2026-03-20 → 2026-08-08 (was stale since 03-19); 370 total
- **19 archive pages** (excerpt format, all with verified screenshots — zero manual captures needed); manifest 107 → 126
- Oracle evt-069 updated with its FY2026 10-K AI attribution (verified on SEC EDGAR) — first formal SEC-filing attribution in the dataset

### Process
- Every event passed a two-stage gate: research agents with AI-attribution requirement (confidence ≥70), then adversarial verification enforcing the owner's rule that journalist framing cannot override company statements. 9 researched events were struck (incl. Verizon and Zillow-class denials); GitLab, Darrow, Thomson Reuters reinstated by owner ruling with transparency notes.
- Google Sheet sync rows generated (owner pastes; no Sheets write access in this session).

## [Unreleased] - 2026-08-10 (round 2: full-archive excerpt migration)

### Changed — Copyright remediation across the entire source archive
- **Migrated all 89 pre-existing archive pages** from full-article-text to excerpt-only format: verbatim ≤75-word opening excerpt + provenance note; headline, publish date, meta grid, details, screenshot, archived stamp, and navigation untouched
- **Completed the 5 Needs-Manual-Capture pages** with user-supplied screenshots (C3.ai, PwC, Pendo, PayPal, Coinbase); filled in real headlines/excerpts read from the captures (Coinbase NYT headline: "Coinbase Lays Off 14% of Employees as A.I. Changes Work"; corrected PwC to Bloomberg's on-page headline "Executive Assistants Making $100,000 a Year Are Losing Jobs to AI")
- Fixed 2023-04-20-buzzfeed page (was an "Access Denied" placeholder — now proper headline + excerpt from the archived screenshot) and filled the empty Details field on 2022-11-09-meta
- All 107 archive pages now excerpt-only; validated by script (structure, word counts, accordions, nav) + build

### Decision
- `public/data/source-archive/txt/` (89 full-text article .txt files) kept intentionally as a local archive (owner decision, 2026-08-10). Not linked from any page.

### Changed — AI Job Creation section layout
- Dashboard card + /widget/creation embed converted from verbose per-company cards to the compact row list matching Planned/Announced (company | jobs | Hiring badge), with a 42,311 headline total
- Added `jobsCreated` numeric field to ai-job-creation.json entries (IBM undisclosed → 0, shown as "Undisclosed", excluded from total)

## [Unreleased] - 2026-08-10

### Added — Catch-up data sync from "AI Attributed Job Losses" Google Sheet (Apr–May 2026 backlog)
- **17 new displacement events** (evt-071–087): Dropbox (2024-10-30), PwC ×2, xAI, BILL Holdings, C3.ai, Pendo, Disney, Snap, UKG, Nike (Apr 2026), Meta (Apr 2026, ~8,000), Coinbase, Cloudflare, Upwork, Cisco, ClickUp — totals now 87 events / 324,370 jobs
- **8 new planned/announced entries** (plan-008–015): Klarna, SAP, Pinterest, UPS (30,000), ASML, British American Tobacco, HSBC (up to 20,000), PayPal
- **5 new job-creation entries** (create-002–006): Cloudflare, Accenture (37,000), Cognizant, ThreatLocker, Salesforce
- **18 new source-archive pages** in the new provenance-safe format: same top section (meta grid, details, source link) but article body reduced to a verbatim ≤75-word excerpt + full-page screenshot; no full-text reproduction. Existing pages unchanged (migration planned separately)
- Archive manifest grown 89 → 107 entries; prev/next navigation chain rebuilt across affected pages

### Fixed
- plan-005 Lufthansa date: 2025-12-01 → 2025-11-20 (matches source article)
- plan-007 Meta planned date: 2026-03-14 → 2026-01-13 (matches source article)

### Known gaps (tracked in notes/catch-up-sync-2026-08/)
- 5 archive pages flagged **Needs Manual Capture** (bot-walled sources): C3.ai (Reuters), PwC 2026-02-26 (Bloomberg), Pendo (Axios, screenshot only), PayPal (Bloomberg), Coinbase (NYT — headline also pending)
- Research gap: no data collected for June–August 2026 (sheet last updated 2026-05-26)

## [1.0.0] - 2026-03-17

### Added — Phase 1: Foundation + Phase 2: Main Dashboard
- **Project scaffolding**: React 18 + Vite + TypeScript + Tailwind CSS v4
- **6 interactive pages**:
  - **Dashboard**: Animated total counter (349,708 jobs), cumulative trend line, top 10 job categories bar chart, industry donut chart, sortable company table
  - **Predictions**: Cards for 3mo/6mo/12mo/3-5yr timeframes with risk levels and confidence ranges
  - **Timeline**: Slider/scrubber mode with play/pause/speed controls + Story mode with narrative chapters
  - **AI Advances**: Vertical timeline of AI milestones with type filters (model releases, partnerships, funding, etc.)
  - **Companies**: Searchable company cards with drill-down detail pages showing displacement events and sources
  - **Learn & Prepare**: 6 tabbed sections — Free AI Tools, CRAFT Framework, 30-Day Action Plan, Irreplaceable Skills, Free Courses (7 resources), Privacy & Safety
- **Seed data**: 24 verified displacement events + 25 AI milestones (Nov 2022 – Mar 2026)
- **Prediction data**: 8 predictions across all timeframes
- **GitHub Pages deploy workflow** (.github/workflows/deploy.yml)
- **Responsive design**: Mobile, tablet, and desktop layouts
- **SEO**: Meta tags, Open Graph, Twitter card
- **Data architecture**: Static JSON files in data/verified/, fetched at runtime via useData hook

### Tech Stack
- React 18, Vite 8, TypeScript 5.9
- Tailwind CSS v4 (PostCSS), Recharts, Framer Motion
- React Router (HashRouter for GitHub Pages), react-helmet-async
