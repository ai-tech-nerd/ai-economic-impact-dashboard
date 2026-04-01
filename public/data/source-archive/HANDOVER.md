# Source Archive -- Handover Documentation

## Overview
78 archived event pages documenting AI-attributed job losses, planned layoffs, hiring freezes, and job creation. Each event has a self-contained HTML page, a source page screenshot, and the original article text.

## Directory Structure

```
public/data/source-archive/
  index.html                          Master index (filterable list of all events)
  style.css                           Shared CSS (light theme, blog-post layout)
  app.js                              Filter/search JS for the index page
  archive-manifest.json               Machine-readable manifest of all 78 entries
  HANDOVER.md                         This file

  txt/                                Archived article text files
    2026-01-13-meta.txt
    2026-03-20-crypto-com.txt
    ...

  2026-01-13-meta/                    Event directories (date-first naming)
    index.html                        Self-contained event page
    2026-01-13-meta-screenshot.png    Source page screenshot

  2026-03-20-crypto-com/
    index.html
    2026-03-20-crypto-com-screenshot.png

  ... (78 directories total)
```

## Naming Convention

- Directory name: `YYYY-MM-DD-company-slug`
- Screenshot: `YYYY-MM-DD-company-slug-screenshot.png`
- Article text: `YYYY-MM-DD-company-slug.txt` (in /txt/ directory)
- Same-day collisions get a suffix: `-planned`, `-created`, or `-layoff`
  - Example: `2023-05-01-ibm` (hiring freeze) and `2023-05-01-ibm-planned` (planned cuts)

## Event Types (tab field in manifest)

| Tab value | Description | Badge |
|-----------|-------------|-------|
| `main`    | Confirmed/actual layoffs and active hiring freezes | None |
| `planned` | Forward-looking announcements and planned cuts | Orange "PLANNED" |
| `created` | AI-related job creation | Green "CREATED" |

## Manifest Schema (archive-manifest.json)

Each entry contains:
```json
{
  "dir_name": "2026-03-20-crypto-com",
  "old_slug": "crypto-com-20260320",
  "date": "2026-03-20",
  "company": "Crypto.com",
  "jobs": "~12% of workforce",
  "category": "Mixed / Company-wide",
  "tab": "main",
  "type": "layoff",
  "reason": "CEO quote and context...",
  "source_url": "https://www.cnbc.com/...",
  "screenshot_file": "2026-03-20-crypto-com-screenshot.png",
  "article_file": "2026-03-20-crypto-com.txt"
}
```

## Article Text File Format

```
SOURCE URL: https://...
TITLE: Article Headline
PUBLISHED: YYYY-MM-DD
================================================================================

Article body text, one paragraph per block of text...
```

## Event Page Structure (index.html)

Each event page is fully self-contained static HTML. Layout from top to bottom:
1. Dark header bar with "AI Job Loss -- Source Archive" link
2. Back-to-archive link
3. Company name heading (with badge for planned/created)
4. Meta grid: Date, Jobs Affected, Category, Type
5. Details section: reason/quote with blue left border
6. Source link (inline: "SOURCE [arrow] www.domain.com")
7. Article headline + published date
8. Article body as HTML paragraphs
9. Screenshot accordion (collapsed by default, click to expand)
10. Archived timestamp
11. Prev/next navigation

## CSS Theme

Light theme matching the AI Impact Tracker dashboard:
- Background: #f8f9fb (light gray)
- Cards/panels: #ffffff
- Header bar: #1a1f36 (dark navy)
- Accent: #4a6cf7 (blue)
- Planned accent: #e6850a (orange)
- Created accent: #0d9668 (green)
- Content max-width: 720px (event pages), 960px (index)
- Font: Inter

## Hiring Freeze Convention

Companies with hiring freezes use an asterisk in the name (e.g., "IBM*") and prefix the reason with "*HIRING FREEZE -- Economic impact, not direct layoffs."
