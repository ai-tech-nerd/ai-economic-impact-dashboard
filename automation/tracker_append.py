#!/usr/bin/env python3
"""
tracker_append.py - one-shot append/edit utility for the LIVE tracker
spreadsheet ("AI Attributed Job Losses").

Purpose: push a reviewed batch of rows (already published to the
dashboard JSON) into the tracker sheet without manual pasting. This is
NOT part of Workflow A; it is a manually dispatched utility. The
payload file is committed to the repo so every sheet write is reviewed
and versioned.

Usage:
  export GOOGLE_SA_KEY='...'         # service-account JSON (secret)
  export SHEET_TRACKER_ID='...'      # tracker spreadsheet ID (secret)
  python3 automation/tracker_append.py --payload <file.json> [--dry-run]

Payload format (JSON):
{
  "appends": [
    {"tab_aliases": ["AI Job Losses Tracker", "AI Job Losses"],
     "rows": [ {"Date": "...", "Company": "...", ...}, ... ]},
    ...
  ],
  "create_tabs": [
    {"title": "Jobs Never Created", "header": ["Date", "Company", ...]}
  ],
  "edits": [
    {"tab_aliases": [...],
     "match": {"Company": "Oracle"},        # all pairs must substring-match
     "append_to_column": "Reason Given",
     "text": " ... appended sentence ..."},
    ...
  ]
}

Rows are dicts keyed by header title; each is placed under the tab's
ACTUAL header (read at runtime), so column order in the sheet never
matters. Headers not present in the row dict are left blank. Tabs are
resolved by title alias, never by gid (gids change when tabs are
recreated). A tab that cannot be resolved is skipped with a warning,
not an error, so the same payload works whether or not the tracker has
an AI Advances tab.

  "set_columns": [
    {"tab_aliases": [...], "column": "Category",
     "insert_after": "Job Position/Category",   # added only if missing
     "rows": [{"match": {"Company": "Oracle", "Date": "2026-03-31"},
               "value": "Operations"}]}
  ],
  "deletes": [
    {"tab_aliases": [...],
     "match": {"Company": "Klarna", "Date": "2024-08-27"}}  # must match 1 row
  ]
}

Order: create_tabs, appends, edits, set_columns, deletes. A set_columns
row that matches zero or several sheet rows is skipped and reported. A delete whose match finds
zero or several rows is skipped (several = refused) and the candidate
rows for that company are printed, so the payload can be corrected.

--dry-run reads the sheet and prints every action without writing.
"""

import argparse
import json
import os
import sys

# Reuse the authenticated client + A1 helpers from Workflow A.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from research import (  # noqa: E402
    get_sheets_service, a1_tab, list_tabs, read_tab_rows, append_rows,
)


def resolve_tab(tabs_by_gid, aliases):
    """Return the actual tab title matching any alias (case-insensitive)."""
    lowered = {t.lower(): t for t in tabs_by_gid.values()}
    for alias in aliases:
        if alias.lower() in lowered:
            return lowered[alias.lower()]
    return None


def dict_to_row(row_dict, header):
    """Order a {header: value} dict to the tab's actual header order."""
    lowered = {k.lower(): v for k, v in row_dict.items()}
    return [str(lowered.get(col.lower(), "")) for col in header]


def column_letter(index):
    """0-based column index -> A1 letters (0 -> A, 26 -> AA)."""
    letters = ""
    index += 1
    while index:
        index, rem = divmod(index - 1, 26)
        letters = chr(65 + rem) + letters
    return letters


def matching_rows(rows, header, match):
    """Return 1-based sheet row indexes whose cells substring-match all pairs."""
    col_index = {col.lower(): i for i, col in enumerate(header)}
    hits = []
    for r, row in enumerate(rows[1:], start=2):  # skip header row
        ok = True
        for col, text in match.items():
            i = col_index.get(col.lower())
            cell = row[i] if i is not None and i < len(row) else ""
            if text.lower() not in cell.lower():
                ok = False
                break
        if ok:
            hits.append(r)
    return hits


def find_row_index(rows, header, match):
    """
    Return the 1-based sheet row index of the single data row whose
    cells substring-match every {column: text} pair, or None. Exits if
    the match is ambiguous (safety: never edit the wrong row).
    """
    col_index = {col.lower(): i for i, col in enumerate(header)}
    hits = []
    for r, row in enumerate(rows[1:], start=2):  # skip header row
        ok = True
        for col, text in match.items():
            i = col_index.get(col.lower())
            cell = row[i] if i is not None and i < len(row) else ""
            if text.lower() not in cell.lower():
                ok = False
                break
        if ok:
            hits.append(r)
    if len(hits) > 1:
        sys.exit(f"ERROR: match {match} is ambiguous (rows {hits}); "
                 "refusing to edit.")
    return hits[0] if hits else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--payload", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    with open(args.payload) as fh:
        payload = json.load(fh)

    tracker_id = os.environ.get("SHEET_TRACKER_ID")
    if not tracker_id:
        sys.exit("ERROR: SHEET_TRACKER_ID environment variable is not set.")

    service = get_sheets_service()
    tabs = list_tabs(service, tracker_id)
    print(f"Tracker tabs: {sorted(tabs.values())}")

    for spec in payload.get("create_tabs", []):
        if resolve_tab(tabs, [spec["title"]]) is not None:
            print(f"Tab '{spec['title']}' already exists - not created.")
            continue
        print(f"Create tab '{spec['title']}' with header {spec['header']}")
        if not args.dry_run:
            service.spreadsheets().batchUpdate(
                spreadsheetId=tracker_id,
                body={"requests": [{"addSheet": {"properties": {
                    "title": spec["title"]}}}]}).execute()
            service.spreadsheets().values().update(
                spreadsheetId=tracker_id,
                range=f"{a1_tab(spec['title'])}!A1",
                valueInputOption="USER_ENTERED",
                body={"values": [spec["header"]]}).execute()
            tabs = list_tabs(service, tracker_id)

    for spec in payload.get("appends", []):
        title = resolve_tab(tabs, spec["tab_aliases"])
        if title is None:
            print(f"WARNING: no tab matching {spec['tab_aliases']} - "
                  f"skipping {len(spec['rows'])} row(s).")
            continue
        rows = read_tab_rows(service, tracker_id, title)
        if not rows:
            print(f"WARNING: tab '{title}' has no header row - skipping.")
            continue
        if not rows and args.dry_run and spec.get("header_if_new"):
            rows = [spec["header_if_new"]]
        if not rows:
            print(f"WARNING: tab '{title}' has no header row - skipping.")
            continue
        header = rows[0]
        ordered = [dict_to_row(r, header) for r in spec["rows"]]
        print(f"[{title}] {len(rows) - 1} data rows now; "
              f"appending {len(ordered)}:")
        for row in ordered:
            print(f"  + {row[:3]}...")
        if not args.dry_run:
            append_rows(service, tracker_id, title, ordered)

    for spec in payload.get("edits", []):
        title = resolve_tab(tabs, spec["tab_aliases"])
        if title is None:
            print(f"WARNING: no tab matching {spec['tab_aliases']} - "
                  f"skipping edit {spec['match']}.")
            continue
        rows = read_tab_rows(service, tracker_id, title)
        header = rows[0] if rows else []
        row_idx = find_row_index(rows, header, spec["match"])
        if row_idx is None:
            print(f"WARNING: no row in '{title}' matches {spec['match']} - "
                  "skipping edit.")
            continue
        col_lower = [c.lower() for c in header]
        target = spec["append_to_column"].lower()
        if target not in col_lower:
            print(f"WARNING: column '{spec['append_to_column']}' not in "
                  f"'{title}' - skipping edit.")
            continue
        col_idx = col_lower.index(target)
        current = ""
        row = rows[row_idx - 1]
        if col_idx < len(row):
            current = row[col_idx]
        new_value = (current + spec["text"]) if current else spec["text"].strip()
        cell = f"{a1_tab(title)}!{chr(ord('A') + col_idx)}{row_idx}"
        print(f"[{title}] edit {cell} (row matched {spec['match']}): "
              f"appending {len(spec['text'])} chars.")
        if not args.dry_run:
            service.spreadsheets().values().update(
                spreadsheetId=tracker_id, range=cell,
                valueInputOption="USER_ENTERED",
                body={"values": [[new_value]]}).execute()

    for spec in payload.get("set_columns", []):
        title = resolve_tab(tabs, spec["tab_aliases"])
        if title is None:
            print(f"WARNING: no tab matching {spec['tab_aliases']} - skipping column.")
            continue
        rows = read_tab_rows(service, tracker_id, title)
        header = rows[0] if rows else []
        lower = [h.lower() for h in header]
        column = spec["column"]
        if column.lower() in lower:
            col_idx = lower.index(column.lower())
            print(f"[{title}] column '{column}' exists at index {col_idx}")
        else:
            after = spec.get("insert_after", "").lower()
            col_idx = lower.index(after) + 1 if after in lower else len(header)
            print(f"[{title}] insert column '{column}' at index {col_idx}")
            if not args.dry_run:
                gid = next(g for g, t in tabs.items() if t == title)
                service.spreadsheets().batchUpdate(
                    spreadsheetId=tracker_id,
                    body={"requests": [{"insertDimension": {
                        "range": {"sheetId": gid, "dimension": "COLUMNS",
                                  "startIndex": col_idx, "endIndex": col_idx + 1},
                        "inheritFromBefore": col_idx > 0}}]},
                ).execute()
            header = header[:col_idx] + [column] + header[col_idx:]
            rows = [header] + [r[:col_idx] + [""] + r[col_idx:] for r in rows[1:]]

        letter = column_letter(col_idx)
        updates, matched, missed = [], 0, []
        for item in spec["rows"]:
            hits = matching_rows(rows, header, item["match"])
            if len(hits) != 1:
                missed.append((item["match"], len(hits)))
                continue
            matched += 1
            updates.append({"range": f"{a1_tab(title)}!{letter}{hits[0]}",
                            "values": [[item["value"]]]})
        updates.insert(0, {"range": f"{a1_tab(title)}!{letter}1", "values": [[column]]})
        print(f"[{title}] '{column}': {matched} rows matched, {len(missed)} skipped")
        for match, n in missed:
            print(f"    SKIP ({n} matches): {match}")
        unfilled = [r for r in range(2, len(rows) + 1)
                    if f"{a1_tab(title)}!{letter}{r}" not in {u["range"] for u in updates}]
        if unfilled:
            print(f"    sheet rows left blank: {unfilled}")
        if not args.dry_run:
            service.spreadsheets().values().batchUpdate(
                spreadsheetId=tracker_id,
                body={"valueInputOption": "USER_ENTERED", "data": updates},
            ).execute()

    for spec in payload.get("deletes", []):
        title = resolve_tab(tabs, spec["tab_aliases"])
        if title is None:
            print(f"WARNING: no tab matching {spec['tab_aliases']} - "
                  f"skipping delete {spec['match']}.")
            continue
        rows = read_tab_rows(service, tracker_id, title)
        header = rows[0] if rows else []
        hits = matching_rows(rows, header, spec["match"])
        if len(hits) != 1:
            print(f"[{title}] delete {spec['match']}: {len(hits)} matches - "
                  "SKIPPED. Rows for this company:")
            company = spec["match"].get("Company", "")
            for r, row in enumerate(rows[1:], start=2):
                if company and company.lower() in " ".join(row).lower():
                    print(f"    row {r}: {row[:5]}")
            continue
        row_idx = hits[0]
        print(f"[{title}] delete row {row_idx}: {rows[row_idx - 1][:5]}")
        if not args.dry_run:
            gid = next(g for g, t in tabs.items() if t == title)
            service.spreadsheets().batchUpdate(
                spreadsheetId=tracker_id,
                body={"requests": [{"deleteDimension": {"range": {
                    "sheetId": gid, "dimension": "ROWS",
                    "startIndex": row_idx - 1, "endIndex": row_idx}}}]},
            ).execute()

    print("Dry run - nothing written." if args.dry_run else "Done.")


if __name__ == "__main__":
    main()
