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

type SortKey = 'name' | 'total' | 'events' | 'freeze' | 'creation';

export function CompanyTable({ events, plannedEvents = [], creationEvents = [] }: CompanyTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('total');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');

  const companies = useMemo(() => getCompanySummary(events), [events]);

  // Build lookup maps for planned and creation companies
  const plannedCompanies = useMemo(() => {
    const map = new Map<string, { status: string; total: number }>();
    for (const evt of plannedEvents) {
      const existing = map.get(evt.company);
      const status = evt.status === 'hiring-freeze' ? 'hiring-freeze' : 'announced';
      map.set(evt.company, {
        status,
        total: (existing?.total || 0) + evt.jobsCut,
      });
    }
    return map;
  }, [plannedEvents]);

  const creationCompanies = useMemo(() => {
    const map = new Map<string, number>();
    for (const evt of creationEvents) {
      map.set(evt.company, (map.get(evt.company) || 0) + 1);
    }
    return map;
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
      if (sortKey === 'freeze') {
        const aVal = plannedCompanies.get(a.id)?.total || 0;
        const bVal = plannedCompanies.get(b.id)?.total || 0;
        return mul * (aVal - bVal);
      }
      if (sortKey === 'creation') {
        const aVal = creationCompanies.get(a.id) || 0;
        const bVal = creationCompanies.get(b.id) || 0;
        return mul * (aVal - bVal);
      }
      return mul * (a[sortKey] - b[sortKey]);
    });
    return result;
  }, [companies, search, sortKey, sortAsc, plannedCompanies, creationCompanies]);

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
    return <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>;
  };

  return (
    <ChartContainer title="Companies" subtitle="All companies with documented AI-driven job cuts">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
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
              <th
                className="text-right py-3 px-2 font-semibold text-surface-600 cursor-pointer hover:text-surface-900"
                onClick={() => handleSort('total')}
              >
                Jobs Displaced <SortIcon column="total" />
              </th>
              <th
                className="text-right py-3 px-2 font-semibold text-surface-600 cursor-pointer hover:text-surface-900"
                onClick={() => handleSort('freeze')}
              >
                Hiring Freeze <SortIcon column="freeze" />
              </th>
              <th
                className="text-right py-3 px-2 font-semibold text-surface-600 cursor-pointer hover:text-surface-900"
                onClick={() => handleSort('creation')}
              >
                Job Creation <SortIcon column="creation" />
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
            {filtered.map((company) => {
              const planned = plannedCompanies.get(company.id);
              const creation = creationCompanies.get(company.id);
              return (
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
                  <td className="py-3 px-2 text-right font-mono text-danger-600">
                    {formatNumber(company.total)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {planned ? (
                      <span className="text-warning-600">{formatNumber(planned.total)}</span>
                    ) : (
                      <span className="text-surface-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {creation ? (
                      <span className="text-success-600">{creation} {creation === 1 ? 'event' : 'events'}</span>
                    ) : (
                      <span className="text-surface-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">{company.events}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-surface-400 py-8">No companies found.</p>
      )}
    </ChartContainer>
  );
}
