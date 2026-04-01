import { useState, useEffect, useMemo } from 'react';
import { ChartContainer } from '../shared/ChartContainer';

interface ArchiveEntry {
  dir_name: string;
  date: string;
  company: string;
  jobs: string;
  category: string;
  tab: 'main' | 'planned' | 'created';
  type: string;
  reason: string;
  source_url: string;
  screenshot_file: string;
  article_file: string;
}

type TabKey = 'all' | 'main' | 'planned' | 'created';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'main', label: 'Jobs Displaced' },
  { key: 'planned', label: 'Planned / Announced' },
  { key: 'created', label: 'Jobs Created' },
];

const BASE = import.meta.env.BASE_URL;

export function SourceArchive() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${BASE}data/source-archive/archive-manifest.json`)
      .then((res) => res.json())
      .then((data: ArchiveEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = entries;
    if (activeTab !== 'all') {
      result = result.filter((e) => e.tab === activeTab);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.company.toLowerCase().includes(q));
    }
    return result;
  }, [entries, activeTab, search]);

  // Tab counts
  const counts = useMemo(() => {
    const all = entries.length;
    const main = entries.filter((e) => e.tab === 'main').length;
    const planned = entries.filter((e) => e.tab === 'planned').length;
    const created = entries.filter((e) => e.tab === 'created').length;
    return { all, main, planned, created };
  }, [entries]);

  if (loading) {
    return (
      <ChartContainer
        title="Source Archive"
        subtitle="Documented evidence for every entry — archived articles, screenshots, and company statements"
        widgetPath="companies"
        widgetHeight={600}
      >
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-surface-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      title="Source Archive"
      subtitle="Documented evidence for every entry — archived articles, screenshots, and company statements"
      widgetPath="companies"
      widgetHeight={600}
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-surface-900 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-70">{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-sm text-surface-400 whitespace-nowrap ml-auto">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Event rows */}
      <div className="divide-y divide-surface-100">
        {filtered.map((entry) => (
          <div
            key={entry.dir_name}
            className="flex items-start gap-3 py-3 hover:bg-surface-50 transition-colors -mx-2 px-2 rounded-lg"
          >
            {/* Date */}
            <div className="text-xs text-surface-400 font-mono w-[82px] shrink-0 pt-0.5">
              {entry.date}
            </div>

            {/* Company + Category */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`${BASE}data/source-archive/${entry.dir_name}/`}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 no-underline"
                >
                  {entry.company}
                </a>
                {entry.tab === 'planned' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-warning-100 text-warning-700">
                    Planned
                  </span>
                )}
                {entry.tab === 'created' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success-100 text-success-700">
                    Created
                  </span>
                )}
              </div>
              <div className="text-xs text-surface-500 mt-0.5 truncate">{entry.category}</div>
            </div>

            {/* Jobs */}
            <div className="text-sm text-right font-medium text-surface-700 shrink-0 max-w-[160px]">
              {entry.jobs}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-surface-400 py-8">No matching entries found.</p>
      )}

      {/* Footer link to full archive */}
      <div className="mt-4 pt-4 border-t border-surface-100 text-center">
        <a
          href={`${BASE}data/source-archive/`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium no-underline"
        >
          View full Source Archive →
        </a>
      </div>
    </ChartContainer>
  );
}
