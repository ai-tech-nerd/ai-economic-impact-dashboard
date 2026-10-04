# Social Share Images, Page Metadata, Static Company Pages

**Date:** 2026-10-03 · **Status:** Shipped, live-verified

## Quick Links
- Code: scripts/og/cards.mjs (templates), scripts/og/site-data.mjs (shared data), scripts/og/generate.mjs (images + archive tags), scripts/prerender-seo.mjs (applyHead, company pages, sitemap), src/components/shared/Seo.tsx
- CHANGELOG: `[Unreleased] - 2026-10-03 — Social share images + page metadata`

## Problem Statement
No page had a share image, X/Twitter text was site-wide, and company pages only existed after JavaScript ran, so shared links previewed poorly.

## Approaches Attempted
- satori + @resvg/resvg-js + @fontsource/inter (woff; satori can't read woff2). Chosen: no browser in CI, ~50s for 284 images.
- Owner approved 3 samples first. Fixes after review: archive summary shown without quote marks (our wording); big numbers nowrap; chips equal-width with minWidth 0 (satori overflows otherwise); long company/jobs text scales down.

## Current State
- 6 section + 147 company + 131 archive images in dist/og/ at deploy; every page tagged; 147 static company pages; companies/index.html mirrors /companies; sitemap 153 URLs.

## Known Constraints (Verified)
- Social sites cache previews ~7 days; old links need a re-scrape.
- Company names/jurisdictions are parsed from CompanyPage.tsx (COMPANY_DISPLAY, COUNTRY_SLUGS); site-data.mjs throws if parsing breaks.
- React's company page title differs slightly from the static title (crawlers without JS see the static one).

## Lessons Learned
- satori flex children need minWidth: 0 and flexBasis: 0 to stay inside the frame.

## Next Steps
- None required. Optional: align React company titles with the static ones.

## Test Files
- None kept (images regenerate every deploy).
