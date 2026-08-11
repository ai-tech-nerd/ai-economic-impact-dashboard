# AI Shift Dashboard — Automation

Automates the research → staging pipeline (Workflow A of the
automation plan). Human approval in the staging sheet remains the hard
gate before anything is published — the scripts here never touch the
live dashboard data.

**Never hardcode sheet IDs or credentials anywhere.** The staging and
tracker spreadsheet IDs are referenced exclusively through the
`SHEET_STAGING_ID` / `SHEET_TRACKER_ID` env vars / GitHub Secrets.

> **Note (2026-08-11):** `workflows/research.yml` lives here temporarily because the repo's git credential lacks the `workflow` OAuth scope. After running `gh auth refresh -h github.com -s workflow`, move it: `git mv automation/workflows/research.yml .github/workflows/research.yml`.

## Contents

| File | Purpose |
|---|---|
| `queries.yml` | Query bank (edit freely; `{Y}` = current year, `{month}` = current month name) |
| `sheet_prep.py` | One-shot staging sheet prep: control columns, dropdowns, AI Advances tab (idempotent) |
| `research.py` | Workflow A: research → gate → dedup → staging append → digest email |
| `requirements.txt` | Pinned Python deps |
| `tests/test_gate.py` | Offline unit tests for the gate, dedup, and structuring logic |
| `../.github/workflows/research.yml` | GitHub Actions runner (manual dispatch; cron commented out until step 3) |

---

## One-time setup (~15 minutes)

### 1. Google Cloud service account (~7 min)

1. Go to https://console.cloud.google.com/ → create (or pick) a project,
   e.g. `ai-shift-automation`.
2. **APIs & Services → Library** → search **Google Sheets API** → Enable.
3. **IAM & Admin → Service Accounts → Create Service Account**.
   Name: `ai-shift-bot`. No project roles needed (sheet access comes
   from sharing, not IAM). Create.
4. Open the new service account → **Keys → Add Key → Create new key →
   JSON** → download. This JSON file is the value of `GOOGLE_SA_KEY`
   (the whole file contents, as one string). Treat it like a password;
   don't commit it anywhere.
5. Copy the service account's email address
   (`ai-shift-bot@<project>.iam.gserviceaccount.com`).

### 2. Share both spreadsheets with the service account (~2 min)

Share each of these with the service-account email as **Editor**
(Share → paste the email → Editor → uncheck "Notify"):

- **AI Economic Dashboard Staging** (its spreadsheet ID → `SHEET_STAGING_ID`)
- **AI Attributed Job Losses** live tracker (its ID → `SHEET_TRACKER_ID`)

The spreadsheet ID is the long token in the sheet URL between `/d/`
and `/edit`.

### 3. GitHub Secrets (~4 min)

Repo → **Settings → Secrets and variables → Actions → New repository
secret**. Create these exact names:

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key (research + gate + structuring) |
| `GOOGLE_SA_KEY` | Full JSON contents of the service-account key file |
| `SHEET_STAGING_ID` | Staging spreadsheet ID |
| `SHEET_TRACKER_ID` | Live tracker spreadsheet ID |
| `DIGEST_TO` | Email address that receives the digest |
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | e.g. `587` |
| `SMTP_USER` | SMTP login (for Gmail: the full address) |
| `SMTP_PASS` | SMTP password (for Gmail: an **App Password**, not the account password — Google Account → Security → 2-Step Verification → App passwords) |
| `ARCHIVE_ORG_S3_KEYS` | archive.org S3 keys as `ACCESSKEY:SECRET` — create a free account at https://archive.org, then get keys at https://archive.org/account/s3.php. **Not used by Workflow A; needed at build-order step 4 (Workflow B / Save Page Now).** |

Email failure is non-fatal by design — a broken SMTP config logs a
warning and the run still completes.

### 4. Prep the staging sheet (one scripted run)

Adds Confidence / Attribution / Quote / Approval / Status / Archive
Link columns to the three staging tabs, the Approval dropdown
(blank / Approved / Rejected / Needs Edit), and creates the
**AI Advances** tab with its Type dropdown (6 values). Idempotent.

```bash
pip install -r automation/requirements.txt
export GOOGLE_SA_KEY="$(cat /path/to/service-account-key.json)"
export SHEET_STAGING_ID="<staging spreadsheet id>"

python3 automation/sheet_prep.py --dry-run   # preview (no creds needed)
python3 automation/sheet_prep.py             # apply
```

Then verify in the sheet: dropdowns work on the Approval column of all
four tabs and the Type column of AI Advances.

---

## Running the research workflow

### Locally — dry run (recommended first; needs ONLY `ANTHROPIC_API_KEY`)

```bash
pip install -r automation/requirements.txt
export ANTHROPIC_API_KEY="sk-ant-..."

python3 automation/research.py --dry-run              # 7-day window
python3 automation/research.py --dry-run --window 30  # catch-up window
```

Dry run behavior: no Sheets reads or writes; dedups against
`public/data/verified/*.json` only; writes structured candidates to
`automation/out/dry-run-candidates.json`; prints the would-be digest to
stdout. Use it to audit gate decisions and tune `queries.yml`.

### Locally — live run

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_SA_KEY="$(cat /path/to/key.json)"
export SHEET_STAGING_ID="<staging id>"
export SHEET_TRACKER_ID="<tracker id>"
# optional digest:
export DIGEST_TO=... SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=...

python3 automation/research.py            # 7-day window
python3 automation/research.py --window 30
```

### Via GitHub Actions (workflow_dispatch)

Repo → **Actions → "Research to Staging" → Run workflow**. Inputs:
`window` (7 default / 30 catch-up) and `dry_run` (checkbox). Dry-run
output is uploaded as a workflow artifact (`dry-run-candidates`).

The every-2-days cron (06:00 America/Chicago = `0 11 */2 * *` UTC) is
present in `research.yml` but **commented out**. Enable it only at
build-order step 3, after 2–3 manual runs pass the acceptance checks:
correctly mapped rows, hedged numbers intact, quotes genuine, dupes
skipped, digest accurate, and an immediate re-run stages zero.

### Unit tests (offline)

```bash
pip install pytest pyyaml
pytest automation/tests/test_gate.py -q
```

---

## Verification status

**Verified (executed locally on 2026-08-11):**

- `python3 -m py_compile` clean on `sheet_prep.py` and `research.py`.
- `queries.yml` parses (PyYAML) and contains all four categories.
- `.github/workflows/research.yml` parses as valid YAML.
- `automation/tests/test_gate.py` — full pytest suite passes offline
  (gate classification incl. denial hard-fail and the 70–84 ⚠ band,
  dedup normalization incl. the brief-§10 "NA" fallback, hedged-number
  verbatim preservation, Status enum coercion, digest text).
- `research.py --help` and `sheet_prep.py --dry-run` run without
  credentials.

**UNTESTED — requires manual verification on first live runs:**

- The Anthropic API call path (model `claude-fable-5` + web search tool
  `web_search_20260209`, refusal handling, JSON parsing of real model
  output). If the account rejects that tool version, set the
  `WEB_SEARCH_TOOL_TYPE` env var to `web_search_20250305` as a fallback.
- All Google Sheets read/write paths (sheet_prep live mode, staging
  dedup reads, tracker reads, staging appends, dropdown rendering).
- SMTP digest delivery.
- The GitHub Actions workflow end-to-end (secrets mapping, artifact
  upload).

Audit the first 2–3 dispatch runs against the acceptance criteria in
`docs/ai-shift-automation-brief.md` §18 before enabling the schedule.

---

## What the owner must do before the first live run

1. Create the Google Cloud service account + JSON key (step 1 above).
2. Share both sheets with the service-account email as Editor (step 2).
3. Create the GitHub Secrets (step 3) — at minimum `ANTHROPIC_API_KEY`,
   `GOOGLE_SA_KEY`, `SHEET_STAGING_ID`, `SHEET_TRACKER_ID`; SMTP ones
   for the digest; `ARCHIVE_ORG_S3_KEYS` can wait until Workflow B.
4. Run `sheet_prep.py` (dry-run, then live) and confirm the dropdowns.
5. Trigger the "Research to Staging" workflow manually with
   `dry_run = true`, inspect the artifact, then run live and audit the
   staged rows.
