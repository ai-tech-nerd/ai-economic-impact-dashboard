# Product Requirements Document (PRD)
## AI Economic Impact Dashboard

| | |
|---|---|
| **Version** | 1.2 |
| **Date** | 2026-10-03 |
| **Owner** | Michael Kristof |
| **Status** | Official |
| **Live Site** | https://aishift.michaelkristof.com (custom domain via public/CNAME; also reachable at https://ai-tech-nerd.github.io/ai-economic-impact-dashboard/) |
| **Source** | https://github.com/ai-tech-nerd/ai-economic-impact-dashboard |

> **v1.2 (2026-10-03):** headline metric redefined as "Total Jobs Displaced by AI" (verified layoffs plus realized Jobs Never Created); robot and autonomous-system layoffs added to scope; new Jobs Never Created data product; 13 canonical job categories; dashboard hero redesign and stats widget rebuild; social share images and per-company static pages; weekly research cron live with a fourth category (never); counts refreshed.

> **v1.1 (2026-08-11):** search-facing positioning ("Jobs Lost to AI") and per-route SEO principle added; feature inventory updated (Data updated indicator, AI Advances order toggle and Public Release badge, predictions "as of" convention, Needs Manual Capture flow); data counts refreshed (9 predictions, publicRelease flags); pipeline build status added (Workflow A built, sheet prep scripted, weekly Monday cadence, cost-control principle).

> **Maintenance note:** This document is the product source of truth. Update it whenever a product decision changes (verification rules, scope, feature set, data model, pipeline design), and bump the version number. Technical internals live in docs/PROJECT_ARCHITECTURE.md; this PRD covers the product.

---

## 1. Product Overview and Mission

The AI Economic Impact Dashboard is a free, open-source, interactive data tool that tracks jobs cut or displaced due to artificial intelligence adoption by companies worldwide. The timeline begins November 30, 2022, the day OpenAI launched ChatGPT, and is updated as new verified events are reported.

**Mission:** Provide transparent, verified data visualization of AI-driven workforce displacement, paired with actionable learning resources, so the response to "this is happening" is preparation rather than paralysis.

**Why it exists:**

- **The data is scattered.** AI displacement is reported one headline at a time. No single source brings the events together in a way that reveals the pattern.
- **Numbers without context do not drive action.** The dashboard pairs displacement data with AI advancement milestones and with learning resources.
- **Transparency builds trust.** Every event is verified against direct company statements, earnings calls, filings, or credible reporting, and every data point links to its original source.
- **Free means accessible.** Static site on GitHub Pages: no accounts, no paywalls, no ads, no tracking, zero infrastructure cost. Data and code are open source so anyone can verify, contribute, or build on them.

**Positioning (2026-08-11).** The search-facing product name and home-page H1 is **"Jobs Lost to AI"**; "AI Economic Impact Dashboard" remains the umbrella brand (it appears as the site's alternate name in structured data). This reflects a deliberate SEO principle: every route's title and H1 lead with the search phrase its audience actually types ("Will AI Take My Job? AI Job Loss Predictions", "Companies Replacing Workers With AI", "AI Layoffs Timeline") rather than brand-led wording.

---

## 2. Audience

| Audience | Need served |
|---|---|
| Workers and professionals | Understand how AI is reshaping their industry; real companies, real numbers, real timelines |
| Job seekers and career changers | Identify which roles are most at risk and which skills to develop |
| Journalists and researchers | A verified, sourced dataset of AI displacement events and industry milestones |
| Educators and trainers | A teaching tool that makes the pace of change tangible (timeline, story mode) |
| Business leaders and HR professionals | Context for workforce planning: which job types are affected and how the trend is accelerating |
| Policy makers and advocates | Evidence-based data for shaping policy, safety nets, and retraining programs |

---

## 3. Core Product Principles

These principles are the product. They are non-negotiable and take precedence over volume of data, speed of publication, or dramatic framing.

### 3.1 Verification Standard (THE RULE)

Every displacement event requires **company-attributed AI causation**. Valid attribution sources:

- Company statement or press release
- Named executive quote
- Internal memo
- Earnings call
- SEC filing (the strongest attribution class; e.g., Oracle's FY2026 10-K was the dataset's first formal SEC-filing attribution)
- A spokesperson statement

**Journalist framing cannot override company statements** unless the journalist has documented proof (e.g., a leaked memo the outlet quotes). Anonymous "sources" and third-party inference are invalid on their own.

**An explicit company denial disqualifies an event**, regardless of how the press framed it. This rule catches real errors: Verizon's AI framing was aggregator inference the company explicitly denied, and Zillow, Etsy, and TikTok all cut jobs while denying AI attribution. Companies actively resist the AI label; the dashboard's credibility depends on this rule.

**Confidence threshold: 70.** Each candidate event is scored 0 to 100 for AI attribution; anything below 70 never reaches staging.

**Owner judgment applies at the margins.** Company phrases such as "advances in technology" may count as AI attribution by ruling, but the company's exact phrase is always preserved verbatim so the call is transparent (the Darrow precedent). Where attribution is contested (e.g., a memo contradicting an earnings call), the contradiction is disclosed in the event's notes (the GitLab precedent).

### 3.2 Provenance Without Republication

Every event links to a source-archive page that proves provenance without reproducing copyrighted work. Archive pages contain, and only contain:

- The article headline and publish date
- A verbatim opening excerpt of **75 words or fewer**, with a provenance note
- A full-page screenshot of the source article
- The live source link
- An archive.org (Wayback Machine) backup link
- Structured event metadata (date, company, jobs, category) and prev/next navigation

**Full-text reproduction is never published.** All archive pages (131 as of 2026-10-03) use the excerpt-only format.

### 3.3 Hedged Numbers Preserved Verbatim

When a source states an imprecise figure ("tens of thousands", "~600 (5%)", "up to 20,000"), that phrasing is preserved exactly. **Never fabricate precision.** Dates are ISO format; reasons are 1 to 3 factual sentences with a direct quote when the source has one.

### 3.4 Job Creation Scope: Two Categories

The dashboard tracks AI-driven job creation alongside displacement, in two categories (`creationCategory`):

1. **AI-adoption roles**: new positions created inside companies adopting AI (e.g., AI-native replacement hires).
2. **Support (infrastructure) jobs**: jobs created for and around the technology itself: data centers, chip fabs, AI labs.

This follows the owner's tech-transition framework: technology transitions historically follow a pattern of **loss, then plateau, then job creation for and around the new technology**, as with the personal computer and the typesetter. Infrastructure job pledges count as AI job creation under the "support" category.

### 3.5 Human Approval Is a Hard Gate

Nothing reaches the public dashboard without explicit owner approval. Automation may research, structure, score, and stage candidates, but the review-and-approve step between research and anything public is manual, permanent, and has no bypass path.

### 3.6 Headline Metric and Counting Rules

The headline is **"Total Jobs Displaced by AI" = verified layoffs + realized Jobs Never Created** (see 3.8): 329,306 as of 2026-10-03, which is 328,106 + 1,200. Planned cuts and future estimates (entries flagged `isProjection`) are shown separately and never counted, and AI job creation is shown but is not part of the total. The home-page H1 "Jobs Lost to AI" is a search-facing choice (see Section 1); the page description explains that the total combines layoffs with jobs companies stopped filling.

### 3.7 Robots and Autonomous Systems Count as AI Displacement

Owner ruling, 2026-10-02: layoffs caused by AI-powered robots and autonomous systems count as AI displacement, under the same attribution gate as software AI (Section 3.1). These entries carry `displacementMode: "robotics"`; everything else is software AI. Tagged so far: UPS (evt-025, 20,000 cut; plan-011, 30,000 planned) and Ocado (evt-062, 1,000 cut), 21,000 robotics jobs in the layoff total. The dashboard shows the robotics share separately (violet), with a "Robotics" badge on affected rows. A backfill of the full window (2022-11-30 to 2026-10-02) found no further robot-driven events that cleared the gate.

### 3.8 Jobs Never Created

Owner-approved name for work given to AI or robots instead of new hires or replacements. It is a separate category from layoffs, with its own gate: the entry needs either a **company-stated number**, or a **company-stated ratio applied to a stated or official baseline**, with the math shown in the entry's `estimateBasis`. Figures a company disputes are flagged and excluded. Realized entries count toward the headline; multi-year future estimates are shown but not counted. Current entries: IBM 7,800 (future estimate), Klarna 1,200 (realized, counted), DBS 4,000 (future estimate). IBM and Klarna were moved out of the layoffs and planned datasets because no one was laid off; positions were simply not refilled.

### 3.9 Canonical Job Categories

Job categories are normalized to **13 canonical categories** (defined in `scripts/job-categories.mjs`). The source's original wording is kept in `jobTypesDetail` and shown as chips on company pages. The deploy fails if any entry uses a non-canonical value. Because one event can belong to more than one category (35 events do), the Job Types chart categories sum to more than the total.

---

## 4. Feature Inventory

### 4.1 The Six Pages

**Dashboard** (`/`)
A real-time summary of total jobs displaced by AI, broken down by company, industry, job type, and trend over time. The hero shows the big headline total on the left with tiles on the right (Layoffs, Jobs Never Created, Robotics "of layoffs", AI Jobs Created marked "not in total", Most Impacted Industry, Top Job Category) and a strip below labeled "Not included in total" (planned cuts and future jobs never created). It stacks on mobile. Below it: a stacked cumulative trend chart (Robotics, Software AI, Jobs Never Created), top job-category and industry charts, a sortable company table, a Jobs Never Created card, plus compact Planned/Announced and AI Job Creation sections with headline totals. A **"Data updated: <date>" indicator** reads `public/data/verified/meta.json` (`dataLastUpdated`); the contract is that every data commit bumps this date, and the publish automation will maintain it.

**Predictions** (`/predictions`)
Forward-looking estimates of which job categories face the highest displacement risk over 3-month, 6-month, 12-month, and 3-to-5-year timeframes, with risk levels, confidence ranges, and methodology transparency. Convention: every prediction's basis opens with its grounding date ("As of Aug 2026: ..."), the set is re-grounded against current data on a roughly quarterly cadence, and every figure is labeled as a projection, never a verified event.

**Timeline** (`/timeline`)
Two ways to experience the data over time (the running counter and chart include realized Jobs Never Created): a slider mode with play/pause/speed controls to scrub through the timeline and watch events accumulate, and a story mode that walks through narrative chapters from ChatGPT's growth to 100 million users through the first AI-driven layoffs to the current acceleration.

**AI Advances** (`/ai-advances`)
A visual timeline of major AI milestones: model releases, company launches, acquisitions, partnerships and funding deals, regulatory actions, and technical breakthroughs, filterable by type, company, and country. Newest-first by default with an order toggle, and a **"Public release" badge** driven by the optional `publicRelease` field (6 milestones flagged as of 2026-10-03).

**Companies** (`/companies/:id?`)
Searchable profiles of AI companies (OpenAI, Anthropic, Google, Meta, xAI, and more) with drill-down detail pages showing per-company milestone timelines, displacement events with sources, job-category chips (original wording), and key stats. Formal company names are used throughout. Every company has its own static, crawlable page (147 as of 2026-10-03) with its own title, description, and share image.

**Learn & Prepare** (`/learn`)
A practical resource hub adapted from "The AI Shift" guide, in six tabbed sections: Free AI Tools, the CRAFT prompt framework, a 30-Day Action Plan, Irreplaceable Skills, Free Courses (from Anthropic, Google, DeepLearning.AI, IBM, NVIDIA, and Microsoft), and Privacy & Safety.

### 4.2 Embeds and Widgets

The product is embeddable so its data can travel:

- **Widgets** (single components): `/widget/stats` (mirrors the dashboard hero; dark, light, and transparent themes), `/widget/trend`, `/widget/job-types`, `/widget/industry`, `/widget/planned`, `/widget/creation`, `/widget/companies`
- **Full-page embeds**: `/embed/dashboard`, `/embed/predictions`, `/embed/timeline`, `/embed/ai-advances`, `/embed/companies/:id?`, `/embed/learn`

Embed snippets use path URLs; the stats widget defaults to height 560 (about 400 full width, 560 in a blog column, 730 on mobile).

### 4.3 Social Sharing and Static Pages

Every page has a branded 1200x630 share image (6 section pages, 147 company pages, 131 Source Archive pages) generated at deploy from live data, so shared links preview correctly and carry the current numbers. Each page also has its own X/Twitter and Open Graph title and description. Company pages are pre-rendered as static HTML so shared company links preview correctly and are crawlable.

### 4.4 Source Archive

Every displacement event links to an excerpt-format archive page (see 3.2), chained with prev/next navigation and indexed in a manifest. The archive has four tabs: Jobs Displaced, Planned/Announced, Jobs Created, and Jobs Never Created. The archive is the product's proof layer: it lets any user verify that a claimed event was really reported, as reported, even if the original article moves or disappears.

**Needs Manual Capture flow:** when a source cannot be captured automatically (paywall or bot wall that survives the fallback chain), the event is stamped "Needs Manual Capture" and skipped rather than half-published. The owner captures the screenshot in a logged-in browser, drops it into the page folder, and the next pass completes the page. A broken or block-page capture is never published.

---

## 5. Data Products

Five datasets, published as static JSON in the repo and fetched at runtime. Counts as of 2026-10-03:

| Dataset | Count | Contents |
|---|---|---|
| Displacement events | **96** | Verified AI-attributed job cuts: 328,106 jobs across 81 companies, each with source link and archive page; 2 entries tagged `displacementMode: "robotics"` |
| Planned / announced | **15** | Announced-but-not-executed reductions and restructurings attributed to AI (151,900 planned jobs; not counted in the headline) |
| Job creation | **16** | AI-driven hiring, each tagged `creationCategory` (adoption vs support), with a numeric `jobsCreated` field (undisclosed counts excluded from totals) |
| Jobs Never Created | **3** | Work given to AI/robots instead of new hires (IBM, Klarna, DBS), each with the stated basis and math; 1,200 realized and counted, 11,800 future estimates not counted |
| AI milestones | **420** | Model releases, company launches, acquisitions, partnerships, funding, regulations, and breakthroughs through 2026-10-02 (pre-2022 historical backfill included); some carry multiple types (e.g. OpenAI Dots is both a company launch and a model release); 6 entries carry the `publicRelease` badge flag |

Supporting data: company profiles and predictions (**9** predictions across four timeframes, re-grounded "As of Aug 2026"), the archive manifest (131 pages: 96 layoffs, 15 planned, 16 created, 4 never created), and `meta.json` (`dataLastUpdated`, the "Data updated" indicator contract).

The owner's tracker spreadsheet is the curation source of truth; the dashboard JSON is the published form and the two are kept in sync at publish time.

---

## 6. The Pipeline as a Product

The data pipeline is a first-class part of the product because the verification standard (Section 3) is only as good as the process that enforces it.

### 6.1 Three Stages

1. **Research (automated).** A query-bank sweep across four categories (losses, planned, created, and never for Jobs Never Created) seeded from the owner's search-term bank, expanded with phrases proven during the August 2026 backfill, such as SEC-filing and earnings-call queries, finds candidate events. Each candidate is structured to the target schema, passed through the attribution gate (Section 3.1: valid attributor check, targeted company-denial search, confidence score with the 70 floor), deduplicated against staging, the tracker, and the published JSON, then appended to the staging sheet (see the local automation brief) with its confidence, attribution source, and decisive quote. A digest email summarizes every run, including zero-result runs.

2. **Review and approval (manual, the veto point).** The owner reads the staged candidates, edits any cell, and sets an approval dropdown. The row's content at publish time is what ships. Rejected rows are kept as a record and feed the dedup so they are never re-proposed.

3. **Publish (automated, approval-triggered).** For each approved row, sequentially and idempotently: append to the live tracker, generate the dashboard JSON entry, capture a screenshot (with a bot-wall fallback chain), trigger an archive.org Save Page Now, generate the excerpt archive page with manifest and navigation updates, commit, and let GitHub Pages deploy. Paywalled or blocked sources are stamped "Needs Manual Capture" and skipped, never half-published; the owner supplies the screenshot manually and the next run completes the row.

A lighter weekly workflow follows the same pattern for AI Advances milestones (staged, approved, appended to the milestones JSON; no archive pages, since milestones cite sources directly).

### 6.2 Runner

Per the approved implementation plan (2026-08-11), the automation runs on **GitHub Actions** in the dashboard repo: scheduled workflows, no always-on hardware, every run auditable in the Actions log. Estimated operating cost is roughly $5 to $10 per month (API usage; hosting, archiving, and scheduling are free). The earlier n8n/local-machine design is superseded for the runner while its schemas, attribution gate, and acceptance criteria carry forward. Details, schemas, and credentials setup live in the local automation brief and implementation plan; they are intentionally not reproduced here.

### 6.3 Build Status (as of 2026-10-03)

- **Workflow A (Research) is built, validated, and scheduled.** `automation/research.py` plus `.github/workflows/research.yml`. Validated by a dry run (35053235405) and a live run (35468244974); the **weekly cron has been live since 2026-09-19** (Mondays 6:00 AM CT). It sweeps four categories: losses, planned, created, and never. Sheets calls retry after a transient stale-TLS error. The staging-append path stays UNTESTED until a run actually stages rows (quiet weeks stage zero by design).
- **Sheet prep is scripted and validated as idempotent** (`automation/sheet_prep.py` plus the manual-dispatch `sheet-prep.yml` workflow, dry-run by default): control columns, Approval dropdowns, and the AI Advances tab.
- **Cadence decision:** research runs weekly, Mondays 6:00 AM CT (owner decision 2026-08-11), not every 2 days as first drafted. It is now enabled.
- **Cost control is a product principle: pipelines never default to premium models.** The research model defaults to `claude-sonnet-5` with hard spend caps (max 10 web searches and 10,000 output tokens per category, env-overridable) and per-category usage logging on every run. Context: 2026-08-11 dry runs on the premium tier burned roughly $36; Sonnet with caps bounds a full run to roughly $1 to $3.
- **Tracker utility:** `automation/tracker_append.py` (with the manual-dispatch Tracker Append workflow) pushes reviewed, committed payloads to the live tracker sheet through the service account, replacing manual pasting. The tracker has a "Category" column (canonical category labels) and a "Jobs Never Created" tab; future publish automation must fill Category on new rows.
- **Workflows B (Publish) and C (Advances) are not yet built.** Workflow B must bump `public/data/verified/meta.json` (`dataLastUpdated`) on every data commit; that contract also binds any manual data commit in the meantime.

### 6.4 Validation Before Automation

The pipeline was validated by manual dry and live runs before the cron was enabled (6.3). The August 2026 backfill ran this exact pipeline manually (parallel research agents, owner review, adversarial verification that struck 9 of 26 researched events, owner rulings, then conversion and browser-verified builds) and serves as the template and acceptance benchmark for the automated build.

---

## 7. Success Metrics

From the project brief:

- All displacement events verified with primary sources (currently: every published event carries company-attributed AI causation and a source-archive page)
- Dashboard accessible and performant on all devices (mobile, tablet, desktop layouts)
- Learning resources actionable and up to date

Pipeline acceptance criteria (from the automation brief) additionally require: correctly mapped staged rows, zero-duplicate re-runs, ISO dates and verbatim hedged numbers, no sub-70-confidence rows in staging, accurate digests, slug-correct excerpt archive pages with working screenshots and valid Wayback links, and paywalled sources flagged rather than half-published.

---

## 8. Out of Scope

- User accounts or authentication
- Real-time data updates (curation is deliberate, gated, and human-approved)
- Public API for third-party consumption
- Paid features of any kind
- Promotion logic beyond the approval trigger

---

## 9. Future Roadmap

- **Phase 3 (project brief): data expansion and refinements.**
- **Automation build** per the approved GitHub Actions plan: research workflow (done, cron live), then the approval signal, then the publish workflow against a single test row, then the weekly AI Advances workflow, then retire the manual process.
- **Additional automated content types**: Predictions, Timeline, and AI Advances research queries beyond the initial milestone sweep (schemas pending).
- **Weekly AI Displacement Brief**: a packaged insight product reading the approved data (deferred; reuses the pipeline).
- **AI company profiles / milestones tracker automation**: same architecture, different queries (deferred).

---

## 10. Technology Summary

React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Framer Motion, React Router (BrowserRouter with the 404.html fallback for GitHub Pages; real crawlable URLs), react-helmet-async, plus build-time per-route static HTML generation for SEO (`scripts/prerender-seo.mjs`). Static JSON data, no backend or database. Deployed to GitHub Pages via GitHub Actions. Created by Michael Kristof (michaelkristof.com).

---

## Document History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-11 | Initial official PRD |
| 1.1 | 2026-08-11 | "Jobs Lost to AI" positioning and per-route SEO principle; Data updated indicator, AI Advances toggle/badge, predictions "as of" convention, Needs Manual Capture flow; counts refreshed (9 predictions, publicRelease flags); pipeline build status (Workflow A built, weekly Monday cadence, sonnet-default cost-control principle, meta.json contract) |
| 1.2 | 2026-10-03 | Headline redefined as Total Jobs Displaced by AI (layoffs + realized Jobs Never Created; planned and future estimates never counted); robot/autonomous-system layoffs in scope (`displacementMode`); Jobs Never Created data product and gate; 13 canonical job categories; dashboard hero redesign and stats widget; social share images and static company pages; Workflow A validated and weekly cron live with a fourth category; tracker_append utility; counts refreshed (96 events, 81 companies, 420 milestones, 131 archive pages, 147 company pages) |
