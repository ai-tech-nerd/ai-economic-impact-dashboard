import { PageLayout } from '../components/layout/PageLayout';
import type { Prediction } from '../types';
import { formatNumber } from '../utils/formatters';

interface PredictionsPageProps {
  predictions: Prediction[];
}

const TIMEFRAME_LABELS: Record<string, string> = {
  '3-months': '3 Months',
  '6-months': '6 Months',
  '12-months': '12 Months',
  '3-5-years': '3-5 Years',
};

const RISK_COLORS: Record<string, string> = {
  high: 'bg-danger-500',
  medium: 'bg-warning-500',
  low: 'bg-success-500',
};

export function PredictionsPage({ predictions }: PredictionsPageProps) {
  const grouped = Object.entries(TIMEFRAME_LABELS).map(([key, label]) => ({
    timeframe: key,
    label,
    items: predictions.filter((p) => p.timeframe === key),
  }));

  return (
    <PageLayout
      title="Predictions"
      subtitle="Estimated jobs at risk based on current trends and announced plans"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {grouped.map(({ timeframe, label, items }) => (
          <div
            key={timeframe}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-800 mb-4">{label}</h3>
            {items.length === 0 ? (
              <p className="text-surface-400 text-sm">No predictions yet for this timeframe.</p>
            ) : (
              <div className="space-y-4">
                {items.map((pred) => (
                  <div key={pred.id} className="border-l-4 border-primary-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-surface-800">{pred.jobType}</span>
                      <span
                        className={`text-xs text-white px-2 py-0.5 rounded-full ${RISK_COLORS[pred.riskLevel]}`}
                      >
                        {pred.riskLevel} risk
                      </span>
                    </div>
                    <div className="text-sm text-surface-600 mb-1">
                      <span className="font-mono">
                        {formatNumber(pred.estimatedJobsAtRisk.low)} –{' '}
                        {formatNumber(pred.estimatedJobsAtRisk.high)}
                      </span>{' '}
                      jobs at risk
                    </div>
                    <p className="text-xs text-surface-500">{pred.basis}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-surface-50 rounded-xl border border-surface-200 p-6">
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Methodology</h3>
        <p className="text-sm text-surface-600">
          Predictions are based on: (1) extrapolation of current displacement trends,
          (2) publicly announced company AI adoption plans, (3) industry analyst reports,
          and (4) academic research on AI capability trajectories. Ranges reflect uncertainty
          — actual outcomes may fall outside these estimates. Predictions are updated monthly
          as new data becomes available.
        </p>
      </div>
    </PageLayout>
  );
}
