# Catch-up Data Sync — August 10, 2026

## Quick Links
- CHANGELOG entry: `[Unreleased] - 2026-08-10`
- Source of truth: Google Sheet **"AI Attributed Job Losses"** (ID `1f_VqBAJgwabI0UDomPpzHN-mokPNdlBvgaUd4eeNsa0`, last edited 2026-05-26)
- Staging sheet **"AI Economic Dashboard Staging"** (`1YamM-SGhhWaqsH355kAhcRsjNuyRV8XzffmqMZ_CDPk`) — VERIFIED EMPTY (headers only); Stage 1 automation never ran
- Automation spec: `docs/ai-shift-automation-brief.md`

## Problem Statement
Dashboard JSON (`public/data/verified/`) stopped at 2026-04-04 while the tracker sheet had entries through 2026-05-21. ~30 entries were never converted. Also: archive pages republished full article text (copyright exposure); new pages must use excerpt-only format.

## What Was Done (all VERIFIED in browser preview against dev build)
1. **Data sync** (subagent): +17 events (evt-071–087), +8 planned (plan-008–015), +5 created (create-002–006). Totals: 87 events / 15 planned / 6 created; dashboard shows 324,370 jobs, 86 events (evt-007 IBM excluded as `isProjection`).
2. **Date fixes** (user-confirmed): plan-005 Lufthansa → 2025-11-20; plan-007 Meta → 2026-01-13.
3. **18 new archive pages** (3 subagents) in the new excerpt format: top section identical to old template; article body = verbatim ≤75-word excerpt + provenance note; full-page screenshot in accordion. Headline and published date retained (user requirement added mid-task).
4. **Manifest** 89 → 107 entries; nav chain rebuilt (34 pages' nav lines touched — 18 new + 16 neighbors).

## Key Decisions
- **Canonical-source rule:** where an existing archive page disagreed with the sheet, archive won (it was built from the actual article). Applied to: Klarna 2024-09-05 (not 09-01), SAP 2025-09-24 (not 2025-04-24), ASML 1,700 jobs (not 1,300), HP planned stays per JSON.
- Screenshot tooling: `npx playwright screenshot --channel chrome` (system Chrome, no browser download needed). Bot-blocked sites: Firecrawl scrape fallback worked for Reuters/CNN/Fast Company/Axios text; NOT for NYT (unsupported) or Bloomberg.

## Approaches That FAILED (do not retry blindly)
- WebFetch + playwright CLI on Reuters/Bloomberg/NYT/Axios → DataDome/"Are you a robot?" walls. Wayback Machine copies of these are usually archived 401/403 block pages, not articles.
- `pip3 install --user` blocked by PEP 668 on this Mac — use a venv.
- Google Drive MCP `read_file_content` on a spreadsheet returns lossy markdown; use `download_file_content` with xlsx exportMimeType + openpyxl.

## Round 2 (same day): Full-archive excerpt migration — DONE
- User completed the 5 manual captures; pages finished with accordions + headlines/excerpts read from the capture PNGs (Coinbase NYT headline recovered from screenshot; PwC headline corrected to Bloomberg's on-page title).
- 4 subagents migrated all 89 old pages to excerpt format. Independent validation script: 88 ok + BuzzFeed special case (was an Access-Denied placeholder; rebuilt from its own screenshot). Zero problems after fixes.
- Subagent lesson: parallel agents sharing a scratchpad MUST use uniquely named work files — two agents collided on `excerpts.json`/`extract.py`; no damage (validated), but future orchestrations should mandate per-agent filenames up front.
- Pre-existing quirk fixed: 2022-11-09-meta had an empty Details/reason-text (filled from event JSON).
- DECIDED (2026-08-10): keep `public/data/source-archive/txt/` as a local archive per owner; manifest `article_file` fields left in place.

## Outstanding — Needs Manual Capture (5) — RESOLVED (round 2)
| Page | Missing | Source |
|---|---|---|
| 2026-02-25-c3-ai | screenshot (headline+excerpt present) | Reuters |
| 2026-02-26-pwc | screenshot + excerpt (headline present) | Bloomberg |
| 2026-04-07-pendo | screenshot (headline+excerpt present) | Axios |
| 2026-05-05-paypal-planned | screenshot + excerpt (headline present) | Bloomberg |
| 2026-05-05-coinbase | screenshot + excerpt + HEADLINE | NYT |

Manual procedure: open article in a logged-in browser, screenshot full page, drop PNG into the page folder named `<slug>-screenshot.png`, re-add the accordion block (copy from any new page), and for Coinbase add the NYT headline to the article-section.

## Next Steps
1. Commit this sync (awaiting user approval) — includes the 131 pre-existing uncommitted deletions (verified: 55 archive dirs superseded by renamed versions, docs moved to assets/)
2. Manual captures above
3. Migrate 89 old full-text archive pages to excerpt format (user: "next round")
4. June–August 2026 research gap backfill
5. Automation build per docs/ai-shift-automation-brief.md (GitHub Actions recommended over n8n/iMac)

## Test Files
Scratchpad (session-temp, not preserved): comparison scripts, tracker.xlsx export, work-data.json, result-pages-*.json.
