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
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { companyRecords } from "./og/site-data.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const DATA = resolve(ROOT, "public", "data", "verified");
const SITE = "https://aishift.michaelkristof.com";

const loadJson = (name) =>
  JSON.parse(readFileSync(resolve(DATA, name), "utf8"));

const events = loadJson("job-displacement-events.json");
const planned = loadJson("planned-layoffs.json");
const created = loadJson("ai-job-creation.json");
const neverCreated = loadJson("jobs-never-created.json");
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
const layoffJobs = realEvents.reduce((s, e) => s + e.jobsCut, 0);
// Headline = layoffs + Jobs Never Created already lost (future estimates and
// disputed figures excluded). Must match DashboardPage's total.
const neverCounted = neverCreated.filter((e) => e.status === "verified" && !e.isProjection);
const neverCountedJobs = neverCounted.reduce((s, e) => s + e.jobsNeverCreated, 0);
const neverFutureJobs = neverCreated
  .filter((e) => e.status === "verified" && e.isProjection)
  .reduce((s, e) => s + e.jobsNeverCreated, 0);
const totalJobs = layoffJobs + neverCountedJobs;
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
  const neverCreatedLine = neverCreated.length
    ? `<p>The total combines ${fmt(layoffJobs)} jobs lost to layoffs and ${fmt(neverCountedJobs)} jobs never created: work companies gave to AI or robots instead of filling the role. A further ${fmt(neverFutureJobs)} jobs never created are company-stated future estimates and are not included in the total.</p>`
    : "";
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
<p>A live tracker of AI-driven layoffs and job losses: <strong>${fmt(totalJobs)} jobs</strong> displaced by AI across <strong>${companies.size} companies</strong>, including <strong>${realEvents.length} verified layoff events</strong> since ChatGPT launched on November 30, 2022. Every event is verified against company statements, earnings calls, internal memos, or SEC filings — journalist speculation alone never qualifies.</p>
${updatedLine}
<p>Of these, ${fmt(roboticsJobs)} jobs were replaced by AI-powered robots or automation (robotics); the rest by software AI.</p>
${neverCreatedLine}
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

/** Point every head tag at this page: title, description, canonical, OG, Twitter, image. */
function applyHead(html, { title, description, path, image }) {
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const set = (re, value) => {
    if (!re.test(html)) throw new Error(`prerender-seo: head tag missing for ${re}`);
    html = html.replace(re, `$1${value}$2`);
  };
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  set(/(<meta name="description" content=")[^"]*(")/, esc(description));
  set(/(<link rel="canonical" href=")[^"]*(")/, url);
  set(/(<meta property="og:title" content=")[^"]*(")/, esc(title));
  set(/(<meta property="og:description" content=")[^"]*(")/, esc(description));
  set(/(<meta property="og:url" content=")[^"]*(")/, url);
  set(/(<meta property="og:image" content=")[^"]*(")/, image);
  set(/(<meta property="og:image:alt" content=")[^"]*(")/, esc(title));
  set(/(<meta name="twitter:title" content=")[^"]*(")/, esc(title));
  set(/(<meta name="twitter:description" content=")[^"]*(")/, esc(description));
  set(/(<meta name="twitter:image" content=")[^"]*(")/, image);
  return html;
}

const routeImage = (file) => `${SITE}/og/${file.replace(/\.html$/, "")}.png`;

for (const route of ROUTES) {
  let html = applyHead(shell, { ...route, image: routeImage(route.file) });
  // Static content inside #root — replaced by React on mount.
  html = html.replace('<div id="root">', `<div id="root">${route.html()}`);
  writeFileSync(resolve(DIST, route.file), html);
  console.log(`prerendered ${route.file} (${route.path})`);
}

// ---- company pages: GitHub Pages serves /companies/<id> from companies/<id>.html
mkdirSync(resolve(DIST, "companies"), { recursive: true });
const companyPages = companyRecords();
for (const c of companyPages) {
  const path = `/companies/${c.id}`;
  const title =
    c.jobs > 0
      ? `${c.name} AI Layoffs: ${fmt(c.jobs)} Jobs Cut — Jobs Lost to AI`
      : `${c.name} AI Milestones & Workforce Impact — Jobs Lost to AI`;
  const parts = [];
  if (c.jobs > 0) parts.push(`${fmt(c.jobs)} jobs cut across ${c.events.length} verified AI-attributed event${c.events.length === 1 ? "" : "s"}`);
  if (c.plannedJobs > 0) parts.push(`${fmt(c.plannedJobs)} jobs in planned cuts`);
  if (c.createdJobs > 0) parts.push(`${fmt(c.createdJobs)} new AI-driven roles`);
  if (c.milestones.length) parts.push(`${c.milestones.length} AI milestone${c.milestones.length === 1 ? "" : "s"}`);
  const description = `${c.name}: ${parts.join(", ") || "AI workforce impact"}. Verified from company statements and primary sources.`;
  const list = (items, render) => (items.length ? `<ul>\n${items.map(render).join("\n")}\n</ul>` : "");
  const body = `<h1>${esc(c.name)}: AI Layoffs and Workforce Impact</h1>
<p>${esc(description)}</p>
${c.events.length ? `<h2>AI-attributed job cuts</h2>` : ""}
${list(c.events, (e) => `<li>${esc(fmtDate(e.date))}: ${fmt(e.jobsCut)} jobs. ${esc(e.reasonGiven || "")}</li>`)}
${c.planned.length ? `<h2>Planned cuts and hiring freezes</h2>` : ""}
${list(c.planned, (e) => `<li>${esc(fmtDate(e.date))}: ${fmt(e.jobsCut)} jobs. ${esc(e.reasonGiven || "")}</li>`)}
${c.milestones.length ? `<h2>AI milestones</h2>` : ""}
${list(c.milestones.slice(-15).reverse(), (m) => `<li>${esc(fmtDate(m.date))}: ${esc(m.name || m.title)}</li>`)}
${NAV}`;
  let html = applyHead(shell, { title, description, path, image: `${SITE}/og/company/${c.id}.png` });
  html = html.replace('<div id="root">', `<div id="root">${body}`);
  writeFileSync(resolve(DIST, "companies", `${c.id}.html`), html);
}
// /companies.html and the companies/ folder now coexist; GitHub Pages may
// resolve /companies to the folder, so give it the same listing page.
writeFileSync(resolve(DIST, "companies", "index.html"), readFileSync(resolve(DIST, "companies.html"), "utf8"));
console.log(`prerendered ${companyPages.length} company pages`);

// ---- sitemap: main routes + company pages
const lastmod = dataUpdated || new Date().toISOString().slice(0, 10);
const sitemapUrls = [
  ...ROUTES.map((r) => ({ loc: `${SITE}${r.path === "/" ? "/" : r.path}`, freq: r.path === "/" ? "daily" : "weekly", pri: r.path === "/" ? "1.0" : "0.8" })),
  ...companyPages.map((c) => ({ loc: `${SITE}/companies/${c.id}`, freq: "weekly", pri: "0.6" })),
];
writeFileSync(
  resolve(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`,
);
console.log(`sitemap: ${sitemapUrls.length} urls`);
console.log("prerender-seo: done");
