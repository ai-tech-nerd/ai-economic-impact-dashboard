#!/usr/bin/env python3
"""
sheet_prep.py - One-shot staging sheet preparation (build-order step 1).

Prepares the "AI Economic Dashboard Staging" spreadsheet for the
automation pipeline:

  1. Appends the control columns (Confidence, Attribution, Quote,
     Approval, Status, Archive Link) to the three existing staging tabs
     IF they are not already present.
  2. Sets a dropdown data-validation on each tab's Approval column
     (blank / Approved / Rejected / Needs Edit).
  3. Creates the "AI Advances" tab with its schema (plan §3) plus the
     same control columns, and a Type dropdown restricted to the six
     tracked milestone types.

Idempotent: safe to re-run. Existing headers are never overwritten;
only missing columns are appended, and validations are (re)applied
in place.

Environment variables (never hardcode these values):
  SHEET_STAGING_ID  - spreadsheet ID of the staging sheet (required
                      for live runs; optional for --dry-run)
  GOOGLE_SA_KEY     - Google service-account key as a JSON string
                      (required for live runs)

Usage:
  python3 automation/sheet_prep.py --dry-run   # print planned changes, no API calls
  python3 automation/sheet_prep.py             # apply changes
"""

import argparse
import json
import os
import sys

# ============================================================
# CONFIGURATION
# ============================================================

# Staging tabs are referenced by gid (never by name - see brief §16).
# These gids identify tabs inside the staging spreadsheet whose ID is
# supplied via the SHEET_STAGING_ID environment variable.
STAGING_TABS = {
    1938860059: {
        "label": "AI Job Losses Tracker",
        "base_columns": [
            "Date", "Company", "Number of Jobs", "Job Position/Category",
            "Reason Given", "Source Link", "Article",
        ],
    },
    451583307: {
        "label": "Planned/Announced",
        "base_columns": [
            "Date Announced", "Company", "Jobs Announced/Planned",
            "Jobs Already Cut", "Status", "Job Position/Category",
            "Timeline", "Reason Given", "Source Link",
        ],
    },
    1283716345: {
        "label": "AI Job Creation",
        "base_columns": [
            "Date", "Company", "Number of Jobs", "Job Roles Created",
            "Context", "Source Link",
        ],
    },
}

# Control columns appended to every tab (plan §3).
CONTROL_COLUMNS = [
    "Confidence", "Attribution", "Quote", "Approval", "Status", "Archive Link",
]

# Approval dropdown values. Blank is allowed because validation is
# non-strict for empty cells (Sheets treats empty as valid).
APPROVAL_VALUES = ["Approved", "Rejected", "Needs Edit"]

# New tab created by this script (plan §3).
ADVANCES_TAB_TITLE = "AI Advances"
ADVANCES_BASE_COLUMNS = [
    "Date", "Company", "Type", "Name", "Description", "Category",
    "Significance", "Source Link",
]
# The six tracked milestone types (plan §3).
ADVANCES_TYPE_VALUES = [
    "breakthrough", "company-launch", "model-release",
    "regulation", "partnership", "acquisition",
]

# Validation is applied from row 2 down to this row (headers excluded).
VALIDATION_MAX_ROWS = 5000


# ============================================================
# HELPERS
# ============================================================

def column_letter(index_zero_based):
    """Convert a 0-based column index to an A1 column letter (0 -> A)."""
    letters = ""
    index = index_zero_based
    while True:
        letters = chr(ord("A") + index % 26) + letters
        index = index // 26 - 1
        if index < 0:
            return letters


def a1_tab(title):
    """Quote a tab title for use in an A1 range (handles / and ')."""
    return "'" + title.replace("'", "''") + "'"


def one_of_list_rule(values):
    """Build a Sheets ONE_OF_LIST data-validation rule (non-strict on blanks)."""
    return {
        "condition": {
            "type": "ONE_OF_LIST",
            "values": [{"userEnteredValue": v} for v in values],
        },
        "showCustomUi": True,   # render as a dropdown
        "strict": True,         # reject typed values outside the list; blank stays valid
    }


def validation_request(sheet_id, column_index, values):
    """Build a setDataValidation request for one column, rows 2..N."""
    return {
        "setDataValidation": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,  # skip header row
                "endRowIndex": VALIDATION_MAX_ROWS,
                "startColumnIndex": column_index,
                "endColumnIndex": column_index + 1,
            },
            "rule": one_of_list_rule(values),
        }
    }


# ============================================================
# GOOGLE SHEETS ACCESS (lazy imports so --dry-run needs no deps)
# ============================================================

def get_service():
    """Build an authenticated Sheets API service from GOOGLE_SA_KEY."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    raw_key = os.environ.get("GOOGLE_SA_KEY")
    if not raw_key:
        sys.exit("ERROR: GOOGLE_SA_KEY environment variable is not set.")
    try:
        info = json.loads(raw_key)
    except json.JSONDecodeError:
        # Never echo the key material in the error message.
        sys.exit("ERROR: GOOGLE_SA_KEY is not valid JSON.")
    credentials = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    return build("sheets", "v4", credentials=credentials, cache_discovery=False)


def fetch_spreadsheet_meta(service, spreadsheet_id):
    """Return {gid: title} and {title: gid} maps for the spreadsheet."""
    meta = service.spreadsheets().get(
        spreadsheetId=spreadsheet_id,
        fields="sheets(properties(sheetId,title))",
    ).execute()
    by_gid, by_title = {}, {}
    for sheet in meta.get("sheets", []):
        props = sheet["properties"]
        by_gid[props["sheetId"]] = props["title"]
        by_title[props["title"]] = props["sheetId"]
    return by_gid, by_title


def read_header(service, spreadsheet_id, tab_title):
    """Read row 1 of a tab; returns a list of header strings."""
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{a1_tab(tab_title)}!1:1",
    ).execute()
    rows = result.get("values", [])
    return rows[0] if rows else []


def write_header_cells(service, spreadsheet_id, tab_title, start_index, headers):
    """Write header values starting at the given 0-based column index."""
    start_col = column_letter(start_index)
    end_col = column_letter(start_index + len(headers) - 1)
    service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=f"{a1_tab(tab_title)}!{start_col}1:{end_col}1",
        valueInputOption="RAW",
        body={"values": [headers]},
    ).execute()


# ============================================================
# DRY RUN
# ============================================================

def print_dry_run_plan():
    """Print the full plan without touching the API or requiring creds."""
    print("DRY RUN - planned changes (no API calls made):\n")
    print("Spreadsheet: staging sheet identified by env var SHEET_STAGING_ID\n")
    for gid, tab in STAGING_TABS.items():
        print(f"Tab gid={gid} ({tab['label']}):")
        print(f"  - Ensure control columns exist after base columns "
              f"{tab['base_columns']}:")
        for col in CONTROL_COLUMNS:
            print(f"      + {col} (appended only if missing)")
        print("  - Set Approval dropdown validation (rows 2+): "
              f"blank / {' / '.join(APPROVAL_VALUES)}\n")
    print(f"New tab '{ADVANCES_TAB_TITLE}' (created only if missing):")
    print(f"  - Header: {ADVANCES_BASE_COLUMNS + CONTROL_COLUMNS}")
    print(f"  - Type dropdown (rows 2+): {' / '.join(ADVANCES_TYPE_VALUES)}")
    print("  - Approval dropdown (rows 2+): blank / "
          + " / ".join(APPROVAL_VALUES))
    print("\nIdempotent: re-running makes no changes once everything exists.")


# ============================================================
# LIVE RUN
# ============================================================

def prepare_existing_tab(service, spreadsheet_id, gid, tab_config, batch_requests):
    """Ensure control columns + Approval validation on one existing tab."""
    by_gid, _ = fetch_spreadsheet_meta(service, spreadsheet_id)
    title = by_gid.get(gid)
    if title is None:
        print(f"  WARNING: no tab with gid={gid} "
              f"({tab_config['label']}) - skipped.")
        return

    header = read_header(service, spreadsheet_id, title)
    missing = [c for c in CONTROL_COLUMNS if c not in header]
    if missing:
        write_header_cells(service, spreadsheet_id, title, len(header), missing)
        header = header + missing
        print(f"  gid={gid} ('{title}'): appended columns {missing}")
    else:
        print(f"  gid={gid} ('{title}'): control columns already present")

    approval_index = header.index("Approval")
    batch_requests.append(validation_request(gid, approval_index, APPROVAL_VALUES))


def ensure_advances_tab(service, spreadsheet_id, batch_requests):
    """Create the AI Advances tab (with schema + dropdowns) if missing."""
    _, by_title = fetch_spreadsheet_meta(service, spreadsheet_id)
    full_header = ADVANCES_BASE_COLUMNS + CONTROL_COLUMNS

    if ADVANCES_TAB_TITLE not in by_title:
        response = service.spreadsheets().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body={"requests": [{"addSheet": {"properties": {
                "title": ADVANCES_TAB_TITLE,
                "gridProperties": {"rowCount": VALIDATION_MAX_ROWS,
                                   "columnCount": len(full_header) + 2},
            }}}]},
        ).execute()
        gid = response["replies"][0]["addSheet"]["properties"]["sheetId"]
        write_header_cells(service, spreadsheet_id, ADVANCES_TAB_TITLE, 0, full_header)
        print(f"  Created tab '{ADVANCES_TAB_TITLE}' (gid={gid}) with header")
    else:
        gid = by_title[ADVANCES_TAB_TITLE]
        header = read_header(service, spreadsheet_id, ADVANCES_TAB_TITLE)
        missing = [c for c in full_header if c not in header]
        if missing:
            write_header_cells(service, spreadsheet_id, ADVANCES_TAB_TITLE,
                               len(header), missing)
            print(f"  Tab '{ADVANCES_TAB_TITLE}' exists: appended {missing}")
        else:
            print(f"  Tab '{ADVANCES_TAB_TITLE}' already complete")

    header = read_header(service, spreadsheet_id, ADVANCES_TAB_TITLE)
    batch_requests.append(
        validation_request(gid, header.index("Type"), ADVANCES_TYPE_VALUES))
    batch_requests.append(
        validation_request(gid, header.index("Approval"), APPROVAL_VALUES))


def run_live():
    """Apply all sheet preparation changes."""
    spreadsheet_id = os.environ.get("SHEET_STAGING_ID")
    if not spreadsheet_id:
        sys.exit("ERROR: SHEET_STAGING_ID environment variable is not set.")

    service = get_service()
    batch_requests = []

    print("Preparing staging tabs:")
    for gid, tab_config in STAGING_TABS.items():
        prepare_existing_tab(service, spreadsheet_id, gid, tab_config,
                             batch_requests)

    print("Preparing AI Advances tab:")
    ensure_advances_tab(service, spreadsheet_id, batch_requests)

    if batch_requests:
        service.spreadsheets().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body={"requests": batch_requests},
        ).execute()
        print(f"Applied {len(batch_requests)} data-validation rule(s).")

    print("Done. Re-running this script is safe (idempotent).")


# ============================================================
# ENTRY POINT
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="Prepare the AI Shift staging spreadsheet "
                    "(control columns, dropdowns, AI Advances tab).")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print planned changes without calling the "
                             "Sheets API (no credentials required).")
    args = parser.parse_args()

    if args.dry_run:
        print_dry_run_plan()
    else:
        run_live()


if __name__ == "__main__":
    main()
