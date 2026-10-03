// Canonical categories (owner-approved 2026-10-03); keep in sync with
// scripts/job-categories.mjs, which the build-time validation checks.
export const JOB_TYPE_LABELS: Record<string, string> = {
  'operations': 'Operations',
  'administrative': 'Administrative & Back Office',
  'company-wide': 'Company-wide / Mixed',
  'engineering-technology': 'Engineering & Technology',
  'hr-recruiting': 'HR & Recruiting',
  'sales-marketing': 'Sales & Marketing',
  'customer-support': 'Customer Support',
  'finance-accounting': 'Finance & Accounting',
  'product-design': 'Product & Design',
  'content-data': 'Content & Data Work',
  'management': 'Management',
  'legal': 'Legal',
  'manufacturing-field': 'Manufacturing & Field Work',
};

export const INDUSTRY_COLORS: Record<string, string> = {
  Technology: '#3b82f6',
  Finance: '#10b981',
  Retail: '#f59e0b',
  Media: '#ef4444',
  Telecommunications: '#8b5cf6',
  Healthcare: '#ec4899',
  'E-commerce': '#f97316',
  Education: '#06b6d4',
  Consulting: '#84cc16',
  Other: '#6b7280',
};

export const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#f97316', '#06b6d4', '#84cc16', '#6366f1',
];

export const TIMELINE_START = '2022-11-30';

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'BarChart3' },
  { path: '/predictions', label: 'Predictions', icon: 'TrendingUp' },
  { path: '/timeline', label: 'Timeline', icon: 'Clock' },
  { path: '/ai-advances', label: 'AI Advances', icon: 'Cpu' },
  { path: '/companies', label: 'AI Companies', icon: 'Building2' },
  { path: '/learn', label: 'Learn & Prepare', icon: 'BookOpen' },
];
