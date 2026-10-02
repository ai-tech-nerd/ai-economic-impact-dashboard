#!/usr/bin/env node
/**
 * prerender-seo.mjs — build-time static SEO content injection.
 *
 * Runs after `vite build`. For each main route it writes dist/<route>.html
 * (and updates dist/index.html for "/") containing:
 *   - the route's real <title>, meta description, and canonical URL
 *     (KEEP IN SYNC with the <Seo> components in src/pages/*)
 *   - substantive static HTML inside #root, generated from the verified
 *     JSON data, so crawlers see real content in the raw source.
 *
 * React replaces the static content the moment it mounts (createRoot),
 * so users always get the interactive app — charts included. This is
 * progressive enhancement, not cloaking: the static content mirrors what
 * the app renders.
 *
 * GitHub Pages serves /predictions from predictions.html, so each route
 * returns HTTP 200 with content (the 404.html fallback covers deep links).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const DATA = resolve(ROOT, "public", "data", "verified");
const SITE = "https://aishift.michaelkristof.com";

const loadJson = (name) =>
  JSON.parse(readFileSync(resolve(DATA, name), "utf8"));

const events = loadJson("job-displacement-events.json");
const planned = loadJson("planned-layoffs.json");
const created = loadJson("ai-job-creation.json");
const milestones = loadJson("ai-milestones.json");
const predictions = loadJson("predictions.json");
let dataUpdated = "";
try {
  dataUpdated = loadJson("meta.json").dataLastUpdated || "";
} catch {
  /* optional */
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmt = (n) => Number(n).toLocaleString("en-US");
const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ---- derived stats (mirror src/utils/dataTransformers.ts conventions)
const realEvents = events.filter((e) => !e.isProjection);
const totalJobs = realEvents.reduce((s, e) => s + e.jobsCut, 0);
const companies = new Map();
for (const e of realEvents) {
  const c = companies.get(e.company) || {
    name: e.companyName,
    jobs: 0,
    latest: "",
  };
  c.jobs += e.jobsCut;
  if (e.date > c.latest) c.latest = e.date;
  companies.set(e.company, c);
}
const companyList = [...companies.values()].sort((a, b) => b.jobs - a.jobs);
const plannedTotal = planned.reduce((s, e) => s + e.jobsCut, 0);

const NAV = `<nav><ul>
<li><a href="/">Jobs Lost to AI — Dashboard</a></li>
<li><a href="/predictions">AI Job Loss Predictions</a></li>
<li><a href="/timeline">AI Layoffs Timeline</a></li>
<li><a href="/ai-advances">AI Advances</a></li>
<li><a href="/companies">Companies Replacing Workers With AI</a></li>
<li><a href="/learn">Prepare for AI Job Displacement</a></li>
</ul></nav>`;

const updatedLine = dataUpdated
  ? `<p>Data updated: ${esc(fmtDate(dataUpdated))}.</p>`
  : "";

// ---- per-route static content generators
function dashboardHtml() {
  const roboticsJobs = realEvents
    .filter((e) => e.displacementMode === "robotics")
    .reduce((sum, e) => sum + e.jobsCut, 0);
  const rows = companyList
    .slice(0, 25)
    .map(
      (c) =>
        `<tr><td>${esc(c.name)}</td><td>${fmt(c.jobs)}</td><td>${esc(
          fmtDate(c.latest),
        )}</td></tr>`,
    )
    .join("\n");
  return `<h1>Jobs Lost to AI</h1>
<p>A live tracker of AI-driven layoffs and job losses: <strong>${fmt(totalJobs)} jobs</strong> lost to AI across <strong>${companies.size} companies</strong> in <strong>${realEvents.length} verified events</strong> since ChatGPT launched on November 30, 2022. Every event is verified against company statements, earnings calls, internal memos, or SEC filings — journalist speculation alone never qualifies.</p>
${updatedLine}
<p>Of these, ${fmt(roboticsJobs)} jobs were replaced by AI-powered robots or automation (robotics); the rest by software AI.</p>
<p>A further ${fmt(plannedTotal)} job cuts have been announced or planned across ${planned.length} companies, while ${created.length} companies have announced new AI-driven roles.</p>
<h2>Companies with the most jobs lost to AI</h2>
<table><thead><tr><th>Company</th><th>Jobs cut (AI-attributed)</th><th>Latest event</th></tr></thead><tbody>
${rows}
</tbody></table>
${NAV}`;
}

function predictionsHtml() {
  const items = predictions
    .map(
      (p) =>
        `<li><strong>${esc(p.jobType)}</strong> (${esc(p.timeframe)}, ${esc(
          p.riskLevel,
        )} risk): ${fmt(p.estimatedJobsAtRisk.low)}–${fmt(
          p.estimatedJobsAtRisk.high,
        )} jobs at risk. ${esc(p.basis)}</li>`,
    )
    .join("\n");
  return `<h1>Will AI Take My Job? AI Job Loss Predictions</h1>
<p>Estimated jobs at risk from AI over the next 3 months to 5 years, based on verified AI layoff trends and announced company plans. All figures are projections, not verified events.</p>
${updatedLine}
<ul>
${items}
</ul>
<p>Exposure is not job loss: Anthropic research (Sept 2026) estimates about 80% of US work tasks are exposed to LLMs or robots, but robots are cost-competitive with people for only 0.3% of tasks today. The most robot-exposed jobs are physical, mainly driving and warehouse work.</p>
${NAV}`;
}

function timelineHtml() {
  const byYear = {};
  for (const e of realEvents) {
    const y = e.date.slice(0, 4);
    byYear[y] = (byYear[y] || 0) + e.jobsCut;
  }
  const yearRows = Object.entries(byYear)
    .sort()
    .map(([y, n]) => `<li>${y}: ${fmt(n)} jobs lost to AI</li>`)
    .join("\n");
  const biggest = [...realEvents]
    .sort((a, b) => b.jobsCut - a.jobsCut)
    .slice(0, 15)
    .map(
      (e) =>
        `<li>${esc(fmtDate(e.date))} — <strong>${esc(
          e.companyName,
        )}</strong>: ${fmt(e.jobsCut)} jobs. ${esc(e.reasonGiven || "")}</li>`,
    )
    .join("\n");
  return `<h1>AI Layoffs Timeline — Jobs Lost to AI Since ChatGPT</h1>
<p>AI job losses month by month since ChatGPT launched in November 2022, totaling ${fmt(totalJobs)} verified jobs lost to AI.</p>
${updatedLine}
<h2>Jobs lost to AI by year</h2>
<ul>${yearRows}</ul>
<h2>Largest AI layoff events</h2>
<ul>
${biggest}
</ul>
${NAV}`;
}

function advancesHtml() {
  const recent = [...milestones]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 25)
    .map(
      (m) =>
        `<li>${esc(fmtDate(m.date))} — <strong>${esc(
          m.name || m.title || "",
        )}</strong>${m.publicRelease ? " (public release)" : ""}: ${esc(
          m.description || "",
        )}</li>`,
    )
    .join("\n");
  return `<h1>AI Advances Timeline</h1>
<p>${milestones.length} major AI milestones — model releases, breakthroughs, launches, regulation, partnerships, and acquisitions — tracked from before ChatGPT's public release (November 30, 2022) to today. Newest first.</p>
${updatedLine}
<h2>Latest AI advances</h2>
<ul>
${recent}
</ul>
${NAV}`;
}

function companiesHtml() {
  const rows = companyList
    .map((c) => `<li><strong>${esc(c.name)}</strong>: ${fmt(c.jobs)} jobs cut (latest: ${esc(fmtDate(c.latest))})</li>`)
    .join("\n");
  return `<h1>Companies Replacing Workers With AI</h1>
<p>${companies.size} companies with verified AI-attributed job cuts, totaling ${fmt(totalJobs)} jobs lost to AI. Each entry is backed by company statements and primary sources.</p>
${updatedLine}
<ul>
${rows}
</ul>
${NAV}`;
}

function learnHtml() {
  return `<h1>How to Prepare for AI Job Displacement</h1>
<p>Free, practical resources to future-proof your career as AI reshapes the job market: free AI tools worth learning, the CRAFT prompting framework, a 30-day action plan, the skills AI cannot easily replace, free AI courses, and privacy &amp; safety guidance. No sign-up required.</p>
${NAV}`;
}

// ---- route table (titles/descriptions KEEP IN SYNC with src <Seo> usage)
const ROUTES = [
  {
    file: "index.html",
    path: "/",
    title: "Jobs Lost to AI — Live AI Layoffs & Job Losses Tracker",
    description:
      "Live tracker of jobs lost to AI: verified AI layoffs, AI job losses, and companies replacing workers with AI. Real numbers from company statements, earnings calls, and SEC filings — updated regularly, free, no sign-up.",
    html: dashboardHtml,
  },
  {
    file: "predictions.html",
    path: "/predictions",
    title: "Will AI Take My Job? AI Job Loss Predictions & Jobs at Risk",
    description:
      "AI job loss predictions: which jobs are most at risk from AI over the next 3 months to 5 years. Estimated jobs at risk by role and industry, based on verified AI layoff trends and announced company plans.",
    html: predictionsHtml,
  },
  {
    file: "timeline.html",
    path: "/timeline",
    title: "AI Layoffs Timeline — Jobs Lost to AI Since ChatGPT (2022–Now)",
    description:
      "Interactive AI layoffs timeline: watch AI job losses unfold month by month since ChatGPT launched in November 2022. Every event verified against company statements, with planned layoffs and AI job creation alongside.",
    html: timelineHtml,
  },
  {
    file: "ai-advances.html",
    path: "/ai-advances",
    title: "AI Advances Timeline — AI Breakthroughs, Model Releases & News",
    description:
      "Timeline of major AI advances: model releases, breakthroughs, product launches, regulation, partnerships, and acquisitions — from ChatGPT's launch to the latest frontier models, newest first.",
    html: advancesHtml,
  },
  {
    file: "companies.html",
    path: "/companies",
    title: "Companies Replacing Workers With AI — AI Layoffs by Company",
    description:
      "Which companies are replacing workers with AI? Browse AI layoffs by company: verified job cuts, planned AI-driven layoffs, hiring freezes, and new AI roles — each backed by company statements and primary sources.",
    html: companiesHtml,
  },
  {
    file: "learn.html",
    path: "/learn",
    title: "How to Prepare for AI Job Displacement — Learn & Prepare",
    description:
      "How to prepare for AI job displacement: free AI courses, prompting guides, AI tools, and an action plan to future-proof your career as AI reshapes the job market. No sign-up required.",
    html: learnHtml,
  },
];

const shell = readFileSync(resolve(DIST, "index.html"), "utf8");
if (!shell.includes('<div id="root">')) {
  throw new Error('dist/index.html has no <div id="root"> mount point');
}

for (const route of ROUTES) {
  let html = shell;
  // Per-route title / description / canonical / og tags in the raw HTML.
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`);
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${esc(route.description)}$2`,
  );
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${SITE}${route.path === "/" ? "/" : route.path}$2`,
  );
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${esc(route.title)}$2`,
  );
  html = html.replace(
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${esc(route.description)}$2`,
  );
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${SITE}${route.path === "/" ? "/" : route.path}$2`,
  );
  // Static content inside #root — replaced by React on mount.
  html = html.replace(
    '<div id="root">',
    `<div id="root">${route.html()}`,
  );
  writeFileSync(resolve(DIST, route.file), html);
  console.log(`prerendered ${route.file} (${route.path})`);
}
console.log("prerender-seo: done");
