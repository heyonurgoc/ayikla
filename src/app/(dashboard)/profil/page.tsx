'use client';

import { useState, useEffect } from 'react';
import { services } from '@/services';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Save, 
  Loader2, 
  TrendingUp, 
  Upload 
} from 'lucide-react';

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await services.getAuth().getCurrentUser();
        if (u) {
          setUser(u);
          setFullName(u.fullName);
          setAvatarUrl(u.avatarUrl || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error('Ad Soyad alanı boş bırakılamaz.');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await services.getUser().updateProfile(fullName, avatarUrl || undefined);
      setUser(updatedUser);
      toast.success('Profil bilgileri başarıyla güncellendi.');
      
      // Force trigger navbar update by reloading the current user
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err: any) {
      toast.error(err.message || 'Profil güncellenirken hata oluşt.');
    } finally {
      setSaving(false);
    }
  };

  const simulateAvatarUpload = () => {
    const randomAvatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=256&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop'
    ];
    const randomAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    setAvatarUrl(randomAvatar);
    toast.success('Yeni profil resmi simüle edildi! Kaydet butonuna tıklayarak uygulayabilirsiniz.');
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-5 w-5 rounded-full bg-primary animate-ping" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Profil Bilgileri</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kişisel hesap ayarlarınızı düzenleyin ve aylık AI kullanım sınırlarınızı izleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Quick Stats */}
        <div className="flex flex-col gap-6">
          <Card className="glass-panel border-border/60 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={avatarUrl || user?.avatarUrl} />
                <AvatarFallback className="text-xl font-bold">{fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <button
                onClick={simulateAvatarUpload}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Yükle
              </button>
            </div>
            <h3 className="font-bold text-base mt-4">{user?.fullName}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 mt-1 border rounded-full ${
              user?.premiumStatus === 'Pro' 
                ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
            }`}>
              {user?.premiumStatus} Planı
            </span>

            <div className="w-full border-t border-border/40 my-4 pt-4 flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  E-posta
                </span>
                <span className="text-xs text-foreground font-semibold pl-0.5">{user?.email}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Katılım Tarihi
                </span>
                <span className="text-xs text-foreground font-semibold pl-0.5">
                  {user ? new Date(user.createdAt).toLocaleDateString('tr-TR') : ''}
                </span>
              </div>
            </div>
          </Card>

          {/* Usage Card */}
          <Card className="glass-panel border-border/60 rounded-3xl p-6 flex flex-col gap-4">
            <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              AI Sorgu Kullanımı
            </h4>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-foreground">{user?.analysisUsed || 0}</span>
              <span className="text-xs text-muted-foreground">/ ∞ sorgu</span>
            </div>
            <Progress 
              value={0} 
              className="h-2 bg-secondary/80 rounded-full [&>div]:bg-gradient-premium"
            />
            <p className="text-[10px] text-muted-foreground leading-normal">
              Sınırsız sorgu hakkınız bulunmaktadır.
            </p>
          </Card>
        </div>

        {/* Right Card: Profile Form */}
        <Card className="md:col-span-2 glass-panel border-border/60 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Profil Ayarları</CardTitle>
            <CardDescription className="text-xs">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                  Ad Soyad
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Onur Göç"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={saving}
                  className="h-11 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                  E-posta (Değiştirilemez)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="h-11 bg-secondary/35 border-border/80 text-muted-foreground rounded-xl text-xs cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="avatarUrl" className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                  Profil Resmi URL'si
                </label>
                <Input
                  id="avatarUrl"
                  type="url"
                  placeholder="https://gorsel-baglantisi.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={saving}
                  className="h-11 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-fit h-11 bg-gradient-premium hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 px-6 ml-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Profili Kaydet
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
