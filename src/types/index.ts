export interface Source {
  url: string;
  title: string;
  publisher: string;
  date: string;
}

export interface DisplacementEvent {
  id: string;
  company: string;
  companyName: string;
  date: string;
  jobsCut: number;
  jobTypes: string[];
  industry: string;
  region: string;
  country: string;
  aiReplacement: boolean;
  aiToolsMentioned?: string[];
  isProjection?: boolean;
  reasonGiven?: string;
  description: string;
  sources: Source[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verifiedBy?: string;
  verifiedDate?: string;
  notes?: string;
  status?: 'verified' | 'announced' | 'hiring-freeze' | 'creation';
  timeline?: string;
  jobsAlreadyCut?: number;
  jobRolesCreated?: string;
  context?: string;
}

export type MilestoneType =
  | 'model-release'
  | 'company-launch'
  | 'acquisition'
  | 'partnership'
  | 'regulation'
  | 'breakthrough';

export interface AIMilestone {
  id: string;
  company: string;
  date: string;
  type: MilestoneType;
  name: string;
  description: string;
  category: string;
  significance: 'high' | 'medium' | 'low';
  sources: Source[];
  title?: string;
  amount?: string;
  source?: string;
}

export interface AIProduct {
  name: string;
  launchDate: string;
  category: string;
  description: string;
}

export interface Acquisition {
  company: string;
  date: string;
  amount?: string;
  aiRelevance: string;
}

export interface FundingRound {
  date: string;
  amount: string;
  investors: string[];
  round: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  website?: string;
  description: string;
  aiProducts: AIProduct[];
  acquisitions: Acquisition[];
  fundingRounds: FundingRound[];
  totalJobsDisplaced: number;
  events: string[];
}

export type PredictionTimeframe = '3-months' | '6-months' | '12-months' | '3-5-years';

export interface Prediction {
  id: string;
  timeframe: PredictionTimeframe;
  targetDate: string;
  createdDate: string;
  jobType: string;
  industry: string;
  estimatedJobsAtRisk: {
    low: number;
    mid: number;
    high: number;
  };
  riskLevel: 'high' | 'medium' | 'low';
  basis: string;
  methodology: string;
  sources: string[];
  confidence: number;
}

export interface DashboardData {
  displacementEvents: DisplacementEvent[];
  milestones: AIMilestone[];
  companies: CompanyProfile[];
  predictions: Prediction[];
}

export interface TimelineChapter {
  id: string;
  title: string;
  dateRange: { start: string; end: string };
  narrative: string;
  keyEvents: string[];
}
