# CLAUDE.md

**Last Updated:** 2026-04-26

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
- **Update SESSION_SUMMARY.md** at session end - Brief summary for next session handoff
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

## SESSION LOGS (REFERENCE ONLY)

**Location:** `/Users/Michael/Dropbox/ai-projects/session-logs/`

Master repository for session logs and cross-project learnings.

**DO NOT read at session start** - Only access when user explicitly references it.

### Structure

session-logs/
├── README.md
├── ai-economic-impact-dashboard/
│   └── YYYY-MM-DD_HH-MM_description.md
└── ...

### SaveSession Trigger

**IMPORTANT:** Sessions are automatically saved on exit and before context compaction via hooks in `~/.claude/settings.json`. The manual "SaveSession" command below is a backup for mid-session saves.

When user says **"SaveSession"**, you MUST:

1. **Create the file:**

   session-logs/ai-economic-impact-dashboard/YYYY-MM-DD_HH-MM_description.md

   (24-hour military time, e.g., `2026-03-14_15-30_video-chunking-fix.md`)

2. **Write the COMPLETE RAW conversation** - NOT a summary. Include:
   - Every user message (verbatim)
   - Every Claude response (verbatim)
   - All tool calls and their outputs
   - All code snippets shown
   - All errors encountered

3. **Format as a transcript:**
   # Session Log: [Brief Description]
   **Date:** [Date]
   **Project:** ai-economic-impact-dashboard

   ---

   ## USER:
   [Exact user message]

   ## CLAUDE:
   [Exact Claude response including any code blocks]

   ## USER:
   [Next user message]

   ...continue for entire conversation...

**DO NOT:**
- Summarize or condense the conversation
- Skip "unimportant" messages
- Paraphrase what was said
- Create a "lessons learned" document instead of the transcript

**WHY:** Session logs are used to understand exactly what was tried, what failed, and what the actual error messages were. Summaries lose critical debugging details.

### When to Access

Only read session logs when:
- User explicitly asks to review previous sessions
- User references a specific past session
- User asks "what was tried before" or similar

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
| Routing | React Router (HashRouter) |
| SEO | react-helmet-async |
| Data | Static JSON files |

---

## Key Files

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Main app with routing |
| `src/pages/*.tsx` | Page components |
| `src/hooks/useData.ts` | Data fetching hook |
| `data/verified/*.json` | Verified event data |
| `docs/about-the-dashboard.md` | Full project description |

---

## Data Architecture

- All data in `data/verified/` as JSON files
- `job-displacement-events.json` - Displacement events with sources
- `ai-milestones.json` - 207 AI milestones
- `predictions.json` - Future predictions by timeframe
- `company-profiles.json` - Company data
- Fetched at runtime via `useData` hook

---

## Lessons Learned

### HashRouter Required
GitHub Pages doesn't support server-side routing. Must use HashRouter for navigation to work.

### Data Verification Standards
Every displacement event must link to primary sources. Cross-reference with research to distinguish AI-driven displacement from other factors.

---
