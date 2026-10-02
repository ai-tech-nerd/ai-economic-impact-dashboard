import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '../shared/ChartContainer';
import { getCumulativeTrend } from '../../utils/dataTransformers';
import { formatNumber } from '../../utils/formatters';
import type { DisplacementEvent } from '../../types';

interface TrendLineProps {
  events: DisplacementEvent[];
  title?: string;
  subtitle?: string;
  dateRange?: { start: string; end: string };
}

export function TrendLine({ events, title, subtitle, dateRange }: TrendLineProps) {
  const data = getCumulativeTrend(events, dateRange?.start, dateRange?.end);

  return (
    <ChartContainer
      title={title ?? 'Cumulative Job Displacement'}
      subtitle={subtitle ?? 'Running total of AI-attributed job cuts over time, split by software AI and robotics'}
      widgetPath="trend"
      widgetHeight={420}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRobotics" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(v) => {
              const [y, m] = v.split('-');
              return `${['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m]} '${y.slice(2)}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(v) => formatNumber(v)}
          />
          <Tooltip
            formatter={(value, name) => [formatNumber(Number(value)), name]}
            labelFormatter={(label) => {
              const [y, m] = label.split('-');
              const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              return `${months[+m]} ${y}`;
            }}
          />
          <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {/* Stacked so the top edge is the overall total; robotics sits at the base. */}
          <Area
            type="monotone"
            dataKey="cumulativeRobotics"
            name="Robotics"
            stackId="mode"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorRobotics)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="cumulativeSoftware"
            name="Software AI"
            stackId="mode"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorCumulative)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
