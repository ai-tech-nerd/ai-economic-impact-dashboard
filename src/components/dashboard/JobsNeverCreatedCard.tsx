import { formatNumber } from '../../utils/formatters';
import { RoboticsBadge } from '../shared/RoboticsBadge';
import type { NeverCreatedEntry } from '../../types';
import { getCountedNeverCreated, sumNeverCreated } from '../../utils/dataTransformers';

interface JobsNeverCreatedCardProps {
  entries: NeverCreatedEntry[];
}

/** Counted total only: verified and already realized (future estimates excluded). */
export function getNeverCreatedTotal(entries: NeverCreatedEntry[]) {
  return sumNeverCreated(getCountedNeverCreated(entries));
}

export function JobsNeverCreatedCard({ entries }: JobsNeverCreatedCardProps) {
  const counted = getCountedNeverCreated(entries);
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-never-100 p-5 relative">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full bg-never-500" />
        <span className="text-xs font-semibold text-never-600 uppercase tracking-wider">
          Jobs Never Created
        </span>
      </div>
      {entries.length > 0 ? (
        <>
          <p className="text-2xl font-bold text-surface-900">
            {formatNumber(getNeverCreatedTotal(entries))}
          </p>
          <p className="text-sm text-surface-500 mt-1">
            jobs already lost this way, counted in the total ({counted.length}{' '}
            {counted.length === 1 ? 'company' : 'companies'})
          </p>
          <div className="mt-3 space-y-2">
            {sorted.map((entry) => (
              <div key={entry.id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-surface-700 flex items-center gap-2">
                    {entry.companyName}
                    {entry.displacementMode === 'robotics' && <RoboticsBadge />}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={entry.status === 'disputed' ? 'text-surface-400 line-through' : 'text-surface-500'}>
                      {formatNumber(entry.jobsNeverCreated)}
                    </span>
                    {entry.isProjection && entry.status === 'verified' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-100 text-surface-600">
                        Future estimate
                      </span>
                    )}
                    {entry.status === 'disputed' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-100 text-surface-600">
                        Company disputes
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-surface-400 mt-0.5">{entry.estimateBasis}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-surface-400 mt-2">No entries tracked yet.</p>
      )}
      <p className="text-xs text-surface-400 mt-3 border-t border-surface-100 pt-2">
        Work that went to AI or robots instead of new hires or replacements: roles not
        refilled, contracts not renewed, sites built to need fewer people. Uses company-stated
        numbers or ratios. Jobs already lost count toward the main total; future estimates and
        disputed figures do not.
      </p>
    </div>
  );
}
