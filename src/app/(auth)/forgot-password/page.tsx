'use client';

import { useState } from 'react';
import Link from 'next/link';
import { services } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Lütfen e-posta adresinizi girin.');
      return;
    }

    setLoading(true);
    try {
      const { success: resetSuccess, error } = await services.getAuth().resetPassword(email);
      if (error) {
        toast.error(error);
      } else if (resetSuccess) {
        setSuccess(true);
        toast.success('Şifre sıfırlama bağlantısı gönderildi.');
      }
    } catch (err: any) {
      toast.error('İşlem sırasında beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex justify-center text-green-500">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold tracking-tight">E-posta Gönderildi</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>{email}</strong> adresine şifrenizi sıfırlamanız için gerekli bağlantıyı içeren bir e-posta gönderdik. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
          </p>
        </div>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Giriş ekranına geri dön
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-xl font-bold tracking-tight">Şifremi Unuttum</h2>
        <p className="text-sm text-muted-foreground">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
            E-posta Adresi
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-premium hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            'Sıfırlama Bağlantısı Gönder'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Giriş ekranına geri dön
        </Link>
      </div>
    </div>
  );
}
