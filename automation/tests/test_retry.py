"""Offline tests for retry_transport (Sheets transport-error retry)."""

import os
import ssl
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import research  # noqa: E402
from research import retry_transport  # noqa: E402


def test_retries_ssl_eof_then_succeeds(monkeypatch):
    """SSLEOFError on the stale connection; a fresh service succeeds."""
    monkeypatch.setattr(research, "get_sheets_service", lambda: "fresh")
    monkeypatch.setattr("time.sleep", lambda s: None)
    calls = []

    def make_request(svc):
        calls.append(svc)
        if len(calls) < 3:
            raise ssl.SSLEOFError("EOF occurred in violation of protocol")
        return {"ok": True}

    assert retry_transport("stale", make_request) == {"ok": True}
    # First attempt uses the caller's service; retries use fresh ones.
    assert calls == ["stale", "fresh", "fresh"]


def test_raises_after_exhausting_attempts(monkeypatch):
    monkeypatch.setattr(research, "get_sheets_service", lambda: "fresh")
    monkeypatch.setattr("time.sleep", lambda s: None)

    def make_request(svc):
        raise ssl.SSLEOFError("EOF occurred in violation of protocol")

    with pytest.raises(ssl.SSLEOFError):
        retry_transport("stale", make_request, attempts=3)


def test_non_transport_errors_raise_immediately(monkeypatch):
    monkeypatch.setattr(research, "get_sheets_service", lambda: "fresh")
    calls = []

    def make_request(svc):
        calls.append(svc)
        raise ValueError("API-level problem")

    with pytest.raises(ValueError):
        retry_transport("stale", make_request)
    assert calls == ["stale"]  # no retries
