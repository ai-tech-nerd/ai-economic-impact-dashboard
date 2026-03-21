import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '../../components/shared/AnimatedNumber';
import { getTotalJobsCut, getCompanySummary } from '../../utils/dataTransformers';
import type { DisplacementEvent } from '../../types';

interface StatsEmbedProps {
  events: DisplacementEvent[];
}

/**
 * Standalone embeddable stats widget.
 *
 * URL params:
 *   theme=dark|light|transparent (default: dark)
 */
export function StatsEmbed({ events }: StatsEmbedProps) {
  const [params] = useSearchParams();
  const theme = (params.get('theme') || 'dark') as 'dark' | 'light' | 'transparent';

  const nonProjection = events.filter((e) => !e.isProjection);
  const total = getTotalJobsCut(events);
  const companies = getCompanySummary(events);
  const eventCount = nonProjection.length;

  const themeStyles = {
    dark: {
      container: 'bg-gradient-to-br from-surface-900 to-surface-800 text-white',
      number: 'text-primary-400',
      label: 'text-surface-400',
      link: 'text-surface-500 hover:text-primary-400',
    },
    light: {
      container: 'bg-white text-surface-900 border border-surface-200',
      number: 'text-primary-600',
      label: 'text-surface-500',
      link: 'text-surface-400 hover:text-primary-600',
    },
    transparent: {
      container: 'bg-transparent text-surface-900',
      number: 'text-primary-600',
      label: 'text-surface-500',
      link: 'text-surface-400 hover:text-primary-600',
    },
  };

  const s = themeStyles[theme];

  const stats = [
    { value: total, label: 'Jobs Displaced by AI', duration: 2000 },
    { value: eventCount, label: 'Displacement Events', duration: 1500 },
    { value: companies.length, label: 'AI Companies', duration: 1500 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-8 ${s.container}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-4xl md:text-5xl font-bold ${s.number}`}>
              <AnimatedNumber value={stat.value} duration={stat.duration} />
            </div>
            <p className={`text-sm mt-1 ${s.label}`}>{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <a
          href="https://aishift.michaelkristof.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs transition-colors ${s.link}`}
        >
          aishift.michaelkristof.com →
        </a>
      </div>
    </motion.div>
  );
}
