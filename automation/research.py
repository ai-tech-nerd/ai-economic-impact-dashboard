#!/usr/bin/env python3
"""
research.py - Workflow A: Research to Staging (plan §4).

Pipeline per category (losses, planned, created, advances):

  1. Load the query bank from automation/queries.yml.
  2. Run research via the Anthropic API (Claude Fable 5 + web search).
  3. Structure candidates to the staging tab schemas (brief §6 rules:
     ISO dates, hedged numbers preserved verbatim, 1-3 sentence reason
     with a direct quote, primary source URL).
  4. Apply the attribution gate (plan §4.3): company-attributed only,
     denial hard-fails, confidence < 70 dropped, 70-84 flagged.
  5. Dedup (plan §4.4) against staging rows (incl. Rejected), the live
     tracker tabs, and the local dashboard JSON.
  6. Append surviving rows to the staging tabs.
  7. Send the digest email (plan §4.5) - failure is non-fatal.

Environment variables (never hardcode secrets or sheet IDs):
  ANTHROPIC_API_KEY  - required (all modes)
  SHEET_STAGING_ID   - staging spreadsheet ID (live mode)
  SHEET_TRACKER_ID   - live tracker spreadsheet ID (live mode)
  GOOGLE_SA_KEY      - service-account key JSON string (live mode)
  DIGEST_TO          - digest recipient email (optional)
  SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS - digest SMTP (optional)

Modes:
  python3 automation/research.py --dry-run [--window 30]
      Requires ONLY ANTHROPIC_API_KEY. Skips all Sheets reads/writes,
      dedups against public/data/verified/*.json only, writes candidates
      to automation/out/dry-run-candidates.json, prints the digest.

  python3 automation/research.py [--window 30]
      Full live run (Sheets + digest email).

Pure functions (gate, dedup, structuring, digest) have no network
dependencies and are unit-tested in automation/tests/test_gate.py.
"""

import argparse
import datetime
import json
import os
import re
import sys
from dataclasses import dataclass

# ============================================================
# CONSTANTS AND CONFIGURATION
# ============================================================

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUERIES_PATH = os.path.join(REPO_ROOT, "automation", "queries.yml")
DRY_RUN_OUT = os.path.join(REPO_ROOT, "automation", "out",
                           "dry-run-candidates.json")
VERIFIED_JSON_DIR = os.path.join(REPO_ROOT, "public", "data", "verified")

# Model per the approved plan. Web search tool type is overridable via
# env in case the account's tool availability differs (UNTESTED live).
ANTHROPIC_MODEL = os.environ.get("RESEARCH_MODEL", "claude-fable-5")
WEB_SEARCH_TOOL_TYPE = os.environ.get("WEB_SEARCH_TOOL_TYPE",
                                      "web_search_20260209")

# Staging tabs by gid (brief §5) inside SHEET_STAGING_ID. The AI Advances
# tab is created by sheet_prep.py and referenced by title.
CONTROL_COLUMNS = ["Confidence", "Attribution", "Quote",
                   "Approval", "Status", "Archive Link"]

CATEGORIES = {
    "losses": {
        "gid": 1938860059,
        "tab_aliases": ["AI Job Losses Tracker", "AI Job Losses"],
        "tab_label": "AI Job Losses Tracker",
        # `Article` stays blank (legacy manual column, brief §6).
        "base_columns": ["Date", "Company", "Number of Jobs",
                         "Job Position/Category", "Reason Given",
                         "Source Link", "Article"],
        "json_files": ["job-displacement-events.json"],
    },
    "planned": {
        "gid": 451583307,
        "tab_aliases": ["Planned/Announced", "Planned_Announced"],
        "tab_label": "Planned/Announced",
        "base_columns": ["Date Announced", "Company",
                         "Jobs Announced/Planned", "Jobs Already Cut",
                         "Status", "Job Position/Category", "Timeline",
                         "Reason Given", "Source Link"],
        "json_files": ["planned-layoffs.json"],
    },
    "created": {
        "gid": 1283716345,
        "tab_aliases": ["AI Job Creation"],
        "tab_label": "AI Job Creation",
        "base_columns": ["Date", "Company", "Number of Jobs",
                         "Job Roles Created", "Context", "Source Link"],
        "json_files": ["ai-job-creation.json"],
    },
    "advances": {
        "gid": None,  # created by sheet_prep.py; resolved by title
        "tab_label": "AI Advances",
        "base_columns": ["Date", "Company", "Type", "Name", "Description",
                         "Category", "Significance", "Source Link"],
        "json_files": ["ai-milestones.json"],
    },
}

# Exact Status enum for the Planned/Announced tab (brief §6).
PLANNED_STATUS_ENUM = ["Hiring Freeze", "In Progress", "Announced",
                       "Announced (early stage)"]

# Attribution classes that satisfy the gate (plan §4.3). A journalist
# holding documented proof (leaked memo the outlet quotes) also passes.
VALID_ATTRIBUTION_TYPES = {
    "company_statement", "exec_quote", "internal_memo", "press_release",
    "earnings_call", "sec_filing", "journalist_with_documentation",
}
INVALID_ATTRIBUTION_TYPES = {
    "journalist_framing", "anonymous_sources", "third_party_inference",
}

# Confidence thresholds (plan §4.3).
CONFIDENCE_DROP_BELOW = 70
CONFIDENCE_FLAG_BELOW = 85

# Company-name suffixes stripped during dedup normalization (brief §10).
COMPANY_SUFFIXES = ["inc", "corp", "corporation", "ltd", "llc", "platforms"]


# ============================================================
# PURE FUNCTIONS - query expansion
# ============================================================

def expand_query(query, today=None):
    """Replace the {Y} and {month} tokens with the current year/month."""
    today = today or datetime.date.today()
    return (query.replace("{Y}", str(today.year))
                 .replace("{month}", today.strftime("%B")))


def load_queries(path=QUERIES_PATH):
    """Load and validate the query bank; returns {category: [queries]}."""
    import yaml
    with open(path, "r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    missing = [c for c in CATEGORIES if c not in data]
    if missing:
        raise ValueError(f"queries.yml is missing categories: {missing}")
    return data


# ============================================================
# PURE FUNCTIONS - attribution gate (plan §4.3)
# ============================================================

@dataclass
class GateResult:
    """Outcome of the attribution gate for one candidate."""
    action: str            # "pass" | "flag" | "drop"
    attribution: str       # value for the Attribution column ("" on drop)
    reason: str            # human-readable explanation (for the digest)


def apply_gate(candidate):
    """
    Classify a structured candidate against the attribution gate.

    Expects these model-supplied fields on the candidate dict:
      attribution_type   - one of the classes above
      attribution_source - short label, e.g. "CEO memo", "10-K"
      denial_found       - bool: the company explicitly denied AI drove it
      confidence         - int 0-100
    """
    denial = bool(candidate.get("denial_found"))
    if denial:
        return GateResult("drop", "", "company denial on record (hard fail)")

    attribution_type = str(candidate.get("attribution_type", "")).strip()
    label = str(candidate.get("attribution_source", "")).strip() \
        or attribution_type or "unattributed"

    if attribution_type not in VALID_ATTRIBUTION_TYPES:
        return GateResult(
            "drop", "",
            f"attribution class '{attribution_type or 'missing'}' does not "
            "satisfy the gate (journalist framing / anonymous sources / "
            "third-party inference are invalid alone)")

    try:
        confidence = int(candidate.get("confidence", 0))
    except (TypeError, ValueError):
        confidence = 0

    if confidence < CONFIDENCE_DROP_BELOW:
        return GateResult("drop", "",
                          f"confidence {confidence} < {CONFIDENCE_DROP_BELOW}")
    if confidence < CONFIDENCE_FLAG_BELOW:
        # 70-84: staged but flagged so the reviewer looks closer.
        return GateResult("flag", f"⚠ {label}",
                          f"confidence {confidence} in flag band")
    return GateResult("pass", label, f"confidence {confidence}")


# ============================================================
# PURE FUNCTIONS - dedup (plan §4.4 / brief §10)
# ============================================================

def normalize_company(name):
    """Lowercase, trim, strip punctuation and common corporate suffixes."""
    text = re.sub(r"[.,]", " ", str(name or "").lower()).strip()
    tokens = text.split()
    while tokens and tokens[-1] in COMPANY_SUFFIXES:
        tokens.pop()
    return " ".join(tokens)


def count_bucket(count_text):
    """
    First integer in the text, rounded to 2 significant figures;
    "NA" when no integer is present (brief §10).
    """
    match = re.search(r"\d[\d,]*", str(count_text or ""))
    if not match:
        return "NA"
    number = int(match.group(0).replace(",", ""))
    if number < 100:
        return str(number)
    digits = len(str(number))
    return str(round(number, -(digits - 2)))


def event_month(date_text):
    """Extract YYYY-MM from an ISO-ish date string; "" if unparseable."""
    match = re.search(r"(\d{4})-(\d{2})", str(date_text or ""))
    return f"{match.group(1)}-{match.group(2)}" if match else ""


def dedup_key(company, date_text, count_text):
    """Dedup key tuple: (normalized company, event month, count bucket)."""
    return (normalize_company(company), event_month(date_text),
            count_bucket(count_text))


def is_duplicate(key, existing_keys):
    """
    True when `key` matches any existing key.

    Exact-key match; plus the brief §10 "NA" fallback: number fields are
    often prose, so when either side's bucket is NA, a match on
    company + month alone counts as a duplicate.
    """
    company, month, bucket = key
    if not company:
        return False
    for existing_company, existing_month, existing_bucket in existing_keys:
        if company != existing_company or month != existing_month:
            continue
        if bucket == existing_bucket:
            return True
        if bucket == "NA" or existing_bucket == "NA":
            return True
    return False


# ============================================================
# PURE FUNCTIONS - structuring (brief §6)
# ============================================================

def clean_planned_status(value):
    """Coerce the model's status onto the exact enum (brief §6)."""
    text = str(value or "").strip()
    for allowed in PLANNED_STATUS_ENUM:
        if text.lower() == allowed.lower():
            return allowed
    return "Announced"  # safe default; the reviewer can edit before approval


def build_row(candidate, category, gate_result):
    """
    Map a structured candidate onto its staging tab's row layout:
    base columns (schema order) + control columns.

    Hedged numbers are preserved verbatim: the `count` field passes
    through untouched (never parsed and re-serialized).
    """
    get = lambda field: str(candidate.get(field, "") or "").strip()
    count_verbatim = str(candidate.get("count", "") or "").strip()

    if category == "losses":
        base = [get("date"), get("company"), count_verbatim, get("roles"),
                get("reason"), get("source_url"), ""]  # Article stays blank
    elif category == "planned":
        base = [get("date"), get("company"), count_verbatim,
                get("jobs_already_cut"), clean_planned_status(get("status")),
                get("roles"), get("timeline"), get("reason"),
                get("source_url")]
    elif category == "created":
        base = [get("date"), get("company"), count_verbatim, get("roles"),
                get("reason"), get("source_url")]
    elif category == "advances":
        base = [get("date"), get("company"), get("type"), get("name"),
                get("description"), get("category"), get("significance"),
                get("source_url")]
    else:
        raise ValueError(f"unknown category: {category}")

    controls = [str(candidate.get("confidence", "")), gate_result.attribution,
                get("quote"), "", "", ""]  # Approval/Status/Archive Link blank
    return base + controls


def extract_json(text):
    """
    Extract the first JSON object/array from model output. Handles bare
    JSON and ```json fenced blocks. Raises ValueError when none found.
    """
    fenced = re.search(r"```(?:json)?\s*(\{.*?\}|\[.*?\])\s*```",
                       text, re.DOTALL)
    if fenced:
        return json.loads(fenced.group(1))
    start = min([i for i in (text.find("{"), text.find("[")) if i != -1],
                default=-1)
    if start == -1:
        raise ValueError("no JSON found in model output")
    decoder = json.JSONDecoder()
    obj, _ = decoder.raw_decode(text[start:])
    return obj


# ============================================================
# PURE FUNCTIONS - digest (plan §4.5)
# ============================================================

def build_digest(per_category_stats, run_date, staging_link=None):
    """
    Build (subject, body) for the digest email.

    per_category_stats: {category: {"new": [candidate...], "skipped": n,
                                    "gate_failed": n, "manual_capture": [..]}}
    """
    total_new = sum(len(s["new"]) for s in per_category_stats.values())
    subject = f"AI Shift staging — {total_new} new candidates ({run_date})"

    lines = []
    if total_new == 0:
        lines.append("Ran clean, nothing new.")
    for category, stats in per_category_stats.items():
        label = CATEGORIES[category]["tab_label"]
        lines.append(f"\n{label}: {len(stats['new'])} new, "
                     f"{stats['skipped']} skipped as duplicates, "
                     f"{stats['gate_failed']} failed the gate")
        for candidate in stats["new"]:
            lines.append(
                "  - "
                f"{candidate.get('date', '?')} · "
                f"{candidate.get('company', '?')} · "
                f"{candidate.get('count') or candidate.get('name', 'n/a')} · "
                f"confidence {candidate.get('confidence', '?')} · "
                f"via query: {candidate.get('matched_query', '?')}")
        for item in stats.get("manual_capture", []):
            lines.append(f"  ! Needs Manual Capture: {item}")
    if staging_link:
        lines.append(f"\nStaging sheet: {staging_link}")
    return subject, "\n".join(lines).strip()


# ============================================================
# ANTHROPIC RESEARCH (network)
# ============================================================

CATEGORY_TASK = {
    "losses": ("companies that EXECUTED layoffs/job cuts within the window "
               "that the company itself (or credible reporting of a company "
               "statement/filing) attributes to AI, automation, or AI-driven "
               "restructuring"),
    "planned": ("announced-but-not-yet-executed workforce reductions, hiring "
                "freezes, or restructurings attributed to AI within the "
                "window"),
    "created": ("new hiring or roles specifically driven by AI initiatives "
                "announced within the window (including AI data center and "
                "chip fab support jobs)"),
    "advances": ("notable AI milestones within the window: breakthroughs, "
                 "company launches, model releases, regulation, "
                 "partnerships, acquisitions (majors always in; aim for "
                 "genuinely notable items only)"),
}

CANDIDATE_FIELDS_COMMON = """
Each candidate object MUST have these fields:
  "company": official company name (or lab/government body for advances)
  "date": ISO YYYY-MM-DD date of the event/announcement
  "count": jobs number EXACTLY as the source phrases it, verbatim -
           preserve hedges like "~600 (5%)" or "about 1,200"; "" if none
  "roles": job positions/categories affected or created
  "reason": 1-3 factual sentences; include a direct quote when the source
            has one; if the company's phrase is vague (e.g. "advances in
            technology"), preserve the exact phrase here
  "quote": the single decisive verbatim quote establishing AI attribution
  "source_url": primary source URL (the original article/filing/PR)
  "matched_query": which query from the list surfaced this event
  "attribution_type": one of company_statement, exec_quote, internal_memo,
      press_release, earnings_call, sec_filing,
      journalist_with_documentation, journalist_framing, anonymous_sources,
      third_party_inference
  "attribution_source": short label of who said it (e.g. "CEO memo", "10-K",
      "spokesperson")
  "denial_found": true/false - run a targeted check for "<company> denies AI
      layoffs" / spokesperson denials before answering; true if the company
      explicitly denied AI drove the decision
  "confidence": integer 0-100 that AI is a genuinely company-attributed
      driver of this event
"""

CATEGORY_EXTRA_FIELDS = {
    "planned": """
Additionally for this category:
  "status": exactly one of "Hiring Freeze", "In Progress", "Announced",
            "Announced (early stage)"
  "jobs_already_cut": verbatim count already executed, "" if none
  "timeline": stated execution timeline, "" if none
""",
    "advances": """
Additionally for this category:
  "type": exactly one of breakthrough, company-launch, model-release,
          regulation, partnership, acquisition
  "name": short name of the milestone
  "description": 1-2 sentence factual description
  "category": topical category (e.g. "LLM", "robotics", "policy")
  "significance": one sentence on why it matters
""",
}


def run_research_category(client, category, queries, window_days):
    """
    One Anthropic call per category: sweep the query bank with web
    search and return a list of structured candidate dicts.

    UNTESTED against the live API - validate on the first manual
    workflow_dispatch run (build-order step 2).
    """
    today = datetime.date.today()
    expanded = [expand_query(q, today) for q in queries]
    query_block = "\n".join(f"- {q}" for q in expanded)
    extra = CATEGORY_EXTRA_FIELDS.get(category, "")

    prompt = f"""You are a precise research assistant feeding a human-reviewed
tracker of AI's economic impact. Today is {today.isoformat()}.

Task: using web search, sweep the query bank below and find
{CATEGORY_TASK[category]}.

STRICT RECENCY WINDOW: only events reported within the last
{window_days} days. Ignore older events and undated speculation.

Query bank (run the sweeps that are likely to surface distinct events;
record which query surfaced each candidate):
{query_block}

Rules:
- Only factual, source-attributed findings. Never speculate or fabricate
  numbers. Preserve hedged phrasing verbatim.
- One candidate object per distinct event. Merge repeat coverage of the
  same event into one candidate with the best primary source.
- For each candidate, run a quick denial check (company spokesperson
  denying AI attribution) and set denial_found accordingly.
{CANDIDATE_FIELDS_COMMON}{extra}
Output: a single JSON array of candidate objects (an empty array [] if
nothing qualifies), inside a ```json fenced block, and nothing else after
the block."""

    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=16000,
        tools=[{"type": WEB_SEARCH_TOOL_TYPE, "name": "web_search",
                "max_uses": 25}],
        messages=[{"role": "user", "content": prompt}],
    )

    # Claude Fable 5's safety classifiers can decline a request with a
    # normal HTTP 200 - check stop_reason before reading content.
    if response.stop_reason == "refusal":
        print(f"  WARNING: model refused the '{category}' sweep "
              "(stop_reason=refusal); skipping category.")
        return []

    text = "".join(block.text for block in response.content
                   if getattr(block, "type", "") == "text")
    try:
        candidates = extract_json(text)
    except (ValueError, json.JSONDecodeError) as error:
        print(f"  WARNING: could not parse model output for "
              f"'{category}': {error}; skipping category.")
        return []
    if not isinstance(candidates, list):
        candidates = [candidates]
    return [c for c in candidates if isinstance(c, dict)]


# ============================================================
# GOOGLE SHEETS (network; lazy imports)
# ============================================================

def get_sheets_service():
    """Build an authenticated Sheets API service from GOOGLE_SA_KEY."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    raw_key = os.environ.get("GOOGLE_SA_KEY")
    if not raw_key:
        sys.exit("ERROR: GOOGLE_SA_KEY environment variable is not set.")
    try:
        info = json.loads(raw_key)
    except json.JSONDecodeError:
        sys.exit("ERROR: GOOGLE_SA_KEY is not valid JSON.")
    credentials = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/spreadsheets"])
    return build("sheets", "v4", credentials=credentials,
                 cache_discovery=False)


def a1_tab(title):
    """Quote a tab title for an A1 range."""
    return "'" + title.replace("'", "''") + "'"


def list_tabs(service, spreadsheet_id):
    """Return {gid: title} for a spreadsheet."""
    meta = service.spreadsheets().get(
        spreadsheetId=spreadsheet_id,
        fields="sheets(properties(sheetId,title))").execute()
    return {s["properties"]["sheetId"]: s["properties"]["title"]
            for s in meta.get("sheets", [])}


def read_tab_rows(service, spreadsheet_id, title):
    """Read all rows of a tab as lists of strings."""
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{a1_tab(title)}!A1:Z").execute()
    return result.get("values", [])


def keys_from_rows(rows):
    """
    Build dedup keys from sheet rows using the header to locate the
    Date/Company/count columns. Includes ALL rows (Rejected included -
    plan §3: rejected rows feed dedup so events are never re-proposed).
    """
    if not rows:
        return set()
    header = [h.strip().lower() for h in rows[0]]

    def find(*names):
        for name in names:
            for index, cell in enumerate(header):
                if name in cell:
                    return index
        return None

    date_index = find("date")
    company_index = find("company")
    count_index = find("number of jobs", "jobs announced", "jobs created")
    keys = set()
    for row in rows[1:]:
        def cell(index):
            return row[index] if index is not None and index < len(row) else ""
        if not cell(company_index):
            continue
        keys.add(dedup_key(cell(company_index), cell(date_index),
                           cell(count_index)))
    return keys


def keys_from_local_json(json_files):
    """Build dedup keys from the dashboard's verified JSON files."""
    keys = set()
    for filename in json_files:
        path = os.path.join(VERIFIED_JSON_DIR, filename)
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as handle:
            try:
                entries = json.load(handle)
            except json.JSONDecodeError:
                continue
        for entry in entries if isinstance(entries, list) else []:
            company = entry.get("companyName") or entry.get("company") or ""
            count = entry.get("jobsCut") or entry.get("jobsCreated") or ""
            keys.add(dedup_key(company, entry.get("date", ""), str(count)))
    return keys


def append_rows(service, spreadsheet_id, title, rows):
    """Append rows to the bottom of a tab."""
    if not rows:
        return
    service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range=f"{a1_tab(title)}!A1",
        valueInputOption="USER_ENTERED",
        insertDataOption="INSERT_ROWS",
        body={"values": rows}).execute()


# ============================================================
# DIGEST EMAIL (network; non-fatal)
# ============================================================

def send_digest(subject, body):
    """
    Send the digest via SMTP. Any failure (missing config, network,
    auth) is logged and swallowed - email must never fail the run.
    """
    recipient = os.environ.get("DIGEST_TO")
    host = os.environ.get("SMTP_HOST")
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    port = int(os.environ.get("SMTP_PORT", "587"))
    if not (recipient and host and user and password):
        print("Digest email skipped: SMTP env vars not fully configured.")
        return
    try:
        import smtplib
        from email.mime.text import MIMEText

        message = MIMEText(body, "plain", "utf-8")
        message["Subject"] = subject
        message["From"] = user
        message["To"] = recipient
        with smtplib.SMTP(host, port, timeout=30) as smtp:
            smtp.starttls()
            smtp.login(user, password)
            smtp.sendmail(user, [recipient], message.as_string())
        print(f"Digest email sent to {recipient}.")
    except Exception as error:  # non-fatal by design (plan §4.5)
        print(f"WARNING: digest email failed (non-fatal): "
              f"{type(error).__name__}: {error}")


# ============================================================
# MAIN PIPELINE
# ============================================================

def process_category(category, candidates, existing_keys, stats):
    """
    Apply gate + dedup to raw candidates; returns rows ready to append.
    Mutates `existing_keys` so a run never stages the same event twice,
    and `stats` for the digest. Pure given its inputs (no network).
    """
    rows = []
    for candidate in candidates:
        gate = apply_gate(candidate)
        if gate.action == "drop":
            stats["gate_failed"] += 1
            continue
        key = dedup_key(candidate.get("company"), candidate.get("date"),
                        candidate.get("count"))
        if is_duplicate(key, existing_keys):
            stats["skipped"] += 1
            continue
        existing_keys.add(key)
        rows.append(build_row(candidate, category, gate))
        stats["new"].append(candidate)
    return rows


def main():
    parser = argparse.ArgumentParser(
        description="Workflow A: research AI workforce events into the "
                    "staging sheet.")
    parser.add_argument("--window", type=int, default=7,
                        help="Recency window in days (default 7; use 30 "
                             "for catch-up runs).")
    parser.add_argument("--dry-run", action="store_true",
                        help="No Sheets access: dedup against local JSON "
                             "only, write candidates to automation/out/, "
                             "print the digest.")
    args = parser.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("ERROR: ANTHROPIC_API_KEY environment variable is not set.")

    import anthropic
    client = anthropic.Anthropic()

    queries = load_queries()
    run_date = datetime.date.today().isoformat()

    # --- Collect existing keys for dedup ------------------------------
    service = None
    staging_tabs = {}
    if not args.dry_run:
        staging_id = os.environ.get("SHEET_STAGING_ID")
        tracker_id = os.environ.get("SHEET_TRACKER_ID")
        if not (staging_id and tracker_id):
            sys.exit("ERROR: SHEET_STAGING_ID and SHEET_TRACKER_ID must be "
                     "set for a live run (use --dry-run otherwise).")
        service = get_sheets_service()
        staging_tabs = list_tabs(service, staging_id)

    per_category_stats = {}
    all_dry_run_candidates = {}

    for category, config in CATEGORIES.items():
        print(f"Category '{category}': researching "
              f"(window {args.window} days)...")
        stats = {"new": [], "skipped": 0, "gate_failed": 0,
                 "manual_capture": []}
        per_category_stats[category] = stats

        # Dedup sources: local dashboard JSON always; staging + tracker
        # tabs on live runs (plan §4.4).
        existing_keys = keys_from_local_json(config["json_files"])
        if service is not None:
            staging_id = os.environ["SHEET_STAGING_ID"]
            tracker_id = os.environ["SHEET_TRACKER_ID"]
            # Resolve by title/alias first (gids change when tabs are
            # recreated); fall back to the brief's historical gid.
            title = None
            for alias in config.get("tab_aliases", [config["tab_label"]]):
                if alias in staging_tabs.values():
                    title = alias
                    break
            if title is None and config["gid"] is not None:
                title = staging_tabs.get(config["gid"])
            if title:
                existing_keys |= keys_from_rows(
                    read_tab_rows(service, staging_id, title))
            else:
                print(f"  WARNING: staging tab for '{category}' not found "
                      "(run sheet_prep.py first?)")
            # Live tracker: dedup against every tab.
            for tracker_title in list_tabs(service, tracker_id).values():
                existing_keys |= keys_from_rows(
                    read_tab_rows(service, tracker_id, tracker_title))

        candidates = run_research_category(client, category,
                                           queries[category], args.window)
        print(f"  model returned {len(candidates)} raw candidate(s)")
        rows = process_category(category, candidates, existing_keys, stats)
        print(f"  {len(rows)} new, {stats['skipped']} duplicates, "
              f"{stats['gate_failed']} gate-failed")

        if args.dry_run:
            all_dry_run_candidates[category] = {
                "staged_rows": rows,
                "new_candidates": stats["new"],
                "skipped_duplicates": stats["skipped"],
                "gate_failed": stats["gate_failed"],
            }
        elif rows:
            append_title = None
            for alias in config.get("tab_aliases", [config["tab_label"]]):
                if alias in staging_tabs.values():
                    append_title = alias
                    break
            if append_title is None:
                append_title = staging_tabs.get(config["gid"],
                                                config["tab_label"])
            append_rows(service, os.environ["SHEET_STAGING_ID"],
                        append_title, rows)

    # --- Digest -------------------------------------------------------
    staging_link = None
    if os.environ.get("SHEET_STAGING_ID"):
        staging_link = ("https://docs.google.com/spreadsheets/d/"
                        + os.environ["SHEET_STAGING_ID"] + "/edit")
    subject, body = build_digest(per_category_stats, run_date, staging_link)

    if args.dry_run:
        os.makedirs(os.path.dirname(DRY_RUN_OUT), exist_ok=True)
        with open(DRY_RUN_OUT, "w", encoding="utf-8") as handle:
            json.dump(all_dry_run_candidates, handle, indent=2,
                      ensure_ascii=False)
        print(f"\nDry run: candidates written to {DRY_RUN_OUT}")
        print("\n--- Would-be digest ---")
        print(f"Subject: {subject}\n\n{body}")
    else:
        send_digest(subject, body)
        print(f"\n{subject}")


if __name__ == "__main__":
    main()
