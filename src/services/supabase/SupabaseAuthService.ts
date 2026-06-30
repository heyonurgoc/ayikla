import { IAuthService } from '../interfaces/IAuthService';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

export class SupabaseAuthService implements IAuthService {
  private mapSupabaseUser(sbUser: any, profile?: any): User {
    let localUsed = 0;
    if (typeof window !== 'undefined') {
      const savedUsed = localStorage.getItem(`ayikla_used_${sbUser.id}`);
      if (savedUsed !== null) {
        localUsed = parseInt(savedUsed, 10);
      }
    }

    const dbUsed = profile?.analysis_used;
    const finalUsed = typeof dbUsed === 'number' ? Math.max(dbUsed, localUsed) : localUsed;

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      fullName: profile?.full_name || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Kullanıcı',
      avatarUrl: profile?.avatar_url || sbUser.user_metadata?.avatar_url,
      premiumStatus: (profile?.premium_status as any) || 'Free',
      analysisLimit: profile?.analysis_limit || 50,
      analysisUsed: finalUsed,
      createdAt: sbUser.created_at || new Date().toISOString(),
    };
  }

  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase URL/Key eksik. Lütfen .env dosyasını yapılandırın.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: 'Kullanıcı bulunamadı.' };

    // Fetch user profile additional info from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { user: this.mapSupabaseUser(data.user, profile), error: null };
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: User | null; error: string | null }> {
    if (!supabase) {
      return { user: null, error: 'Supabase URL/Key eksik. Lütfen .env dosyasını yapılandırın.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: 'Kayıt başarısız.' };

    // Create profile entry
    const newProfile = {
      id: data.user.id,
      full_name: fullName,
      premium_status: 'Free',
      analysis_limit: 5,
      analysis_used: 0,
      created_at: new Date().toISOString()
    };

    await supabase.from('profiles').insert(newProfile);

    return { user: this.mapSupabaseUser(data.user, newProfile), error: null };
  }

  async logout(): Promise<{ error: string | null }> {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  }

  async getCurrentUser(): Promise<User | null> {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      console.log('AYIKLA: Profile not found for authenticated user, creating one...');
      const newProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Kullanıcı',
        premium_status: 'Free',
        analysis_limit: 50,
        analysis_used: 0,
        created_at: new Date().toISOString()
      };
      
      const { data: inserted } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();
        
      if (inserted) {
        profile = inserted;
      } else {
        // Return fallback profile data if database insert fails temporarily (e.g. strict RLS)
        profile = newProfile;
      }
    }

    return this.mapSupabaseUser(user, profile);
  }

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!supabase) {
      return { success: false, error: 'Supabase URL/Key eksik. Lütfen .env dosyasını yapılandırın.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`
    });
    return { success: !error, error: error ? error.message : null };
  }
}
