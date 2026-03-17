export const AI_TOOLS = [
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    description:
      'The most widely used AI assistant. Best for general writing, brainstorming, coding, and research. Free tier includes web search, image generation, and file uploads.',
    url: 'https://chat.openai.com',
    free: true,
    capabilities: ['Writing', 'Coding', 'Research', 'Image Generation', 'Data Analysis'],
  },
  {
    name: 'Claude',
    company: 'Anthropic',
    description:
      'Known for nuanced reasoning and strong performance on complex, long-form work. Can process up to 200,000 words in a single session. Best for analysis, research synthesis, and detailed writing.',
    url: 'https://claude.ai',
    free: true,
    capabilities: ['Long-form Analysis', 'Research Synthesis', 'Coding', 'Writing', 'Reasoning'],
  },
  {
    name: 'Google Gemini',
    company: 'Google',
    description:
      'Integrates directly into Gmail, Docs, Sheets, and Slides. Strong at multimodal tasks and search-connected responses.',
    url: 'https://gemini.google.com',
    free: true,
    capabilities: ['Google Workspace Integration', 'Multimodal', 'Search', 'Coding'],
  },
  {
    name: 'NotebookLM',
    company: 'Google',
    description:
      'Upload documents, PDFs, and YouTube videos as sources, then generate summaries, study guides, timelines, and AI-generated audio discussions.',
    url: 'https://notebooklm.google.com',
    free: true,
    capabilities: ['Document Analysis', 'Audio Summaries', 'Study Guides', 'Research'],
  },
  {
    name: 'Perplexity AI',
    company: 'Perplexity',
    description:
      'AI-powered search that returns sourced, cited answers instead of links. Best for research, fact-checking, and staying current.',
    url: 'https://perplexity.ai',
    free: true,
    capabilities: ['Research', 'Fact-checking', 'Cited Answers', 'Real-time Search'],
  },
];

export const CRAFT_FRAMEWORK = {
  title: 'The CRAFT Method',
  description: 'A structured framework for any complex AI request:',
  steps: [
    {
      letter: 'C',
      label: 'Context',
      description: 'Who are you? What is the situation? Who is the audience?',
      example: '"I\'m a marketing manager preparing a quarterly report for executive leadership..."',
    },
    {
      letter: 'R',
      label: 'Role',
      description: 'What role should AI play? (Expert, editor, analyst, devil\'s advocate)',
      example: '"Act as a senior data analyst who specializes in market trends..."',
    },
    {
      letter: 'A',
      label: 'Action',
      description: 'What specific task do you need completed?',
      example: '"Analyze these sales figures and identify the top 3 growth opportunities..."',
    },
    {
      letter: 'F',
      label: 'Format',
      description: 'How should the output look? (Length, structure, tone, reading level)',
      example: '"Present as a 2-page executive summary with bullet points and a chart..."',
    },
    {
      letter: 'T',
      label: 'Target',
      description: 'What does a successful result achieve?',
      example: '"The report should convince leadership to increase Q3 budget by 15%..."',
    },
  ],
};

export const ACTION_PLAN = {
  title: '30-Day Action Plan',
  weeks: [
    {
      week: 1,
      title: 'Start',
      tasks: [
        'Create free accounts on ChatGPT and Claude',
        'Adjust privacy settings on both platforms',
        'Use AI to help with one real task each day',
        'Note what works, what doesn\'t, and what surprised you',
      ],
    },
    {
      week: 2,
      title: 'Build Competence',
      tasks: [
        'Apply the CRAFT framework to a real, complex work task',
        'Try Chain-of-Thought prompting on a problem you\'ve been wrestling with',
        'Upload a document to NotebookLM and generate a summary',
        'Use Perplexity for one research task instead of a regular web search',
        'Identify 3 recurring tasks where AI could save meaningful time',
      ],
    },
    {
      week: 3,
      title: 'Apply to Real Work',
      tasks: [
        'Use AI to produce an actual work deliverable',
        'Track the time you save and be honest about what you did with it',
        'Share what you\'ve learned with one person',
      ],
    },
    {
      week: 4,
      title: 'Expand and Reflect',
      tasks: [
        'Explore one tool specific to your industry or function',
        'Honestly audit which parts of your current job are most exposed to AI',
        'Create a simple development plan: one AI skill to build, one human skill to deepen',
        'Subscribe to one AI-focused newsletter to stay current',
      ],
    },
  ],
};

export const IRREPLACEABLE_SKILLS = [
  {
    name: 'Critical Thinking',
    description:
      'Evaluating AI output for errors, bias, and gaps. Knowing when to trust it and when to override it.',
  },
  {
    name: 'Emotional Intelligence',
    description:
      'Building real relationships, navigating conflict, understanding what people actually need.',
  },
  {
    name: 'Creative Direction',
    description:
      'Setting vision, making taste decisions, defining what "good" looks like. AI executes; humans direct.',
  },
  {
    name: 'Complex Judgment',
    description:
      'Handling ambiguity, integrating incomplete information, adapting to unprecedented situations.',
  },
  {
    name: 'Communication & Persuasion',
    description:
      'Influencing people, negotiating, presenting ideas that move others to act.',
  },
  {
    name: 'Leadership',
    description:
      'Motivating teams, making hard decisions under uncertainty, building organizational culture.',
  },
];

export const FREE_RESOURCES = [
  {
    name: 'Anthropic Learn',
    url: 'https://www.anthropic.com/learn',
    description: 'Official learning resources from Anthropic, the makers of Claude.',
  },
  {
    name: 'DeepLearning.AI',
    url: 'https://www.deeplearning.ai/courses/',
    description: 'Free AI courses from Andrew Ng covering fundamentals to advanced topics.',
  },
  {
    name: 'Google AI Essentials',
    url: 'https://www.coursera.org/specializations/ai-essentials-google/paidmedia',
    description: 'Google\'s comprehensive AI essentials course on Coursera.',
  },
  {
    name: 'IBM SkillsBuild AI',
    url: 'https://skillsbuild.org/students/course-catalog/artificial-intelligence',
    description: 'Free AI courses from IBM covering practical applications.',
  },
  {
    name: 'NVIDIA Free Courses',
    url: 'https://resources.nvidia.com/en-us-nvidia-training/free-courses',
    description: 'Technical AI and deep learning courses from NVIDIA.',
  },
  {
    name: 'Microsoft AI for Beginners',
    url: 'https://microsoft.github.io/AI-For-Beginners/',
    description: 'A 12-week, 24-lesson curriculum about Artificial Intelligence from Microsoft.',
  },
  {
    name: 'Free AI Resources (GitHub)',
    url: 'https://github.com/mrsaeeddev/free-ai-resources',
    description: 'Curated collection of free AI learning resources, tools, and guides.',
  },
];

export const PRIVACY_TIPS = [
  {
    tool: 'ChatGPT',
    instruction: 'Settings → Data Controls → Turn off "Improve the model for everyone"',
  },
  {
    tool: 'Claude',
    instruction:
      'Settings → Privacy → Turn off "Help improve Claude" (reduces data retention from 5 years to 30 days)',
  },
  {
    tool: 'Google Gemini',
    instruction: 'myactivity.google.com → Gemini Apps Activity → Turn off',
  },
];

export const NEVER_SHARE = [
  'Social Security numbers',
  'Passwords or API keys',
  'Financial account numbers',
  'Client data under NDA',
  'Proprietary source code',
  'Confidential business information',
];
