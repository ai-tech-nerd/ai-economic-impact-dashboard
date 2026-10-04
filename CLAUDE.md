# CLAUDE.md

**Last Updated:** 2026-10-03 (template sections added 2026-09-22)

> **Version Note**: Update version numbers in package.json and README.md with each release.

---

## SESSION START CHECKLIST

**Read these knowledge-base files:**
- `/Users/Michael/Dropbox/ai-knowledge-base/projects/ai-economic-impact-dashboard/BRIEF.md`
- `/Users/Michael/Dropbox/ai-knowledge-base/projects/ai-economic-impact-dashboard/CURRENT_STATE.md`
- `/Users/Michael/Dropbox/ai-knowledge-base/projects/ai-economic-impact-dashboard/DECISIONS.md`
- `/Users/Michael/Dropbox/ai-knowledge-base/projects/ai-economic-impact-dashboard/TASKS.md`
- `/Users/Michael/Dropbox/ai-knowledge-base/projects/ai-economic-impact-dashboard/NOTES.md`
- `/Users/Michael/Dropbox/ai-knowledge-base/projects/ai-economic-impact-dashboard/SESSION_SUMMARY.md`

**MANDATORY: Read these files BEFORE doing ANY work:**

| Order | File | Purpose |
|-------|------|---------|
| 1 | `/Users/Michael/Dropbox/ai-knowledge-base/REQUIRED_READING.md` | **READ FIRST** - Master index of all required policies |
| 2 | `CHANGELOG.md` | Recent changes and session history |
| 3 | `docs/about-the-dashboard.md` | Full project description |

**Failure to read `REQUIRED_READING.md` has caused data loss in past sessions. This is not optional.**

If deeper context is needed, review:
- `notes/`
- `/Users/Michael/Dropbox/ai-projects/session-logs/ai-economic-impact-dashboard/`

---

## CRITICAL RULES

- **Do not modify ai-knowledge-base files** directly unless explicitly asked.
- **Do NOT proceed without explicit approval**
- **Present plan outline first**, wait for approval, then implement
- **Be concise and use verified information only** - Never provide suggestions without verification - See "VERIFICATION RULES"
- **Update project notes/** - After every feature, fix, or failed attempt - See "NOTES DIRECTORY" section below
- **Update CHANGELOG.md** after every significant change
- **Update MODEL_REGISTRY.md** - When an AI model is added, changed, or removed in this project, update `/Users/Michael/Dropbox/ai-knowledge-base/MODEL_REGISTRY.md` in the same session: the project's Quick Reference row(s) and the Models by Provider table. It is a fact registry, edited directly, not through `_inbox/`
- **Update SESSION_SUMMARY.md** at session end - Brief summary for next session handoff
- **Route learnings by scope** - Project facts go in this project's files (SYNC DOCS). Anything that applies to every project, to the business, or to a client goes to `/Users/Michael/Dropbox/ai-knowledge-base/_inbox/` for review, never directly into `policies/`, `agent-workflows/`, `business/`, or `clients/`. See "LEARNINGS INBOX" section below
- **Update CLAUDE.md** - After every correction so you don't make that mistake again
- **NEVER delete any files without explicit permission** - See "FILE DELETION RULES" section below
- Do NOT modify or delete files in `_ignore/` or backup files
- Do NOT modify or delete files in `docs/` without permission

---

## NOTES DIRECTORY (MANDATORY)

**Location:** `notes/`

**Purpose:** Track progress, failures, test files, and learnings for every task/project.

### Directory Structure

notes/
├── README.md                   # Index of all tasks (check here first!)
├── {task-name}/
│   ├── README.md               # Main task documentation
│   └── tests/                  # Test files, samples, screenshots, logs
└── ...

### When to Update Notes

- **After every implemented feature** - Document what was built and how
- **After every code fix** - Document what was broken and how it was fixed
- **After every failed attempt** - Document what was tried and why it failed
- **At end of session** - Update current task notes with session summary

### Required README Sections

1. **Quick Links** - Paths to related files, CHANGELOG reference
2. **Problem Statement** - What we're trying to solve
3. **Approaches Attempted** - What was tried, results, why it failed/succeeded
4. **Current State** - What's deployed, what's broken
5. **Known Constraints (Verified)** - Limits with sources (actual tests, not assumptions)
6. **Potential Solutions (NOT VERIFIED)** - Ideas that need research
7. **Lessons Learned** - What went wrong, how to avoid it
8. **Next Steps** - What remains to be done
9. **Test Files** - What's in the tests/ subdirectory

### Why This Exists

Multiple AI sessions have wasted time re-attempting failed approaches because there was no record of what had already been tried and why it failed. The tests/ subdirectory preserves evidence (screenshots, logs, sample files) for future reference.

---

## FILE DELETION RULES (MANDATORY)

**NEVER delete ANY file or folder without explicit user permission.**

See `workflow-requirements.md` → "Incident 1: File Deletion" for full context.

**Before ANY delete operation:**
1. List specific files/folders to delete
2. Show contents of any folders
3. Explain WHY each needs to be deleted
4. Wait for explicit approval
5. Execute ONE FILE AT A TIME - never `rm -rf`

---

## VERIFICATION RULES (MANDATORY)

**NEVER claim something is "verified" or "will work" without actual proof.**

See `workflow-requirements.md` → "Incident 2: False Verification" for full context.

**Key rules:**
- Reading documentation is NOT verification
- If you cannot test it, say "UNTESTED - requires manual verification"
- Label untested claims as "THEORETICAL" or "REQUIRES VERIFICATION"

---

## CODE CHANGE RULES (MANDATORY)

**NEVER make code changes without reading documentation and getting approval.**

See `workflow-requirements.md` → "Incident 3: Code Change Without Understanding" for full context.

**Before ANY code change:**
1. READ documentation (PRD, CLAUDE.md, notes/)
2. UNDERSTAND why existing code works the way it does
3. PRESENT a plan outline
4. WAIT for explicit approval
5. Only THEN make changes
6. TEST before claiming it works

---

## LEARNINGS INBOX (MANDATORY)

**Location:** `/Users/Michael/Dropbox/ai-knowledge-base/_inbox/`

Global rules, business facts, and client facts are never written directly into the knowledge base. They are proposed in the inbox and Michael approves them.

### Scope tag

Every learning gets one scope before it is written anywhere:

| Scope | Meaning | Goes to |
|-------|---------|---------|
| `project` | Only this codebase | This project's files, via SYNC DOCS |
| `all-projects` | How Michael works, any stack | `_inbox/` |
| `business` | Pricing, positioning, customers | `_inbox/` |
| `client:<name>` | A specific client | `_inbox/` |

### When to write to the inbox

During SYNC DOCS, or whenever Michael corrects you, states a preference, or gives business or client context that is not specific to this project. Append to `_inbox/<YYYY-MM-DD>_<project>.md`. If creating it, start it with `# Inbox: <project>, <date>` and the line `**Default is keep.** Tick Drop to reject, or tick Change target and type the file after the colon. Then run /process-inbox <project> to get the AI's decisions in the file, review them, and run /process-inbox <project> apply.` Each item in this exact shape:

```
**G-1** [CORRECTION] Learned YYYY-MM-DD
<one-sentence statement, plain language>
Why: <what happened, with date>
- Target: <knowledge-base file> → <section>
- Insert: "<text> (Origin: <project>, YYYY-MM-DD)"
- [ ] Drop
- [ ] Change target to:
```

IDs: G-n for all-projects, B-n business, K-n client. Michael runs `/process-inbox <project>` (AI decisions written into the file), reviews, then `/process-inbox <project> apply`. Do not run either yourself.

### Do not

- Edit `policies/`, `agent-workflows/`, `business/`, or `clients/` directly
- Put project-only facts in the inbox

---


## SESSION LOGS (REFERENCE ONLY)

**Location:** `/Users/Michael/Dropbox/ai-projects/session-logs/ai-economic-impact-dashboard/`

Do NOT read at session start. Sessions are saved automatically as `.jsonl` on exit and before compaction by the hook in `~/.claude/settings.json`.

When the user says **"SaveSession"**, invoke the `save-session` skill (`~/.claude/skills/save-session/SKILL.md`): it writes the complete raw transcript, never a summary.

Read session logs only when the user explicitly asks to review a previous session or what was tried before. Learnings are mined from them by `/extract-sessions` into `_inbox/`; see LEARNINGS INBOX above.

---

## Project Overview

| Property | Value |
|----------|-------|
| **Name** | ai-economic-impact-dashboard |
| **Type** | Static Web Application (React SPA) |
| **GitHub** | https://github.com/ai-tech-nerd/ai-economic-impact-dashboard |
| **Live Site** | https://ai-tech-nerd.github.io/ai-economic-impact-dashboard/ |
| **Hosting** | GitHub Pages |
| **Version** | 1.0.0 |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19, TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Animation | Framer Motion |
| Routing | React Router (BrowserRouter + spa-github-pages 404 fallback) |
| SEO | react-helmet-async |
| Data | Static JSON files |

---

## Key Files

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Main app with routing |
| `src/pages/*.tsx` | Page components |
| `src/hooks/useData.ts` | Data fetching hook |
| `public/data/verified/*.json` | Verified event data (CANONICAL — the root `data/verified/` is a stale legacy copy) |
| `docs/PRD.md` + `docs/PROJECT_ARCHITECTURE.md` | Official product and technical docs |
| `docs/about-the-dashboard.md` | Full project description |

---

## Data Architecture

- All data in `public/data/verified/` as JSON files (root `data/verified/` is stale — do not use)
- `job-displacement-events.json` - Displacement events with sources
- `planned-layoffs.json` / `ai-job-creation.json` - Planned cuts and AI-driven job creation (creationCategory: adoption vs support)
- `ai-milestones.json` - AI milestones (420 as of 2026-10-03); optional `types[]` for multi-type entries
- `jobs-never-created.json` - Jobs Never Created (work given to AI/robots instead of hiring). Realized entries count in the headline; `isProjection` future estimates and `disputed` entries never do
- `predictions.json` - Projections by timeframe, re-grounded "as of" dates
- `meta.json` - dataLastUpdated (MUST be bumped on every data commit; drives the "Data updated" indicator)
- `company-profiles.json` - Optional company blurbs (pages degrade gracefully without entries)
- Events/planned: `jobTypes` must be one of 13 canonical slugs (`scripts/job-categories.mjs`; deploy fails otherwise), original wording in `jobTypesDetail`; `displacementMode: "robotics"` marks robot/autonomous-system cuts
- Headline "Total Jobs Displaced by AI" = layoffs + realized Jobs Never Created; computed only in `getHeroBreakdown` (dashboard + /widget/stats) and mirrored in `scripts/prerender-seo.mjs` and `scripts/og/generate.mjs`
- Share images + static company pages + sitemap are generated at deploy (`scripts/prerender-seo.mjs`, `scripts/og/`); deploy order: validate categories, build, prerender, og
- Fetched at runtime via `useData` hook; full schemas in docs/PROJECT_ARCHITECTURE.md

---

## Lessons Learned

### Routing: BrowserRouter + 404.html fallback (changed 2026-08-11)
The app now uses BrowserRouter with the spa-github-pages 404.html redirect so routes are real, Google-indexable URLs. Do NOT switch back to HashRouter — it made every page invisible to crawlers. A shim in index.html redirects legacy #/ links and embeds.

### JSON edits must preserve formatting (2026-10-02)
Data files are indent=2 with ensure_ascii matching the original. Rewriting with different settings rewrote all of ai-milestones.json once. Check `git diff --stat` after every data edit.

### Never trust summarized tables from WebFetch (2026-10-02)
A WebFetch summary invented half of a report's top-10 table. Verify figures against raw page text, and read image-based tables from the image itself.

### Tracker sheet writes go through tracker_append.py (2026-10-03)
Commit a payload in automation/payloads/, dry-run via the Tracker Append workflow, then run live. Deletes and set_columns refuse ambiguous matches; appends are not idempotent, so never re-run a payload live.

### Data Verification Standards
Every displacement event must link to primary sources. Cross-reference with research to distinguish AI-driven displacement from other factors.

---
