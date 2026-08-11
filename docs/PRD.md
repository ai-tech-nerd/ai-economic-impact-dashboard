# Product Requirements Document (PRD)
## AI Economic Impact Dashboard

| | |
|---|---|
| **Version** | 1.1 |
| **Date** | 2026-08-11 |
| **Owner** | Michael Kristof |
| **Status** | Official |
| **Live Site** | https://aishift.michaelkristof.com (custom domain via public/CNAME; also reachable at https://ai-tech-nerd.github.io/ai-economic-impact-dashboard/) |
| **Source** | https://github.com/ai-tech-nerd/ai-economic-impact-dashboard |

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

**Full-text reproduction is never published.** All archive pages (126 as of this document) use the excerpt-only format.

### 3.3 Hedged Numbers Preserved Verbatim

When a source states an imprecise figure ("tens of thousands", "~600 (5%)", "up to 20,000"), that phrasing is preserved exactly. **Never fabricate precision.** Dates are ISO format; reasons are 1 to 3 factual sentences with a direct quote when the source has one.

### 3.4 Job Creation Scope: Two Categories

The dashboard tracks AI-driven job creation alongside displacement, in two categories (`creationCategory`):

1. **AI-adoption roles**: new positions created inside companies adopting AI (e.g., AI-native replacement hires).
2. **Support (infrastructure) jobs**: jobs created for and around the technology itself: data centers, chip fabs, AI labs.

This follows the owner's tech-transition framework: technology transitions historically follow a pattern of **loss, then plateau, then job creation for and around the new technology**, as with the personal computer and the typesetter. Infrastructure job pledges count as AI job creation under the "support" category.

### 3.5 Human Approval Is a Hard Gate

Nothing reaches the public dashboard without explicit owner approval. Automation may research, structure, score, and stage candidates, but the review-and-approve step between research and anything public is manual, permanent, and has no bypass path.

---

## 4. Feature Inventory

### 4.1 The Six Pages

**Dashboard** (`/`)
A real-time summary of total verified jobs displaced by AI, broken down by company, industry, job type, and trend over time. Animated counters, a cumulative trend line, top job-category and industry charts, a sortable company table, plus compact Planned/Announced and AI Job Creation sections with headline totals. A **"Data updated: <date>" indicator** reads `public/data/verified/meta.json` (`dataLastUpdated`); the contract is that every data commit bumps this date, and the publish automation will maintain it.

**Predictions** (`/predictions`)
Forward-looking estimates of which job categories face the highest displacement risk over 3-month, 6-month, 12-month, and 3-to-5-year timeframes, with risk levels, confidence ranges, and methodology transparency. Convention: every prediction's basis opens with its grounding date ("As of Aug 2026: ..."), the set is re-grounded against current data on a roughly quarterly cadence, and every figure is labeled as a projection, never a verified event.

**Timeline** (`/timeline`)
Two ways to experience the data over time: a slider mode with play/pause/speed controls to scrub through the timeline and watch events accumulate, and a story mode that walks through narrative chapters from ChatGPT's growth to 100 million users through the first AI-driven layoffs to the current acceleration.

**AI Advances** (`/ai-advances`)
A visual timeline of major AI milestones: model releases, company launches, acquisitions, partnerships and funding deals, regulatory actions, and technical breakthroughs, filterable by type, company, and country. Newest-first by default with an order toggle, and a **"Public release" badge** driven by the optional `publicRelease` field (8 milestones flagged as of 2026-08-11).

**Companies** (`/companies/:id?`)
Searchable profiles of AI companies (OpenAI, Anthropic, Google, Meta, xAI, and more) with drill-down detail pages showing per-company milestone timelines, displacement events with sources, and key stats. Formal company names are used throughout.

**Learn & Prepare** (`/learn`)
A practical resource hub adapted from "The AI Shift" guide, in six tabbed sections: Free AI Tools, the CRAFT prompt framework, a 30-Day Action Plan, Irreplaceable Skills, Free Courses (from Anthropic, Google, DeepLearning.AI, IBM, NVIDIA, and Microsoft), and Privacy & Safety.

### 4.2 Embeds and Widgets

The product is embeddable so its data can travel:

- **Widgets** (single components): `/widget/stats`, `/widget/trend`, `/widget/job-types`, `/widget/industry`, `/widget/planned`, `/widget/creation`, `/widget/companies`
- **Full-page embeds**: `/embed/dashboard`, `/embed/predictions`, `/embed/timeline`, `/embed/ai-advances`, `/embed/companies/:id?`, `/embed/learn`

### 4.3 Source Archive

Every displacement event links to an excerpt-format archive page (see 3.2), chained with prev/next navigation and indexed in a manifest. The archive is the product's proof layer: it lets any user verify that a claimed event was really reported, as reported, even if the original article moves or disappears.

**Needs Manual Capture flow:** when a source cannot be captured automatically (paywall or bot wall that survives the fallback chain), the event is stamped "Needs Manual Capture" and skipped rather than half-published. The owner captures the screenshot in a logged-in browser, drops it into the page folder, and the next pass completes the page. A broken or block-page capture is never published.

---

## 5. Data Products

Four datasets, published as static JSON in the repo and fetched at runtime. Counts as of 2026-08-11:

| Dataset | Count | Contents |
|---|---|---|
| Displacement events | **96** (95 displayed; 1 IBM projection excluded from totals) | Verified AI-attributed job cuts: 328,995 jobs across 80 companies, each with source link and archive page |
| Planned / announced | **17** | Announced-but-not-executed reductions, freezes, and restructurings attributed to AI, with status (Hiring Freeze, In Progress, Announced, Announced (early stage)) |
| Job creation | **14** | AI-driven hiring, each tagged `creationCategory` (8 ai-adoption-roles, 6 support), with a numeric `jobsCreated` field (undisclosed counts excluded from totals) |
| AI milestones | **370** | Model releases, company launches, acquisitions, partnerships, funding, regulations, and breakthroughs through 2026-08-08 (pre-2022 historical backfill included); 8 entries carry the `publicRelease` badge flag, and the ChatGPT launch milestone (ms-029, 2022-11-30) was enriched 2026-08-11 |

Supporting data: company profiles and predictions (**9** predictions across four timeframes, re-grounded "As of Aug 2026"), the archive manifest (126 pages), and `meta.json` (`dataLastUpdated`, the "Data updated" indicator contract).

The owner's tracker spreadsheet is the curation source of truth; the dashboard JSON is the published form and the two are kept in sync at publish time.

---

## 6. The Pipeline as a Product

The data pipeline is a first-class part of the product because the verification standard (Section 3) is only as good as the process that enforces it.

### 6.1 Three Stages

1. **Research (automated).** A query-bank sweep (seeded from the owner's search-term bank, expanded with phrases proven during the August 2026 backfill, such as SEC-filing and earnings-call queries) finds candidate events. Each candidate is structured to the target schema, passed through the attribution gate (Section 3.1: valid attributor check, targeted company-denial search, confidence score with the 70 floor), deduplicated against staging, the tracker, and the published JSON, then appended to the staging sheet (see the local automation brief) with its confidence, attribution source, and decisive quote. A digest email summarizes every run, including zero-result runs.

2. **Review and approval (manual, the veto point).** The owner reads the staged candidates, edits any cell, and sets an approval dropdown. The row's content at publish time is what ships. Rejected rows are kept as a record and feed the dedup so they are never re-proposed.

3. **Publish (automated, approval-triggered).** For each approved row, sequentially and idempotently: append to the live tracker, generate the dashboard JSON entry, capture a screenshot (with a bot-wall fallback chain), trigger an archive.org Save Page Now, generate the excerpt archive page with manifest and navigation updates, commit, and let GitHub Pages deploy. Paywalled or blocked sources are stamped "Needs Manual Capture" and skipped, never half-published; the owner supplies the screenshot manually and the next run completes the row.

A lighter weekly workflow follows the same pattern for AI Advances milestones (staged, approved, appended to the milestones JSON; no archive pages, since milestones cite sources directly).

### 6.2 Runner

Per the approved implementation plan (2026-08-11), the automation runs on **GitHub Actions** in the dashboard repo: scheduled workflows, no always-on hardware, every run auditable in the Actions log. Estimated operating cost is roughly $5 to $10 per month (API usage; hosting, archiving, and scheduling are free). The earlier n8n/local-machine design is superseded for the runner while its schemas, attribution gate, and acceptance criteria carry forward. Details, schemas, and credentials setup live in the local automation brief and implementation plan; they are intentionally not reproduced here.

### 6.3 Build Status (as of 2026-08-11)

- **Workflow A (Research) is built.** `automation/research.py` plus `.github/workflows/research.yml`, manual dispatch only; the weekly cron (Mondays 6:00 AM CT) is written but commented out pending 2 to 3 audited manual runs. 29 offline unit tests pass; live API/Sheets/SMTP paths remain UNTESTED until credentials exist (see automation/README.md).
- **Sheet prep is scripted and validated as idempotent** (`automation/sheet_prep.py` plus the manual-dispatch `sheet-prep.yml` workflow, dry-run by default): control columns, Approval dropdowns, and the AI Advances tab.
- **Cadence decision:** research runs weekly, Mondays 6:00 AM CT (owner decision 2026-08-11), not every 2 days as first drafted.
- **Cost control is a product principle: pipelines never default to premium models.** The research model defaults to `claude-sonnet-5` with hard spend caps (max 10 web searches and 10,000 output tokens per category, env-overridable) and per-category usage logging on every run. Context: 2026-08-11 dry runs on the premium tier burned roughly $36; Sonnet with caps bounds a full run to roughly $1 to $3.
- **Workflows B (Publish) and C (Advances) are not yet built.** Workflow B must bump `public/data/verified/meta.json` (`dataLastUpdated`) on every data commit; that contract also binds any manual data commit in the meantime.

### 6.4 Validation Before Automation

The August 2026 backfill ran this exact pipeline manually (parallel research agents, owner review, adversarial verification that struck 9 of 26 researched events, owner rulings, then conversion and browser-verified builds) and serves as the template and acceptance benchmark for the automated build.

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
- **Automation build** per the approved GitHub Actions plan: research workflow first (schedule off, manual validation runs), then the approval signal, then the publish workflow against a single test row, then the weekly AI Advances workflow, then retire the manual process.
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
