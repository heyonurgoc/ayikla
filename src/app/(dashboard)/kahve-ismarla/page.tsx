'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Heart, ArrowUpRight, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function KahveIsmarlaPage() {
  const handleDonationRedirect = () => {
    window.open('https://www.shopier.com/onurgoc/45298023', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-4">
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center justify-center gap-1.5">
          <Heart className="h-3.5 w-3.5 fill-primary animate-pulse" />
          Destek Olun
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bize Bir Kahve Ismarla</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          AYIKLA, iş arayanların hayalet ilanlarla vakit kaybetmesini engellemek için tamamen ücretsiz olarak geliştirilmiştir. Bize destek olmak ister misiniz?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
        {/* Visual Cup Card */}
        <div className="relative aspect-square rounded-3xl overflow-hidden glass-panel border border-border/80 shadow-2xl flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
          <Image
            src="/images/premium_coffee_cup.jpg"
            alt="Premium 3D Glassmorphic Coffee Cup"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute bottom-6 left-6 z-20 flex flex-col">
            <span className="text-xs font-semibold text-primary">AYIKLA Topluluğu</span>
            <span className="text-base font-extrabold text-white mt-0.5">Emeğe Küçük Bir Katkı</span>
          </div>
        </div>

        {/* Donation Action Card */}
        <Card className="glass-panel border-border/85 rounded-3xl p-6 h-full flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              ☕️ Kahve Desteği
            </CardTitle>
            <CardDescription className="text-xs leading-normal mt-1">
              Bağışlarınız, sunucu maliyetlerimizi karşılamamıza ve platformu reklamsız olarak geliştirmeye devam etmemize yardımcı olur.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-3.5">
              <div className="bg-secondary/20 p-4 rounded-2xl border border-border/20 flex flex-col gap-2">
                <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">Nasıl Çalışır?</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Aşağıdaki butona tıkladığınızda Shopier üzerinden güvenli bağış ödeme sayfasına yönlendirilirsiniz. Dilediğiniz miktarda kahve ısmarlayarak platformumuza can suyu verebilirsiniz.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Destekçilere Özel</span>
                <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    BETA Rozeti
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Sınırsız Günlük Analiz İzni
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Geliştirici Teşekkür Listesi
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleDonationRedirect}
              className="w-full h-12 bg-gradient-premium hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-primary/10 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Coffee className="h-5 w-5" />
              Kahve Ismarla (Shopier)
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info card */}
      <Card className="glass-panel border-border/40 rounded-3xl p-6 bg-secondary/10 flex items-start gap-4 mt-4">
        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Destek Hakkında SSS</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ödemeleriniz Shopier ödeme altyapısı ile güvence altındadır. İşleminiz gerçekleştikten sonra sisteme otomatik yansımaması durumunda, profil sayfanızdaki e-posta ile destek ekibimize ulaşabilirsiniz. Teşekkürler!
          </p>
        </div>
      </Card>
    </div>
  );
}
