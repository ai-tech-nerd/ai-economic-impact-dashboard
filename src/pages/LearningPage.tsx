import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import {
  AI_TOOLS,
  CRAFT_FRAMEWORK,
  PROMPTING_TECHNIQUES,
  ACTION_PLAN,
  IRREPLACEABLE_SKILLS,
  FREE_RESOURCES,
  PRIVACY_TIPS,
  NEVER_SHARE,
  AI_GLOSSARY,
} from '../content/learning-content';

type Tab = 'tools' | 'prompting' | 'courses' | 'glossary';

const TABS: { id: Tab; label: string }[] = [
  { id: 'tools', label: 'Free AI Tools' },
  { id: 'prompting', label: 'AI Prompting Guides' },
  { id: 'courses', label: 'Free Courses' },
  { id: 'glossary', label: 'AI Glossary' },
];

export function LearningPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tools');

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
        {activeTab === 'tools' && <ToolsSection />}
        {activeTab === 'prompting' && <PromptingSection />}
        {activeTab === 'courses' && <ResourcesSection />}
        {activeTab === 'glossary' && <GlossarySection />}
      </motion.div>

      {/* Path Forward — always visible below tabs */}
      <PathForwardSection />
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

function PromptingSection() {
  return (
    <div className="max-w-4xl space-y-8">
      <p className="text-surface-600">
        The quality of AI output depends heavily on how you communicate with it.
        "Prompt engineering" is the skill of crafting inputs that get useful results. Here are the key frameworks to master.
      </p>

      {/* CRAFT Framework */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">{CRAFT_FRAMEWORK.title}</h2>
        <p className="text-surface-600 mb-8">{CRAFT_FRAMEWORK.description}</p>

        <div className="space-y-6">
          {CRAFT_FRAMEWORK.steps.map((step) => (
            <div key={step.letter} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                {step.letter}
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">{step.label}</h3>
                <p className="text-sm text-surface-600 mb-1">{step.description}</p>
                <p className="text-xs text-surface-400 italic">{step.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Techniques */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 mb-4">More prompting techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPTING_TECHNIQUES.map((tech) => (
            <div key={tech.name} className="bg-white rounded-xl shadow-sm border border-surface-200 p-5">
              <h3 className="font-semibold text-surface-900 mb-2">{tech.name}</h3>
              <p className="text-sm text-surface-600 mb-2">{tech.description}</p>
              <p className="text-xs text-surface-400 italic">{tech.example}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-primary-800">
          <strong>Pro tip:</strong> After getting AI's first response, push it further:
          "Make this more concise", "Give me three alternative approaches",
          "What are the weaknesses in this plan?", or "Is this actually the best answer?"
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
