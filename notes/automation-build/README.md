# Automation Build — GitHub Actions Pipeline

**Started:** 2026-08-11 · **Status:** Steps 1–2 built (schedule OFF), awaiting owner setup

## Quick Links
- Plan: docs/automation-implementation-plan.md (approved 2026-08-11)
- Code: automation/ + .github/workflows/research.yml
- Setup checklist: automation/README.md (owner's 5 remaining steps)
- Original spec: docs/ai-shift-automation-brief.md (schemas/gate/acceptance still authoritative; runner superseded: GitHub Actions, NOT n8n/iMac)
- Query bank: automation/queries.yml (seeded from docs/ai-economic-impact-search-terms.md)

## Current State
- Workflow A (research → staging) fully coded; 29/29 offline unit tests pass (gate, dedup, hedged-number preservation)
- VERIFIED: compile, YAML, dry-run paths, local-JSON dedup against real data
- UNTESTED (labeled in automation/README.md): live Anthropic web-search calls, all Sheets read/write, SMTP, Actions end-to-end — blocked on owner credentials
- Cron is COMMENTED OUT in research.yml — enable only at build-order step 3 after manual-run validation per brief §18
- Workflows B (publish) and C (advances) NOT built yet — sequenced after A validates

## Key Rules Encoded (do not regress)
- Attribution gate: company statements only; journalist framing cannot override; denial = hard fail; <70 dropped; 70–84 flagged "⚠"
- Hedged numbers verbatim; sheet tabs referenced by gid, never name
- Sheet IDs live ONLY in GitHub Secrets / env vars — never in repo files

## Next Steps
1. Owner: 15-min setup (service account, share sheets, GitHub Secrets) per automation/README.md
2. Run sheet_prep live; verify dropdowns
3. Dispatch research.yml dry_run=true, inspect artifact; then live run; audit staged rows
4. Enable cron (step 3), one full cycle, then build Workflow B
