# Jobs Never Created

**Date:** 2026-10-02 · **Status:** Shipped

## Quick Links
- Data: public/data/verified/jobs-never-created.json · UI: src/components/dashboard/JobsNeverCreatedCard.tsx
- CHANGELOG: `[Unreleased] - 2026-10-02 — Jobs Never Created`

## Problem Statement
Owner: fully automated facilities and AI-enabled non-hiring displace people even without layoffs. Track it from the worker's perspective, separate from verified layoffs.

## Rules (owner-approved)
- Name: "Jobs Never Created" (owner rejected "jobs avoided by automation": company-centric).
- Gate: company itself states the number, OR a ratio plus company-stated/official baseline; math shown in estimateBasis. Leaked/union/analyst/journalist figures don't qualify. Company-disputed figures shown flagged, excluded from total.
- Never added to the jobs-lost headline. Hiring freezes without numbers stay in Planned.

## Approaches / Results
- Research sweep (Sonnet, ~45 searches): 0 new >=70. Borderline IBM/Klarna/DBS; Amazon 600K disputed; Republic (2019, no baseline), Sweetgreen (no store baseline), CEVA (unverifiable snippet) excluded.
- Owner chose option 1: move IBM + Klarna from layoffs/planned, add DBS.

## Known Constraints (Verified)
- Evidence is mostly ratios without baselines; expect slow growth.
- Klarna plan-008 "2,000" was target headcount (data error in old entry) - not counted.

## Lessons Learned
- Freeze/attrition entries had been filed as layoffs (Klarna counted in headline; IBM double-entered as projection + planned). The new category is the correct home.

## Next Steps
- Watch Monday runs' "never" category; Amazon stays disputed unless Amazon states figures.
- Tracker sheet DONE 2026-10-02 (owner approved): tab "Jobs Never Created" created with IBM/Klarna/DBS; old rows deleted (Losses: IBM 2023-05-01, Klarna 2024-08-27; Planned: IBM 2023-05-01, Klarna 2024-09-01). The IBM 2025-11-04 layoff row was kept. Verified by re-run: tab has 3 rows, all 4 deletes now match 0.
- tracker_append.py now supports create_tabs and guarded deletes (exactly-one-match rule; ambiguity is refused and lists candidate rows). Always dry-run first. Payloads are still NOT idempotent for appends.
