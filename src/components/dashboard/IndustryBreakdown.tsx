import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../shared/ChartContainer';
import { getIndustryBreakdown } from '../../utils/dataTransformers';
import { formatNumber } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';
import type { DisplacementEvent } from '../../types';

interface IndustryBreakdownProps {
  events: DisplacementEvent[];
}

export function IndustryBreakdown({ events }: IndustryBreakdownProps) {
  const data = getIndustryBreakdown(events);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartContainer
      title="Displacement by Industry"
      subtitle="Which industries have seen the most AI-driven job cuts"
      widgetPath="industry"
      widgetHeight={500}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="industry"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    opacity={activeIndex !== null && activeIndex !== i ? 0.4 : 1}
                    stroke={activeIndex === i ? CHART_COLORS[i % CHART_COLORS.length] : undefined}
                    strokeWidth={activeIndex === i ? 3 : 0}
                    style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveIndex(i)}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 space-y-2">
          {data.map((item, i) => {
            const pct = ((item.count / total) * 100).toFixed(1);
            const isActive = activeIndex === i;
            return (
              <div
                key={item.industry}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  isActive ? 'bg-surface-100 scale-[1.02]' : 'hover:bg-surface-50'
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-surface-800 truncate">
                    {item.industry}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-surface-900 tabular-nums">
                    {formatNumber(item.count)}
                  </div>
                  <div className="text-xs text-surface-400 tabular-nums">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartContainer>
  );
}

