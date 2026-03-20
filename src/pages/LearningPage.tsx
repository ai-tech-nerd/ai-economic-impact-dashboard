import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import {
  AI_TOOLS,
  PROMPT_FRAMEWORKS,
  FRAMEWORK_GUIDE,
  ACTION_PLAN,
  IRREPLACEABLE_SKILLS,
  FREE_RESOURCES,
  PRIVACY_TIPS,
  NEVER_SHARE,
  AI_GLOSSARY,
} from '../content/learning-content';
import type { PromptFramework } from '../content/learning-content';

type Tab = 'start' | 'prompting' | 'tools' | 'courses' | 'glossary';

const TABS: { id: Tab; label: string }[] = [
  { id: 'start', label: 'Start Here' },
  { id: 'prompting', label: 'AI Prompting Guides' },
  { id: 'tools', label: 'Free AI Tools' },
  { id: 'courses', label: 'Free AI Courses' },
  { id: 'glossary', label: 'AI Glossary' },
];

export function LearningPage() {
  const [activeTab, setActiveTab] = useState<Tab>('start');

  return (
    <PageLayout
      title="Learn & Prepare"
      subtitle="Practical resources for understanding AI and positioning yourself for success"
      embedPath="/learn"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-surface-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'start' && <PathForwardSection />}
        {activeTab === 'prompting' && <PromptingSection />}
        {activeTab === 'tools' && <ToolsSection />}
        {activeTab === 'courses' && <ResourcesSection />}
        {activeTab === 'glossary' && <GlossarySection />}
      </motion.div>
    </PageLayout>
  );
}

/* ─── Free AI Tools ─── */

function ToolsSection() {
  return (
    <div>
      <p className="text-surface-600 mb-6 max-w-3xl">
        The single most important thing you can do is start using AI tools now. All of these have free tiers — no credit card needed.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_TOOLS.map((tool) => (
          <div key={tool.name} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-surface-900">{tool.name}</h3>
              <span className="text-xs bg-success-500 text-white px-2 py-0.5 rounded-full">
                Free tier
              </span>
            </div>
            <p className="text-xs text-surface-400 mb-2">by {tool.company}</p>
            <p className="text-sm text-surface-600 mb-4">{tool.description}</p>

            {/* Capability pills */}
            <div className="flex flex-wrap gap-1 mb-4">
              {tool.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                >
                  {cap}
                </span>
              ))}
            </div>

            {/* Service links */}
            {tool.services.length > 1 && (
              <div className="border-t border-surface-100 pt-3 mb-3">
                <p className="text-xs font-medium text-surface-500 mb-2">Products & services</p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.services.map((svc) => (
                    <a
                      key={svc.name}
                      href={svc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-surface-50 text-primary-600 hover:bg-primary-50 border border-surface-200 hover:border-primary-300 px-2 py-1 rounded-full transition-colors no-underline"
                    >
                      {svc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Try it free &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI Prompting Guides ─── */

const FRAMEWORK_COLORS: Record<string, string> = {
  rtto: 'bg-success-500',
  craft: 'bg-primary-600',
  score: 'bg-warning-500',
  stay: 'bg-purple-500',
  train: 'bg-danger-500',
};

function PromptingSection() {
  const [activeFramework, setActiveFramework] = useState<string>(PROMPT_FRAMEWORKS[0].id);
  const [guideOpen, setGuideOpen] = useState(false);
  const current = PROMPT_FRAMEWORKS.find((f) => f.id === activeFramework) || PROMPT_FRAMEWORKS[0];

  return (
    <div className="space-y-8">
      {/* Which Framework accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-surface-50 transition-colors"
        >
          <div>
            <h2 className="text-xl font-bold text-surface-900">Which AI prompting framework should I use?</h2>
            <p className="text-sm text-surface-500 italic mt-1">Five frameworks. One system. Here's how to choose.</p>
            <p className="text-sm text-surface-600 mt-2">
              You don't need a different framework for every situation — you need the right one for where you are in the process.
              These five frameworks cover the full arc of working with AI: from your first prompt to a finished project. Use this guide to find your entry point.
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-surface-400 flex-shrink-0 mt-1 transition-transform ${guideOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {guideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-6 border-t border-surface-100"
          >
            {/* Frameworks at a glance */}
            <div className="mt-5 mb-6">
              <h3 className="font-semibold text-surface-900 mb-3">The five frameworks at a glance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 text-left">
                      <th className="pb-2 pr-4 font-semibold text-surface-700">Framework</th>
                      <th className="pb-2 pr-4 font-semibold text-surface-700">Job</th>
                      <th className="pb-2 pr-4 font-semibold text-surface-700">Best for</th>
                      <th className="pb-2 font-semibold text-surface-700">Skill level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    <tr><td className="py-2 pr-4 font-semibold">R.T.T.O.</td><td className="py-2 pr-4 text-surface-600">Quick-start any request</td><td className="py-2 pr-4 text-surface-600">Simple tasks, first prompts</td><td className="py-2 text-surface-600">Beginner</td></tr>
                    <tr><td className="py-2 pr-4 font-semibold">C.R.A.F.T.</td><td className="py-2 pr-4 text-surface-600">Build complex prompts</td><td className="py-2 pr-4 text-surface-600">High-stakes, multi-part work</td><td className="py-2 text-surface-600">Intermediate</td></tr>
                    <tr><td className="py-2 pr-4 font-semibold">S.C.O.R.E.</td><td className="py-2 pr-4 text-surface-600">Audit before you send</td><td className="py-2 pr-4 text-surface-600">Any prompt, any skill level</td><td className="py-2 text-surface-600">Any</td></tr>
                    <tr><td className="py-2 pr-4 font-semibold">S.T.A.Y.</td><td className="py-2 pr-4 text-surface-600">Sustain a long session</td><td className="py-2 pr-4 text-surface-600">Multi-step creative projects</td><td className="py-2 text-surface-600">Intermediate+</td></tr>
                    <tr><td className="py-2 pr-4 font-semibold">T.R.A.I.N.</td><td className="py-2 pr-4 text-surface-600">Debug broken outputs</td><td className="py-2 pr-4 text-surface-600">When results aren't working</td><td className="py-2 text-surface-600">Any</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Find your starting point */}
            <div className="mb-6">
              <h3 className="font-semibold text-surface-900 mb-3">Find your starting point</h3>
              <div className="space-y-3">
                {[
                  { quote: "I'm new to AI prompting and just need something that works.", fw: 'R.T.T.O.', detail: 'Four components, no complexity. Gets you useful output fast.' },
                  { quote: "I'm working on something important — a pitch, a campaign, a strategy.", fw: 'C.R.A.F.T.', detail: 'It structures everything the AI needs to produce high-quality work on complex requests.' },
                  { quote: "I have a prompt ready but I'm not confident it's good.", fw: 'S.C.O.R.E.', detail: 'A five-question audit catches gaps before they cost you a bad output.' },
                  { quote: "I'm deep in a project and the AI keeps drifting or losing context.", fw: 'S.T.A.Y.', detail: 'Built for long sessions — keeps context tight and gives you a clean handoff when you\'re done.' },
                  { quote: "The output isn't working and I don't know why.", fw: 'T.R.A.I.N.', detail: 'Diagnoses what\'s broken and gives you a step-by-step fix.' },
                ].map((item) => (
                  <div key={item.fw} className="bg-surface-50 rounded-lg p-4">
                    <p className="text-sm text-surface-700 italic">"{item.quote}"</p>
                    <p className="text-sm mt-1">
                      <span className="text-surface-500">→ Start with </span>
                      <span className="font-semibold text-primary-600">{item.fw}</span>
                    </p>
                    <p className="text-xs text-surface-400 mt-0.5">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick reference by situation */}
            <div className="mb-6">
              <h3 className="font-semibold text-surface-900 mb-3">Quick reference by situation</h3>
              <div className="divide-y divide-surface-100 border border-surface-200 rounded-lg overflow-hidden">
                {FRAMEWORK_GUIDE.situations.map((s) => (
                  <div key={s.situation} className="flex items-center justify-between px-4 py-2.5 bg-white">
                    <span className="text-sm text-surface-600">{s.situation}</span>
                    <span className="text-sm font-semibold text-primary-600 whitespace-nowrap ml-4">{s.framework}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How they work together */}
            <div className="mb-6">
              <h3 className="font-semibold text-surface-900 mb-3">How they work together</h3>
              <p className="text-sm text-surface-600 mb-3">
                These frameworks are sequential. Most productive AI sessions move through this arc:
              </p>
              <p className="text-sm font-semibold text-surface-800 mb-3">Build → Check → Send → Sustain → Fix</p>
              <div className="bg-surface-50 rounded-lg p-4 mb-4">
                <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                  {FRAMEWORK_GUIDE.workflowSteps.map((ws, i) => (
                    <span key={ws.step} className="flex items-center gap-2">
                      {i > 0 && <span className="text-surface-300">→</span>}
                      <span className="font-semibold text-surface-800">{ws.step}</span>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-surface-400 mt-1 font-mono">
                  {FRAMEWORK_GUIDE.workflowSteps.map((ws, i) => (
                    <span key={ws.label} className="flex items-center gap-2">
                      {i > 0 && <span className="text-transparent">→</span>}
                      <span>({ws.label})</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-surface-600 space-y-2">
                <p><strong>A typical creative workflow:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-surface-600">
                  <li>Starting a new campaign brief? <strong>R.T.T.O.</strong> to get moving, <strong>C.R.A.F.T.</strong> once the scope gets complex.</li>
                  <li>Before sending any high-stakes prompt? <strong>S.C.O.R.E.</strong> takes 60 seconds and catches most problems.</li>
                  <li>Working through a multi-day project? <strong>S.T.A.Y.</strong> keeps the AI aligned across sessions.</li>
                  <li>Output went sideways? <strong>T.R.A.I.N.</strong> tells you exactly what to fix.</li>
                </ol>
              </div>
            </div>

            {/* Skill level guide */}
            <div className="mb-4">
              <h3 className="font-semibold text-surface-900 mb-3">Skill level guide</h3>
              <div className="space-y-2 text-sm text-surface-600">
                <p><strong>New to AI prompting:</strong> Start with R.T.T.O. Add S.C.O.R.E. once you're comfortable. You may not need the others yet.</p>
                <p><strong>Intermediate:</strong> C.R.A.F.T. and S.C.O.R.E. should be your defaults. Reach for T.R.A.I.N. when outputs break down.</p>
                <p><strong>Advanced / Daily AI user:</strong> All five. S.T.A.Y. becomes essential once you're running complex multi-session projects.</p>
              </div>
            </div>

            <p className="text-xs text-surface-400 italic">
              These frameworks work with any AI tool: Claude, ChatGPT, Gemini, or others. The principles don't change. The prompts do.
            </p>
          </motion.div>
        )}
      </div>

      {/* Framework selector */}
      <div className="flex flex-wrap gap-2">
        {PROMPT_FRAMEWORKS.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setActiveFramework(fw.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFramework === fw.id
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            {fw.acronym} <span className="hidden sm:inline">— {fw.title}</span>
          </button>
        ))}
      </div>

      {/* Active framework detail */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <FrameworkCard framework={current} />
      </motion.div>
    </div>
  );
}

function FrameworkCard({ framework }: { framework: PromptFramework }) {
  const color = FRAMEWORK_COLORS[framework.id] || 'bg-primary-600';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={`${color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
            {framework.acronym}
          </span>
          <span className="text-sm text-surface-400">{framework.bestFor}</span>
        </div>
        <h2 className="text-xl font-bold text-surface-900">{framework.tagline}</h2>
        <p className="text-sm text-surface-600 mt-1">{framework.description}</p>
      </div>

      <div className="space-y-5">
        {framework.steps.map((step, i) => (
          <div key={`${step.letter}-${i}`} className="flex gap-4">
            <div className={`flex-shrink-0 w-10 h-10 ${color} text-white rounded-lg flex items-center justify-center text-lg font-bold`}>
              {step.letter}
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 text-sm">{step.label}</h3>
              <p className="text-sm text-surface-600 mb-1">{step.description}</p>
              <p className="text-xs text-surface-400 italic">{step.example}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-primary-800">
          <strong>Pro tip:</strong> {framework.proTip}
        </p>
      </div>
    </div>
  );
}

/* ─── Free Courses ─── */

function ResourcesSection() {
  return (
    <div>
      <p className="text-surface-600 mb-6 max-w-3xl">
        Free courses from industry leaders to deepen your understanding of AI — from beginner fundamentals to advanced applications.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FREE_RESOURCES.map((resource) => (
          <a
            key={resource.name}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-5 hover:shadow-md transition-shadow no-underline block"
          >
            <h3 className="font-semibold text-primary-600 mb-1">{resource.name}</h3>
            <p className="text-sm text-surface-600">{resource.description}</p>
            <span className="text-xs text-primary-500 mt-2 inline-block">Visit &rarr;</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── AI Glossary ─── */

function GlossarySection() {
  const [openCategory, setOpenCategory] = useState<string | null>(AI_GLOSSARY[0]?.name ?? null);

  return (
    <div className="max-w-4xl">
      <p className="text-surface-600 mb-6">
        Key AI terms you'll encounter in the news, at work, and in this dashboard. For the complete glossary with 100+ terms, visit{' '}
        <a
          href="https://www.michaelkristof.com/ai-knowledge-center/ai-business-glossary/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          the full AI glossary
        </a>.
      </p>

      <div className="space-y-2">
        {AI_GLOSSARY.map((category) => (
          <div key={category.name} className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
            <button
              onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors"
            >
              <span className="font-semibold text-surface-900">{category.name}</span>
              <span className="text-surface-400 text-sm">
                {category.terms.length} terms
                <svg
                  className={`w-4 h-4 inline-block ml-1 transition-transform ${
                    openCategory === category.name ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {openCategory === category.name && (
              <div className="border-t border-surface-100 px-5 py-4 space-y-4">
                {category.terms.map((t) => (
                  <div key={t.term}>
                    <dt className="font-medium text-sm text-surface-900">{t.term}</dt>
                    <dd className="text-sm text-surface-600 mt-0.5">{t.definition}</dd>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="https://www.michaelkristof.com/ai-knowledge-center/ai-business-glossary/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium no-underline"
        >
          View complete glossary (100+ terms) &rarr;
        </a>
      </div>
    </div>
  );
}

/* ─── Your Path Forward (always visible below tabs) ─── */

function PathForwardSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mt-16 border-t border-surface-200 pt-12">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-3">Your path forward</h2>
        <p className="text-surface-600 max-w-3xl">
          The people who will thrive in the AI era aren't necessarily the most technical — they're the ones who learn to work alongside AI effectively.
          Here's a practical roadmap that ties everything together.
        </p>
      </div>

      {/* 30-Day Action Plan */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-surface-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
          30-Day action plan
        </h3>
        <p className="text-sm text-surface-500 mb-6 ml-10">
          {ACTION_PLAN.intro}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
          {ACTION_PLAN.weeks.map((week) => (
            <div key={week.week} className="bg-white rounded-xl shadow-sm border border-surface-200 p-5">
              <h4 className="text-base font-semibold text-surface-900 mb-3">
                Week {week.week}: {week.title}
              </h4>
              <div className="space-y-2.5">
                {week.tasks.map((task, i) => {
                  const key = `${week.week}-${i}`;
                  return (
                    <label key={key} className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!checked[key]}
                        onChange={() => toggle(key)}
                        className="mt-0.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span
                        className={`text-sm ${
                          checked[key] ? 'text-surface-400 line-through' : 'text-surface-700'
                        }`}
                      >
                        {task}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protect Yourself */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-surface-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
          Protect yourself
        </h3>
        <p className="text-sm text-surface-500 mb-6 ml-10">
          Before you share information with AI tools, understand how your data may be used.
          Most free AI tools use your conversations to train future models — your prompts may be reviewed by humans and retained for years.
          <strong> Treat AI conversations like email: don't share anything you wouldn't want read by others.</strong>
        </p>

        <div className="ml-10 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-5">
            <h4 className="text-base font-semibold text-surface-900 mb-4">Privacy settings by platform</h4>
            <div className="space-y-4">
              {PRIVACY_TIPS.map((tip) => (
                <div key={tip.tool} className="border-l-4 border-primary-500 pl-4">
                  <h5 className="font-medium text-surface-900">{tip.tool}</h5>
                  <p className="text-sm text-surface-600">{tip.instruction}</p>
                  {tip.note && <p className="text-xs text-surface-400 mt-0.5">{tip.note}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-danger-500/5 border border-danger-500/20 rounded-xl p-5">
            <h4 className="text-base font-semibold text-danger-600 mb-3">Never share with any AI tool</h4>
            <ul className="space-y-1.5">
              {NEVER_SHARE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-surface-700">
                  <span className="text-danger-500 mt-0.5">&#10005;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-50 rounded-xl border border-surface-200 p-4">
            <p className="text-sm text-surface-600">
              <strong>Enterprise plans</strong> from OpenAI, Anthropic, and Google generally do NOT use your data for training by default.
              If your company has a corporate AI subscription, your data is typically better protected. Always verify with your IT department.
            </p>
          </div>
        </div>
      </div>

      {/* Build AI-Resistant Skills */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-surface-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
          Build AI-resistant skills
        </h3>
        <p className="text-sm text-surface-500 mb-6 ml-10">
          While learning to use AI, also invest in skills that complement rather than compete with it.
          These capabilities remain valuable regardless of how AI advances.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-10">
          {IRREPLACEABLE_SKILLS.map((skill) => (
            <div
              key={skill.name}
              className="bg-white rounded-xl shadow-sm border border-surface-200 p-5"
            >
              <h4 className="font-semibold text-surface-900 mb-2">{skill.name}</h4>
              <p className="text-sm text-surface-600">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing */}
      <div className="bg-primary-50 rounded-xl p-6 text-center max-w-2xl mx-auto">
        <p className="text-primary-800 font-medium mb-2">
          AI won't replace everyone. But people who know how to use AI will replace people who don't.
        </p>
        <p className="text-sm text-primary-700">
          The best time to start preparing was a year ago. The second best time is today.
        </p>
      </div>
    </div>
  );
}
