import { PageLayout } from '../components/layout/PageLayout';
import { TotalCounter } from '../components/dashboard/TotalCounter';
import { TrendLine } from '../components/dashboard/TrendLine';
import { JobTypesChart } from '../components/dashboard/JobTypesChart';
import { IndustryBreakdown } from '../components/dashboard/IndustryBreakdown';
import { CompanyTable } from '../components/dashboard/CompanyTable';
import { getTotalJobsCut, getCompanySummary } from '../utils/dataTransformers';
import type { DisplacementEvent } from '../types';

interface DashboardPageProps {
  events: DisplacementEvent[];
}

export function DashboardPage({ events }: DashboardPageProps) {
  const total = getTotalJobsCut(events);
  const companies = getCompanySummary(events);

  return (
    <PageLayout
      title="AI Economic Impact Dashboard"
      subtitle="Tracking workforce displacement driven by artificial intelligence adoption"
    >
      <div className="space-y-8">
        <TotalCounter
          total={total}
          companyCount={companies.length}
          eventCount={events.length}
        />

        <TrendLine events={events} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <JobTypesChart events={events} />
          <IndustryBreakdown events={events} />
        </div>

        <CompanyTable events={events} />
      </div>
    </PageLayout>
  );
}
