# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** (Just Started)

> **Version Note**: Version number must be updated with each release in README.md, PRD, and appropriate code files.

---

## SESSION START CHECKLIST

**MANDATORY: Read these files BEFORE doing ANY work:**

| Order | File | Purpose |
|-------|------|---------|
| 1 | `/Users/Michael/Dropbox/_claude_code_projects/critical-protocals.md` | **READ FIRST** - Communication and workflow rules |
| 2 | `/Users/Michael/Dropbox/_claude_code_projects/ai-review-policy.md` | Code evaluation policy |

**Failure to read `critical-protocals.md` has caused data loss in past sessions. This is not optional.**

**Key Rules:**
1. Do NOT proceed without explicit approval
2. Present plan outline first, wait for approval, then implement
3. Update CHANGELOG.md after every significant change
4. Update docs/PROJECT_REVIEW.md with session findings
5. Do NOT modify or delete files in `_ignore/` or backup files
6. Do NOT modify or delete files in `docs/` without permission

---

## FILE DELETION RULES (MANDATORY)

**NEVER delete ANY file or folder without explicit user permission.**

### Why This Rule Exists
On February 13, 2026, an AI session deleted critical files including an entire `docs/` folder containing PRD, implementation plans, and documentation. This happened because:
- AI assumed "untracked" git files were safe to delete
- AI used `rm -rf` on directories without checking contents
- AI did not ask for approval before deleting
- AI did not read `critical-protocals.md` at session start

### Mandatory Rules for File Operations

1. **NEVER use `rm -rf` on any directory** - Delete specific files only, never entire folders
2. **NEVER assume untracked files are disposable** - Untracked files may be in `.gitignore` but still critical (docs, configs, local data)
3. **ALWAYS list files to be deleted and get explicit approval** - Show exact files, wait for "approved" or "proceed"
4. **ALWAYS check folder contents before any delete operation** - Use `ls` to see what's inside
5. **When reverting changes, restore files only** - Do not delete anything as part of a "revert"
6. **If unsure, ASK** - Never assume. Ask the user what they want deleted.

### Before ANY Delete Operation
```
1. List the specific files/folders you plan to delete
2. Show contents of any folders
3. Explain WHY each needs to be deleted
4. Wait for explicit approval ("approved", "proceed", "yes delete")
5. Only then execute - ONE FILE AT A TIME, never rm -rf
```

---

## Lessons Learned (Critical)

### File Deletion Rules
- **NEVER delete files without explicit permission**
- **NEVER use `rm -rf` on directories**
- **Untracked files are NOT safe to delete** - they may be in `.gitignore` but still critical
- **Always read `critical-protocals.md` first**

### [Add project-specific lessons as they occur]

-
