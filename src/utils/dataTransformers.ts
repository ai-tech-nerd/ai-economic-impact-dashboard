import type { DisplacementEvent, AIMilestone, NeverCreatedEntry } from '../types';

export function getTopJobTypes(events: DisplacementEvent[], limit = 10) {
  const counts: Record<string, number> = {};
  for (const evt of events.filter((e) => !e.isProjection)) {
    for (const jt of evt.jobTypes) {
      counts[jt] = (counts[jt] || 0) + evt.jobsCut;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([type, count]) => ({ type, count }));
}

const INDUSTRY_GROUP: Record<string, string> = {
  'Financial Technology': 'Finance',
  'Financial Services': 'Finance',
  'Technology / Financial Software': 'Finance',
  'Technology / Advertising': 'Technology',
  'Technology / Cloud Storage': 'Technology',
  'Technology / E-commerce': 'Technology',
  'Technology / Enterprise Software': 'Technology',
  'Technology / Gaming': 'Technology',
  'Technology / SaaS': 'Technology',
  'Education Technology': 'Education',
  'Healthcare Technology': 'Healthcare',
  'Media / News': 'Media',
  'Media / PR Technology': 'Media',
  'Media / Publishing': 'Media',
  'Logistics / Shipping': 'Logistics',
};

function normalizeIndustry(industry: string): string {
  return INDUSTRY_GROUP[industry] || industry;
}

export function getIndustryBreakdown(events: DisplacementEvent[]) {
  const counts: Record<string, number> = {};
  for (const evt of events.filter((e) => !e.isProjection)) {
    const industry = normalizeIndustry(evt.industry);
    counts[industry] = (counts[industry] || 0) + evt.jobsCut;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([industry, count]) => ({ industry, count }));
}

export function getMonthlyTrend(events: DisplacementEvent[]) {
  const monthly: Record<string, number> = {};
  for (const evt of events.filter((e) => !e.isProjection)) {
    const key = evt.date.slice(0, 7); // YYYY-MM
    monthly[key] = (monthly[key] || 0) + evt.jobsCut;
  }
  return Object.entries(monthly)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ month, count }));
}

export function getCumulativeTrend(
  events: DisplacementEvent[],
  startDate?: string,
  endDate?: string,
  neverCreated: NeverCreatedEntry[] = [],
) {
  const neverMap: Record<string, number> = {};
  for (const e of getCountedNeverCreated(neverCreated)) {
    const key = e.date.slice(0, 7);
    neverMap[key] = (neverMap[key] || 0) + e.jobsNeverCreated;
  }
  const monthly = getMonthlyTrend(events);
  const monthlyMap: Record<string, number> = {};
  for (const { month, count } of monthly) {
    monthlyMap[month] = count;
  }
  const roboticsMap: Record<string, number> = {};
  for (const { month, count } of getMonthlyTrend(
    events.filter((e) => e.displacementMode === 'robotics'),
  )) {
    roboticsMap[month] = count;
  }

  // Build full month range if start/end provided
  let months: string[];
  if (startDate && endDate) {
    months = [];
    const [sy, sm] = startDate.slice(0, 7).split('-').map(Number);
    const [ey, em] = endDate.slice(0, 7).split('-').map(Number);
    let y = sy;
    let m = sm;
    while (y < ey || (y === ey && m <= em)) {
      months.push(`${y}-${String(m).padStart(2, '0')}`);
      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
    }
  } else {
    months = [...new Set([...monthly.map((d) => d.month), ...Object.keys(neverMap)])].sort();
  }

  let cumulative = 0;
  let cumulativeRobotics = 0;
  let cumulativeNever = 0;
  return months.map((month) => {
    const count = monthlyMap[month] || 0;
    cumulative += count;
    cumulativeRobotics += roboticsMap[month] || 0;
    cumulativeNever += neverMap[month] || 0;
    return {
      month,
      count,
      cumulative: cumulative + cumulativeNever,
      cumulativeRobotics,
      cumulativeSoftware: cumulative - cumulativeRobotics,
      cumulativeNever,
    };
  });
}

export function getCompanySummary(events: DisplacementEvent[]) {
  const companies: Record<string, { name: string; total: number; events: number }> = {};
  for (const evt of events.filter((e) => !e.isProjection)) {
    if (!companies[evt.company]) {
      companies[evt.company] = { name: evt.companyName, total: 0, events: 0 };
    }
    companies[evt.company].total += evt.jobsCut;
    companies[evt.company].events += 1;
  }
  return Object.entries(companies)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total);
}

export function getTotalJobsCut(events: DisplacementEvent[]): number {
  return events
    .filter((evt) => !evt.isProjection)
    .reduce((sum, evt) => sum + evt.jobsCut, 0);
}

export function filterEventsByDate(events: DisplacementEvent[], maxDate: string) {
  return events.filter((evt) => evt.date <= maxDate);
}

export function filterMilestonesByDate(milestones: AIMilestone[], maxDate: string) {
  return milestones.filter((ms) => ms.date <= maxDate);
}

/** Jobs Never Created that count toward the total: verified and already realized. */
export function getCountedNeverCreated(entries: NeverCreatedEntry[]) {
  return entries.filter((e) => e.status === 'verified' && !e.isProjection);
}

/** Verified future estimates: shown, never counted. */
export function getFutureNeverCreated(entries: NeverCreatedEntry[]) {
  return entries.filter((e) => e.status === 'verified' && e.isProjection);
}

export function sumNeverCreated(entries: NeverCreatedEntry[]) {
  return entries.reduce((sum, e) => sum + e.jobsNeverCreated, 0);
}
