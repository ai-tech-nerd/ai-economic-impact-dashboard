import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '../shared/ChartContainer';

const GROWTH_DATA = [
  { date: 'Nov 30', users: 0, label: 'Launch' },
  { date: 'Dec 5', users: 1_000_000, label: '1M users (5 days)' },
  { date: 'Dec 31', users: 57_000_000, label: '57M users (1 month)' },
  { date: 'Jan 31', users: 100_000_000, label: '100M users (2 months)' },
];

function formatUsers(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export function ChatGPTGrowthChart() {
  return (
    <ChartContainer
      title="The ChatGPT Moment"
      subtitle="Nov 30, 2022 — Jan 31, 2023"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={formatUsers}
          />
          <Tooltip
            formatter={(value) => [formatUsers(Number(value)), 'Users']}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload as { label?: string } | undefined;
              if (item?.label) {
                return `${String(label)}: ${item.label}`;
              }
              return String(label);
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorGrowth)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
