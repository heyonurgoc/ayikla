import { IAuthService } from '../interfaces/IAuthService';
import { User } from '@/types';

// Let's keep the mock state in local variable or localStorage if client-side
let mockCurrentUser: User | null = null;

if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('ayikla_user');
  if (savedUser) {
    mockCurrentUser = JSON.parse(savedUser);
  } else {
    // Default mock user
    mockCurrentUser = {
      id: 'mock-user-123',
      email: 'onur.goc@gmail.com',
      fullName: 'Onur Göç',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
      premiumStatus: 'Pro',
      analysisLimit: 50,
      analysisUsed: 28,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('ayikla_user', JSON.stringify(mockCurrentUser));
  }
}

export class MockAuthService implements IAuthService {
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
    
    if (!email.includes('@')) {
      return { user: null, error: 'Geçersiz e-posta adresi.' };
    }
    if (password.length < 6) {
      return { user: null, error: 'Şifre en az 6 karakter olmalıdır.' };
    }
    
    // Deterministic user ID based on email
    const userId = email === 'onur.goc@gmail.com' 
      ? 'mock-user-123' 
      : 'user-' + email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // Check if user has registered before, if so try to load their full name
    let fullName = email.split('@')[0].toUpperCase();
    let premiumStatus: 'Free' | 'Pro' | 'Enterprise' = 'Free';
    let limit = 50;
    let used = 0;

    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('ayikla_registered_users');
      const usersList = savedUsers ? JSON.parse(savedUsers) : [];
      const found = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        fullName = found.fullName;
        premiumStatus = found.premiumStatus;
        limit = found.analysisLimit;
      }
      
      // Calculate active analyses count for this user
      const savedAnalyses = localStorage.getItem('ayikla_analyses');
      if (savedAnalyses) {
        const analyses = JSON.parse(savedAnalyses) as any[];
        used = analyses.filter(a => a.userId === userId).length;
      }
    }

    // Default mock user override
    if (email === 'onur.goc@gmail.com') {
      fullName = 'Onur Göç';
      premiumStatus = 'Pro';
      limit = 50;
      if (used === 0) used = 28; // fallback for default dashboard display
    }

    mockCurrentUser = {
      id: userId,
      email: email,
      fullName: fullName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop',
      premiumStatus: premiumStatus,
      analysisLimit: limit,
      analysisUsed: used,
      createdAt: new Date().toISOString(),
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('ayikla_user', JSON.stringify(mockCurrentUser));
    }
    
    return { user: mockCurrentUser, error: null };
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: User | null; error: string | null }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (!email.includes('@')) {
      return { user: null, error: 'Geçersiz e-posta adresi.' };
    }
    if (password.length < 6) {
      return { user: null, error: 'Şifre en az 6 karakter olmalıdır.' };
    }
    if (!fullName) {
      return { user: null, error: 'Ad soyad alanı zorunludur.' };
    }
    
    // Deterministic user ID based on email
    const userId = email === 'onur.goc@gmail.com' 
      ? 'mock-user-123' 
      : 'user-' + email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    mockCurrentUser = {
      id: userId,
      email: email,
      fullName: fullName,
      premiumStatus: 'Free',
      analysisLimit: 50,
      analysisUsed: 0,
      createdAt: new Date().toISOString(),
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('ayikla_user', JSON.stringify(mockCurrentUser));
      
      // Store in registered users pool to persist credentials in mock mode
      const savedUsers = localStorage.getItem('ayikla_registered_users');
      const usersList = savedUsers ? JSON.parse(savedUsers) : [];
      if (!usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        usersList.push(mockCurrentUser);
        localStorage.setItem('ayikla_registered_users', JSON.stringify(usersList));
      }
    }
    
    return { user: mockCurrentUser, error: null };
  }

  async logout(): Promise<{ error: string | null }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockCurrentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ayikla_user');
    }
    return { error: null };
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('ayikla_user');
      if (savedUser) {
        mockCurrentUser = JSON.parse(savedUser);
      }
    }
    return mockCurrentUser;
  }

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!email.includes('@')) {
      return { success: false, error: 'Geçersiz e-posta adresi.' };
    }
    return { success: true, error: null };
  }
}
