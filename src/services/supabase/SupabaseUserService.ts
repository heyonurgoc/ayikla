import { IUserService } from '../interfaces/IUserService';
import { User, Notification } from '@/types';
import { supabase } from '@/lib/supabase';

export class SupabaseUserService implements IUserService {
  async getNotifications(): Promise<Notification[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Notification[];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    if (!supabase) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
  }

  async updateProfile(fullName: string, avatarUrl?: string): Promise<User> {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Kullanıcı oturumu bulunamadı.');

    const updates: any = { full_name: fullName };
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: user.id,
      email: user.email || '',
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      premiumStatus: profile.premium_status,
      analysisLimit: profile.analysis_limit,
      analysisUsed: profile.analysis_used,
      createdAt: user.created_at || new Date().toISOString()
    };
  }
}
