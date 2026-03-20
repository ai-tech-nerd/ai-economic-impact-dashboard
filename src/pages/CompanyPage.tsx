import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { formatNumber, formatDate } from '../utils/formatters';
import { SourceCitation } from '../components/shared/SourceCitation';
import type { DisplacementEvent, CompanyProfile, AIMilestone } from '../types';

interface CompanyPageProps {
  events: DisplacementEvent[];
  companies: CompanyProfile[];
  milestones: AIMilestone[];
}

const COMPANY_DISPLAY: Record<string, { name: string; description: string }> = {
  openai: {
    name: 'OpenAI',
    description: 'Creator of ChatGPT, GPT-4, DALL·E, and Codex. The company that ignited the generative AI revolution.',
  },
  anthropic: {
    name: 'Anthropic',
    description: 'AI safety company behind Claude. Founded by former OpenAI researchers with a focus on building safe, reliable AI.',
  },
  google: {
    name: 'Google',
    description: 'Maker of Gemini, NotebookLM, and Vertex AI. Integrating AI across Search, Workspace, and Cloud.',
  },
  'google-deepmind': {
    name: 'Google DeepMind',
    description: 'Google\'s AI research lab behind AlphaFold, Gemini models, Veo, Imagen, and SynthID.',
  },
  meta: {
    name: 'Meta',
    description: 'Open-source AI leader with the Llama model family, Meta AI assistant, and AI Studio.',
  },
  'stability-ai': {
    name: 'Stability AI',
    description: 'Pioneer of open-source image generation with Stable Diffusion.',
  },
  github: {
    name: 'GitHub',
    description: 'Home of Copilot, the first widely-adopted AI coding assistant.',
  },
  midjourney: {
    name: 'Midjourney',
    description: 'Independent AI lab creating one of the most popular image generation tools.',
  },
  mistral: {
    name: 'Mistral AI',
    description: 'French AI company building open-weight language models and Le Chat assistant.',
  },
  xai: {
    name: 'xAI',
    description: 'Elon Musk\'s AI company behind Grok, integrated with the X platform.',
  },
  deepseek: {
    name: 'DeepSeek',
    description: 'Chinese AI lab producing high-performance open-weight models.',
  },
  perplexity: {
    name: 'Perplexity',
    description: 'AI-powered answer engine combining search with language model responses.',
  },
  apple: {
    name: 'Apple',
    description: 'Integrating AI across iPhone, iPad, and Mac with Apple Intelligence.',
  },
  adobe: {
    name: 'Adobe',
    description: 'Creative software giant with Firefly generative AI for images and design.',
  },
  'inflection-ai': {
    name: 'Inflection AI',
    description: 'Creator of Pi personal assistant. Key team later joined Microsoft.',
  },
  'black-forest-labs': {
    name: 'Black Forest Labs',
    description: 'Creators of FLUX, an advanced open-source image generation model.',
  },
  runway: {
    name: 'Runway',
    description: 'AI video generation pioneer with Gen-1 through Gen-4 models.',
  },
  pika: {
    name: 'Pika',
    description: 'AI video generation startup focused on creative video tools.',
  },
  suno: {
    name: 'Suno',
    description: 'AI music generation platform creating songs from text prompts.',
  },
  elevenlabs: {
    name: 'ElevenLabs',
    description: 'Leading AI voice synthesis and cloning platform.',
  },
  heygen: {
    name: 'HeyGen',
    description: 'AI avatar and video creation platform for business communications.',
  },
  synthesia: {
    name: 'Synthesia',
    description: 'AI video platform creating presenters from text, used by enterprises worldwide.',
  },
  cursor: {
    name: 'Cursor',
    description: 'AI-native code editor built on VS Code with deep AI integration.',
  },
  bolt: {
    name: 'Bolt',
    description: 'StackBlitz\'s AI app builder for creating full-stack web apps from prompts.',
  },
  lovable: {
    name: 'Lovable',
    description: 'AI-powered web app builder turning ideas into working applications.',
  },
  replit: {
    name: 'Replit',
    description: 'Cloud IDE with AI coding agent for building software collaboratively.',
  },
  manus: {
    name: 'Manus',
    description: 'AI agent platform acquired by Meta to advance autonomous AI capabilities.',
  },
  academic: {
    name: 'Academic',
    description: 'Foundational AI research from universities and conferences that shaped the field.',
  },
  mit: {
    name: 'MIT',
    description: 'Massachusetts Institute of Technology — pioneering AI research including early chatbots and robotics.',
  },
  stanford: {
    name: 'Stanford',
    description: 'Stanford University and SRI International — home of Shakey the Robot and key autonomous vehicle research.',
  },
  darpa: {
    name: 'DARPA',
    description: 'Defense Advanced Research Projects Agency — funded foundational AI and autonomous vehicle competitions.',
  },
  ibm: {
    name: 'IBM',
    description: 'Built Deep Blue and Watson, pioneering AI in chess, Jeopardy!, and enterprise applications.',
  },
  irobot: {
    name: 'iRobot',
    description: 'Creator of the Roomba, bringing AI-powered autonomous navigation into consumer homes.',
  },
  deepmind: {
    name: 'DeepMind',
    description: 'AI research lab behind AlphaGo, AlphaFold, and foundational reinforcement learning breakthroughs. Acquired by Google in 2014.',
  },
  'hugging-face': {
    name: 'Hugging Face',
    description: 'Open-source AI platform and model hub, home to thousands of community models and datasets.',
  },
  databricks: {
    name: 'Databricks',
    description: 'Data and AI platform building the lakehouse architecture, with major acquisitions in AI-native data infrastructure.',
  },
  cognition: {
    name: 'Cognition',
    description: 'Creator of Devin, the first autonomous AI software engineer, and acquirer of Windsurf AI coding IDE.',
  },
  amazon: {
    name: 'Amazon',
    description: 'AWS cloud leader investing heavily in AI infrastructure, Alexa+, and AI-powered logistics and automation.',
  },
};

// Country/jurisdiction slugs to exclude from company listings
const COUNTRY_SLUGS = new Set([
  'eu', 'us', 'uk', 'china', 'singapore', 'canada', 'brazil',
  'south-korea', 'india', 'oecd', 'unesco', 'us-government',
]);

const TYPE_COLORS: Record<string, string> = {
  'model-release': 'bg-primary-500',
  'company-launch': 'bg-success-500',
  acquisition: 'bg-warning-500',
  partnership: 'bg-purple-500',
  regulation: 'bg-danger-500',
  breakthrough: 'bg-cyan-500',
};

const TYPE_LABELS: Record<string, string> = {
  'model-release': 'Model Release',
  'company-launch': 'Launch',
  acquisition: 'Acquisition',
  partnership: 'Partnerships & Funding',
  regulation: 'Regulation',
  breakthrough: 'Breakthrough',
};

export function CompanyPage({ events, companies, milestones }: CompanyPageProps) {
  const { id } = useParams<{ id: string }>();

  if (id) {
    return <CompanyDetail id={id} events={events} companies={companies} milestones={milestones} />;
  }

  return <CompanyList events={events} milestones={milestones} />;
}

function CompanyList({
  events,
  milestones,
}: {
  events: DisplacementEvent[];
  milestones: AIMilestone[];
}) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'alpha' | 'milestones'>('alpha');

  // Group milestones by company (exclude country/jurisdiction entries)
  const companyMilestones = useMemo(() => {
    const map: Record<string, AIMilestone[]> = {};
    for (const m of milestones) {
      if (COUNTRY_SLUGS.has(m.company)) continue;
      if (!map[m.company]) map[m.company] = [];
      map[m.company].push(m);
    }
    // Sort each company's milestones by date
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.date.localeCompare(b.date));
    }
    return map;
  }, [milestones]);

  // Group displacement events by company
  const companyDisplacements = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    for (const evt of events) {
      if (!map[evt.company]) map[evt.company] = { total: 0, count: 0 };
      map[evt.company].total += evt.jobsCut;
      map[evt.company].count += 1;
    }
    return map;
  }, [events]);

  // Get all unique companies from milestones
  const companyKeys = useMemo(() => {
    return Object.keys(companyMilestones)
      .filter((key) => {
        const display = COMPANY_DISPLAY[key];
        const name = display?.name || key;
        return !search || name.toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (sortBy === 'alpha') {
          const nameA = COMPANY_DISPLAY[a]?.name || a;
          const nameB = COMPANY_DISPLAY[b]?.name || b;
          return nameA.localeCompare(nameB);
        }
        return (companyMilestones[b]?.length || 0) - (companyMilestones[a]?.length || 0);
      });
  }, [companyMilestones, search, sortBy]);

  return (
    <PageLayout
      title="AI Companies"
      subtitle="How major AI companies are evolving and their impact on the workforce"
      embedPath="/companies"
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'alpha' | 'milestones')}
          className="px-3 py-2 border border-surface-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="alpha">A–Z</option>
          <option value="milestones">Most milestones</option>
        </select>
        <span className="text-sm text-surface-400 ml-auto">
          {companyKeys.length} companies
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companyKeys.map((key) => {
          const display = COMPANY_DISPLAY[key];
          const name = display?.name || key;
          const desc = display?.description || '';
          const ms = companyMilestones[key] || [];
          const displacement = companyDisplacements[key];
          const latest = ms[ms.length - 1];

          return (
            <Link
              key={key}
              to={`/companies/${key}`}
              className="bg-white rounded-xl shadow-sm border border-surface-200 p-5 hover:shadow-md transition-shadow no-underline group"
            >
              <h3 className="font-semibold text-surface-900 text-lg group-hover:text-primary-600 transition-colors">
                {name}
              </h3>
              {desc && (
                <p className="text-xs text-surface-500 mt-1 line-clamp-2">{desc}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{ms.length}</div>
                  <div className="text-xs text-surface-500">milestones</div>
                </div>
                {displacement && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-danger-600">
                      {formatNumber(displacement.total)}
                    </div>
                    <div className="text-xs text-surface-500">jobs displaced</div>
                  </div>
                )}
              </div>
              {latest && (
                <div className="mt-3 pt-3 border-t border-surface-100">
                  <div className="text-xs text-surface-400">Latest milestone</div>
                  <div className="text-sm font-medium text-surface-700 truncate">
                    {latest.name}
                  </div>
                  <div className="text-xs text-surface-400">{formatDate(latest.date)}</div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </PageLayout>
  );
}

function CompanyDetail({
  id,
  events,
  companies,
  milestones,
}: {
  id: string;
  events: DisplacementEvent[];
  companies: CompanyProfile[];
  milestones: AIMilestone[];
}) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'displacement'>('timeline');

  const companyMilestones = milestones
    .filter((m) => m.company === id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const companyEvents = events
    .filter((e) => e.company === id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const profile = companies.find((c) => c.id === id);
  const display = COMPANY_DISPLAY[id];
  const name = display?.name || profile?.name || companyEvents[0]?.companyName || id;
  const description = display?.description || profile?.description || '';
  const totalDisplaced = companyEvents.reduce((s, e) => s + e.jobsCut, 0);

  return (
    <PageLayout title={name} subtitle={description}>
      <Link
        to="/companies"
        className="text-primary-600 hover:text-primary-700 text-sm mb-6 inline-block"
      >
        &larr; Back to all companies
      </Link>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-5 text-center">
          <div className="text-3xl font-bold text-primary-600">
            {companyMilestones.length}
          </div>
          <div className="text-sm text-surface-500">AI Milestones</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-5 text-center">
          <div className="text-3xl font-bold text-danger-600">
            {totalDisplaced > 0 ? formatNumber(totalDisplaced) : '—'}
          </div>
          <div className="text-sm text-surface-500">Jobs Displaced</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-5 text-center">
          <div className="text-3xl font-bold text-surface-800">
            {companyMilestones.length > 0
              ? `${formatDate(companyMilestones[0].date).split(',')[0]} ${formatDate(companyMilestones[0].date).split(',')[1]?.trim() || ''}`
              : '—'}
          </div>
          <div className="text-sm text-surface-500">First Milestone</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'bg-primary-600 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          }`}
        >
          AI Timeline ({companyMilestones.length})
        </button>
        {companyEvents.length > 0 && (
          <button
            onClick={() => setActiveTab('displacement')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'displacement'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Displacement Events ({companyEvents.length})
          </button>
        )}
      </div>

      {activeTab === 'timeline' ? (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-200" />
          {companyMilestones.map((milestone, i) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="relative flex items-start gap-4 mb-6"
            >
              <div
                className={`absolute left-4 w-3 h-3 rounded-full -translate-x-1.5 mt-2 ${
                  TYPE_COLORS[milestone.type] || 'bg-surface-400'
                }`}
              />
              <div className="ml-10 bg-white rounded-xl shadow-sm border border-surface-200 p-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs text-white px-2 py-0.5 rounded-full ${
                      TYPE_COLORS[milestone.type] || 'bg-surface-400'
                    }`}
                  >
                    {TYPE_LABELS[milestone.type] || milestone.type}
                  </span>
                  <span className="text-xs text-surface-400">
                    {formatDate(milestone.date)}
                  </span>
                </div>
                <h3 className="font-semibold text-surface-900">{milestone.name}</h3>
                <p className="text-sm text-surface-600 mt-1">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
          {companyMilestones.length === 0 && (
            <p className="text-surface-500 text-center py-8 ml-10">
              No milestones recorded for this company yet.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {companyEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-xl shadow-sm border border-surface-200 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm text-surface-400">
                    {formatDate(evt.date)}
                  </span>
                  <h3 className="font-semibold text-surface-900 mt-1">
                    {formatNumber(evt.jobsCut)} jobs cut
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {evt.jobTypes.map((jt) => (
                    <span
                      key={jt}
                      className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                    >
                      {jt}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-surface-600">{evt.description}</p>
              <SourceCitation sources={evt.sources} />
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
