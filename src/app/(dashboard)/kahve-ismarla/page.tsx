'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Heart, ArrowUpRight, HelpCircle, Check, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';
import Image from 'next/image';

interface TierData {
  id: string;
  name: string;
  price: string;
  description: string;
  benefits: string[];
  iconCount: number;
  popular?: boolean;
  shopierUrl: string;
}

export default function KahveIsmarlaPage() {
  const [selectedTier, setSelectedTier] = useState<string>('3');

  const tiers: Record<string, TierData> = {
    '1': {
      id: '1',
      name: 'Yol Arkadaşı',
      price: '50 TL',
      description: 'Geliştirme hevesimizi artıracak ve platformu geliştirmeye devam etmemizi sağlayacak anlamlı bir jest.',
      benefits: [
        'Profilinizde "Destekçi" (BETA) Rozeti',
        'Geliştirici teşekkür listesinde yer alma',
        'Uygulamanın reklamsız kalmasına katkı'
      ],
      iconCount: 1,
      shopierUrl: 'https://www.shopier.com/onurgoc/45298023'
    },
    '3': {
      id: '3',
      name: 'Kahve Gurmesi',
      price: '150 TL',
      description: 'Sunucu maliyetlerimize can suyu olacak, platformun altyapı performansını artıracak harika bir destek.',
      benefits: [
        'Profilinizde Parlayan "Premium Destekçi" Rozeti',
        'Günlük analiz sınırlarının tamamen kaldırılması',
        'Geliştirici teşekkür listesinde öncelikli gösterim',
        'Reklamsız ve yüksek hızlı sorgu deneyimi'
      ],
      iconCount: 3,
      popular: true,
      shopierUrl: 'https://www.shopier.com/onurgoc/45298023'
    },
    '5': {
      id: '5',
      name: 'Süper Kahraman',
      price: '250 TL',
      description: 'Yeni yapay zekâ modellerini entegre etmemizi ve sunucu kaynaklarımızı büyütmemizi sağlayan gerçek bir dost.',
      benefits: [
        'Profilinizde Altın Renkli "Süper Kahraman" Rozeti',
        'Sınırsız günlük analiz hakkı',
        'Teşekkür listesinde en üstte sabitlenmiş profil',
        'Gelecek yapay zekâ özelliklerine erken erişim hakkı',
        'Geliştirici ekiple doğrudan geri bildirim kanalı'
      ],
      iconCount: 5,
      shopierUrl: 'https://www.shopier.com/onurgoc/45298023'
    },
    'custom': {
      id: 'custom',
      name: 'Vizyoner Sponsor',
      price: 'Serbest Destek',
      description: 'Geliştirme sürecini hızlandırmak, sunucu kapasitesini artırmak ve platformun geleceğine yön vermek için.',
      benefits: [
        'Tüm "Süper Kahraman" avantajları',
        'İsteğe bağlı olarak ana sayfada sponsor logolu teşekkür',
        'Geliştiricilerle birebir görüntülü sohbet/geribildirim hakkı',
        'Gelecek yol haritasında oy kullanma ayrıcalığı'
      ],
      iconCount: 0,
      shopierUrl: 'https://www.shopier.com/onurgoc/45298023'
    }
  };

  const activeData = tiers[selectedTier];

  const handleDonationRedirect = () => {
    window.open(activeData.shopierUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-6 px-4">
      {/* Title Header */}
      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary tracking-wide uppercase mx-auto">
          <Heart className="h-3.5 w-3.5 fill-primary animate-pulse text-primary" />
          Bağış ve Katkı
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Bize Bir <span className="text-gradient">Kahve Ismarla</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          AYIKLA, iş arayanların hayalet ilanlarla vakit kaybetmesini engellemek için tamamen ücretsiz ve reklamsız olarak geliştirilmiştir. Projenin sunucu ve API maliyetlerini karşılamamıza destek olmak ister misiniz?
        </p>
      </div>

      {/* Interactive Options Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {Object.values(tiers).map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative cursor-pointer glass-panel p-5 border flex flex-col justify-between transition-all duration-300 ${
                isSelected
                  ? 'border-primary ring-1 ring-primary bg-primary/5 translate-y-[-2px] shadow-lg shadow-primary/5'
                  : 'border-border/60 hover:border-primary/40 hover:bg-secondary/20'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-premium text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow shadow-primary/20">
                  En Çok Tercih Edilen
                </span>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1">
                    {tier.id === 'custom' ? (
                      <Award className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    ) : (
                      Array.from({ length: Math.min(tier.iconCount, 3) }).map((_, i) => (
                        <Coffee
                          key={i}
                          className={`h-5 w-5 ${
                            isSelected ? 'text-primary fill-primary/10' : 'text-muted-foreground'
                          }`}
                        />
                      ))
                    )}
                    {tier.iconCount > 3 && (
                      <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                        +{tier.iconCount - 3}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="font-extrabold text-base text-foreground">{tier.name}</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-normal">
                    {tier.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Katkı Tutarı</span>
                <span className="text-lg font-black text-foreground">{tier.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Details & Checkout area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
        {/* Visual Showcase (Left 2-cols) */}
        <div className="lg:col-span-2 relative aspect-square lg:h-auto rounded-3xl overflow-hidden glass-panel border border-border/80 shadow-xl flex flex-col justify-between p-8 group">
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
            Seçilen Destek Planı
          </div>

          <div className="z-20 flex flex-col">
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">AYIKLA Topluluğu</span>
            <span className="text-2xl font-black text-white mt-1 drop-shadow-md">
              {activeData.name}
            </span>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs drop-shadow-sm leading-relaxed">
              Katkılarınız tamamen sunucu maliyetleri ve yapay zekâ analiz API'lerinin finanse edilmesinde kullanılmaktadır.
            </p>
          </div>
        </div>

        {/* Detailed Benefits & Checkout Action (Right 3-cols) */}
        <Card className="lg:col-span-3 glass-panel border-border/85 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div className="flex flex-col gap-6">
            <CardHeader className="p-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                  ☕️ {activeData.name} Desteği
                </CardTitle>
                <span className="text-2xl font-black text-primary bg-primary/5 px-4 py-1 border border-primary/10 rounded-xl">
                  {activeData.price}
                </span>
              </div>
              <CardDescription className="text-xs leading-relaxed mt-2.5">
                {activeData.description}
              </CardDescription>
            </CardHeader>

            <div className="border-t border-border/40 my-1" />

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                Planın Sağlayacağı Ayrıcalıklar
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                {activeData.benefits.map((benefit, index) => (
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
              {activeData.id === 'custom' ? 'Destek Ol (Shopier\'e Git)' : `${activeData.name} Desteği Ver`}
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
                <span className="text-[10px] font-bold text-foreground">Hızlı Aktivasyon</span>
                <span className="text-[8px] text-muted-foreground">Anında Tanımlanır</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Heart className="h-5 w-5 text-red-500 fill-red-500/10" />
                <span className="text-[10px] font-bold text-foreground">Reklamsız Deneyim</span>
                <span className="text-[8px] text-muted-foreground">Reklamsız Kullanım</span>
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
            Ödemeleriniz, Türkiye'nin önde gelen ödeme kuruluşu **Shopier** ödeme altyapısı ile %100 güvence altındadır. İşleminiz gerçekleştikten sonra ayrıcalıkların hesabınıza otomatik yansımaması durumunda, profil sayfanızdaki e-posta adresi üzerinden destek ekibimize ulaşabilirsiniz. AYIKLA topluluğuna verdiğiniz can suyu için sonsuz teşekkürler!
          </p>
        </div>
      </Card>
    </div>
  );
}
