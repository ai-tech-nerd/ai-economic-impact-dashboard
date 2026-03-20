import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { formatDate } from '../utils/formatters';
import type { AIMilestone } from '../types';

interface AITimelinePageProps {
  milestones: AIMilestone[];
}

const TYPE_COLORS: Record<string, string> = {
  'model-release': 'bg-primary-500',
  'company-launch': 'bg-success-500',
  acquisition: 'bg-warning-500',
  partnership: 'bg-purple-500',
  regulation: 'bg-danger-500',
  breakthrough: 'bg-cyan-500',
};

const TYPE_LABELS: Record<string, string> = {
  'model-release': 'Model release',
  'company-launch': 'Launch',
  acquisition: 'Acquisition',
  partnership: 'Partnerships & funding',
  regulation: 'Regulation',
  breakthrough: 'Breakthrough',
};

const COMPANY_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  'google-deepmind': 'Google DeepMind',
  meta: 'Meta',
  'stability-ai': 'Stability AI',
  github: 'GitHub',
  midjourney: 'Midjourney',
  mistral: 'Mistral AI',
  xai: 'xAI',
  deepseek: 'DeepSeek',
  perplexity: 'Perplexity',
  apple: 'Apple',
  adobe: 'Adobe',
  'inflection-ai': 'Inflection AI',
  'black-forest-labs': 'Black Forest Labs',
  runway: 'Runway',
  pika: 'Pika',
  suno: 'Suno',
  elevenlabs: 'ElevenLabs',
  heygen: 'HeyGen',
  synthesia: 'Synthesia',
  cursor: 'Cursor',
  bolt: 'Bolt',
  lovable: 'Lovable',
  replit: 'Replit',
  manus: 'Manus',
  academic: 'Academic',
  mit: 'MIT',
  stanford: 'Stanford',
  darpa: 'DARPA',
  ibm: 'IBM',
  irobot: 'iRobot',
  deepmind: 'DeepMind',
  'japan-gov': 'Japan Government',
  'hugging-face': 'Hugging Face',
  databricks: 'Databricks',
  cognition: 'Cognition',
  amazon: 'Amazon',
};

// Country/jurisdiction slugs used for regulation entries
const COUNTRY_SLUGS = new Set([
  'eu', 'us', 'uk', 'china', 'singapore', 'canada', 'brazil',
  'south-korea', 'india', 'oecd', 'unesco',
  'us-government',
]);

const COUNTRY_LABELS: Record<string, string> = {
  eu: 'European Union',
  us: 'United States',
  'us-government': 'United States',
  uk: 'United Kingdom',
  china: 'China',
  singapore: 'Singapore',
  canada: 'Canada',
  brazil: 'Brazil',
  'south-korea': 'South Korea',
  india: 'India',
  oecd: 'OECD',
  unesco: 'UNESCO',
};

export function AITimelinePage({ milestones }: AITimelinePageProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // Separate companies from countries/jurisdictions
  const { companyKeys, companyCounts, countryKeys, countryCounts } = useMemo(() => {
    const cc: Record<string, number> = {};
    const jc: Record<string, number> = {};
    for (const m of milestones) {
      if (COUNTRY_SLUGS.has(m.company)) {
        jc[m.company] = (jc[m.company] || 0) + 1;
      } else {
        cc[m.company] = (cc[m.company] || 0) + 1;
      }
    }
    return {
      companyKeys: Object.keys(cc).sort((a, b) =>
        (COMPANY_LABELS[a] || a).localeCompare(COMPANY_LABELS[b] || b),
      ),
      companyCounts: cc,
      countryKeys: Object.keys(jc).sort((a, b) =>
        (COUNTRY_LABELS[a] || a).localeCompare(COUNTRY_LABELS[b] || b),
      ),
      countryCounts: jc,
    };
  }, [milestones]);

  const sorted = useMemo(() => {
    return [...milestones]
      .filter((m) => typeFilter === 'all' || m.type === typeFilter)
      .filter((m) => {
        if (companyFilter !== 'all') return m.company === companyFilter;
        if (countryFilter !== 'all') return m.company === countryFilter;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [milestones, typeFilter, companyFilter, countryFilter]);

  const types = Array.from(new Set(milestones.map((m) => m.type)));

  return (
    <PageLayout
      title="AI Advancements"
      subtitle="Major AI milestones over time"
      embedPath="/ai-advances"
    >
      {/* Type filter — pill buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            typeFilter === 'all'
              ? 'bg-surface-900 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          }`}
        >
          All types
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => {
              setTypeFilter(type);
              if (type !== 'regulation') setCountryFilter('all');
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              typeFilter === type
                ? 'bg-surface-900 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            {TYPE_LABELS[type] || type}
          </button>
        ))}
      </div>

      {/* Company + Country dropdowns */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={companyFilter}
          onChange={(e) => {
            setCompanyFilter(e.target.value);
            if (e.target.value !== 'all') {
              setCountryFilter('all');
              setTypeFilter('all');
            }
          }}
          className="px-3 py-2 border border-surface-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All companies</option>
          {companyKeys.map((key) => (
            <option key={key} value={key}>
              {COMPANY_LABELS[key] || key} ({companyCounts[key]})
            </option>
          ))}
        </select>

        {countryKeys.length > 0 && (
          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              if (e.target.value !== 'all') {
                setCompanyFilter('all');
                setTypeFilter('all');
              }
            }}
            className="px-3 py-2 border border-surface-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All countries</option>
            {countryKeys.map((key) => (
              <option key={key} value={key}>
                {COUNTRY_LABELS[key] || key} ({countryCounts[key]})
              </option>
            ))}
          </select>
        )}

        {(companyFilter !== 'all' || countryFilter !== 'all' || typeFilter !== 'all') && (
          <button
            onClick={() => {
              setTypeFilter('all');
              setCompanyFilter('all');
              setCountryFilter('all');
            }}
            className="px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        )}

        <span className="self-center text-sm text-surface-400 ml-auto">
          {sorted.length} milestone{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-surface-200" />

        {sorted.map((milestone, i) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.03, 1) }}
            className={`relative flex items-start gap-4 mb-8 ${
              i % 2 === 0
                ? 'md:flex-row md:pr-[52%]'
                : 'md:flex-row-reverse md:pl-[52%]'
            }`}
          >
            <div
              className={`absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1.5 mt-2 ${
                TYPE_COLORS[milestone.type] || 'bg-surface-400'
              }`}
            />
            <div className="ml-10 md:ml-0 bg-white rounded-xl shadow-sm border border-surface-200 p-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs text-white px-2 py-0.5 rounded-full ${
                    TYPE_COLORS[milestone.type] || 'bg-surface-400'
                  }`}
                >
                  {TYPE_LABELS[milestone.type] || milestone.type}
                </span>
                <span className="text-xs text-surface-400">{formatDate(milestone.date)}</span>
              </div>
              <h3 className="font-semibold text-surface-900">{milestone.name}</h3>
              <p className="text-sm text-surface-600 mt-1">{milestone.description}</p>
              <p className="text-xs text-surface-400 mt-2">
                {COMPANY_LABELS[milestone.company] || COUNTRY_LABELS[milestone.company] || milestone.company}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
