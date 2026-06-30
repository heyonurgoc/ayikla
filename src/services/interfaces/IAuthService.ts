import { User } from '@/types';

export interface IAuthService {
  login(email: string, password: string): Promise<{ user: User | null; error: string | null }>;
  register(email: string, password: string, fullName: string): Promise<{ user: User | null; error: string | null }>;
  logout(): Promise<{ error: string | null }>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<{ success: boolean; error: string | null }>;
}
