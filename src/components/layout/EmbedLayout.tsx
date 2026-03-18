import type { ReactNode } from 'react';

interface EmbedLayoutProps {
  children: ReactNode;
}

export function EmbedLayout({ children }: EmbedLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {children}
      </div>
      <div className="border-t border-surface-200 bg-white px-4 py-2 text-center">
        <a
          href="https://aishift.michaelkristof.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-surface-400 hover:text-primary-600 transition-colors"
        >
          Powered by <span className="font-semibold">AI Shift Dashboard</span> — View full dashboard →
        </a>
      </div>
    </div>
  );
}
