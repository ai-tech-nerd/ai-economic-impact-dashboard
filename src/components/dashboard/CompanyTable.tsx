import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCompanySummary } from '../../utils/dataTransformers';
import { formatNumber } from '../../utils/formatters';
import { ChartContainer } from '../shared/ChartContainer';
import type { DisplacementEvent } from '../../types';

interface CompanyTableProps {
  events: DisplacementEvent[];
  plannedEvents?: DisplacementEvent[];
  creationEvents?: DisplacementEvent[];
}

type SortKey = 'name' | 'total' | 'events';

export function CompanyTable({ events, plannedEvents = [], creationEvents = [] }: CompanyTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('total');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');

  const companies = useMemo(() => getCompanySummary(events), [events]);

  // Build lookup sets for planned and creation companies (by slug)
  const plannedCompanies = useMemo(() => {
    const map = new Map<string, string>();
    for (const evt of plannedEvents) {
      map.set(evt.company, evt.status === 'hiring-freeze' ? 'hiring-freeze' : 'announced');
    }
    return map;
  }, [plannedEvents]);

  const creationCompanies = useMemo(() => {
    const set = new Set<string>();
    for (const evt of creationEvents) {
      set.add(evt.company);
    }
    return set;
  }, [creationEvents]);

  const filtered = useMemo(() => {
    let result = companies;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      if (sortKey === 'name') return mul * a.name.localeCompare(b.name);
      return mul * (a[sortKey] - b[sortKey]);
    });
    return result;
  }, [companies, search, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-surface-300 ml-1">&#8597;</span>;
    return <span className="ml-1">{sortAsc ? '&#8593;' : '&#8595;'}</span>;
  };

  function getStatusBadge(companyId: string) {
    const badges: React.ReactNode[] = [];

    // Always show confirmed (red) since they're in the events list
    badges.push(
      <span
        key="confirmed"
        className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-full bg-danger-100 text-danger-700"
      >
        Confirmed
      </span>
    );

    if (plannedCompanies.has(companyId)) {
      const status = plannedCompanies.get(companyId);
      badges.push(
        <span
          key="planned"
          className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-full bg-warning-100 text-warning-700"
        >
          {status === 'hiring-freeze' ? 'Freeze' : 'Announced'}
        </span>
      );
    }

    if (creationCompanies.has(companyId)) {
      badges.push(
        <span
          key="creation"
          className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-full bg-success-100 text-success-700"
        >
          Net Hiring
        </span>
      );
    }

    return <div className="flex flex-wrap gap-1">{badges}</div>;
  }

  return (
    <ChartContainer title="Companies" subtitle="All companies with documented AI-driven job cuts">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex items-center gap-3 text-xs text-surface-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger-500" /> Confirmed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning-500" /> Announced
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success-500" /> Net Hiring
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200">
              <th
                className="text-left py-3 px-2 font-semibold text-surface-600 cursor-pointer hover:text-surface-900"
                onClick={() => handleSort('name')}
              >
                Company <SortIcon column="name" />
              </th>
              <th className="text-left py-3 px-2 font-semibold text-surface-600">
                Status
              </th>
              <th
                className="text-right py-3 px-2 font-semibold text-surface-600 cursor-pointer hover:text-surface-900"
                onClick={() => handleSort('total')}
              >
                Jobs Cut <SortIcon column="total" />
              </th>
              <th
                className="text-right py-3 px-2 font-semibold text-surface-600 cursor-pointer hover:text-surface-900"
                onClick={() => handleSort('events')}
              >
                Events <SortIcon column="events" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => (
              <tr
                key={company.id}
                className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
              >
                <td className="py-3 px-2">
                  <Link
                    to={`/companies/${company.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium no-underline"
                  >
                    {company.name}
                  </Link>
                </td>
                <td className="py-3 px-2">
                  {getStatusBadge(company.id)}
                </td>
                <td className="py-3 px-2 text-right font-mono">
                  {formatNumber(company.total)}
                </td>
                <td className="py-3 px-2 text-right">{company.events}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-surface-400 py-8">No companies found.</p>
      )}
    </ChartContainer>
  );
}
