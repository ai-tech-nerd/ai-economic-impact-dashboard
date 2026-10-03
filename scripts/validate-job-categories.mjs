/**
 * Fails the build if any displacement or planned entry uses a job category
 * outside the canonical list. Run in deploy before the Vite build.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { JOB_CATEGORIES } from "./job-categories.mjs";

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "data", "verified");
const allowed = new Set(JOB_CATEGORIES);
const bad = [];
for (const file of ["job-displacement-events.json", "planned-layoffs.json"]) {
  for (const entry of JSON.parse(readFileSync(resolve(DATA, file), "utf8"))) {
    for (const jt of entry.jobTypes ?? []) {
      if (!allowed.has(jt)) bad.push(`${file} ${entry.id}: "${jt}"`);
    }
  }
}
if (bad.length) {
  console.error(`Non-canonical job categories (allowed: ${JOB_CATEGORIES.join(", ")}):\n  ${bad.join("\n  ")}`);
  process.exit(1);
}
console.log("Job categories OK");
