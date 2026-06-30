'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { 
  Bell, 
  Monitor, 
  Save,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance'>('notifications');
  const { theme, setTheme } = useTheme();

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Appearance states
  const [glassEffect, setGlassEffect] = useState(true);
  const [accentColor, setAccentColor] = useState('purple');

  // Load saved accent color and glassmorphism on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAccent = localStorage.getItem('ayikla_accent_color') || 'purple';
      setAccentColor(savedAccent);
      const savedGlass = localStorage.getItem('ayikla_glass_effect') !== 'false';
      setGlassEffect(savedGlass);
    }
  }, []);

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-accent', color);
      localStorage.setItem('ayikla_accent_color', color);
    }
  };

  const handleGlassChange = (enabled: boolean) => {
    setGlassEffect(enabled);
    if (typeof window !== 'undefined') {
      if (enabled) {
        document.documentElement.removeAttribute('data-glass-disabled');
      } else {
        document.documentElement.setAttribute('data-glass-disabled', 'true');
      }
      localStorage.setItem('ayikla_glass_effect', String(enabled));
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Sistem bildirim tercihleri güncellendi.');
  };

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Arayüz görünüm ayarları kaydedildi.');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Sistem Ayarları</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Uygulama bildirim tercihlerini ve arayüz görünüm ayarlarını yapılandırın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: navigation tabs */}
        <div className="flex flex-col gap-4">
          <Card className="glass-panel border-border/60 rounded-3xl p-3 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-premium text-white shadow shadow-primary/10' 
                  : 'text-muted-foreground hover:bg-secondary/65 hover:text-foreground'
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              Bildirim Tercihleri
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all ${
                activeTab === 'appearance' 
                  ? 'bg-gradient-premium text-white shadow shadow-primary/10' 
                  : 'text-muted-foreground hover:bg-secondary/65 hover:text-foreground'
              }`}
            >
              <Monitor className="h-4.5 w-4.5" />
              Görünüm Ayarları
            </button>
          </Card>
        </div>

        {/* Right column: settings content cards */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {activeTab === 'notifications' ? (
            <Card className="glass-panel border-border/60 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Bildirim Tercihleri
                </CardTitle>
                <CardDescription className="text-xs">
                  Hangi durumlarda sistem içi veya e-posta bildirimleri alacağınızı seçin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePreferences} className="flex flex-col gap-5">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-border/30">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">E-posta Bildirimleri</span>
                      <span className="text-[10px] text-muted-foreground">Analiz sonuçları özetleri e-posta ile iletilsin.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-border/30">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">Yüksek Risk Uyarıları</span>
                      <span className="text-[10px] text-muted-foreground">Skoru %80 üzeri çıkan analizlerde anlık pop-up göster.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={riskAlerts}
                      onChange={(e) => setRiskAlerts(e.target.checked)}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-border/30">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">Haftalık Rapor</span>
                      <span className="text-[10px] text-muted-foreground">Takip ettiğiniz şirketlerin haftalık anomali raporlarını gönder.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-fit h-10 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 px-6 ml-auto"
                  >
                    <Save className="h-4 w-4" />
                    Tercihleri Kaydet
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-panel border-border/60 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Görünüm Ayarları
                </CardTitle>
                <CardDescription className="text-xs">
                  Uygulama temasını ve arayüz görsel tercihlerini özelleştirin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveAppearance} className="flex flex-col gap-6">
                  {/* Theme Switcher */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-semibold text-foreground">Arayüz Teması</span>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all ${
                          theme === 'light'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border/60 bg-secondary/15 hover:bg-secondary/30 text-muted-foreground'
                        }`}
                      >
                        <Sun className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Açık Tema</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all ${
                          theme === 'dark'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border/60 bg-secondary/15 hover:bg-secondary/30 text-muted-foreground'
                        }`}
                      >
                        <Moon className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Karanlık Tema</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all ${
                          theme === 'system'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border/60 bg-secondary/15 hover:bg-secondary/30 text-muted-foreground'
                        }`}
                      >
                        <Laptop className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Sistem Teması</span>
                      </button>
                    </div>
                  </div>

                  {/* Glassmorphic Switch */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-border/30">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">Premium Cam Efekti (Glassmorphism)</span>
                      <span className="text-[10px] text-muted-foreground">Arka plan bulanıklaştırma ve yarı saydam panelleri etkinleştirin.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={glassEffect}
                      onChange={(e) => handleGlassChange(e.target.checked)}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Accent Color Selection */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-foreground">Arayüz Vurgu Rengi</span>
                    <div className="flex gap-3 mt-1">
                      {[
                        { id: 'purple', class: 'bg-purple-600', name: 'Mor (Varsayılan)' },
                        { id: 'blue', class: 'bg-blue-600', name: 'Mavi' },
                        { id: 'emerald', class: 'bg-emerald-600', name: 'Zümrüt Yeşili' },
                        { id: 'amber', class: 'bg-amber-600', name: 'Turuncu' }
                      ].map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => handleAccentChange(color.id)}
                          title={color.name}
                          className={`h-7 w-7 rounded-full ${color.class} flex items-center justify-center transition-all ${
                            accentColor === color.id
                              ? 'ring-2 ring-offset-2 ring-primary scale-110'
                              : 'opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-fit h-10 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 px-6 ml-auto mt-4"
                  >
                    <Save className="h-4 w-4" />
                    Ayarları Kaydet
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
