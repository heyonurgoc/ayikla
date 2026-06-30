'use client';

import { useState } from 'react';
import { services } from '@/services';
import { Analysis } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Search, 
  Link as LinkIcon, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert, 
  Bookmark,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalizYapPage() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<Analysis | null>(null);
  const [saving, setSaving] = useState(false);

  const scanSteps = [
    'LinkedIn ilanı taranıyor...',
    'Metadata ve ilan yayın tarihi çıkartılıyor...',
    'Şirket büyüme ve turnover geçmişi sorgulanıyor...',
    'İK sorumlusunun işe alım aktivitesi inceleniyor...',
    'DeepSeek AI ile risk analizi tamamlanıyor...'
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'url' && !url) {
      toast.error('Lütfen bir LinkedIn ilan URL\'si girin.');
      return;
    }
    if (activeTab === 'text' && !description) {
      toast.error('Lütfen ilan açıklama metnini girin.');
      return;
    }

    setResult(null);
    setAnalyzing(true);
    setScanStep(0);

    // Simulate scanning animation steps
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    try {
      const response = await services.getAnalysis().analyzeJob(
        activeTab === 'url' ? url : undefined,
        activeTab === 'text' ? description : undefined
      );
      
      // Delay slightly for visual comfort
      setTimeout(() => {
        setResult(response);
        setAnalyzing(false);
        clearInterval(stepInterval);
        toast.success('İlan analizi başarıyla tamamlandı!');
      }, 2500);
    } catch (err: any) {
      setAnalyzing(false);
      clearInterval(stepInterval);
      toast.error(err.message || 'Analiz sırasında bir hata oluştu.');
    }
  };

  const handleSaveToggle = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const saved = await services.getAnalysis().toggleSaveAnalysis(result.id);
      setResult({ ...result, isSaved: saved });
      toast.success(saved ? 'Analiz başarıyla favorilere eklendi.' : 'Analiz favorilerden çıkarıldı.');
    } catch (err) {
      toast.error('Kayıt güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setDescription('');
    setResult(null);
  };

  const getRiskDetails = (level: string) => {
    switch (level) {
      case 'high':
        return { label: 'Yüksek Risk', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: ShieldAlert };
      case 'medium':
        return { label: 'Orta Risk', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertCircle };
      default:
        return { label: 'Düşük Risk', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 };
    }
  };

  const getCriterionLabel = (key: string) => {
    switch (key) {
      case 'postingAge': return 'İlan Yayında Kalma Süresi';
      case 'companyGrowth': return 'Şirket Büyüme Değişimi';
      case 'descriptionAuthenticity': return 'İş Tanımı Özgünlüğü';
      case 'recruiterActivity': return 'İK Ekibi Aktivitesi';
      case 'salaryTransparency': return 'Maaş Şeffaflığı';
      default: return key;
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI İlan Analiz Aracı</h1>
        <p className="text-sm text-muted-foreground mt-1">
          LinkedIn iş ilanlarının hayalet (ghost job) olma ihtimalini yapay zekâ modellerimiz ile anında tarayın.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Input Form */}
        {!analyzing && !result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-panel border-border/80 rounded-3xl">
              <CardHeader className="pb-4">
                <div className="flex gap-2 p-1 bg-secondary/50 rounded-2xl w-fit">
                  <Button
                    variant={activeTab === 'url' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('url')}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                      activeTab === 'url' ? 'bg-gradient-premium text-white shadow' : 'text-muted-foreground'
                    }`}
                  >
                    <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                    LinkedIn URL
                  </Button>
                  <Button
                    variant={activeTab === 'text' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('text')}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                      activeTab === 'text' ? 'bg-gradient-premium text-white shadow' : 'text-muted-foreground'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    İş Tanımı Metni
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
                  {activeTab === 'url' ? (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="job-url" className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                        LinkedIn İlan Bağlantısı
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="job-url"
                          type="url"
                          placeholder="https://www.linkedin.com/jobs/view/..."
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-12 h-14 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-sm"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground pl-1">
                        LinkedIn üzerindeki herhangi bir açık pozisyonun bağlantı adresini buraya yapıştırın.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="job-desc" className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                        İş Tanımı Metni
                      </label>
                      <textarea
                        id="job-desc"
                        rows={8}
                        placeholder="İlan başlığı, şirket adı ve iş detaylarını buraya yapıştırın..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 bg-background/50 border border-border/80 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-sm focus:outline-none placeholder:text-muted-foreground"
                      />
                      <p className="text-[11px] text-muted-foreground pl-1">
                        Metin analizi, URL taraması kadar net şirket geçmişi sunamayabilir fakat dil analizini tam olarak gerçekleştirir.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-premium hover:opacity-95 text-white font-semibold rounded-2xl shadow-xl shadow-primary/10 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    Hayalet İlan Analizi Başlat
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* State 2: Analyzing / Scanning Simulation */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
            key="scanning-state"
          >
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center relative mb-8 shadow-inner shadow-primary/5">
              <div className="absolute inset-0 rounded-3xl border border-primary/30 animate-ping opacity-75" />
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Yapay Zekâ Analiz Ediyor</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-10">
              İlan parametreleri taranıyor ve risk dereceleri hesaplanıyor. Lütfen bekleyin.
            </p>

            {/* Stepper progress */}
            <div className="w-full max-w-md flex flex-col gap-3">
              {scanSteps.map((step, idx) => {
                const isDone = idx < scanStep;
                const isActive = idx === scanStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/5 border border-primary/20 scale-[1.01]' 
                        : isDone 
                        ? 'bg-secondary/20 opacity-70' 
                        : 'opacity-40'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      )}
                    </div>
                    <span className={`text-xs font-medium text-left ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* State 3: Analysis Results */}
        {!analyzing && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
            key="result-state"
          >
            {/* Clean Result Header (No AI Risk Card, just Job Title + Actions) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/30 p-6 rounded-3xl border border-border/40 glass-panel">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider mb-1">Analiz Raporu</span>
                <h2 className="text-xl font-bold text-foreground">{result.jobTitle}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{result.companyName} &bull; {result.location}</p>
              </div>
              <div className="flex gap-2 self-stretch sm:self-auto">
                <Button 
                  variant="ghost" 
                  onClick={handleSaveToggle} 
                  disabled={saving}
                  className="flex-1 sm:flex-none text-xs rounded-xl flex items-center gap-1.5 h-10 border border-border px-4"
                >
                  <Bookmark className={`h-4 w-4 ${result.isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  {result.isSaved ? 'Kaydedildi' : 'Kaydet'}
                </Button>
                <Button 
                  onClick={resetForm}
                  className="flex-1 sm:flex-none text-xs bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 rounded-xl flex items-center gap-1.5 h-10 px-4"
                >
                  <RefreshCw className="h-4 w-4" />
                  Yeni Analiz
                </Button>
              </div>
            </div>

            {/* Score & Criteria Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Gauge */}
              <Card className="glass-panel border-border/80 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider mb-2">Ghost Job Skoru</span>
                <div className="relative flex items-center justify-center mb-2">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="54" className="stroke-secondary" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="54" 
                      className={`${
                        result.ghostScore >= 70 ? 'stroke-red-500' : result.ghostScore >= 35 ? 'stroke-amber-500' : 'stroke-green-500'
                      }`} 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={339.29}
                      strokeDashoffset={339.29 - (339.29 * result.ghostScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-foreground">%{result.ghostScore}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">İhtimal</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-2">Düşük skor daha güvenli ilana işaret eder.</span>
              </Card>

              {/* Criteria Breakdown Grid */}
              <Card className="md:col-span-2 glass-panel border-border/80 rounded-3xl p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Kriter Detay Analizi
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Hayalet ilan puanını oluşturan temel parametre kırılımları
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4 flex flex-col gap-6">
                  {Object.entries(result.criteriaBreakdown).map(([key, value]: any) => {
                    return (
                      <div key={key} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-foreground">{getCriterionLabel(key)}</span>
                          <span className={`font-bold ${
                            value.score >= 75 ? 'text-red-500' : value.score >= 35 ? 'text-amber-500' : 'text-green-500'
                          }`}>
                            %{value.score} risk
                          </span>
                        </div>
                        <Progress 
                          value={value.score} 
                          className="h-2 bg-secondary/80 rounded-full [&>div]:bg-gradient-premium"
                        />
                        <p className="text-[11px] text-muted-foreground leading-normal pl-0.5">
                          {value.text}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
