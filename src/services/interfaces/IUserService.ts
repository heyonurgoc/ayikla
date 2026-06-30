import { User, Notification } from '@/types';

export interface IUserService {
  getNotifications(): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  updateProfile(fullName: string, avatarUrl?: string): Promise<User>;
}
