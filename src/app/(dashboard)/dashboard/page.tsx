'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { services } from '@/services';
import { Analysis, CompanyInsight, User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Sparkles, 
  History, 
  Bookmark, 
  ShieldAlert, 
  TrendingUp, 
  Building2, 
  ArrowUpRight,
  TrendingDown,
  Gauge
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [companies, setCompanies] = useState<CompanyInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await services.getAuth().getCurrentUser();
        setUser(currentUser);

        const analysisHistory = await services.getAnalysis().getAnalysisHistory();
        setHistory(analysisHistory);

        const companyInsights = await services.getAnalysis().getCompanyInsights();
        setCompanies(companyInsights);
      } catch (err) {
        toast.error('Gösterge paneli verileri yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 animate-bounce" />
          <span className="text-xs text-muted-foreground">İstatistikler yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Calculate some aggregate values
  const totalAnalyses = history.length;
  const savedAnalysesCount = history.filter((a) => a.isSaved).length;
  
  const averageGhostScore = totalAnalyses > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.ghostScore, 0) / totalAnalyses) 
    : 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 35) return 'text-amber-500';
    return 'text-green-500';
  };

  // Group history by company to find highest-risk companies from user's own scans
  const highRiskCompanies = (() => {
    const companyMap: Record<string, { id: string; name: string; logoUrl: string; ghostScore: number; count: number }> = {};
    
    history.forEach((analysis) => {
      const key = analysis.companyName.toLowerCase().trim();
      if (!companyMap[key]) {
        companyMap[key] = {
          id: 'c-' + Math.random().toString(36).substr(2, 9),
          name: analysis.companyName,
          logoUrl: analysis.companyLogo || analysis.companyName.substring(0, 2).toUpperCase(),
          ghostScore: analysis.ghostScore,
          count: 1
        };
      } else {
        if (analysis.ghostScore > companyMap[key].ghostScore) {
          companyMap[key].ghostScore = analysis.ghostScore;
        }
        companyMap[key].count += 1;
      }
    });

    return Object.values(companyMap)
      .sort((a, b) => b.ghostScore - a.ghostScore)
      .slice(0, 3);
  })();

  // Find top risk company
  const highestRiskCompany = highRiskCompanies.length > 0 ? highRiskCompanies[0] : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Merhaba, {user?.fullName || 'Kullanıcı'} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            İlan analiz durumunuzu izleyin ve AI destekli iş ilan güvenilirlik raporlarına erişin.
          </p>
        </div>
        <Link href="/analiz-yap">
          <Button className="bg-gradient-premium hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center gap-2 px-5 py-2.5">
            <Sparkles className="h-4 w-4" />
            Yeni İlan Analiz Et
          </Button>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metrik 1: Ghost Score */}
        <Card className="glass-panel card-hover rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-premium" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Ghost Job Skoru
              <Gauge className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold mt-1">
              %{averageGhostScore}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-normal">
              Analiz ettiğiniz ilanların ortalama hayalet ilan çıkma riski.
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                averageGhostScore >= 70 ? 'bg-red-500/10 text-red-500' : averageGhostScore >= 35 ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
              }`}>
                {averageGhostScore >= 70 ? 'Yüksek' : averageGhostScore >= 35 ? 'Orta' : 'Güvenli'} Riskli
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metrik 2: Analiz Sayısı */}
        <Card className="glass-panel card-hover rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-premium" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Analiz Sayısı
              <History className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold mt-1">{totalAnalyses}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-normal">
              Toplam yaptığınız yapay zekâ destekli tarama sayısı.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-green-500">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Bu hafta +4 yeni analiz</span>
            </div>
          </CardContent>
        </Card>

        {/* Metrik 3: Kaydedilen İlanlar */}
        <Card className="glass-panel card-hover rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-premium" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Kaydedilen İlanlar
              <Bookmark className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold mt-1">{savedAnalysesCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-normal">
              Daha sonra göz atmak üzere favorilere eklediğiniz ilanlar.
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <Link href="/analiz-gecmisi?filter=saved" className="text-[10px] text-primary font-bold hover:underline">
                Kaydedilenleri Görüntüle &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Metrik 4: Premium Durumu */}
        <Card className="glass-panel card-hover rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-premium" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Kullanım Limiti ({user?.premiumStatus})
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold mt-1">
              {user?.analysisUsed || 0} <span className="text-sm font-medium text-muted-foreground">/ {user?.analysisLimit || 50}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Progress 
              value={user ? (user.analysisUsed / user.analysisLimit) * 100 : 0} 
              className="h-1.5 bg-secondary/80 [&>div]:bg-gradient-premium"
            />
            <p className="text-[10px] text-muted-foreground">
              Aylık analiz yenilenme tarihine son 14 gün kaldı.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Analyses & Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Analyses Table */}
        <Card className="lg:col-span-2 glass-panel rounded-3xl border-border/60">
          <CardHeader className="flex flex-row justify-between items-center pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Son Analizleriniz</CardTitle>
              <CardDescription className="text-xs">Yapay zekâ ile incelenen en yeni ilanlarınız</CardDescription>
            </div>
            <Link href="/analiz-gecmisi">
              <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-secondary/50">
                Tümünü Gör
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase tracking-wider bg-secondary/10">
                    <th className="py-3 px-6">Pozisyon / Şirket</th>
                    <th className="py-3 px-4">Tarih</th>
                    <th className="py-3 px-4 text-center">Ghost Skor</th>
                    <th className="py-3 px-4 text-right">Detaylar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                        Henüz hiç analiz yapmadınız.
                      </td>
                    </tr>
                  ) : (
                    history.slice(0, 4).map((analysis) => (
                      <tr key={analysis.id} className="hover:bg-secondary/15 transition-all">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground">{analysis.jobTitle}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Building2 className="h-3 w-3" />
                              {analysis.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-muted-foreground">
                          {new Date(analysis.analysisDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant="outline" className={`font-bold px-2 py-0.5 border ${getRiskColor(analysis.riskLevel)}`}>
                            %{analysis.ghostScore}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link href={`/analiz-gecmisi?id=${analysis.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Ghost Job Company warnings & Analytics info */}
        <div className="flex flex-col gap-6">
          {/* Top Ghost Job Risk Warnings */}
          <Card className="glass-panel rounded-3xl border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Yüksek Riskli Firmalar
              </CardTitle>
              <CardDescription className="text-xs">
                Platform genelinde en yüksek hayalet ilan oranına sahip şirketler
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {highRiskCompanies.length === 0 ? (
                <p className="text-xs text-muted-foreground">Analiz yapıldıkça yüksek riskli firmalar burada listelenecektir.</p>
              ) : (
                highRiskCompanies.map((company) => (
                    <div key={company.id} className="flex justify-between items-center p-3 rounded-2xl bg-secondary/20 border border-border/40">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-premium flex items-center justify-center font-bold text-white text-xs shadow">
                          {company.logoUrl}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{company.name}</span>
                          <span className="text-[10px] text-muted-foreground">{company.count} kez analiz edildi</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-bold ${getScoreColor(company.ghostScore)}`}>
                          %{company.ghostScore}
                        </span>
                        <span className="text-[9px] text-muted-foreground">En Yüksek Skor</span>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>

          {/* AI Advisor Tip */}
          <Card className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-24 w-24 text-primary" />
            </div>
            <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Yapay Zekâ Tavsiyesi
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
              {highestRiskCompany 
                ? `Son dönem verilerine göre ${highestRiskCompany.name} firmasının ilanları %${highestRiskCompany.ghostScore} oranında hayalet ilan çıkmaktadır. Bu firmanın ilanlarına başvururken İK aktivitesini kontrol edin.` 
                : 'Başvurularınızda zaman kazanmak için 30 günden eski ilanları analiz etmeden başvurmayın. Genellikle yayında unutulan ilanlar yüksek hayalet skoru alır.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
