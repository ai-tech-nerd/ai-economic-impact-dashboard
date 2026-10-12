# Google Alerts Digest Review (first pass) + October adds

**Date:** 2026-10-12 · **Status:** Done

## Quick Links
- CHANGELOG: `[Unreleased] - 2026-10-12`
- Tracker payloads: automation/payloads/tracker-2026-10-12-dnb-honeybook.json, tracker-2026-10-12-bmw-fico-bird.json

## Problem Statement
Owner set up Google Alerts (daily digests) for AI job terms and asked that research also mine those emails.

## Approach
- Gmail connector: `subject:"Google Alert" Daily Digest after:<last sweep>`; digests are ~250 KB each, so a subagent extracts headlines and links, then each company-specific story is gate-checked against the primary source.
- First pass: 22 digests (Sep 15 – Oct 12), ~250 unique stories, ~30 company-specific.

## Results
- Added: DNB (planned 400), HoneyBook (30), California SB 951 milestone; on owner approval with estimates documented: BMW (planned ~13 = 20% of ~65 SVPs, SVP count unnamed-source), FICO (planned ~572 = 15% of 3,811 FY2025 10-K), Bird (~30, May 2026 round; first round Bird itself tied to AI).
- Struck (no company AI attribution or explicit denial): HubSpot (CEO: "not driven by AI-related efficiencies"), Admiral, Amazon 121 WARN and ~1,000 Stores round, One Zero Bank, Atlassian (commentary; March event already recorded), Microsoft, Intuit, Disney, Reach, McClatchy, Flock, Entain, Stellantis.
- Not added: Axis Bank (bank says AI's headcount effect "had not yet fully emerged"); Bird cumulative "1,000 to 120" (would double count).

## Known Constraints (Verified)
- Workflow A (GitHub Actions) can't read Gmail without new credentials; digests are reviewed in interactive sessions only.
- WebFetch refuses long verbatim excerpts; use curl + text extraction for archive excerpts.
- Some sites need a cookie banner dismissed for screenshots (Inderes: "Kun nødvendige"); scratchpad shot.mjs handles common buttons.

## Lessons Learned
- Headlines labeling layoffs "AI restructuring" are frequently contradicted by the company (HubSpot). The gate matters most on exactly the stories that get the most coverage.
- An earlier report called BMW's ~65 SVP count company-stated; it was an unnamed source. Check where every baseline number comes from before presenting it.

## Next Steps
- Optional (owner decision): give Workflow A Gmail read access so the Monday run includes digests.

## Test Files
- None.
