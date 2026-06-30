'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Heart, ArrowUpRight, HelpCircle, Check, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';
import Image from 'next/image';

export default function KahveIsmarlaPage() {
  const handleDonationRedirect = () => {
    window.open('https://www.shopier.com/onurgoc/45298023', '_blank', 'noopener,noreferrer');
  };

  const benefits = [
    'Profilinizde Parlayan "Premium Destekçi" (BETA) Rozeti',
    'Günlük analiz sınırlarının tamamen kaldırılması',
    'Geliştirici teşekkür listesinde yer alma',
    'Yapay zekâ modelleri için ek kota ve yüksek hızlı analiz',
    'Gelecek yeni özelliklere öncelikli erişim hakkı'
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-6 px-4">
      {/* Title Header */}
      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary tracking-wide uppercase mx-auto">
          <Heart className="h-3.5 w-3.5 fill-primary animate-pulse text-primary" />
          Destek Olun
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Bize Bir <span className="text-gradient">Kahve Ismarla</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          AYIKLA, iş arayanların hayalet ilanlarla vakit kaybetmesini engellemek için tamamen ücretsiz ve reklamsız olarak geliştirilmiştir. Sunucu ve yapay zekâ analiz API maliyetlerimizi karşılamamıza katkıda bulunmak ister misiniz?
        </p>
      </div>

      {/* Focused 2-Column Redesign */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-4">
        {/* Visual Cup Card (Left) */}
        <div className="relative aspect-square md:h-auto rounded-3xl overflow-hidden glass-panel border border-border/80 shadow-xl flex flex-col justify-between p-8 group">
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />
          <Image
            src="/images/premium_coffee_cup.jpg"
            alt="Premium 3D Glassmorphic Coffee Cup"
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
            priority
          />
          
          <div className="z-20 self-start bg-background/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/40 text-xs font-bold text-primary flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Topluluk Desteği
          </div>

          <div className="z-20 flex flex-col">
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">AYIKLA Projesi</span>
            <span className="text-2xl font-black text-white mt-1 drop-shadow-md">
              Emeğe Küçük Bir Katkı
            </span>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs drop-shadow-sm leading-relaxed">
              Katkınız tamamen platformun reklamsız kalması, sunucu kaynakları ve yapay zekâ analiz API'lerinin finanse edilmesinde kullanılmaktadır.
            </p>
          </div>
        </div>

        {/* Focused Single Donation Card (Right) */}
        <Card className="glass-panel border-border/85 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div className="flex flex-col gap-6">
            <CardHeader className="p-0">
              <div className="flex justify-between items-baseline gap-2">
                <CardTitle className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                  ☕️ Kahve Desteği
                </CardTitle>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-black text-primary bg-primary/5 px-4 py-1.5 border border-primary/10 rounded-xl leading-none">
                    200 TL
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Tek Seferlik Bağış</span>
                </div>
              </div>
              <CardDescription className="text-xs leading-relaxed mt-4">
                Tek seferlik 200 TL bağışta bulunarak projenin geliştirilmesine doğrudan katkıda bulunabilir ve destekçilere özel ayrıcalıklara sahip olabilirsiniz.
              </CardDescription>
            </CardHeader>

            <div className="border-t border-border/40 my-1" />

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                Destekçilere Sağlanan Ayrıcalıklar
              </span>
              <ul className="flex flex-col gap-3 mt-1.5">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-normal">
                    <span className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="pt-0.5">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <Button
              onClick={handleDonationRedirect}
              className="w-full h-14 bg-gradient-premium hover:opacity-95 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/15 transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <Coffee className="h-5 w-5" />
              200 TL Kahve Ismarla (Shopier)
              <ArrowUpRight className="h-4.5 w-4.5" />
            </Button>

            {/* Micro assurances badges */}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-border/40 pt-4 mt-1">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] font-bold text-foreground">Güvenli Ödeme</span>
                <span className="text-[8px] text-muted-foreground">Shopier Güvencesi</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="h-5 w-5 text-amber-500" />
                <span className="text-[10px] font-bold text-foreground">Anında Aktivasyon</span>
                <span className="text-[8px] text-muted-foreground">Otomatik Tanımlanır</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Heart className="h-5 w-5 text-red-500 fill-red-500/10" />
                <span className="text-[10px] font-bold text-foreground">Reklamsız Deneyim</span>
                <span className="text-[8px] text-muted-foreground">Sonsuza Kadar Reklamsız</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info card */}
      <Card className="glass-panel border-border/40 rounded-3xl p-6 bg-secondary/10 flex items-start gap-4 mt-4">
        <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Destek ve Bağış Hakkında Bilgilendirme</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ödemeleriniz, Türkiye'nin önde gelen güvenli ödeme altyapısı **Shopier** ile güvence altındadır. İşleminiz gerçekleştikten sonra ayrıcalıkların hesabınıza otomatik yansımaması durumunda, profil sayfanızdaki e-posta adresi üzerinden destek ekibimize ulaşabilirsiniz. AYIKLA topluluğuna verdiğiniz destek için teşekkür ederiz!
          </p>
        </div>
      </Card>
    </div>
  );
}
