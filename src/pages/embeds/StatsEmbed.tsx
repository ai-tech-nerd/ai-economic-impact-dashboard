import { useSearchParams } from 'react-router-dom';
import { TotalCounter, type HeroTheme } from '../../components/dashboard/TotalCounter';
import { getHeroBreakdown } from '../../utils/dataTransformers';
import type { DisplacementEvent, NeverCreatedEntry } from '../../types';

interface StatsEmbedProps {
  events: DisplacementEvent[];
  plannedEvents?: DisplacementEvent[];
  creationEvents?: DisplacementEvent[];
  neverCreated?: NeverCreatedEntry[];
}

/**
 * Standalone embeddable stats widget: the dashboard hero, same numbers.
 *
 * URL params:
 *   theme=dark|light|transparent (default: dark)
 */
export function StatsEmbed({
  events,
  plannedEvents = [],
  creationEvents = [],
  neverCreated = [],
}: StatsEmbedProps) {
  const [params] = useSearchParams();
  const requested = params.get('theme');
  const theme: HeroTheme =
    requested === 'light' || requested === 'transparent' ? requested : 'dark';

  return (
    <div>
      <TotalCounter
        data={getHeroBreakdown(events, plannedEvents, creationEvents, neverCreated)}
        theme={theme}
      />
      <div className="text-center mt-2">
        <a
          href="https://aishift.michaelkristof.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-surface-400 hover:text-primary-600 transition-colors"
        >
          aishift.michaelkristof.com →
        </a>
      </div>
    </div>
  );
}
