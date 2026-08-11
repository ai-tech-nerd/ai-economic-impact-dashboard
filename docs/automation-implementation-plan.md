# AI Shift Dashboard — Automation Implementation Plan

**Version:** 1.0 draft · **Date:** 2026-08-11 · **Runner decision:** GitHub Actions (replaces the n8n/iMac design in `docs/ai-shift-automation-brief.md`; that brief's schemas, gate, and acceptance criteria carry forward)

---

## 1. Architecture at a glance

```
┌─ Workflow A: RESEARCH (every 2 days, 6:00 AM CT) ──────────────┐
│ query bank sweep → structure → attribution gate → dedup        │
│ → append candidates to STAGING sheet → email digest            │
└────────────────────────────────────────────────────────────────┘
                       │
             Michael reviews staging sheet
             (edit cells, set Approval dropdown)          ← STAGE 2 (manual, the veto point)
                       │
┌─ Workflow B: PUBLISH (daily, 7:00 AM CT) ──────────────────────┐
│ poll staging for Approved+unpublished rows → for each:         │
│  1. append to live tracker sheet (source of truth)             │
│  2. convert to dashboard JSON (ids, schema, hedged numbers)    │
│  3. screenshot (Playwright) + archive.org Save Page Now        │
│  4. generate excerpt archive page + manifest + nav             │
│  5. commit → GitHub Pages auto-deploy                          │
│  6. stamp staging row Published + archive link                 │
│ paywalled source → stamp "Needs Manual Capture", skip, digest  │
└────────────────────────────────────────────────────────────────┘

┌─ Workflow C: ADVANCES (weekly, Mon 6:00 AM CT) ────────────────┐
│ milestones sweep (6 types) → staging "AI Advances" tab         │
│ → approved rows → ai-milestones.json (no archive pages)        │
└────────────────────────────────────────────────────────────────┘
```

All three run in the dashboard repo. No always-on hardware; everything auditable in the Actions log.

---

## 2. One-time setup (~15 min of Michael's time)

1. **Google service account** (I walk you through it): create in Google Cloud Console, enable the Sheets API, download the JSON key, share both sheets ("AI Economic Dashboard Staging" and "AI Attributed Job Losses") with the service-account email as Editor.
2. **GitHub Secrets** (repo Settings → Secrets): `GOOGLE_SA_KEY`, `ANTHROPIC_API_KEY` (research + structuring + gate), `PERPLEXITY_API_KEY` (optional second engine), `ARCHIVE_ORG_S3_KEYS` (free archive.org account → S3-style keys for reliable Save Page Now), `DIGEST_EMAIL` + a mail method (simplest: a Gmail app password or a free Resend/Mailgun key).
3. **Staging sheet prep** (scripted, one run): add columns and dropdowns per §3, plus the new "AI Advances" tab.

## 3. Staging sheet design

Existing tabs keep their column order (matching the live tracker), with these appended control columns on every tab:

| Column | Who writes it | Values |
|---|---|---|
| `Confidence` | automation | 0–100 from the gate |
| `Attribution` | automation | who said it (e.g. "CEO memo", "10-K", "spokesperson") |
| `Quote` | automation | the decisive verbatim quote |
| `Approval` | **you** (dropdown) | blank · Approved · Rejected · Needs Edit |
| `Status` | automation | blank · Published YYYY-MM-DD · Needs Manual Capture |
| `Archive Link` | automation | URL of the generated archive page |

New tab **AI Advances**: `Date | Company | Type | Name | Description | Category | Significance | Source Link` + the same control columns. Type restricted by dropdown to the 6 tracked values (breakthrough, company-launch, model-release, regulation, partnership, acquisition).

Rules: you may edit any cell before approving — the row's content at publish time is what ships. Rejected rows stay in place as a record (and feed the dedup so they're never re-proposed).

## 4. Workflow A — Research (Stage 1)

**Schedule:** every 2 days, 6:00 AM America/Chicago (`cron: 0 11 */2 * *`), plus `workflow_dispatch` for manual runs.

### 4.1 Query bank (from `docs/ai-economic-impact-search-terms.md`, expanded)

Your variants are the seed set, organized per category, with additions that proved out during the August backfill. The year token is injected dynamically (`{Y}` = current year), and every query runs with a 7-day recency window (widened to 30 days on manual catch-up runs).

**Job losses (your 11 + 6 learned):**
- Yours: `"laid off" AI OR "artificial intelligence"` · `"layoffs" AI OR "artificial intelligence"` · `"jobs cut" AI…` · `"AI-driven layoffs"` · `"restructuring workforce" AI…` · `"replacing roles" AI…` · `"AI replacing workers" {Y}` · `"replacing workers" AI {Y}` · `"company eliminated jobs" AI {Y}` · `"eliminating positions" AI {Y}` · `AI job loss`
- Added (these surfaced events the generic terms missed): `layoffs "cites AI"` · `earnings call layoffs "artificial intelligence"` · `restructuring 8-K "artificial intelligence"` (SEC filings — the strongest attribution class) · `CEO memo layoffs AI` · `"AI-native" restructuring layoffs` · Challenger, Gray & Christmas monthly report (their AI-cited tally is a discovery index — each named company gets a follow-up sweep)

**Planned / freezes (your 2 + 3):**
- Yours: `"hiring freeze" AI OR "artificial intelligence"` · `"paused hiring" AI…`
- Added: `"will result in" jobs AI automation` (forward-looking exec statements — how Wells Fargo surfaced) · `announced layoffs AI "over the next"` · `hiring "only AI roles"`

**Job creation (your 6 + 3):**
- Yours: `"job creation" AI…` · `"AI Hiring"` · `"companies hiring AI" {Y}` · `"AI jobs created" {Y}` · `"AI job creation" {Y}` · `"AI hiring" {Y}`
- Added: `AI data center jobs announced` (support category) · `"new roles" "AI-native" hiring` · `chip fab AI jobs {Y}`

**AI Advances (your 2, split per tracked type):** `AI breakthrough announced` · `AI model release {Y}` · `AI product launch` · `AI regulation {month} {Y}` · `AI acquisition announced` · `AI funding round billion` + per-lab sweeps (OpenAI, Anthropic, Google/DeepMind, Meta, xAI, Mistral, DeepSeek, Nvidia).

The bank lives in a config file (`automation/queries.yml`) so you can add/remove phrases by editing one file — no code changes. Every run logs which query surfaced each candidate, so we can prune dead phrases over time.

### 4.2 Engine and structuring

- **Search:** Claude with web search as primary engine (it applies judgment at search time), Perplexity `sonar` as an optional second pass (two engines catch different stories; dedup merges them). Cost either way: cents per run.
- **Structuring:** model outputs one candidate row per event matching the target tab's exact columns; hedged numbers preserved verbatim ("~600 (5%)"), reason limited to 1–3 factual sentences with a direct quote when the source has one, ISO dates, primary source URL.

### 4.3 Attribution gate (THE RULE, encoded)

Each candidate is classified before it can reach staging:
1. **Who attributes it to AI?** Valid: company statement, named exec quote, internal memo, press release, earnings call, SEC filing — or a journalist holding documented proof (leaked memo the outlet quotes). Invalid alone: journalist framing, anonymous "sources", third-party inference.
2. **Company denial check:** a targeted search for `"<company>" denies AI layoffs` / spokesperson statements. An explicit denial = hard fail regardless of framing (the Verizon/Zillow/Etsy pattern).
3. Confidence 0–100; **< 70 never reaches staging**; 70–84 is staged with a ⚠ flag in the Attribution column so you know to look closer.
4. Contextual judgment (your Darrow ruling): phrases like "advances in technology" from the company may count as AI at the model's judgment — but the company's exact phrase is always preserved in the Reason cell so you can overrule.

### 4.4 Dedup

Key: normalized company + event month + count bucket — checked against (a) all staging rows including Rejected, (b) the live tracker tabs, (c) the dashboard JSON. A repeat story about a known event is dropped and counted in the digest ("3 skipped as duplicates"). A genuine follow-up (planned → executed, like Oracle's 10-K) is staged as an **update** row flagged in the Attribution column.

### 4.5 Digest email

Subject: `AI Shift staging — {n} new candidates ({date})`. Body: per-tab new/skipped/gate-failed counts, one line per candidate (date · company · jobs · confidence), the staging link, and any rows stuck in Needs Manual Capture. Zero-result runs send a one-line "ran clean, nothing new" so silence always means something's wrong.

## 5. Stage 2 — Approval (yours, unchanged forever)

Open the staging sheet, read, optionally edit cells, set the dropdown. That's the entire interface. Nothing publishes without an explicit Approved — the automation has no path around you.

## 6. Workflow B — Publish (Stage 3)

**Schedule:** daily 7:00 AM CT + `workflow_dispatch`. Sequential per row (no parallel captures). Idempotent: rows with `Status = Published` are never reprocessed.

Per approved row: append to the live tracker tab (formatted to match) → generate the JSON entry (next id, schema conventions, `creationCategory` for creation rows) → Playwright screenshot with the bot-wall fallback chain proven in the backfill (direct → consent-dismiss → Firecrawl) → archive.org SPN2 save (endpoint verified at build time, keys from Secrets, calls spaced for rate limits) → generate the excerpt archive page (verbatim ≤75-word opening, headline, published date, screenshot accordion, Wayback link added to the page's source row, archived stamp, nav) → update manifest + neighbor nav → single commit per run (`Publish N approved events (YYYY-MM-DD)`) → Pages deploys → stamp rows.

**Failure paths:** screenshot unobtainable → `Needs Manual Capture`, row skipped, surfaced in next digest; you drop a PNG in Drive folder `AI-Shift-Manual-Captures/<slug>.png` and the next run picks it up. Any hard error → workflow fails loudly and emails you; nothing half-publishes (the commit is the last step).

## 7. Workflow C — AI Advances (weekly)

Same pattern, lighter: weekly sweep across the 6 types → staged to the AI Advances tab (calibration: the notable items, ~8–15/month, majors always in) → approved rows appended to `ai-milestones.json` in the next publish run. No archive pages, no screenshots — milestones cite sources directly.

## 8. Costs

| Item | Est. |
|---|---|
| GitHub Actions | $0 (public repo) |
| Claude API (research + gate + structuring, ~15 runs/mo) | ~$3–8/mo |
| Perplexity (optional second engine) | ~$1–3/mo |
| archive.org, Sheets API, email | $0 |
| **Total** | **≈ $5–10/mo** — in line with the brief's estimate |

## 9. Build order (each step approved & tested before the next)

1. **Sheet prep script** — control columns, dropdowns, AI Advances tab. *Test: dropdowns work, columns match.*
2. **Workflow A, schedule OFF** — run manually 2–3 times; you audit staged rows against the gate and query-attribution log; tune `queries.yml`. *Acceptance: correctly mapped rows, hedged numbers intact, quotes genuine, dupes skipped, digest accurate; a re-run stages zero.*
3. **Enable Workflow A schedule.** Live for one full cycle.
4. **Workflow B against a single test row** — one approved row end-to-end: tracker append, JSON, screenshot, Wayback, page, deploy, stamp. *Acceptance: brief §18 criteria — slug-correct excerpt page, working screenshot, valid Wayback link, dashboard row live, status stamped; a paywalled test row lands in Needs Manual Capture, not half-published.*
5. **Enable Workflow B schedule.**
6. **Workflow C** (advances), same pattern.
7. Retire the manual process; the notes/ pipeline docs become the runbook.

Estimated build effort: steps 1–2 in one working session, 3–5 across the following week (validation cycles are calendar time, not work time), 6 quick after that.

## 10. Out of scope (unchanged from the brief)

Weekly displacement brief, company-profiles automation, promotion logic. All reuse this plumbing later.

---
*Supersedes the runner/environment sections of `docs/ai-shift-automation-brief.md` (§3–4); everything else in that brief remains the spec of record. Pipeline template and lessons: `notes/research-backfill-2026-08/README.md`.*
