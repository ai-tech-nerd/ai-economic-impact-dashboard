# June–August 2026 Research Backfill + AI Advances Catch-up

**Date:** 2026-08-11 · **Status:** Complete, pending commit + owner's sheet paste

## Quick Links
- CHANGELOG: `[Unreleased] - 2026-08-11`
- Prior task: [../catch-up-sync-2026-08/README.md](../catch-up-sync-2026-08/README.md)
- Sheet paste rows: delivered in-session (scratchpad `sheet-paste-rows.md`); regenerate via the pattern in this README if lost

## Problem Statement
Jobs data stopped at 2026-05-21 and AI Advances at 2026-03-19. Backfill both with verified, company-attributed events.

## Pipeline used (template for the future GitHub Actions automation)
1. **Research** — 6 parallel agents (3 job windows × all categories; 3 milestone windows × 6 types). AI-attribution gate ≥70 confidence; every claim verified against a real article; exclusions documented.
2. **Owner review v1** — staged tables; owner demanded full URLs + full columns and set THE RULE: journalist framing cannot override company statements without documented proof.
3. **Adversarial verification** — 3 agents traced every attribution to a named person/document, checked quotes verbatim, searched for denials. Struck 9 of 26 (Verizon had an explicit company denial; CBA/Nutun, Darrow, GoKwik were journalist-attributed; Amazon UK was miscategorized warehouse jobs; Eros had no company number; MediaTek no number; GitLab denial-vs-earnings-call contradiction).
4. **Owner rulings** — Darrow reinstated ("advances in technology" counts, phrase preserved verbatim); GitLab reinstated (earnings call affirms; memo contradiction disclosed in notes); Thomson Reuters yes (AI-native replacement hires count); infrastructure job pledges included as creationCategory "support" (tech-transition framework: loss → plateau → creation incl. support industries); milestones approved minus duplicate + 2 weak-sourced.
5. **Conversion** — 2 data agents (jobs + milestones), 3 page agents (19 archive pages), finalize script (manifest+nav), build + browser verification.

## Key Learnings
- **The attribution rule catches real errors**: Verizon's AI framing was pure aggregator inference — the company explicitly denied it. Zillow/Etsy/TikTok all cut jobs the same week while denying AI attribution. Companies actively resist the AI label; the dashboard's credibility depends on the rule.
- Counter animations pause when the browser pane is hidden (requestAnimationFrame) — a frozen mid-animation number is NOT a data bug; verify via fetch of the served JSON.
- Parallel subagents sharing a scratchpad must use uniquely named work files (repeat lesson).
- Firecrawl + consent-banner clicking got screenshots through CNBC/Reuters-class bot walls — zero manual captures this round (vs 5 last round).
- Sheet sync: no Sheets write tool in this session; generated paste-ready TSVs per tab instead. For the automation build, use a service account via GitHub Actions instead.

## Data State After
- 96 events (95 displayed + IBM projection) / 328,995 jobs / 80 companies
- 17 planned / 14 creation (with creationCategory) / 370 milestones (through 2026-08-08)
- Archive: 126 pages, all excerpt-format, all with screenshots

## Next Steps
1. Commit + push (owner approval)
2. Owner pastes sheet rows (3 tabs) + Oracle row edit
3. Build the GitHub Actions automation (docs/ai-shift-automation-brief.md, adapted: runner=Actions, gate=THE RULE, archive=excerpt format)
