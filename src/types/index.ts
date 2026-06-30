export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  premiumStatus: 'Free' | 'Pro' | 'Enterprise';
  analysisLimit: number;
  analysisUsed: number;
  createdAt: string;
}

export interface CriteriaDetail {
  score: number; // 0 to 100 (where high is high ghost risk)
  text: string;  // Detailed explanation of this score
}

export interface CriteriaBreakdown {
  postingAge: CriteriaDetail;
  companyGrowth: CriteriaDetail;
  descriptionAuthenticity: CriteriaDetail;
  recruiterActivity: CriteriaDetail;
  salaryTransparency: CriteriaDetail;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Analysis {
  id: string;
  userId: string;
  jobUrl?: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  jobDescription?: string;
  ghostScore: number; // 0 to 100, where 100 means definitely a Ghost Job
  riskLevel: RiskLevel;
  analysisDate: string;
  criteriaBreakdown: CriteriaBreakdown;
  aiVerdict: string;
  aiExplanation: string;
  status: 'completed' | 'failed' | 'pending';
  isSaved: boolean;
}

export interface CompanyInsight {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  employeeCountRange: string;
  averageGhostScore: number;
  totalJobsAnalyzed: number;
  ghostJobsCount: number;
  activeJobsCount: number;
  averageDaysOpen: number;
  warningFlags: string[];
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'warning' | 'info' | 'success';
}
