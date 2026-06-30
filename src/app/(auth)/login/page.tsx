'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { services } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await services.getAuth().login(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success(`Hoş geldiniz, ${user?.fullName || 'Kullanıcı'}!`);
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error('Giriş yapılırken beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-xl font-bold tracking-tight">Giriş Yap</h2>
        <p className="text-sm text-muted-foreground">
          Hesabınıza giriş yaparak ilanları analiz etmeye başlayın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 relative">
          <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="isim@örnek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="pl-10 h-11 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Şifre
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Şifremi Unuttum
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="pl-10 h-11 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-premium hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Giriş Yapılıyor...
            </>
          ) : (
            'Giriş Yap'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Hesabınız yok mu?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Kayıt Olun
        </Link>
      </div>
    </div>
  );
}
