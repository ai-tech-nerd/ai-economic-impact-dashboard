# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-08-10

### Added — Catch-up data sync from "AI Attributed Job Losses" Google Sheet (Apr–May 2026 backlog)
- **17 new displacement events** (evt-071–087): Dropbox (2024-10-30), PwC ×2, xAI, BILL Holdings, C3.ai, Pendo, Disney, Snap, UKG, Nike (Apr 2026), Meta (Apr 2026, ~8,000), Coinbase, Cloudflare, Upwork, Cisco, ClickUp — totals now 87 events / 324,370 jobs
- **8 new planned/announced entries** (plan-008–015): Klarna, SAP, Pinterest, UPS (30,000), ASML, British American Tobacco, HSBC (up to 20,000), PayPal
- **5 new job-creation entries** (create-002–006): Cloudflare, Accenture (37,000), Cognizant, ThreatLocker, Salesforce
- **18 new source-archive pages** in the new provenance-safe format: same top section (meta grid, details, source link) but article body reduced to a verbatim ≤75-word excerpt + full-page screenshot; no full-text reproduction. Existing pages unchanged (migration planned separately)
- Archive manifest grown 89 → 107 entries; prev/next navigation chain rebuilt across affected pages

### Fixed
- plan-005 Lufthansa date: 2025-12-01 → 2025-11-20 (matches source article)
- plan-007 Meta planned date: 2026-03-14 → 2026-01-13 (matches source article)

### Known gaps (tracked in notes/catch-up-sync-2026-08/)
- 5 archive pages flagged **Needs Manual Capture** (bot-walled sources): C3.ai (Reuters), PwC 2026-02-26 (Bloomberg), Pendo (Axios, screenshot only), PayPal (Bloomberg), Coinbase (NYT — headline also pending)
- Research gap: no data collected for June–August 2026 (sheet last updated 2026-05-26)

## [1.0.0] - 2026-03-17

### Added — Phase 1: Foundation + Phase 2: Main Dashboard
- **Project scaffolding**: React 18 + Vite + TypeScript + Tailwind CSS v4
- **6 interactive pages**:
  - **Dashboard**: Animated total counter (349,708 jobs), cumulative trend line, top 10 job categories bar chart, industry donut chart, sortable company table
  - **Predictions**: Cards for 3mo/6mo/12mo/3-5yr timeframes with risk levels and confidence ranges
  - **Timeline**: Slider/scrubber mode with play/pause/speed controls + Story mode with narrative chapters
  - **AI Advances**: Vertical timeline of AI milestones with type filters (model releases, partnerships, funding, etc.)
  - **Companies**: Searchable company cards with drill-down detail pages showing displacement events and sources
  - **Learn & Prepare**: 6 tabbed sections — Free AI Tools, CRAFT Framework, 30-Day Action Plan, Irreplaceable Skills, Free Courses (7 resources), Privacy & Safety
- **Seed data**: 24 verified displacement events + 25 AI milestones (Nov 2022 – Mar 2026)
- **Prediction data**: 8 predictions across all timeframes
- **GitHub Pages deploy workflow** (.github/workflows/deploy.yml)
- **Responsive design**: Mobile, tablet, and desktop layouts
- **SEO**: Meta tags, Open Graph, Twitter card
- **Data architecture**: Static JSON files in data/verified/, fetched at runtime via useData hook

### Tech Stack
- React 18, Vite 8, TypeScript 5.9
- Tailwind CSS v4 (PostCSS), Recharts, Framer Motion
- React Router (HashRouter for GitHub Pages), react-helmet-async
