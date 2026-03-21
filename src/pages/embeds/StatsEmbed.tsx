import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '../../components/shared/AnimatedNumber';
import { getTotalJobsCut, getCompanySummary } from '../../utils/dataTransformers';
import type { DisplacementEvent } from '../../types';

interface StatsEmbedProps {
  events: DisplacementEvent[];
}

/**
 * Standalone embeddable stats counter widget.
 *
 * URL params:
 *   theme=dark|light|transparent (default: dark)
 *   compact=true  — single-line minimal version
 *   label=custom  — override the subtitle text
 */
export function StatsEmbed({ events }: StatsEmbedProps) {
  const [params] = useSearchParams();
  const theme = (params.get('theme') || 'dark') as 'dark' | 'light' | 'transparent';
  const compact = params.get('compact') === 'true';
  const customLabel = params.get('label');

  const nonProjection = events.filter((e) => !e.isProjection);
  const total = getTotalJobsCut(events);
  const companies = getCompanySummary(events);
  const eventCount = nonProjection.length;

  const themeClasses = {
    dark: 'bg-gradient-to-br from-surface-900 to-surface-800 text-white',
    light: 'bg-white text-surface-900 border border-surface-200',
    transparent: 'bg-transparent text-surface-900',
  };

  const subtitleClasses = {
    dark: 'text-surface-400',
    light: 'text-surface-500',
    transparent: 'text-surface-500',
  };

  const accentClasses = {
    dark: 'text-primary-400',
    light: 'text-primary-600',
    transparent: 'text-primary-600',
  };

  const statLabelClasses = {
    dark: 'text-surface-400',
    light: 'text-surface-500',
    transparent: 'text-surface-500',
  };

  const linkClasses = {
    dark: 'text-surface-500 hover:text-primary-400',
    light: 'text-surface-400 hover:text-primary-600',
    transparent: 'text-surface-400 hover:text-primary-600',
  };

  if (compact) {
    return (
      <div className={`flex items-center justify-center gap-6 rounded-xl px-6 py-4 ${themeClasses[theme]}`}>
        <div className="text-center">
          <span className={`text-3xl font-bold ${accentClasses[theme]}`}>
            <AnimatedNumber value={total} />
          </span>
          <span className={`text-sm ml-2 ${subtitleClasses[theme]}`}>
            {customLabel || 'jobs displaced by AI'}
          </span>
        </div>
        <div className={`text-xs ${subtitleClasses[theme]} flex gap-4`}>
          <span><strong className={theme === 'dark' ? 'text-white' : 'text-surface-800'}>{companies.length}</strong> companies</span>
          <span><strong className={theme === 'dark' ? 'text-white' : 'text-surface-800'}>{eventCount}</strong> events</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-8 text-center ${themeClasses[theme]}`}
    >
      <p className={`text-sm uppercase tracking-wider mb-2 ${subtitleClasses[theme]}`}>
        Total Jobs Displaced by AI
      </p>
      <div className={`text-5xl md:text-7xl font-bold mb-4 ${accentClasses[theme]}`}>
        <AnimatedNumber value={total} />
      </div>
      <p className={`text-sm mb-6 ${subtitleClasses[theme]}`}>
        {customLabel || 'Since November 30, 2022 (ChatGPT Launch)'}
      </p>
      <div className="flex justify-center gap-8">
        <div>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={companies.length} duration={1500} />
          </div>
          <p className={`text-xs uppercase tracking-wider ${statLabelClasses[theme]}`}>Companies</p>
        </div>
        <div>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={eventCount} duration={1500} />
          </div>
          <p className={`text-xs uppercase tracking-wider ${statLabelClasses[theme]}`}>Events</p>
        </div>
      </div>
      <a
        href="https://aishift.michaelkristof.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block mt-6 text-xs transition-colors ${linkClasses[theme]}`}
      >
        aishift.michaelkristof.com →
      </a>
    </motion.div>
  );
}
