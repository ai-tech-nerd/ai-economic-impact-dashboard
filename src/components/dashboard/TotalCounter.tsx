import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '../shared/AnimatedNumber';

import { JOB_TYPE_LABELS } from '../../utils/constants';
import type { getHeroBreakdown } from '../../utils/dataTransformers';

export type HeroData = ReturnType<typeof getHeroBreakdown>;
export type HeroTheme = 'dark' | 'light' | 'transparent';

const THEMES: Record<HeroTheme, {
  container: string;
  tile: string;
  label: string;
  note: string;
  strong: string;
  divider: string;
  total: string;
}> = {
  dark: {
    container: 'bg-gradient-to-br from-surface-900 to-surface-800 text-white',
    tile: 'bg-white/5 border-white/10',
    label: 'text-surface-400',
    note: 'text-surface-500',
    strong: 'text-white',
    divider: 'border-white/10',
    total: 'text-primary-400',
  },
  light: {
    container: 'bg-white text-surface-900 border border-surface-200',
    tile: 'bg-surface-50 border-surface-200',
    label: 'text-surface-500',
    note: 'text-surface-400',
    strong: 'text-surface-900',
    divider: 'border-surface-200',
    total: 'text-primary-600',
  },
  transparent: {
    container: 'bg-transparent text-surface-900',
    tile: 'bg-white/60 border-surface-200',
    label: 'text-surface-500',
    note: 'text-surface-400',
    strong: 'text-surface-900',
    divider: 'border-surface-200',
    total: 'text-primary-600',
  },
};

interface TotalCounterProps {
  data: HeroData;
  theme?: HeroTheme;
  /** Show the "Embed" snippet button (dashboard only, never inside embeds). */
  showEmbedButton?: boolean;
}

function StatTile({
  t,
  label,
  value,
  text,
  note,
  accent,
}: {
  t: (typeof THEMES)[HeroTheme];
  label: string;
  value?: number;
  text?: string;
  note: string;
  accent: string;
}) {
  return (
    <div className={`rounded-xl border p-4 min-w-0 ${t.tile}`}>
      <p className={`text-[11px] uppercase tracking-wider ${t.label}`}>{label}</p>
      {value !== undefined ? (
        <div className={`text-2xl font-bold mt-1 ${accent}`}>
          <AnimatedNumber value={value} duration={1500} />
        </div>
      ) : (
        <div className={`text-lg font-bold mt-1 leading-tight truncate ${accent}`} title={text}>
          {text}
        </div>
      )}
      <p className={`text-xs mt-1 ${t.note}`}>{note}</p>
    </div>
  );
}

export function TotalCounter({ data: b, theme = 'dark', showEmbedButton = false }: TotalCounterProps) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed') || location.pathname.startsWith('/widget');
  const t = THEMES[theme];
  const fmt = (n: number) => n.toLocaleString('en-US');
  const jobTypeName = b.topJobType ? JOB_TYPE_LABELS[b.topJobType.slug] || b.topJobType.slug : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 md:p-8 relative ${t.container}`}
    >
      {showEmbedButton && !isEmbed && <WidgetEmbedButton />}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 lg:gap-8 items-center">
        {/* Primary number */}
        <div className="text-center lg:text-left">
          <p className={`text-sm uppercase tracking-wider mb-2 ${t.label}`}>
            Total Jobs Displaced by AI
          </p>
          <div className="text-5xl md:text-7xl font-bold">
            <AnimatedNumber value={b.total} className={t.total} />
          </div>
          <p className={`text-sm mt-3 ${t.label}`}>
            Layoffs + jobs never created, since November 30, 2022 (ChatGPT launch)
          </p>
          <p className={`text-xs mt-1 ${t.note}`}>
            {fmt(b.companyCount)} companies · {fmt(b.eventCount)} verified layoff events
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatTile t={t} label="Layoffs" value={b.layoffs} note="part of total" accent={t.strong} />
          <StatTile t={t} label="Jobs Never Created" value={b.neverCreated} note="part of total" accent="text-never-500" />
          <StatTile t={t} label="Robotics" value={b.robotics} note="of layoffs" accent="text-robotics-500" />
          <StatTile t={t} label="AI Jobs Created" value={b.jobsCreated} note="new roles, not in total" accent="text-success-500" />
          <StatTile
            t={t}
            label="Most Impacted Industry"
            text={b.topIndustry?.name ?? '—'}
            note={b.topIndustry ? `${fmt(b.topIndustry.count)} jobs` : ''}
            accent={t.strong}
          />
          <StatTile
            t={t}
            label="Top Job Category"
            text={jobTypeName}
            note={b.topJobType ? `${fmt(b.topJobType.count)} jobs` : ''}
            accent={t.strong}
          />
        </div>
      </div>

      {/* Future numbers, never counted */}
      <div className={`mt-6 pt-4 border-t flex flex-wrap gap-x-6 gap-y-1 text-sm justify-center lg:justify-start ${t.divider} ${t.label}`}>
        <span className={`uppercase tracking-wider text-xs self-center ${t.note}`}>
          Not included in total:
        </span>
        <span>
          Planned / announced cuts <span className="font-semibold text-warning-500">{fmt(b.plannedCuts)}</span>
        </span>
        <span>
          Future jobs never created <span className="font-semibold text-never-500">{fmt(b.futureNeverCreated)}</span>
        </span>
      </div>
    </motion.div>
  );
}

function WidgetEmbedButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState('');

  const variants = [
    {
      label: 'Dark (default)',
      code: '<iframe src="https://aishift.michaelkristof.com/widget/stats" width="100%" height="560" frameborder="0" style="border: none;"></iframe>',
    },
    {
      label: 'Light',
      code: '<iframe src="https://aishift.michaelkristof.com/widget/stats?theme=light" width="100%" height="560" frameborder="0" style="border: none;"></iframe>',
    },
    {
      label: 'Transparent',
      code: '<iframe src="https://aishift.michaelkristof.com/widget/stats?theme=transparent" width="100%" height="560" frameborder="0" style="border: none;"></iframe>',
    },
  ];

  const handleCopy = async (code: string, label: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-surface-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        title="Embed this widget"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Embed Stats Widget</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-surface-400 hover:text-surface-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-surface-500 mb-4">
              Embed live stats that auto-update. Choose a theme:
            </p>
            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-surface-700">{v.label}</span>
                    <button
                      onClick={() => handleCopy(v.code, v.label)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        copied === v.label
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white border border-surface-300 text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      {copied === v.label ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-surface-50 border border-surface-200 rounded-lg p-2 text-xs text-surface-600 overflow-x-auto whitespace-pre-wrap break-all">
                    {v.code}
                  </pre>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-surface-400">
              <p>Set <code className="bg-surface-100 px-1 rounded">height</code> to fit your layout: about 400 on full-width pages, 560 in a blog column, 730 on narrow or mobile layouts. Numbers update automatically from live data.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
