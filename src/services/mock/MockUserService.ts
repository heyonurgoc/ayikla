import { IUserService } from '../interfaces/IUserService';
import { User, Notification } from '@/types';
import cachedData from './mock_jobs_cache.json';

const fallbackNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Yeni Şirket Uyarısı',
    description: 'Takip ettiğiniz Getir firması için Ghost Job oranı %78 seviyesine ulaştı.',
    time: '2 saat önce',
    read: false,
    type: 'warning',
  },
  {
    id: 'n2',
    title: 'Analiz Başarılı',
    description: 'Senior React Developer ilanı analizi tamamlandı. Skor: %82',
    time: '1 gün önce',
    read: true,
    type: 'success',
  },
  {
    id: 'n3',
    title: 'Haftalık Rapor Hazır',
    description: 'Geçen hafta analiz edilen ilanların ortalama Ghost Job skoru %42 olarak ölçüldü.',
    time: '3 gün önce',
    read: true,
    type: 'info',
  }
];

let mockNotifications: Notification[] = [];

if (cachedData && cachedData.notifications && cachedData.notifications.length > 0) {
  mockNotifications = [
    ...(cachedData.notifications as any[]).map(n => ({
      ...n,
      userId: n.userId || 'mock-user-123',
      time: n.time || '1 saat önce'
    })),
    ...fallbackNotifications.map(n => ({ ...n, userId: 'mock-user-123' }))
  ];
} else {
  mockNotifications = fallbackNotifications.map(n => ({ ...n, userId: 'mock-user-123' }));
}

if (typeof window !== 'undefined') {
  const savedNotifs = localStorage.getItem('ayikla_notifications');
  if (savedNotifs) {
    const existing = JSON.parse(savedNotifs) as Notification[];
    const existingIds = new Set(existing.map((n) => n.id));
    const newCached = mockNotifications.filter((n) => !existingIds.has(n.id));
    mockNotifications = [...newCached, ...existing];
    localStorage.setItem('ayikla_notifications', JSON.stringify(mockNotifications));
  } else {
    localStorage.setItem('ayikla_notifications', JSON.stringify(mockNotifications));
  }
}

export class MockUserService implements IUserService {
  async getNotifications(): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let currentUserId = 'mock-user-123';
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('ayikla_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u && u.id) currentUserId = u.id;
      }
    }
    return mockNotifications.filter(n => n.userId === currentUserId);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayikla_notifications', JSON.stringify(mockNotifications));
      }
    }
  }

  async updateProfile(fullName: string, avatarUrl?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let user: User | null = null;
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('ayikla_user');
      if (savedUser) {
        user = JSON.parse(savedUser);
      }
    }
    
    if (!user) {
      user = {
        id: 'mock-user-123',
        email: 'onur.goc@gmail.com',
        fullName: fullName,
        avatarUrl: avatarUrl,
        premiumStatus: 'Pro',
        analysisLimit: 50,
        analysisUsed: 28,
        createdAt: new Date().toISOString(),
      };
    } else {
      user.fullName = fullName;
      if (avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('ayikla_user', JSON.stringify(user));
    }
    
    return user;
  }
}
