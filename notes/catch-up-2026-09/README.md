# September 2026 Catch-up (post GitHub account flag) + Workflow A Dry Run

**Date:** 2026-09-15 · **Status:** Complete (dry-run audit pending owner review)

## Quick Links
- CHANGELOG: `[Unreleased] - 2026-09-15`
- Prior task: [../research-backfill-2026-08/README.md](../research-backfill-2026-08/README.md)
- Sheet paste rows: [sheet-paste-rows.md](sheet-paste-rows.md)
- Dry-run artifact: GitHub Actions run 35053235405 ("Research to Staging", dry_run=true, window=35)

## Problem Statement
Owner's GitHub account was flagged; project offline ~1 month (2026-08-11 → 2026-09-15). Data stale by ~5 weeks. Two goals: (1) run the Workflow A dry run (T-201), (2) catch up the missed month of data.

## Pipeline used (same shape as Aug 2026 backfill)
1. **Dry run dispatched first** via GitHub Actions workflow_dispatch (window=35, dry_run=true) using repo secrets — local credential lookup is blocked by the harness classifier, Actions is the sanctioned path.
2. **Research** — 3 parallel Sonnet agents (losses+planned / creation / milestones), window 2026-08-08 → 2026-09-15, using automation/queries.yml terms.
3. **Adversarial verification** — 2 agents enforcing THE RULE (company attribution only; denial = hard fail; hedged numbers verbatim; analyst estimates labeled).
4. **Conversion** — 3 agents: jobs JSON, milestones JSON, 5 archive pages (excerpt format + screenshots via `npx playwright screenshot --channel chrome`, zero manual captures).
5. Build + browser verification, docs, sheet rows, commit.

## Verification outcomes (the gate keeps working)
- **STRUCK: Hitachi Energy Gallman MS** (700 jobs) — grid/transformer investment with AI as one of several plural demand drivers; not AI-attributed.
- **REJECTED milestones:** AlphaFold-3 drugs "cleared Phase I" (premature/fabricated — Isomorphic trials not begun), DoD $200M OTAs (July 2025, stale), DigitalOcean/Katanemo (April 2026), Nvidia RTX Spark "GTC Taipei" (actually Computex, out of window), Meta Hatch (unlaunched, reported-only), Bending Spoons–Airtable (out of window + weak AI fit), China PIPL small-handler rule (not AI-specific).
- **Oracle second wave (Sep 14):** Catz/Ellison quotes are from the MARCH first wave — do not re-attribute. Recorded as an update to evt-069 only; 7,000–10,000 estimate is press/analyst, NOT company-confirmed, jobsCut unchanged.
- **PayPal:** only the 251 San Jose WARN is company-confirmed; Ireland/India/Israel figures unverified and excluded; AI attribution rests on the 10-Q (public statement omits AI — pattern: SEC filings carry AI attribution that PR avoids, same as Oracle).
- **PORTS-Pike:** Aug 17 NVIDIA/OpenAI announcement is an expansion of the March SB Energy Portsmouth project; 35,000/2,500 figures originate in the March DOE/SB Energy release; recorded as a single entry (no prior entry existed).

## New entries
- **Events:** evt-097 Anaconda (2026-08-14, ~14% undisclosed → jobsCut 0), evt-098 Pentera (60), evt-099 PayPal (251); evt-069 Oracle description update; plan-015 PayPal description update.
- **Creation:** create-015 SB Energy/OpenAI/NVIDIA PORTS-Pike (35,000), create-016 Google Finland (37,000) — both "support".
- **Milestones:** ms-281–298 (18): GPT-6 Astra, Claude Fable/Mythos 5.1, Gemini 3.8 Flash/Cyber + Live, Grok 4.6, DeepSeek V4-Pro GA + V4.1 Flash, Qwen3.8-Flash, Muse Spark 1.3, Fugu Max/Ultra v2, Stripe–OpenRouter $7B, Nvidia–Hugging Face $13B, Nvidia $500B financing platforms, Mistral €3B Series D, NARA AI records guidance, California 13-bill child AI-safety package, Amodei "Pace the Frontier".
- **Archive:** 5 pages (anaconda, pentera, sb-energy-ports-pike, paypal, google-finland), manifest 126 → 131, nav chain extended.

## Data State After
- 99 events raw (98 displayed + IBM projection) / 329,306 displayed jobs / 82 companies
- 17 planned / 16 creation / 388 milestones (through 2026-09-15)
- Archive: 131 pages (main 98 / planned 17 / created 16); meta.json dataLastUpdated 2026-09-15

## Lessons Learned
- Researcher agents cite aggregator blogs (local-ai-zone, vorplabs, skycrumbs, tech-insider, llmgateway) — always re-source to official pages in verification; every "only aggregator-sourced" item that was checked either got an official source or was rejected.
- One researched claim (AlphaFold Phase I) was outright premature/fabricated — verification against official sources is non-optional.
- Local API-key lookup for the dry run is blocked by the permission classifier; use GitHub Actions workflow_dispatch with repo secrets instead.

## Owner rulings (2026-09-16)
- **Micron Research Labs** ($10B, no headcount; dry-run staged candidate): WAITS for a company-stated jobs number before entering the dataset. Re-check on future sweeps.
- Sheet sync: pushed via the new `tracker_append.py` utility + Tracker Append workflow (service account), replacing manual pasting. Payload: `automation/payloads/tracker-2026-09-15.json`.
- Query bank broadened (10-Q/10-K, expanded-layoff-plan, WARN, "AI efficiencies", "AI-native" phrasings) after owner flagged coverage breadth; gap-sweep run over the same window.

## Sheet sync executed (2026-09-16)
Live tracker updated via Tracker Append workflow (runs 35108015349 dry → 35108122732 live): losses 95 → 98 rows, creation 14 → 16 rows, Oracle E70 + PayPal H16 edits applied. The tracker has NO "AI Advances" tab (milestones live only in the dashboard JSON + staging sheet) — the utility skipped those 18 rows by design. CAUTION: tracker_append.py has no dedup; re-running a payload live duplicates its rows.

## Gap-sweep (2026-09-16, owner coverage-breadth request)
33 broader searches over the same window: ZERO new qualifying candidates — the catch-up was complete (owner's Oracle example = evt-069 update, already recorded). Documented near-misses: Wonder/Grubhub (tracker "Explicit AI" label with no AI language in source — jobloss.ai mislabel trap), IBM Rocket Center (contract non-renewal), Samsung NJ WARN (relocation, disputed framing), Zalando (logistics consolidation), Verizon Sep WARN (explicit AI denial again), C3.ai (pre-window cumulative), Acrisure/Sprout Social/HP (pre-window announcements). Systematic trap confirmed: 2026 aggregator listicles recirculate 2023-24 AI-layoff figures (IBM 7,800, SAP 8,000, BT 10,000) as if new — always trace to the original dated announcement.

## Next Steps
1. Owner audits dry-run artifact (`dry-run-candidates`) vs this session's verified entries → then live run → enable weekly cron (T-202)
2. Standing owner items: sitemap submission (T-205), embed check (T-206), stale root data/verified cleanup (T-207)

## Test Files
- None kept; dry-run output lives as the GitHub Actions artifact.
