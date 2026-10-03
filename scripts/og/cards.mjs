/**
 * Social share card templates (1200x630) rendered with satori -> resvg.
 * Templates are plain element objects (no JSX) so this runs in plain Node
 * during deploy. Styling mirrors the dashboard hero (dark slate, blue total,
 * violet robotics, teal jobs-never-created, amber planned).
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const font = (weight) =>
  readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
const FONTS = [400, 600, 700, 800].map((weight) => ({
  name: "Inter",
  data: font(weight),
  weight,
  style: "normal",
}));

export const W = 1200;
export const H = 630;

const C = {
  bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  text: "#f8fafc",
  muted: "#94a3b8",
  faint: "#64748b",
  blue: "#60a5fa",
  violet: "#a78bfa",
  teal: "#2dd4bf",
  amber: "#fbbf24",
  green: "#4ade80",
  red: "#f87171",
  tile: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
};

/** Minimal hyperscript for satori element objects. */
const h = (type, style, ...children) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.flat().filter((c) => c !== null && c !== false) },
});
const text = (value, style) => h("div", style, String(value));

export const fmt = (n) => Number(n).toLocaleString("en-US");

function frame(children, { footer = "aishift.michaelkristof.com" } = {}) {
  return h(
    "div",
    {
      width: W,
      height: H,
      flexDirection: "column",
      background: C.bg,
      padding: "56px 64px",
      fontFamily: "Inter",
      color: C.text,
    },
    h(
      "div",
      { alignItems: "center", gap: 14 },
      text("AI Impact", { fontSize: 28, fontWeight: 800 }),
      text("TRACKER", {
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 2,
        color: "#0f172a",
        background: C.blue,
        borderRadius: 999,
        padding: "5px 14px",
      }),
    ),
    h("div", { flexDirection: "column", flexGrow: 1 }, children),
    h(
      "div",
      { justifyContent: "space-between", alignItems: "center", color: C.faint, fontSize: 20 },
      text(footer, {}),
      text("Verified from company statements & filings", {}),
    ),
  );
}

function sparkline(points, { width = 1072, height = 120, color = C.blue } = {}) {
  if (points.length < 2) return null;
  const max = Math.max(...points) || 1;
  const step = width / (points.length - 1);
  const xy = points.map((v, i) => [i * step, height - (v / max) * (height - 6) - 3]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return {
    type: "svg",
    props: {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      children: [
        { type: "path", props: { d: area, fill: color, fillOpacity: 0.18 } },
        { type: "path", props: { d: line, stroke: color, strokeWidth: 4, fill: "none" } },
      ],
    },
  };
}

function chip(label, value, color) {
  return h(
    "div",
    {
      flexDirection: "column",
      background: C.tile,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: "14px 22px",
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      overflow: "hidden",
    },
    text(label, { fontSize: 17, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase" }),
    text(value, { fontSize: value.length > 12 ? 26 : 36, fontWeight: 800, color, marginTop: 4 }),
  );
}

/** Dashboard / site-wide card. */
export function dashboardCard({ total, layoffs, neverCreated, robotics, companies, trend }) {
  return frame([
    text("TOTAL JOBS DISPLACED BY AI", {
      marginTop: 34,
      fontSize: 22,
      letterSpacing: 3,
      color: C.muted,
      fontWeight: 600,
    }),
    text(fmt(total), { fontSize: 132, fontWeight: 800, color: C.blue, lineHeight: 1.05 }),
    text(`Since ChatGPT's launch · ${companies} companies`, { fontSize: 26, color: C.muted, marginTop: 2 }),
    h("div", { marginTop: 18 }, sparkline(trend, { height: 70 })),
    h(
      "div",
      { gap: 16, marginTop: 18, marginBottom: 22 },
      chip("Layoffs", fmt(layoffs), C.text),
      chip("Jobs never created", fmt(neverCreated), C.teal),
      chip("Robotics", fmt(robotics), C.violet),
    ),
  ]);
}

/**
 * One company. `headline` is the main stat: jobs cut for companies with
 * layoffs, otherwise planned cuts, jobs created, or AI milestones.
 */
export function companyCard({ name, headline, chips, robotics }) {
  return frame([
    h(
      "div",
      { alignItems: "center", gap: 14, marginTop: 40 },
      text("COMPANY PROFILE", { fontSize: 22, letterSpacing: 3, color: C.muted, fontWeight: 600 }),
      robotics
        ? text("ROBOTICS", {
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#2e1065",
            background: C.violet,
            borderRadius: 8,
            padding: "4px 10px",
          })
        : null,
    ),
    text(name, { fontSize: name.length > 28 ? 60 : name.length > 20 ? 76 : 96, fontWeight: 800, lineHeight: 1.05, marginTop: 6 }),
    h(
      "div",
      { alignItems: "baseline", gap: 18, marginTop: 14 },
      text(headline.value, { fontSize: 88, fontWeight: 800, color: C[headline.color] ?? headline.color }),
      text(headline.label, { fontSize: 34, color: C.muted }),
    ),
    h(
      "div",
      { gap: 16, marginTop: "auto", marginBottom: 26 },
      chips.map(([label, value, color]) => chip(label, value, C[color] ?? C.text)),
    ),
  ]);
}

/** Section pages (predictions, timeline, AI advances, companies, learn). */
export function routeCard({ kicker, title, bigValue, bigLabel, bigColor = "blue", chips = [], trend }) {
  return frame([
    text(kicker, { marginTop: 34, fontSize: 22, letterSpacing: 3, color: C.muted, fontWeight: 600 }),
    text(title, { fontSize: title.length > 26 ? 58 : 72, fontWeight: 800, lineHeight: 1.08, marginTop: 6 }),
    bigValue
      ? h(
          "div",
          { alignItems: "baseline", gap: 16, marginTop: 10 },
          text(bigValue, { fontSize: 72, fontWeight: 800, color: C[bigColor] ?? bigColor, whiteSpace: "nowrap", flexShrink: 0 }),
          text(bigLabel, { fontSize: 30, color: C.muted, flexShrink: 1 }),
        )
      : null,
    trend ? h("div", { marginTop: 12 }, sparkline(trend, { height: 60 })) : null,
    chips.length
      ? h(
          "div",
          { gap: 16, marginTop: "auto", marginBottom: 26 },
          chips.map(([label, value, color]) => chip(label, value, C[color] ?? C.text)),
        )
      : null,
  ]);
}

const TAB_STYLE = {
  main: { label: "LAYOFF", color: C.red },
  planned: { label: "PLANNED", color: C.amber },
  created: { label: "JOBS CREATED", color: C.green },
  never: { label: "JOBS NEVER CREATED", color: C.teal },
};

/** One Source Archive page. */
export function archiveCard({ company, jobs, date, category, tab, reason }) {
  const style = TAB_STYLE[tab] ?? TAB_STYLE.main;
  // Our summary, not a verbatim quote: no quotation marks; cut on a word boundary.
  const crowded = company.length > 30 || jobs.length > 28;
  const max = crowded ? 100 : 150;
  const snippet =
    reason.length > max ? `${reason.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:.]+$/, "")}…` : reason;
  return frame([
    h(
      "div",
      { alignItems: "center", gap: 14, marginTop: 40 },
      text("SOURCE ARCHIVE", { fontSize: 22, letterSpacing: 3, color: C.muted, fontWeight: 600 }),
      text(style.label, {
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: 2,
        color: "#0f172a",
        background: style.color,
        borderRadius: 8,
        padding: "4px 10px",
      }),
    ),
    text(company, {
      fontSize: company.length > 30 ? 52 : company.length > 22 ? 68 : 88,
      fontWeight: 800,
      lineHeight: 1.05,
      marginTop: 6,
    }),
    h(
      "div",
      { alignItems: "baseline", gap: 18, marginTop: 10 },
      text(jobs, {
        fontSize: jobs.length > 28 ? 34 : jobs.length > 18 ? 44 : 64,
        fontWeight: 800,
        color: style.color,
        flexShrink: 1,
      }),
      text(date, { fontSize: 28, color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }),
    ),
    text(category, { fontSize: 26, color: C.muted, marginTop: 8 }),
    text(snippet, {
      fontSize: 26,
      color: C.text,
      marginTop: "auto",
      marginBottom: 26,
      lineHeight: 1.35,
      borderLeft: `4px solid ${style.color}`,
      paddingLeft: 20,
    }),
  ]);
}

export async function renderPng(element) {
  const svg = await satori(element, { width: W, height: H, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
}
