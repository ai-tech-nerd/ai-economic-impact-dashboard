import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Seo } from '../components/shared/Seo';
import { TotalCounter } from '../components/dashboard/TotalCounter';
import { TrendLine } from '../components/dashboard/TrendLine';
import { JobTypesChart } from '../components/dashboard/JobTypesChart';
import { IndustryBreakdown } from '../components/dashboard/IndustryBreakdown';
import { SourceArchive } from '../components/dashboard/SourceArchive';
import { CardEmbedButton } from '../components/ui/CardEmbedButton';
import { getHeroBreakdown } from '../utils/dataTransformers';
import { formatNumber } from '../utils/formatters';
import type { DisplacementEvent, NeverCreatedEntry } from '../types';
import { JobsNeverCreatedCard } from '../components/dashboard/JobsNeverCreatedCard';
import { RoboticsBadge, isRobotics } from '../components/shared/RoboticsBadge';

interface DashboardPageProps {
  events: DisplacementEvent[];
  plannedEvents: DisplacementEvent[];
  creationEvents: DisplacementEvent[];
  neverCreated?: NeverCreatedEntry[];
}

export function DashboardPage({ events, plannedEvents, creationEvents, neverCreated = [] }: DashboardPageProps) {
  const location = useLocation();
  const isEmbedOrWidget = location.pathname.startsWith('/embed') || location.pathname.startsWith('/widget');
  const hero = getHeroBreakdown(events, plannedEvents, creationEvents, neverCreated);
  const plannedTotal = hero.plannedCuts;

  // "Data updated" indicator. Reads public/data/verified/meta.json —
  // dataLastUpdated must be bumped by the publish automation and by any
  // manual data commit. Fails silently (line simply not shown) if missing.
  const [dataUpdated, setDataUpdated] = useState<string | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/verified/meta.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((meta: { dataLastUpdated?: string } | null) => {
        if (meta?.dataLastUpdated) {
          const d = new Date(`${meta.dataLastUpdated}T00:00:00`);
          if (!Number.isNaN(d.getTime())) {
            setDataUpdated(
              d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PageLayout
      title="Jobs Lost to AI"
      subtitle="Jobs displaced by AI since ChatGPT's launch: verified layoffs that companies attribute to AI, plus jobs companies stopped filling because AI or robots now do the work. Planned cuts and future estimates are shown separately."
      embedPath="/dashboard"
    >
      <Seo
        title="Jobs Lost to AI — Live AI Layoffs & Job Losses Tracker"
        description="Live tracker of jobs lost to AI: verified AI layoffs, AI job losses, and companies replacing workers with AI. Real numbers from company statements, earnings calls, and SEC filings — updated regularly, free, no sign-up."
        path="/"
      />
      <div className="space-y-8">
        {dataUpdated && (
          <p className="-mt-4 flex items-center gap-1.5 text-sm text-surface-500">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500" aria-hidden="true" />
            Data updated: <span className="font-medium text-surface-700">{dataUpdated}</span>
          </p>
        )}
        <TotalCounter data={hero} showEmbedButton />

        <TrendLine events={events} neverCreated={neverCreated} />

        <div className="grid grid-cols-1 gap-8">
          <JobTypesChart events={events} />
          <IndustryBreakdown events={events} />
        </div>

        {/* Secondary stat cards — Planned, Creation, Never Created */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="text-surface-700 flex items-center gap-2">{evt.companyName}{isRobotics(evt) && <RoboticsBadge />}</span>
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
                <p className="text-2xl font-bold text-surface-900">
                  {formatNumber(creationEvents.reduce((sum, e) => sum + (e.jobsCreated ?? 0), 0))}
                </p>
                <p className="text-sm text-surface-500 mt-1">
                  new AI-driven roles announced across {creationEvents.length} companies
                </p>
                <div className="mt-3 space-y-1.5">
                  {creationEvents.map((evt) => (
                    <div key={evt.id} className="flex items-center justify-between text-sm">
                      <span className="text-surface-700 flex items-center gap-2">{evt.companyName}{isRobotics(evt) && <RoboticsBadge />}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-surface-500">
                          {evt.jobsCreated ? formatNumber(evt.jobsCreated) : 'Undisclosed'}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-success-100 text-success-700">
                          Hiring
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-surface-400 mt-2">No AI job creation events tracked yet.</p>
            )}
            <p className="text-xs text-surface-400 mt-3 border-t border-surface-100 pt-2">
              Tracking new roles that emerge specifically because of AI adoption
            </p>
          </div>

          <JobsNeverCreatedCard entries={neverCreated} />
        </div>

        <SourceArchive />
      </div>
    </PageLayout>
  );
}
