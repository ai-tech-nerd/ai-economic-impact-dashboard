import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import {
  AI_TOOLS,
  CRAFT_FRAMEWORK,
  ACTION_PLAN,
  IRREPLACEABLE_SKILLS,
  FREE_RESOURCES,
  PRIVACY_TIPS,
  NEVER_SHARE,
} from '../content/learning-content';

type Tab = 'tools' | 'craft' | 'action-plan' | 'skills' | 'resources' | 'privacy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'tools', label: 'Free AI Tools' },
  { id: 'craft', label: 'CRAFT Framework' },
  { id: 'action-plan', label: '30-Day Plan' },
  { id: 'skills', label: 'Irreplaceable Skills' },
  { id: 'resources', label: 'Free Courses' },
  { id: 'privacy', label: 'Privacy & Safety' },
];

export function LearningPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tools');

  return (
    <PageLayout
      title="Learn & Prepare"
      subtitle="Practical resources for understanding AI and positioning yourself for success"
      embedPath="/learn"
    >
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

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'tools' && <ToolsSection />}
        {activeTab === 'craft' && <CraftSection />}
        {activeTab === 'action-plan' && <ActionPlanSection />}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'resources' && <ResourcesSection />}
        {activeTab === 'privacy' && <PrivacySection />}
      </motion.div>
    </PageLayout>
  );
}

function ToolsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {AI_TOOLS.map((tool) => (
        <div key={tool.name} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-surface-900">{tool.name}</h3>
            {tool.free && (
              <span className="text-xs bg-success-500 text-white px-2 py-0.5 rounded-full">
                Free Tier
              </span>
            )}
          </div>
          <p className="text-xs text-surface-400 mb-2">by {tool.company}</p>
          <p className="text-sm text-surface-600 mb-4">{tool.description}</p>
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
  );
}

function CraftSection() {
  return (
    <div className="max-w-3xl">
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

        <div className="mt-8 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800">
            <strong>Pro tip:</strong> After getting AI's first response, push it further:
            "Make this more concise", "Give me three alternative approaches",
            "What are the weaknesses in this plan?", or "Is this actually the best answer?"
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionPlanSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      {ACTION_PLAN.weeks.map((week) => (
        <div key={week.week} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-1">
            Week {week.week}: {week.title}
          </h3>
          <div className="mt-4 space-y-3">
            {week.tasks.map((task, i) => {
              const key = `${week.week}-${i}`;
              return (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!checked[key]}
                    onChange={() => toggle(key)}
                    className="mt-1 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
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
  );
}

function SkillsSection() {
  return (
    <div>
      <p className="text-surface-600 mb-6 max-w-2xl">
        Every skill that requires genuine human presence, trust, or responsibility becomes
        more valuable as AI absorbs everything else. These are the skills AI cannot replace:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IRREPLACEABLE_SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-5"
          >
            <h3 className="font-semibold text-surface-900 mb-2">{skill.name}</h3>
            <p className="text-sm text-surface-600">{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesSection() {
  return (
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
  );
}

function PrivacySection() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          Privacy Settings by Platform
        </h3>
        <div className="space-y-4">
          {PRIVACY_TIPS.map((tip) => (
            <div key={tip.tool} className="border-l-4 border-primary-500 pl-4">
              <h4 className="font-medium text-surface-900">{tip.tool}</h4>
              <p className="text-sm text-surface-600">{tip.instruction}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-danger-500/5 border border-danger-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-danger-600 mb-3">
          Never Share with Any AI Tool
        </h3>
        <ul className="space-y-2">
          {NEVER_SHARE.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-surface-700">
              <span className="text-danger-500">&#10005;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
