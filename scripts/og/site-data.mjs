/**
 * Shared build-time data for share images and static company pages.
 * Mirrors the app's company listing (src/pages/CompanyPage.tsx): every
 * company key found in milestones, layoffs, planned or creation data,
 * minus country/jurisdiction slugs. Display names and the jurisdiction list
 * are parsed from CompanyPage.tsx so the two can't drift apart.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA = resolve(ROOT, "public", "data", "verified");
const load = (name) => JSON.parse(readFileSync(resolve(DATA, name), "utf8"));

export const events = load("job-displacement-events.json");
export const planned = load("planned-layoffs.json");
export const created = load("ai-job-creation.json");
export const neverCreated = load("jobs-never-created.json");
export const milestones = load("ai-milestones.json");
export const predictions = load("predictions.json");
export const archive = JSON.parse(
  readFileSync(resolve(ROOT, "public", "data", "source-archive", "archive-manifest.json"), "utf8"),
);

const companySrc = readFileSync(resolve(ROOT, "src", "pages", "CompanyPage.tsx"), "utf8");
const displayBlock = companySrc.slice(
  companySrc.indexOf("const COMPANY_DISPLAY"),
  companySrc.indexOf("const COUNTRY_SLUGS"),
);
const DISPLAY_NAMES = Object.fromEntries(
  [...displayBlock.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{\s*\n\s*name:\s*'((?:[^'\\]|\\.)*)'/gm)].map(
    ([, key, name]) => [key, name.replace(/\\'/g, "'")],
  ),
);
const countryBlock = companySrc.slice(companySrc.indexOf("const COUNTRY_SLUGS"));
const COUNTRY_SLUGS = new Set(
  [...countryBlock.slice(0, countryBlock.indexOf("]);")).matchAll(/'([a-z-]+)'/g)].map((m) => m[1]),
);
if (Object.keys(DISPLAY_NAMES).length < 10 || COUNTRY_SLUGS.size < 5) {
  throw new Error("site-data: failed to parse COMPANY_DISPLAY / COUNTRY_SLUGS from CompanyPage.tsx");
}

export const JOB_LABELS = {
  operations: "Operations",
  administrative: "Admin & Back Office",
  "company-wide": "Company-wide",
  "engineering-technology": "Engineering & Tech",
  "hr-recruiting": "HR & Recruiting",
  "sales-marketing": "Sales & Marketing",
  "customer-support": "Customer Support",
  "finance-accounting": "Finance & Accounting",
  "product-design": "Product & Design",
  "content-data": "Content & Data",
  management: "Management",
  legal: "Legal",
  "manufacturing-field": "Manufacturing & Field",
};

const prettify = (slug) =>
  slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

const monthYear = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

/** One record per company page, with the stats the share card and static page need. */
export function companyRecords() {
  const realEvents = events.filter((e) => !e.isProjection);
  const keys = new Set(
    [...milestones, ...realEvents, ...planned, ...created].map((e) => e.company),
  );
  const nameFromData = {};
  for (const e of [...realEvents, ...planned, ...created]) {
    if (e.companyName && !nameFromData[e.company]) nameFromData[e.company] = e.companyName;
  }
  return [...keys]
    .filter((key) => key && !COUNTRY_SLUGS.has(key))
    .map((key) => {
      const ev = realEvents.filter((e) => e.company === key).sort((a, b) => a.date.localeCompare(b.date));
      const pl = planned.filter((e) => e.company === key);
      const cr = created.filter((e) => e.company === key);
      const ms = milestones.filter((m) => m.company === key);
      const cat = {};
      for (const e of ev) for (const jt of e.jobTypes) cat[jt] = (cat[jt] || 0) + e.jobsCut;
      const topSlug = Object.entries(cat).sort((a, b) => b[1] - a[1])[0]?.[0];
      return {
        id: key,
        name: DISPLAY_NAMES[key] || nameFromData[key] || prettify(key),
        jobs: ev.reduce((s, e) => s + e.jobsCut, 0),
        events: ev,
        plannedJobs: pl.reduce((s, e) => s + e.jobsCut, 0),
        planned: pl,
        created: cr,
        createdJobs: cr.reduce((s, e) => s + (e.jobsCreated ?? 0), 0),
        milestones: ms,
        topCategory: topSlug ? JOB_LABELS[topSlug] || topSlug : null,
        robotics: [...ev, ...pl].some((e) => e.displacementMode === "robotics"),
        period: ev.length
          ? monthYear(ev[0].date) === monthYear(ev.at(-1).date)
            ? monthYear(ev[0].date)
            : `${monthYear(ev[0].date)} – ${monthYear(ev.at(-1).date)}`
          : null,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
