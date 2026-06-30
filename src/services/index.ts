import { IAuthService } from './interfaces/IAuthService';
import { IAnalysisService } from './interfaces/IAnalysisService';
import { IUserService } from './interfaces/IUserService';

import { MockAuthService } from './mock/MockAuthService';
import { MockAnalysisService } from './mock/MockAnalysisService';
import { MockUserService } from './mock/MockUserService';

import { SupabaseAuthService } from './supabase/SupabaseAuthService';
import { SupabaseAnalysisService } from './supabase/SupabaseAnalysisService';
import { SupabaseUserService } from './supabase/SupabaseUserService';

const useMock = 
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_USE_MOCK === 'true';

class ServiceFactory {
  private authService: IAuthService;
  private analysisService: IAnalysisService;
  private userService: IUserService;

  constructor() {
    if (useMock) {
      this.authService = new MockAuthService();
      this.analysisService = new MockAnalysisService();
      this.userService = new MockUserService();
      console.log('AYIKLA: Running in MOCK mode.');
    } else {
      this.authService = new SupabaseAuthService();
      this.analysisService = new SupabaseAnalysisService();
      this.userService = new SupabaseUserService();
      console.log('AYIKLA: Running in PRODUCTION/SUPABASE mode.');
    }
  }

  getAuth(): IAuthService {
    return this.authService;
  }

  getAnalysis(): IAnalysisService {
    return this.analysisService;
  }

  getUser(): IUserService {
    return this.userService;
  }
}

export const services = new ServiceFactory();
