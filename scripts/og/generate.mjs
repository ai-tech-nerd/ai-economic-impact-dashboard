/**
 * Deploy step (after vite build + prerender-seo): renders every share image
 * into dist/og/ from live data, and adds share tags to the deployed copies of
 * the static Source Archive pages. Image paths are fixed so prerender-seo can
 * reference them without running this first:
 *   /og/<route>.png, /og/company/<id>.png, /og/archive/<dir>.png
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dashboardCard, companyCard, archiveCard, routeCard, renderPng, fmt } from "./cards.mjs";
import {
  events,
  neverCreated,
  milestones,
  predictions,
  archive,
  companyRecords,
} from "./site-data.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIST = resolve(ROOT, "dist");
const OG = resolve(DIST, "og");
export const SITE = "https://aishift.michaelkristof.com";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const compact = (n) =>
  n >= 1e6 ? `${+(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n);
const shorten = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const TIMEFRAME = { "3-months": "3 months", "6-months": "6 months", "12-months": "12 months", "3-5-years": "3–5 years" };
const timeframe = (t) => TIMEFRAME[t] ?? t;
const longDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

async function write(file, element) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, await renderPng(element));
}

// ---- shared stats (same conventions as getHeroBreakdown)
const realEvents = events.filter((e) => !e.isProjection);
const layoffs = realEvents.reduce((s, e) => s + e.jobsCut, 0);
const neverCounted = neverCreated
  .filter((e) => e.status === "verified" && !e.isProjection)
  .reduce((s, e) => s + e.jobsNeverCreated, 0);
const robotics = realEvents
  .filter((e) => e.displacementMode === "robotics")
  .reduce((s, e) => s + e.jobsCut, 0);
const companiesWithLayoffs = new Set(realEvents.map((e) => e.company)).size;
const monthly = {};
for (const e of realEvents) monthly[e.date.slice(0, 7)] = (monthly[e.date.slice(0, 7)] || 0) + e.jobsCut;
let running = 0;
const trend = Object.keys(monthly).sort().map((m) => (running += monthly[m]));

const companies = companyRecords();

// ---- section pages
const biggestPrediction = [...predictions].sort(
  (a, b) => b.estimatedJobsAtRisk.high - a.estimatedJobsAtRisk.high,
)[0];
const latestReleases = milestones
  .filter((m) => m.type === "model-release" || m.types?.includes("model-release"))
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);
const topCompanies = companies.filter((c) => c.jobs > 0).sort((a, b) => b.jobs - a.jobs).slice(0, 3);
const latestEvent = [...realEvents].sort((a, b) => b.date.localeCompare(a.date))[0];

const ROUTE_CARDS = {
  index: dashboardCard({
    total: layoffs + neverCounted,
    layoffs,
    neverCreated: neverCounted,
    robotics,
    companies: companiesWithLayoffs,
    trend,
  }),
  predictions: routeCard({
    kicker: "AI JOB LOSS PREDICTIONS",
    title: "Will AI Take My Job?",
    bigValue: `${compact(biggestPrediction.estimatedJobsAtRisk.low)}–${compact(biggestPrediction.estimatedJobsAtRisk.high)}`,
    bigLabel: `${biggestPrediction.jobType.replace(/\s*\(.*\)/, "").toLowerCase()} jobs at risk in ${timeframe(biggestPrediction.timeframe)}`,
    bigColor: "amber",
    chips: [...predictions]
      .filter((p) => p.riskLevel === "high" && p.id !== biggestPrediction.id)
      .slice(0, 3)
      .map((p) => [timeframe(p.timeframe), p.jobType.replace(/\s*\(.*\)/, ""), "text"]),
  }),
  timeline: routeCard({
    kicker: "AI LAYOFFS TIMELINE",
    title: "Jobs Lost to AI, Month by Month",
    bigValue: fmt(layoffs + neverCounted),
    bigLabel: "jobs displaced since Nov 2022",
    trend,
    chips: [
      ["Layoff events", fmt(realEvents.length), "text"],
      ["Companies", fmt(companiesWithLayoffs), "text"],
      ["Latest", shorten(latestEvent.companyName, 20), "red"],
    ],
  }),
  "ai-advances": routeCard({
    kicker: "AI ADVANCES TIMELINE",
    title: "Every Major AI Model, Breakthrough & Deal",
    bigValue: fmt(milestones.length),
    bigLabel: "milestones tracked",
    chips: latestReleases.map((m) => [
      longDate(m.date),
      shorten(
        (m.name || m.title)
          .replace(/^.*?\b(Releases|Introduces|Announces)\s+/, "")
          .split(/:| for | and | with /)[0],
        30,
      ),
      "blue",
    ]),
  }),
  companies: routeCard({
    kicker: "AI LAYOFFS BY COMPANY",
    title: "Companies Replacing Workers With AI",
    bigValue: fmt(companiesWithLayoffs),
    bigLabel: "companies with AI-attributed job cuts",
    bigColor: "red",
    chips: topCompanies.map((c) => [shorten(c.name, 18), fmt(c.jobs), "red"]),
  }),
  learn: routeCard({
    kicker: "LEARN & PREPARE",
    title: "How to Prepare for AI Job Displacement",
    chips: [
      ["Free", "AI courses", "green"],
      ["Guides", "Prompting", "blue"],
      ["Plan", "30-day action plan", "teal"],
    ],
  }),
};

function companyElement(c) {
  let headline;
  const chips = [];
  if (c.jobs > 0) {
    headline = { value: fmt(c.jobs), label: "jobs cut, attributed to AI", color: "red" };
    chips.push(["Events", String(c.events.length), "text"]);
    if (c.topCategory) chips.push(["Top category", c.topCategory, "text"]);
    chips.push(c.plannedJobs ? ["Planned", fmt(c.plannedJobs), "amber"] : ["Period", c.period, "text"]);
  } else if (c.plannedJobs > 0) {
    headline = { value: fmt(c.plannedJobs), label: "jobs in planned AI-driven cuts", color: "amber" };
    chips.push(["Planned announcements", String(c.planned.length), "text"]);
  } else if (c.createdJobs > 0) {
    headline = { value: fmt(c.createdJobs), label: "new AI-driven roles announced", color: "green" };
    chips.push(["Announcements", String(c.created.length), "text"]);
  } else {
    headline = { value: fmt(c.milestones.length), label: "AI milestones tracked", color: "blue" };
  }
  if (c.milestones.length && c.jobs === 0) {
    const latest = [...c.milestones].sort((a, b) => b.date.localeCompare(a.date))[0];
    chips.push(["Latest milestone", longDate(latest.date), "text"]);
    const releases = c.milestones.filter((m) => m.type === "model-release").length;
    if (releases) chips.push(["Model releases", String(releases), "blue"]);
  }
  if (!chips.length) chips.push(["Tracked on", "aishift.michaelkristof.com", "text"]);
  return companyCard({ name: c.name, headline, chips: chips.slice(0, 3), robotics: c.robotics });
}

/** Share tags for a static page (used for the Source Archive copies). */
export function shareTags({ title, description, url, image }) {
  return [
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="AI Shift — AI Job Loss Tracker" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n");
}

async function main() {
  if (!existsSync(DIST)) throw new Error("dist/ missing - run vite build first");
  let count = 0;

  for (const [name, element] of Object.entries(ROUTE_CARDS)) {
    await write(resolve(OG, `${name}.png`), element);
    count++;
  }

  for (const c of companies) {
    await write(resolve(OG, "company", `${c.id}.png`), companyElement(c));
    count++;
  }

  let tagged = 0;
  for (const a of archive) {
    await write(
      resolve(OG, "archive", `${a.dir_name}.png`),
      archiveCard({
        company: a.company,
        jobs: a.jobs,
        date: longDate(a.date),
        category: a.category,
        tab: a.tab,
        reason: a.reason || "",
      }),
    );
    count++;
    const page = resolve(DIST, "data", "source-archive", a.dir_name, "index.html");
    if (!existsSync(page)) continue;
    let html = readFileSync(page, "utf8");
    if (html.includes('property="og:image"')) continue;
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || `${a.company} — Source Archive`;
    const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || a.reason || "";
    const tags = shareTags({
      title: title.replace(/&amp;/g, "&"),
      description: description.replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
      url: `${SITE}/data/source-archive/${a.dir_name}/`,
      image: `${SITE}/og/archive/${a.dir_name}.png`,
    });
    html = html.replace("</head>", `${tags}\n</head>`);
    writeFileSync(page, html);
    tagged++;
  }

  console.log(`og: ${count} images (${Object.keys(ROUTE_CARDS).length} pages, ${companies.length} companies, ${archive.length} archive); ${tagged} archive pages tagged`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
