import { Analysis, CompanyInsight } from '@/types';

export interface IAnalysisService {
  analyzeJob(url?: string, description?: string): Promise<Analysis>;
  getAnalysisHistory(): Promise<Analysis[]>;
  getAnalysisById(id: string): Promise<Analysis | null>;
  toggleSaveAnalysis(id: string): Promise<boolean>;
  getCompanyInsights(): Promise<CompanyInsight[]>;
  getCompanyInsightByName(name: string): Promise<CompanyInsight | null>;
}
