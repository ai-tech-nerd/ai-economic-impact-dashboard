import type { Source } from '../../types';

interface SourceCitationProps {
  sources: Source[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {sources.map((source, i) => (
        <a
          key={i}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {source.publisher}
        </a>
      ))}
    </div>
  );
}
