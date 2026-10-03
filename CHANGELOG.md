# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-10-03 — Model releases sweep (image, video, audio, robotics, open-weight)

### Added
- 9 verified model releases (418 milestones): ChatGPT Images 2.5 / GPT-Image-2.5 (09-08, missed earlier), Qwen3.8-Omni-Flash, Qwen-Image-2.1, Xiaomi MiMo-V2.6-Pro/Flash, Gemini 3.8 Flash TTS, FLUX 3 Action, Eleven v4, Runway Praxis-1, Tavus Griffin (video Turing test labeled as the company's own claim: 48% of 54 in a Tavus-run study).
- OpenAI Dots also listed under Model releases (types: company-launch + model-release).
- Deleted misdated duplicate archive page 2025-04-28-duolingo (owner approved); nav chain DBS ↔ UPS; legacy archive index row removed.
- Held (weak sourcing): Ideogram 4.5, HeyGen Video 1.0. Rejected: Kling 4.0 (limited access), GPT-Synopsys (no model yet), unverified Nvidia/Mistral claims, pre-window items.

## [Unreleased] - 2026-10-03 — Tracker sheet Category column

### Added
- Tracker sheet: new "Category" column (canonical category labels) next to "Job Position/Category" on Losses (96 rows) and Planned/Announced (15 rows); original descriptions untouched. Dry-run, live, re-verified. tracker_append.py gained `set_columns` (insert column + match-and-fill, skips ambiguous rows). Future publish automation (Workflow B) must fill Category on new rows.

### Fixed (owner approved)
- Removed duplicate evt-014 (Duolingo, 2024-01-09, 0 jobs, same CNN source as evt-013; its text was actually from the April 2025 "AI-first" memo, now noted on evt-013). Events 97 -> 96; jobs total unchanged.
- Tracker sheet SAP planned row date corrected 2025-04-24 -> 2025-09-24 (matches the Fortune source).

### Found, not fixed
- Archive page 2025-04-28-duolingo is a misdated copy of the 2024-01-09 CNN page (same article). Deleting it needs owner approval.

## [Unreleased] - 2026-10-03 — AI Advances catch-up (Sep 15 → Oct 2)

### Added
- 20 milestones (ms-300–319; 409 total), research + verification pass (all confirmed; corrections applied: OpenAI Australia credits US$1B / A$1.42B; Sonnet 5.5 cheaper per task, not per token; Accenture $1B is each party's commitment). Includes TypeSafe Jev (09-15), Anthropic–Accenture embedded evaluator, California AI oversight/kill-switch EO, Grok 4.7, UN loss-of-control brief, Claude Opus 5.5 and Sonnet 5.5, GPT-6 Sol/Luna, Meta Connect Muse upgrades, Claude ART enzyme discovery, Akamai–Anthropic $11.6B, Microsoft Copilot app, AMD–World Labs $8.2B, Instinct $1B, OpenAI Dots, GPT-6.1 Sol, GPT-6.1 Astra shelved + Australia apology, Gemini 4 Argon, Claude Frontier Academy, Meta Muse Gadgets.
- Rejected: OpenAI $1.4T raise talks, Cerebras (2025), Muse Spark 1.4 leak, Haiku 5.5 (not released), Grok 10-01 claims, UK bill (aggregator only).
- Company display names for AMD, TypeSafe AI, Instinct; 'un' treated as a jurisdiction, not a company.

## [Unreleased] - 2026-10-03 — Job category cleanup + stats widget

### Changed
- **Job categories normalized** (owner-approved): 65 inconsistent labels → 13 canonical categories (scripts/job-categories.mjs; labels in JOB_TYPE_LABELS). 88 entries rewritten; original wording kept in new `jobTypesDetail` (shown as chips on company pages). AI Job Creation untouched (role descriptions, not charted).
- Deploy now runs scripts/validate-job-categories.mjs before the build; a non-canonical category fails the deploy.
- Job Types chart note: an event can count in more than one category (35 events do), so categories sum to more than the total.
- **/widget/stats rebuilt to match the new hero** (same shared component + getHeroBreakdown helper as the dashboard; dark/light/transparent themes kept). Embed snippets now use path URLs (/widget/stats, not legacy /#/) at height 560, with sizing guidance (~400 full width / 560 blog column / 730 mobile; measured, no horizontal overflow at 375-1100px).

## [Unreleased] - 2026-10-03 — Dashboard hero redesign; Jobs Never Created counted in total

### Changed (owner ruling)
- Headline is now **Total Jobs Displaced by AI = layoffs + realized Jobs Never Created**: 328,106 + 1,200 = **329,306**. Future estimates (IBM 7,800 over 5 yrs, DBS 4,000 over 3 yrs; new `isProjection` flag) and planned cuts are shown but never counted.
- Hero redesigned as a dashboard: big total left; tiles right (Layoffs, Jobs Never Created, Robotics "of layoffs", AI Jobs Created "not in total", Most Impacted Industry, Top Job Category); bottom strip "Not included in total" (planned 151,900; future never-created 11,800). Stacks on mobile (verified at 375px, no overflow).
- Page description clarifies the SEO H1 "Jobs Lost to AI" (layoffs + jobs companies stopped filling; planned/future shown separately).
- Trend chart adds a Jobs Never Created layer (top edge = headline); Timeline counter and chart, /widget/stats, and SEO copy all use the same total.
- Jobs Never Created recolored teal (distinct from Robotics violet / Planned amber); card marks "Future estimate" entries.
- JOB_TYPE_LABELS: added Operations.

### Known issue (not fixed)
- Job-type values are inconsistent across events (e.g. "Sales" vs "sales-marketing", "Admin" vs "administrative"); affects the Job Types chart and the Top Job Category tile.

## [Unreleased] - 2026-10-02 — Jobs Never Created

### Added
- **Jobs Never Created** (owner-approved name): work given to AI/robots instead of new hires or replacements. New dataset jobs-never-created.json (company-stated number, or company-stated ratio x stated baseline; math shown per entry; disputed figures flagged and excluded). Separate dashboard card (13,000 across 3 companies), Timeline line, SEO copy line, Source Archive tab. Never added to the jobs-lost headline.
- Entries: IBM 7,800 (CEO 30% of ~26,000 back-office roles), Klarna 1,200 (5,000 → 3,800 via freeze + attrition), DBS 4,000 (contract/temp roles not renewed; new archive page with screenshot).
- Tracker sheet: new "Jobs Never Created" tab (IBM, Klarna, DBS); IBM/Klarna rows removed from Losses/Planned via tracker_append.py (new create_tabs + guarded deletes), dry-run verified before and after.
- Workflow A: 4th category "never" (research.py, queries.yml 8 queries, research.yml default), staging tab "Jobs Never Created" via sheet_prep.py.

### Changed (owner ruling)
- Moved out of layoffs/planned: evt-007 + plan-001 (IBM, duplicate pair), evt-023 + plan-008 (Klarna). Jobs-lost headline 329,306 → 328,106 (-1,200 Klarna). plan-008's "2,000" was Klarna's target headcount, not a cut count; recorded as a non-counted target.
- Research sweep: no new company cleared the strict gate; Amazon 600K remains disputed (not entered).

## [Unreleased] - 2026-10-02 — Robotics split (visual) + robot backfill

### Added
- `displacementMode` field ('robotics' | absent = software AI). Tagged robotics (owner ruling): UPS evt-025 (20,000), UPS plan-011 (30,000 planned), Ocado evt-062 (1,000).
- Cumulative trend chart (dashboard, timeline, widget) is now stacked: Robotics (violet) vs Software AI (blue), with a legend.
- Headline counter: "Robotics Jobs" stat (21,000).
- "Robotics" badge on company cards, dashboard and widget Planned lists, and Timeline rows.
- Static SEO copy states the robotics share.

### Process
- Robot backfill (2 Sonnet agents, ~85 searches, 2022-11-30 → 2026-10-02): ZERO new events cleared the gate. Struck: Amazon 600K "avoided hires" (company disputes the leaked docs), GXO, Hyundai Atlas, GM, Tesla, Waymo, ports, autonomous trucking, Foxconn 60K (2016 recirculated). Closest miss: Asda/DHL "up to 1,000" (union attribution only).

## [Unreleased] - 2026-10-02 — Anthropic robots report + robot-displacement scope

### Added
- Predictions methodology: "Exposure is not job loss" context (80% of tasks exposed to LLMs or robots; robots cost-competitive for 0.3% today), linking Anthropic's "What Work Can Robots Do?" (2026-09-30). Mirrored in the prerender static SEO copy.
- AI Advances ms-299: the report (389 milestones). meta.json → 2026-10-02.

### Changed — scope (owner ruling)
- Layoffs from AI-powered robots/autonomous systems now count as AI displacement (same attribution gate). research.py losses/planned task text and 8 new robotics queries in queries.yml. Pre-2026-10-02 robot-driven layoffs were never swept.

## [Unreleased] - 2026-09-21 — Sheets transport retry fix

### Fixed
- First scheduled Monday run (35628847733) failed on the same stale-TLS ssl.SSLEOFError as Friday's first attempt (2 of 3 live runs). Added retry_transport (3 attempts, fresh connection per retry) to all Sheets calls in research.py; 32/32 offline tests. Rerun 35646051383 clean: 0 staged across all categories, digest delivered.

## [Unreleased] - 2026-09-19 — Weekly research cron ENABLED (T-201/T-202 complete)

### Fixed (2026-09-20)
- **DIGEST_TO secret was set to the service-account address** — the live run's digest bounced (NXDOMAIN on @...iam.gserviceaccount.com; owner received the bounce). Reset to the owner's mailbox. Status corrections: digest SMTP send path works (login+send OK, recipient was wrong); staging APPEND path remains UNTESTED until a run actually stages rows (reads verified). The empty staging sheet after the live run was correct behavior (0 staged, 3 gate-failed).

### Changed
- **research.yml weekly schedule enabled** (Mondays 06:00 CT / 11:00 UTC) after validation: dry run 35053235405 (caps held, gate correct, usage logged) + live run 35468244974 (sweeps + Sheets reads clean; 3 raw candidates, all gate-failed, 0 staged on a quiet week). First failed live attempt (35467651099) was a transient runner-side ssl.SSLEOFError during a Sheets read — retry succeeded; noted as a known flake class.

## [Unreleased] - 2026-09-15 — September catch-up (post GitHub account flag) + Workflow A dry run

### Added
- **3 displacement events** (evt-097–099): Anaconda (2026-08-14, ~14% of roles, number undisclosed — counted as 0; CEO David DeSanto: "the efficiencies AI provides us are real"), Pentera (2026-08-17, 60; company statement on AI-native transformation), PayPal (2026-08-31, 251 San Jose WARN; AI attribution via 10-Q — public statement omits AI). Total now 329,306 jobs / 98 events / 82 companies.
- **2 job-creation entries** (create-015–016, both "support"): SB Energy/OpenAI/NVIDIA PORTS-Pike Ohio (35,000 construction + 2,500 ops; figures originate in the March DOE/SB Energy release — single entry to avoid double counting) and Google Finland €13B (37,000+ construction-phase). Creation total 118,561.
- **18 AI milestones** (ms-281–298): AI Advances now through 2026-09-15 (GPT-6 Astra, Claude Fable/Mythos 5.1, Gemini 3.8 Flash/Cyber + Live, Grok 4.6, DeepSeek V4-Pro GA + V4.1 Flash, Qwen3.8-Flash, Muse Spark 1.3, Sakana Fugu Max/Ultra v2, Stripe–OpenRouter, Nvidia–Hugging Face, Nvidia $500B financing platforms, Mistral €3B, NARA records guidance, California child AI-safety package, Amodei "Pace the Frontier"). 388 total.
- **5 archive pages** (excerpt format, screenshots via system-Chrome playwright, zero manual captures); manifest 126 → 131.

### Changed
- evt-069 Oracle: description update for the 2026-09-14 second wave — $700M restructuring expansion to ~$2.8B per Q1 FY27 10-Q; press-estimated 7,000–10,000 roles NOT company-confirmed, jobsCut unchanged.
- plan-015 PayPal: execution update (251 WARN recorded as evt-099).
- meta.json dataLastUpdated → 2026-09-15.

### Process
- Same two-stage gate as August: 3 research agents → 2 adversarial verification agents. Struck: Hitachi Energy Mississippi (multi-driver grid investment, not AI-attributed) and 7 milestone candidates (incl. a premature/fabricated AlphaFold Phase-I claim and three out-of-window items). Oracle March-wave exec quotes were correctly NOT re-attributed to the September wave.
- **Workflow A dry run (T-201) executed via GitHub Actions** (run 35053235405, dry_run, window=35, Sonnet 5): completed successfully in ~23 min; caps held (10 searches/category; ~2.50M input / 64K output tokens across 3 sweeps); gate failed 3 candidates, staged 1 (Micron Research Labs $10B, no headcount — ⚠ flagged, awaiting owner audit in the dry-run-candidates artifact).
- Sheet paste rows for all 4 tabs: notes/catch-up-2026-09/sheet-paste-rows.md.

### Added — 2026-09-16 follow-up
- **automation/tracker_append.py + Tracker Append workflow**: reviewed, committed payloads pushed to the live tracker via the service account (no more manual pasting). Sep rows + Oracle/PayPal edits applied and verified (losses 95→98, creation 14→16). No dedup — never re-run a payload live.
- **queries.yml broadened** (10-Q/10-K, expanded-layoff-plan, WARN, "AI efficiencies", "AI-native") after owner coverage request; a 33-search gap-sweep over the window found zero missed events (owner's Oracle example was already recorded as the evt-069 update).
- Owner ruling: Micron Research Labs waits for a company-stated headcount.

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
