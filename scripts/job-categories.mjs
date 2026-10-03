/**
 * Canonical job categories for displacement data (owner-approved 2026-10-03).
 * Every jobTypes value in job-displacement-events.json and planned-layoffs.json
 * must be one of these slugs; original wording lives in jobTypesDetail.
 * Shared by the validation test (scripts/validate-job-categories.mjs).
 */
export const JOB_CATEGORIES = [
  'operations',
  'administrative',
  'company-wide',
  'engineering-technology',
  'hr-recruiting',
  'sales-marketing',
  'customer-support',
  'finance-accounting',
  'product-design',
  'content-data',
  'management',
  'legal',
  'manufacturing-field',
];
