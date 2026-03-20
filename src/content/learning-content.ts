export interface AIToolService {
  name: string;
  url: string;
}

export interface AITool {
  name: string;
  company: string;
  description: string;
  url: string;
  free: true;
  capabilities: string[];
  services: AIToolService[];
}

export const AI_TOOLS: AITool[] = [
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    description:
      'The most widely used AI assistant. Excels at general-purpose tasks: writing, brainstorming, coding, and research. Free tier includes web search, image generation, and file uploads.',
    url: 'https://chat.openai.com',
    free: true,
    capabilities: ['Writing', 'Coding', 'Research', 'Image Generation', 'Data Analysis'],
    services: [
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'DALL·E (Image Gen)', url: 'https://chat.openai.com' },
      { name: 'Custom GPTs', url: 'https://chat.openai.com/gpts' },
      { name: 'Codex', url: 'https://openai.com/index/codex/' },
      { name: 'Sora (Video)', url: 'https://sora.com' },
      { name: 'Atlas Browser', url: 'https://chatgpt.com/atlas/' },
    ],
  },
  {
    name: 'Claude',
    company: 'Anthropic',
    description:
      'Known for nuanced reasoning and strong performance on complex, long-form work. Can process up to 200,000 words in a single session. Best for analysis, research synthesis, and detailed writing.',
    url: 'https://claude.ai',
    free: true,
    capabilities: ['Long-form Analysis', 'Research Synthesis', 'Coding', 'Writing', 'Reasoning'],
    services: [
      { name: 'Claude.ai', url: 'https://claude.ai' },
      { name: 'Claude Code', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
      { name: 'Claude Cowork', url: 'https://support.claude.com/en/articles/13345190-get-started-with-cowork' },
      { name: 'Deep Research', url: 'https://claude.ai' },
    ],
  },
  {
    name: 'Google',
    company: 'Google',
    description:
      'Integrates deeply with Google Workspace. Strong at multimodal tasks, search-connected responses, and productivity workflows across Gmail, Docs, Sheets, and Slides.',
    url: 'https://gemini.google.com',
    free: true,
    capabilities: ['Google Workspace', 'Multimodal', 'Search', 'Coding', 'Image Generation', 'Video Generation'],
    services: [
      { name: 'Gemini', url: 'https://gemini.google.com' },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com' },
      { name: 'Gemini in Workspace', url: 'https://workspace.google.com/solutions/ai/' },
      { name: 'Google Vids', url: 'https://workspace.google.com/products/vids/' },
      { name: 'Veo 3 (Video Gen)', url: 'https://aistudio.google.com/models/veo-3' },
      { name: 'Flow (Video Editing)', url: 'https://labs.google/fx/tools/flow' },
      { name: 'Stitch (UI Design)', url: 'https://stitch.withgoogle.com' },
    ],
  },
  {
    name: 'Meta AI',
    company: 'Meta',
    description:
      'Free AI assistant available across WhatsApp, Instagram, Facebook, and Messenger. Powered by Llama models with image generation built in.',
    url: 'https://www.meta.ai',
    free: true,
    capabilities: ['Chat', 'Image Generation', 'Social Integration', 'Research'],
    services: [
      { name: 'Meta AI', url: 'https://www.meta.ai' },
      { name: 'AI Studio', url: 'https://ai.meta.com/ai-studio/' },
    ],
  },
  {
    name: 'Microsoft Copilot',
    company: 'Microsoft',
    description:
      'AI assistant built into Microsoft products. Free version offers chat, image generation, and web search. Integrates into Word, Excel, PowerPoint, and Outlook with paid plans.',
    url: 'https://copilot.microsoft.com',
    free: true,
    capabilities: ['Writing', 'Image Generation', 'Search', 'Office Integration'],
    services: [
      { name: 'Copilot Chat', url: 'https://copilot.microsoft.com' },
      { name: 'Copilot in Edge', url: 'https://www.microsoft.com/en-us/edge' },
      { name: 'GitHub Copilot', url: 'https://github.com/features/copilot' },
    ],
  },
  {
    name: 'NotebookLM',
    company: 'Google',
    description:
      'Upload documents, PDFs, and YouTube videos as sources, then generate summaries, study guides, timelines, and AI-generated audio discussions from your materials.',
    url: 'https://notebooklm.google.com',
    free: true,
    capabilities: ['Document Analysis', 'Audio Summaries', 'Study Guides', 'Research'],
    services: [
      { name: 'NotebookLM', url: 'https://notebooklm.google.com' },
    ],
  },
  {
    name: 'Perplexity AI',
    company: 'Perplexity',
    description:
      'AI-powered search that returns sourced, cited answers instead of links. Best for research, fact-checking, and staying current on any topic.',
    url: 'https://perplexity.ai',
    free: true,
    capabilities: ['Research', 'Fact-checking', 'Cited Answers', 'Real-time Search'],
    services: [
      { name: 'Perplexity Search', url: 'https://perplexity.ai' },
      { name: 'Spaces', url: 'https://perplexity.ai' },
      { name: 'Comet Browser', url: 'https://perplexity.ai/comet' },
      { name: 'Computer', url: 'https://www.perplexity.ai/products/computer' },
    ],
  },
];

export interface PromptFramework {
  id: string;
  acronym: string;
  title: string;
  tagline: string;
  description: string;
  bestFor: string;
  steps: { letter: string; label: string; description: string; example: string }[];
  proTip: string;
}

export const PROMPT_FRAMEWORKS: PromptFramework[] = [
  {
    id: 'rtto',
    acronym: 'R.T.T.O.',
    title: 'Quick Start',
    tagline: 'Your quick-start prompt for any AI request.',
    description: 'Most people overthink their first prompt. R.T.T.O. cuts that friction — four essential building blocks to get useful output fast.',
    bestFor: 'Beginners, simple tasks, everyday requests',
    steps: [
      { letter: 'R', label: 'Role', description: 'Who should the AI be in this task?', example: '"Act as a marketing strategist specializing in AI-powered solutions."' },
      { letter: 'T', label: 'Task', description: 'What exactly are you trying to achieve?', example: '"Create a social media strategy to boost engagement for a new product launch."' },
      { letter: 'T', label: 'Tone', description: 'How should the response sound?', example: '"Professional yet approachable, suitable for a LinkedIn audience."' },
      { letter: 'O', label: 'Output', description: 'What should the result look like?', example: '"A numbered list with bullet points for sub-steps."' },
    ],
    proTip: 'R.T.T.O. is your starting point. Once the project gets complex, upgrade to CRAFT. Before you send any prompt, run it through SCORE.',
  },
  {
    id: 'craft',
    acronym: 'C.R.A.F.T.',
    title: 'Complex Prompts',
    tagline: 'Build high-quality prompts for complex AI requests.',
    description: 'When the work matters — a pitch, a strategy, a campaign — you need more than a quick ask. CRAFT ensures the AI understands not just what to do, but who it\'s talking to, how to respond, and what success looks like.',
    bestFor: 'High-stakes, multi-part work, client deliverables',
    steps: [
      { letter: 'C', label: 'Context', description: 'Who are you and what is the situation? Ground the AI in your world before giving it work.', example: '"I\'m a creative director preparing a brand voice presentation for a wellness client targeting women 35–55."' },
      { letter: 'R', label: 'Role', description: 'What role should the AI play? The more precise, the more calibrated the output.', example: '"Act as a senior brand strategist with experience in wellness and lifestyle brands."' },
      { letter: 'A', label: 'Action', description: 'What specific task needs to be completed? One task per prompt produces cleaner output.', example: '"Write three homepage headline options that communicate warmth and expertise."' },
      { letter: 'F', label: 'Format', description: 'How should the output be structured? Define length, structure, and reading level.', example: '"Present each headline with a one-sentence rationale. Numbered list. Under 10 words each."' },
      { letter: 'T', label: 'Target', description: 'What does a successful result achieve? Define the outcome, not just the output.', example: '"The headlines should make a first-time visitor immediately understand the brand\'s personality."' },
    ],
    proTip: 'After the first response, push further — "Give me three alternatives," "What\'s the weakest part of this?" or "What would you change if the audience were 10 years older?"',
  },
  {
    id: 'score',
    acronym: 'S.C.O.R.E.',
    title: 'Prompt Audit',
    tagline: 'Check your prompt before you wreck your prompt.',
    description: 'A pre-send audit: five questions to run through before you hit enter. Catching a gap here takes 30 seconds. Fixing a broken output takes much longer.',
    bestFor: 'Any prompt, any skill level — especially before high-stakes sends',
    steps: [
      { letter: 'S', label: 'Specific', description: 'Does the prompt make clear what you want — and what you don\'t?', example: 'Instead of "improve this copy" — "Rewrite for a landing page targeting first-time buyers. Two sentences max."' },
      { letter: 'C', label: 'Contextualized', description: 'Does it include the background the AI actually needs?', example: '"You are a podcast editor working on a show about entrepreneurship for early-stage founders."' },
      { letter: 'O', label: 'Ordered', description: 'Are instructions in a logical sequence? Constraints before content. Format before task.', example: '"Limit to 100 words. Formal tone. No jargon. Now summarize the following report."' },
      { letter: 'R', label: 'Role-Defined', description: 'Have you told the AI who it is? Without a role, the AI defaults to generic.', example: '"You are an experienced creative director reviewing copy for a luxury brand."' },
      { letter: 'E', label: 'Evaluated', description: 'Read it back as if you\'re the AI. Would a smart freelancer know what to deliver?', example: '"Would a freelancer know exactly what to deliver — or would they email back with questions?"' },
    ],
    proTip: 'SCORE works at any stage. Use it to audit prompts built with CRAFT, or as a quick check before any one-off request.',
  },
  {
    id: 'stay',
    acronym: 'S.T.A.Y.',
    title: 'Session Management',
    tagline: 'Keep your AI session on track — from first prompt to final output.',
    description: 'Most people know how to start a conversation with AI. Few know how to sustain one. S.T.A.Y. gives you a repeatable system for managing AI across the full arc of a working session.',
    bestFor: 'Multi-step creative projects, multi-day work, team handoffs',
    steps: [
      { letter: 'S', label: 'Set the Stage', description: 'Establish context before the work begins. Not just a task — a full creative brief handoff.', example: '"I\'m a creative director working on a brand refresh for a wellness company. Today we\'re writing homepage copy."' },
      { letter: 'T', label: 'Tether Each Prompt', description: 'Connect every new request back to the established context. Don\'t assume the AI remembers.', example: '"Still in the brand refresh project. Now I need three tagline options. Same editorial tone."' },
      { letter: 'A', label: 'Anchor and Correct', description: 'When it drifts, don\'t start over — recalibrate with a correction anchor.', example: '"That\'s too corporate. Back to the brief — warm, editorial, not clinical. Try again."' },
      { letter: 'Y', label: 'Your Handoff Note', description: 'Before closing, have the AI summarize decisions, direction, and outputs worth keeping.', example: '"Summarize this session: direction confirmed, outputs we\'re using, what\'s unresolved."' },
    ],
    proTip: 'S.T.A.Y. works best paired with CRAFT (for building the initial request) and TRAIN (for debugging when outputs break down). Together they cover: Build → Sustain → Fix.',
  },
  {
    id: 'train',
    acronym: 'T.R.A.I.N.',
    title: 'Debug Outputs',
    tagline: 'Diagnose and fix your prompts when the output isn\'t working.',
    description: 'When AI isn\'t cooperating, most people repeat the same prompt louder, or give up. TRAIN gives you a structured debugging process — identify what\'s broken, why, and exactly how to fix it.',
    bestFor: 'When results aren\'t working, fixing hallucinations, off-brand output',
    steps: [
      { letter: 'T', label: 'Test', description: 'Try variations and compare outputs. Change tone, reorder instructions, rephrase the task.', example: '"Run the same request three ways — formal, conversational, bullet-point — and compare where output improves."' },
      { letter: 'R', label: 'Reason', description: 'Guide the AI through the logic step by step. Add a thinking path explicitly.', example: '"Before writing the headline, explain what emotion the brand is trying to trigger. Then write three options."' },
      { letter: 'A', label: 'Align', description: 'Reconnect the output to your actual goal. Add specificity around audience and success criteria.', example: '"That\'s accurate but too clinical. The audience is creative directors, not CFOs. Rewrite with that shift."' },
      { letter: 'I', label: 'Investigate', description: 'Find what\'s causing hallucination or drift — usually a missing constraint or too much ambiguity.', example: '"Use only examples found in the document above. Do not add outside references."' },
      { letter: 'N', label: 'Narrow', description: 'Make the request smaller and more focused. Smaller requests produce tighter, more reliable outputs.', example: 'Instead of "write a full campaign strategy" — "First, define the target audience only. Stop there."' },
    ],
    proTip: 'TRAIN works best after SCORE. If your prompt passed the pre-send audit but the output still broke, TRAIN tells you why.',
  },
];

export const FRAMEWORK_GUIDE = {
  situations: [
    { situation: 'First time using AI for a task', framework: 'R.T.T.O.' },
    { situation: 'Writing a creative brief or strategy', framework: 'C.R.A.F.T.' },
    { situation: 'Client-facing deliverable', framework: 'C.R.A.F.T. + S.C.O.R.E.' },
    { situation: 'Long copy or multi-step project', framework: 'S.T.A.Y.' },
    { situation: 'Output sounds generic or off-brand', framework: 'T.R.A.I.N.' },
    { situation: 'AI is hallucinating or inventing content', framework: 'T.R.A.I.N.' },
    { situation: 'Prompt feels vague but you\'re not sure why', framework: 'S.C.O.R.E.' },
    { situation: 'Handing a project to a collaborator', framework: 'S.T.A.Y.' },
  ],
  workflow: 'Build → Check → Send → Sustain → Fix',
  workflowSteps: [
    { step: 'R.T.T.O. or C.R.A.F.T.', label: 'Build the prompt' },
    { step: 'S.C.O.R.E.', label: 'Audit it' },
    { step: 'S.T.A.Y.', label: 'Sustain the session' },
    { step: 'T.R.A.I.N.', label: 'Fix what breaks' },
  ],
};

export const ACTION_PLAN = {
  title: '30-Day Action Plan',
  intro: 'Knowledge without action is useless. This plan builds on the tools and frameworks above — each week introduces more complexity as your confidence grows.',
  weeks: [
    {
      week: 1,
      title: 'Get Started',
      tasks: [
        'Create free accounts on ChatGPT and Claude',
        'Review and adjust privacy settings on both platforms (see below)',
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
        'Upload a document to NotebookLM and generate a summary or podcast',
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
      'Evaluating AI output for errors, bias, and gaps. AI can generate options; humans must decide which are good.',
  },
  {
    name: 'Emotional Intelligence',
    description:
      'Building real relationships, navigating conflict, understanding what people actually need. AI cannot genuinely connect with people.',
  },
  {
    name: 'Creative Direction',
    description:
      'Setting vision, making taste decisions, defining what "good" looks like. AI can execute; humans must direct.',
  },
  {
    name: 'Complex Judgment',
    description:
      'Handling ambiguity, integrating incomplete information, adapting to unprecedented situations. AI struggles with truly novel problems.',
  },
  {
    name: 'Communication & Persuasion',
    description:
      'Influencing people, negotiating, presenting ideas that move others to act. The ability to influence humans remains human.',
  },
  {
    name: 'Leadership',
    description:
      'Motivating teams, making hard decisions under uncertainty, building organizational culture. Organizations still need humans to lead.',
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
    note: 'OpenAI may still retain data for safety monitoring and legal compliance.',
  },
  {
    tool: 'Claude',
    instruction:
      'Settings → Privacy → Turn off "Help improve Claude"',
    note: 'Training on user data is ON by default for free/Pro/Max plans. Opting out reduces retention from 5 years to 30 days.',
  },
  {
    tool: 'Google Gemini',
    instruction: 'myactivity.google.com → Gemini Apps Activity → Turn off',
    note: 'You can also set auto-delete for 3, 18, or 36 months.',
  },
];

export const NEVER_SHARE = [
  'Social Security numbers, financial account numbers, passwords',
  'Confidential business information or trade secrets',
  'Personal health information (unless using HIPAA-compliant tools)',
  'Client data or information covered by NDAs',
  'Proprietary code or algorithms',
];

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossaryCategory {
  name: string;
  terms: GlossaryTerm[];
}

export const AI_GLOSSARY: GlossaryCategory[] = [
  {
    name: 'Foundational AI',
    terms: [
      { term: 'Artificial Intelligence (AI)', definition: 'The broader concept of machines being able to carry out tasks in a way we would consider "smart" or "intelligent."' },
      { term: 'Artificial General Intelligence (AGI)', definition: 'AI that can understand, learn, and apply intelligence across a broad range of tasks, mimicking human cognitive abilities. Does not yet exist.' },
      { term: 'Machine Learning (ML)', definition: 'AI systems that improve their performance through experience, without being explicitly programmed for each specific task.' },
      { term: 'Deep Learning', definition: 'A subset of machine learning that uses neural networks with multiple layers to process complex patterns and make decisions.' },
      { term: 'Large Language Models (LLMs)', definition: 'Advanced AI models trained on vast amounts of text data, capable of understanding and generating human-like text. Examples: GPT-4, Claude, Gemini.' },
      { term: 'Generative AI', definition: 'AI systems that can create new content — text, images, audio, video — based on training data.' },
      { term: 'AI Hallucinations', definition: 'When AI generates content that seems plausible but is factually incorrect or fabricated. A significant limitation of current AI.' },
      { term: 'Token', definition: 'A chunk of text (like a word or part of a word) used by LLMs during prediction. Output length and cost are often measured in tokens.' },
      { term: 'Context Window', definition: 'The maximum amount of text an AI model can process at once. Larger windows allow longer conversations and documents.' },
    ],
  },
  {
    name: 'Agents & Automation',
    terms: [
      { term: 'AI Agent', definition: 'An AI system that uses a language model to reason through problems, make decisions, and execute tasks by interacting with tools and APIs.' },
      { term: 'Agentic AI', definition: 'AI systems designed to autonomously execute complex tasks with enhanced decision-making, under limited human supervision.' },
      { term: 'AI Copilot', definition: 'An AI-driven assistant that supports users by automating tasks and offering suggestions while keeping humans in control.' },
      { term: 'Robotic Process Automation (RPA)', definition: 'Using AI to automate routine, rule-based digital tasks like data entry and form processing.' },
      { term: 'Digital Workers', definition: 'AI-powered software agents designed to automate specific business processes, reducing the need for human intervention.' },
    ],
  },
  {
    name: 'Content Creation',
    terms: [
      { term: 'Text-to-Image', definition: 'Generating images from text descriptions using AI models like DALL·E, Midjourney, or Stable Diffusion.' },
      { term: 'Text-to-Video', definition: 'AI-generated videos created from written descriptions or prompts. Examples: Sora, Runway, Veo.' },
      { term: 'Voice Cloning', definition: 'Replicating a person\'s voice using AI to generate new speech that sounds like the original speaker.' },
      { term: 'Deepfake', definition: 'AI-generated videos or images that manipulate a person\'s likeness, often used to superimpose faces or mimic movements.' },
      { term: 'Diffusion Models', definition: 'AI techniques that generate images, videos, or audio by gradually refining noise into coherent outputs.' },
    ],
  },
  {
    name: 'Prompting & Interaction',
    terms: [
      { term: 'Prompt Engineering', definition: 'The skill of crafting inputs that get useful results from AI — arguably the most important practical AI skill.' },
      { term: 'Chain-of-Thought (CoT)', definition: 'A prompting technique that encourages AI to show its reasoning step-by-step, improving accuracy.' },
      { term: 'Few-Shot Learning', definition: 'Providing a few examples in your prompt so the AI learns the pattern you want.' },
      { term: 'Zero-Shot Learning', definition: 'An AI performing a task without any examples — relying solely on your instructions.' },
      { term: 'RAG (Retrieval-Augmented Generation)', definition: 'A technique combining information retrieval with AI generation to produce more accurate, grounded responses.' },
      { term: 'Temperature', definition: 'A setting that adjusts randomness in AI responses. Lower = more predictable, higher = more creative.' },
    ],
  },
  {
    name: 'Ethics & Governance',
    terms: [
      { term: 'AI Alignment', definition: 'The field aiming to ensure AI systems act in accordance with human values and intended goals.' },
      { term: 'Bias in AI', definition: 'When AI makes prejudiced decisions due to flaws in training data or algorithms.' },
      { term: 'Explainability (XAI)', definition: 'Techniques that make AI decisions interpretable to humans — understanding why it made a choice.' },
      { term: 'AI Governance', definition: 'Frameworks of guidelines, policies, and procedures ensuring responsible AI use within organizations.' },
      { term: 'EU AI Act', definition: 'Comprehensive EU regulation classifying AI systems by risk level and setting compliance requirements.' },
    ],
  },
];
