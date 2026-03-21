import { useLocation } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { TotalCounter } from '../components/dashboard/TotalCounter';
import { TrendLine } from '../components/dashboard/TrendLine';
import { JobTypesChart } from '../components/dashboard/JobTypesChart';
import { IndustryBreakdown } from '../components/dashboard/IndustryBreakdown';
import { CompanyTable } from '../components/dashboard/CompanyTable';
import { CardEmbedButton } from '../components/ui/CardEmbedButton';
import { getTotalJobsCut, getCompanySummary } from '../utils/dataTransformers';
import { formatNumber } from '../utils/formatters';
import type { DisplacementEvent } from '../types';

interface DashboardPageProps {
  events: DisplacementEvent[];
  plannedEvents: DisplacementEvent[];
  creationEvents: DisplacementEvent[];
}

export function DashboardPage({ events, plannedEvents, creationEvents }: DashboardPageProps) {
  const location = useLocation();
  const isEmbedOrWidget = location.pathname.startsWith('/embed') || location.pathname.startsWith('/widget');
  const total = getTotalJobsCut(events);
  const companies = getCompanySummary(events);
  const plannedTotal = plannedEvents.reduce((sum, e) => sum + e.jobsCut, 0);

  return (
    <PageLayout
      title="AI Economic Impact Dashboard"
      subtitle="Tracking workforce displacement driven by artificial intelligence adoption"
      embedPath="/dashboard"
    >
      <div className="space-y-8">
        <TotalCounter
          total={total}
          companyCount={companies.length}
          eventCount={events.filter((e) => !e.isProjection).length}
        />

        <TrendLine events={events} />

        <div className="grid grid-cols-1 gap-8">
          <JobTypesChart events={events} />
          <IndustryBreakdown events={events} />
        </div>

        {/* Secondary stat cards — Planned & Creation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-warning-200 p-5 relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-warning-500" />
                <span className="text-xs font-semibold text-warning-600 uppercase tracking-wider">Planned / Announced</span>
              </div>
              {!isEmbedOrWidget && <CardEmbedButton widgetPath="planned" title="Planned / Announced" height={400} />}
            </div>
            <p className="text-2xl font-bold text-surface-900">{formatNumber(plannedTotal)}</p>
            <p className="text-sm text-surface-500 mt-1">
              jobs announced or in hiring freezes across {plannedEvents.length} companies
            </p>
            <div className="mt-3 space-y-1.5">
              {plannedEvents.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between text-sm">
                  <span className="text-surface-700">{evt.companyName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-surface-500">{formatNumber(evt.jobsCut)}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      evt.status === 'hiring-freeze'
                        ? 'bg-warning-100 text-warning-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {evt.status === 'hiring-freeze' ? 'Freeze' : 'Announced'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-success-200 p-5 relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
                <span className="text-xs font-semibold text-success-600 uppercase tracking-wider">AI Job Creation</span>
              </div>
              {!isEmbedOrWidget && <CardEmbedButton widgetPath="creation" title="AI Job Creation" height={350} />}
            </div>
            {creationEvents.length > 0 ? (
              <>
                {creationEvents.map((evt) => (
                  <div key={evt.id} className="mt-2">
                    <p className="text-lg font-bold text-surface-900">{evt.companyName}</p>
                    <p className="text-sm text-surface-600 mt-1">{evt.reasonGiven}</p>
                    {evt.jobRolesCreated && (
                      <p className="text-xs text-surface-500 mt-2">
                        <strong>New roles:</strong> {evt.jobRolesCreated}
                      </p>
                    )}
                    {evt.context && (
                      <p className="text-xs text-surface-400 mt-1 italic">{evt.context}</p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-surface-400 mt-2">No AI job creation events tracked yet.</p>
            )}
            <p className="text-xs text-surface-400 mt-3 border-t border-surface-100 pt-2">
              Tracking new roles that emerge specifically because of AI adoption
            </p>
          </div>
        </div>

        <CompanyTable events={events} plannedEvents={plannedEvents} creationEvents={creationEvents} />
      </div>
    </PageLayout>
  );
}
