import { TrendLine } from '../../components/dashboard/TrendLine';
import { JobTypesChart } from '../../components/dashboard/JobTypesChart';
import { IndustryBreakdown } from '../../components/dashboard/IndustryBreakdown';
import { SourceArchive } from '../../components/dashboard/SourceArchive';
import { formatNumber } from '../../utils/formatters';
import type { DisplacementEvent } from '../../types';

interface EventsProps {
  events: DisplacementEvent[];
}

interface AllEventsProps {
  events: DisplacementEvent[];
  plannedEvents: DisplacementEvent[];
  creationEvents: DisplacementEvent[];
}

function WidgetWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
      <div className="text-center mt-4">
        <a
          href="https://aishift.michaelkristof.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-surface-400 hover:text-primary-600 transition-colors"
        >
          aishift.michaelkristof.com →
        </a>
      </div>
    </div>
  );
}

export function TrendWidget({ events }: EventsProps) {
  return (
    <WidgetWrapper>
      <TrendLine events={events} />
    </WidgetWrapper>
  );
}

export function JobTypesWidget({ events }: EventsProps) {
  return (
    <WidgetWrapper>
      <JobTypesChart events={events} />
    </WidgetWrapper>
  );
}

export function IndustryWidget({ events }: EventsProps) {
  return (
    <WidgetWrapper>
      <IndustryBreakdown events={events} />
    </WidgetWrapper>
  );
}

export function CompaniesWidget(_props: AllEventsProps) {
  return (
    <WidgetWrapper>
      <SourceArchive />
    </WidgetWrapper>
  );
}

export function PlannedWidget({ plannedEvents }: { plannedEvents: DisplacementEvent[] }) {
  const plannedTotal = plannedEvents.reduce((sum, e) => sum + e.jobsCut, 0);

  return (
    <WidgetWrapper>
      <div className="bg-white rounded-xl shadow-sm border border-warning-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-warning-500" />
          <span className="text-xs font-semibold text-warning-600 uppercase tracking-wider">Planned / Announced</span>
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
    </WidgetWrapper>
  );
}

export function CreationWidget({ creationEvents }: { creationEvents: DisplacementEvent[] }) {
  return (
    <WidgetWrapper>
      <div className="bg-white rounded-xl shadow-sm border border-success-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
          <span className="text-xs font-semibold text-success-600 uppercase tracking-wider">AI Job Creation</span>
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
    </WidgetWrapper>
  );
}
