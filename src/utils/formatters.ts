export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthYear(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}
