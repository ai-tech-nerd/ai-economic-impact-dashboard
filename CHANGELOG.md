# Changelog

All notable changes to this project will be documented in this file.

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
