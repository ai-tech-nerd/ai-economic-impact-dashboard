import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { EmbedButton } from '../ui/EmbedButton';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  embedPath?: string;
  children: ReactNode;
}

export function PageLayout({ title, subtitle, embedPath, children }: PageLayoutProps) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-surface-500 text-lg">{subtitle}</p>
            )}
          </div>
          {!isEmbed && embedPath && (
            <EmbedButton path={embedPath} title={title} />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
