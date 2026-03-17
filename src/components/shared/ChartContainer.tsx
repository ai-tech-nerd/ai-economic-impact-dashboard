import type { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ title, subtitle, children, className = '' }: ChartContainerProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-surface-800">{title}</h3>
        {subtitle && <p className="text-sm text-surface-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
