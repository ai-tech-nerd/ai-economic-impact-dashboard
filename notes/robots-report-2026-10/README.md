# Anthropic "What Work Can Robots Do?" (2026-09-30): dashboard impact + robot scope

**Date:** 2026-10-02 · **Status:** Complete

## Quick Links
- Report: https://www.anthropic.com/research/what-work-can-robots-do
- CHANGELOG: `[Unreleased] - 2026-10-02`

## Problem Statement
Owner asked how the report affects dashboard figures and predictions (initial thought: the most-exposed occupations table should drive predictions).

## Findings (verified against raw page + Figure 4 image)
- Top-10 most exposed (Figure 4, image only): taxi drivers 2.2, agricultural equipment operators 2.1, light truck drivers 2.1 (983K jobs), shuttle drivers/chauffeurs 2.0, industrial truck/tractor operators 2.0 (774K), paving equipment operators 1.8, refuse collectors 1.8, driver/sales workers 1.7, recycling/reclamation workers 1.7, surface-mining loader operators 1.6. 9 of 10 are vehicle operators.
- Exposure is not displacement: robots are cost-competitive for 0.3% of tasks; ~40 yrs to 10% at 3%/yr price declines; half of physical work cost-competitive by 2085 (2050 fast scenario).
- Nearest-term real risk: packers & packagers (560K jobs, -22% since 2015, BLS 11th-largest projected loss to 2035) and taxi drivers.
- LLMs alone expose ~half of work; with robots 81%.
- No change to existing 9 predictions (all white-collar/LLM).

## Owner rulings (2026-10-02)
- Approved: Predictions methodology context line ("Exposure is not job loss") on page + static SEO copy; AI Advances milestone ms-299.
- Declined: new robot-exposed physical-work prediction.
- SCOPE: robot/autonomous-system layoffs COUNT as AI displacement (same attribution gate). research.py losses/planned prompts + 8 robotics queries in queries.yml.

## Lessons Learned
- WebFetch's summarizer FABRICATED half of the Figure 4 table (wrong occupations, out-of-order scores). The table was an image; only reading the image itself gave correct rows. Never trust summarized tables from WebFetch; verify against raw text or images.
- json.dump without indent=2 rewrote all of ai-milestones.json; always match the original formatting (indent=2, ensure_ascii=False, trailing newline) and check `git diff --stat`.

## Robot backfill + robotics visual (2026-10-02, owner approved)
- Backfill: 0 qualifying events (see CHANGELOG for strikes). Existing UPS evt-025/plan-011 + Ocado evt-062 tagged robotics per owner.
- Visual shipped: displacementMode field, stacked trend chart, Robotics Jobs stat, Robotics badges, SEO line. Verified locally (DOM: two stacked areas; badges on UPS/Ocado company cards and the UPS planned row; no console errors).
- Not split out: the industry and job-type charts (owner approved this deferral).

## Next Steps
- Optional (needs approval): historical backfill sweep for robot-driven layoffs before 2026-10-02 (e.g., autonomous trucking, warehouse robotics), since the old scope excluded them.
