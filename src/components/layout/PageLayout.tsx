import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-surface-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-surface-500 text-lg">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
