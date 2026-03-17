import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '../shared/ChartContainer';
import { getTopJobTypes } from '../../utils/dataTransformers';
import { formatNumber } from '../../utils/formatters';
import { JOB_TYPE_LABELS } from '../../utils/constants';
import type { DisplacementEvent } from '../../types';

interface JobTypesChartProps {
  events: DisplacementEvent[];
}

export function JobTypesChart({ events }: JobTypesChartProps) {
  const data = getTopJobTypes(events).map((d) => ({
    ...d,
    label: JOB_TYPE_LABELS[d.type] || d.type,
  }));

  return (
    <ChartContainer
      title="Top Job Categories Displaced"
      subtitle="Most affected job types by total positions cut"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(v) => formatNumber(v)}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: '#334155' }}
            width={110}
          />
          <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Jobs Cut']} />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
