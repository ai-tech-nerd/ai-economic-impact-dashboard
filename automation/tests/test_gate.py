"""
Offline unit tests for research.py's pure functions:
attribution gate, dedup key normalization, and structuring rules.

Run:  pytest automation/tests/test_gate.py
No network, no credentials, no API keys required.
"""

import os
import sys

import pytest

# Import research.py from the automation directory.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from research import (  # noqa: E402
    apply_gate,
    build_digest,
    build_row,
    clean_planned_status,
    count_bucket,
    dedup_key,
    expand_query,
    extract_json,
    is_duplicate,
    normalize_company,
)


def make_candidate(**overrides):
    """A baseline candidate that passes the gate cleanly."""
    candidate = {
        "company": "Acme Corp",
        "date": "2026-08-05",
        "count": "~600 (5%)",
        "roles": "customer support",
        "reason": 'CEO said "AI now handles most tickets."',
        "quote": "AI now handles most tickets.",
        "source_url": "https://example.com/article",
        "matched_query": '"AI-driven layoffs"',
        "attribution_type": "exec_quote",
        "attribution_source": "CEO memo",
        "denial_found": False,
        "confidence": 92,
    }
    candidate.update(overrides)
    return candidate


# ============================================================
# Attribution gate (plan §4.3)
# ============================================================

class TestGate:
    def test_company_quote_passes(self):
        result = apply_gate(make_candidate())
        assert result.action == "pass"
        assert result.attribution == "CEO memo"
        assert "⚠" not in result.attribution

    def test_journalist_framing_fails(self):
        result = apply_gate(make_candidate(
            attribution_type="journalist_framing", confidence=95))
        assert result.action == "drop"

    def test_anonymous_sources_fail(self):
        result = apply_gate(make_candidate(
            attribution_type="anonymous_sources", confidence=95))
        assert result.action == "drop"

    def test_denial_hard_fails_regardless_of_confidence(self):
        result = apply_gate(make_candidate(denial_found=True, confidence=99))
        assert result.action == "drop"
        assert "denial" in result.reason

    def test_below_70_dropped(self):
        assert apply_gate(make_candidate(confidence=69)).action == "drop"
        assert apply_gate(make_candidate(confidence=0)).action == "drop"

    def test_70_to_84_flagged_with_warning_prefix(self):
        for confidence in (70, 84):
            result = apply_gate(make_candidate(confidence=confidence))
            assert result.action == "flag"
            assert result.attribution.startswith("⚠ ")

    def test_85_passes_unflagged(self):
        result = apply_gate(make_candidate(confidence=85))
        assert result.action == "pass"

    def test_sec_filing_and_journalist_with_documentation_valid(self):
        for attribution in ("sec_filing", "journalist_with_documentation"):
            result = apply_gate(make_candidate(attribution_type=attribution))
            assert result.action == "pass"

    def test_missing_or_garbage_confidence_dropped(self):
        assert apply_gate(make_candidate(confidence=None)).action == "drop"
        assert apply_gate(make_candidate(confidence="high")).action == "drop"


# ============================================================
# Dedup normalization (plan §4.4 / brief §10)
# ============================================================

class TestNormalizeCompany:
    def test_strips_suffixes_and_case(self):
        assert normalize_company("Oracle Corporation ") == "oracle"
        assert normalize_company("Meta Platforms, Inc.") == "meta"
        assert normalize_company("Vodafone Ltd") == "vodafone"

    def test_plain_names_unchanged(self):
        assert normalize_company("  IBM ") == "ibm"
        assert normalize_company("Wells Fargo") == "wells fargo"


class TestCountBucket:
    def test_hedged_number_extracts_first_integer(self):
        assert count_bucket("~600 (5%)") == "600"

    def test_two_significant_figures(self):
        assert count_bucket("4,550 roles") == "4600"  # round-half-even -> 4600
        assert count_bucket("25,000") == "25000"
        assert count_bucket("1234") == "1200"

    def test_small_numbers_unchanged(self):
        assert count_bucket("95 jobs") == "95"

    def test_prose_without_numbers_is_na(self):
        assert count_bucket("several hundred roles") == "NA"
        assert count_bucket("") == "NA"
        assert count_bucket(None) == "NA"


class TestDedup:
    def test_exact_key_match_is_duplicate(self):
        key = dedup_key("Acme Corp", "2026-08-05", "~600 (5%)")
        existing = {dedup_key("Acme, Inc.", "2026-08-20", "600 jobs")}
        assert is_duplicate(key, existing)

    def test_different_month_not_duplicate(self):
        key = dedup_key("Acme", "2026-08-05", "600")
        existing = {dedup_key("Acme", "2026-07-05", "600")}
        assert not is_duplicate(key, existing)

    def test_na_bucket_falls_back_to_company_plus_month(self):
        # Brief §10: prose counts resolve to NA; a same-company,
        # same-month row then counts as a duplicate.
        key = dedup_key("Acme", "2026-08-05", "several hundred")
        existing = {dedup_key("Acme Inc", "2026-08-12", "600")}
        assert is_duplicate(key, existing)
        # ...and symmetrically when the existing row has the NA bucket.
        key2 = dedup_key("Acme", "2026-08-05", "600")
        existing2 = {dedup_key("Acme Inc", "2026-08-12", "hundreds")}
        assert is_duplicate(key2, existing2)

    def test_different_buckets_same_month_not_duplicate(self):
        key = dedup_key("Acme", "2026-08-05", "600")
        existing = {dedup_key("Acme", "2026-08-12", "5000")}
        assert not is_duplicate(key, existing)

    def test_empty_company_never_matches(self):
        key = dedup_key("", "2026-08-05", "600")
        assert not is_duplicate(key, {dedup_key("", "2026-08-05", "600")})


# ============================================================
# Structuring (brief §6)
# ============================================================

class TestBuildRow:
    def test_hedged_number_preserved_verbatim_in_losses_row(self):
        candidate = make_candidate(count="~600 (5%)")
        gate = apply_gate(candidate)
        row = build_row(candidate, "losses", gate)
        # Losses schema: Date | Company | Number of Jobs | ... ; count is
        # column index 2 and must pass through untouched.
        assert row[2] == "~600 (5%)"
        # Article column (index 6) stays blank.
        assert row[6] == ""

    def test_losses_row_layout_and_controls(self):
        candidate = make_candidate()
        gate = apply_gate(candidate)
        row = build_row(candidate, "losses", gate)
        assert len(row) == 7 + 6  # base columns + control columns
        assert row[0] == "2026-08-05"
        assert row[1] == "Acme Corp"
        assert row[7] == "92"              # Confidence
        assert row[8] == "CEO memo"        # Attribution
        assert row[9] == "AI now handles most tickets."  # Quote
        assert row[10] == row[11] == row[12] == ""  # Approval/Status/Archive

    def test_flagged_candidate_gets_warning_in_attribution_cell(self):
        candidate = make_candidate(confidence=75)
        gate = apply_gate(candidate)
        row = build_row(candidate, "losses", gate)
        assert row[8].startswith("⚠ ")

    def test_planned_status_enum_enforced(self):
        assert clean_planned_status("hiring freeze") == "Hiring Freeze"
        assert clean_planned_status("Announced (early stage)") == \
            "Announced (early stage)"
        assert clean_planned_status("who knows") == "Announced"
        candidate = make_candidate(status="In progress",
                                   jobs_already_cut="120", timeline="by Q4")
        row = build_row(candidate, "planned", apply_gate(candidate))
        assert row[4] == "In Progress"

    def test_advances_row_layout(self):
        candidate = make_candidate(type="model-release", name="Model X",
                                   description="A new model.",
                                   category="LLM", significance="Big jump.")
        row = build_row(candidate, "advances", apply_gate(candidate))
        assert row[:3] == ["2026-08-05", "Acme Corp", "model-release"]
        assert len(row) == 8 + 6

    def test_unknown_category_raises(self):
        with pytest.raises(ValueError):
            build_row(make_candidate(), "nonsense", apply_gate(make_candidate()))


# ============================================================
# Helpers: query expansion, JSON extraction, digest
# ============================================================

class TestHelpers:
    def test_expand_query_tokens(self):
        import datetime
        today = datetime.date(2026, 8, 11)
        assert expand_query('"AI hiring" {Y}', today) == '"AI hiring" 2026'
        assert expand_query("AI regulation {month} {Y}", today) == \
            "AI regulation August 2026"

    def test_extract_json_fenced_and_bare(self):
        assert extract_json('```json\n[{"a": 1}]\n```') == [{"a": 1}]
        assert extract_json('noise before [1, 2] noise after') == [1, 2]
        with pytest.raises(ValueError):
            extract_json("no json here")

    def test_digest_counts_and_zero_run(self):
        stats = {c: {"new": [], "skipped": 0, "gate_failed": 0,
                     "manual_capture": []}
                 for c in ("losses", "planned", "created", "advances")}
        subject, body = build_digest(stats, "2026-08-11")
        assert "0 new candidates" in subject
        assert "Ran clean, nothing new." in body

        stats["losses"]["new"].append(make_candidate())
        stats["losses"]["skipped"] = 3
        subject, body = build_digest(stats, "2026-08-11",
                                     "https://example.com/sheet")
        assert "1 new candidates" in subject
        assert "3 skipped as duplicates" in body
        assert "Acme Corp" in body
        assert "https://example.com/sheet" in body
