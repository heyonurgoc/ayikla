'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { services } from '@/services';
import { Analysis } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Bookmark, 
  Building2, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function AnalizGecmisiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [savedFilter, setSavedFilter] = useState<boolean>(false);
  
  // Selected analysis for modal detail
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  // Sync state with search params if an ID is passed (e.g. from Dashboard click)
  useEffect(() => {
    const id = searchParams.get('id');
    const filterParam = searchParams.get('filter');
    const searchParam = searchParams.get('search');
    
    if (id) {
      setSelectedId(id);
    }
    if (filterParam === 'saved') {
      setSavedFilter(true);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await services.getAnalysis().getAnalysisHistory();
      setHistory(data);
    } catch (err) {
      toast.error('Geçmiş analiz verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch single analysis details when selectedId changes
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedId) {
        setSelectedAnalysis(null);
        return;
      }
      try {
        const detail = await services.getAnalysis().getAnalysisById(selectedId);
        if (detail) {
          setSelectedAnalysis(detail);
        } else {
          toast.error('Analiz kaydı bulunamadı.');
          setSelectedId(null);
        }
      } catch (err) {
        toast.error('Detaylar yüklenirken hata oluştu.');
        setSelectedId(null);
      }
    };
    fetchDetail();
  }, [selectedId]);

  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening dialog
    try {
      const saved = await services.getAnalysis().toggleSaveAnalysis(id);
      setHistory(prev =>
        prev.map(a => a.id === id ? { ...a, isSaved: saved } : a)
      );
      if (selectedAnalysis && selectedAnalysis.id === id) {
        setSelectedAnalysis({ ...selectedAnalysis, isSaved: saved });
      }
      toast.success(saved ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.');
    } catch (err) {
      toast.error('Kayıt güncellenemedi.');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return ShieldAlert;
      case 'medium': return AlertCircle;
      default: return CheckCircle2;
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

  // Filter history
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;
    const matchesSaved = !savedFilter || item.isSaved;

    return matchesSearch && matchesRisk && matchesSaved;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setRiskFilter('all');
    setSavedFilter(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Analiz Geçmişi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daha önce yapay zekâ ile değerlendirdiğiniz tüm ilanları görüntüleyin, filtreleyin ve kaydedin.
        </p>
      </div>

      {/* Filters Toolbar */}
      <Card className="glass-panel border-border/60 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Pozisyon veya şirket ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10.5 bg-background/50 border-border/80 rounded-xl text-xs"
          />
        </div>

        {/* Action Selects */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 p-1 bg-secondary/50 rounded-xl border border-border/30">
            <Button
              variant={riskFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('all')}
              className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold transition-all h-8 ${
                riskFilter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Tümü
            </Button>
            <Button
              variant={riskFilter === 'low' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('low')}
              className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold transition-all h-8 ${
                riskFilter === 'low' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'text-muted-foreground'
              }`}
            >
              Düşük Risk
            </Button>
            <Button
              variant={riskFilter === 'medium' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('medium')}
              className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold transition-all h-8 ${
                riskFilter === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-muted-foreground'
              }`}
            >
              Orta Risk
            </Button>
            <Button
              variant={riskFilter === 'high' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('high')}
              className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold transition-all h-8 ${
                riskFilter === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-muted-foreground'
              }`}
            >
              Yüksek Risk
            </Button>
          </div>

          <Button
            variant={savedFilter ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSavedFilter(!savedFilter)}
            className={`text-xs font-semibold rounded-xl border border-border h-10 px-4 flex items-center gap-1.5 ${
              savedFilter ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${savedFilter ? 'fill-white' : ''}`} />
            Kaydedilenler
          </Button>

          {(searchQuery || riskFilter !== 'all' || savedFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-red-500 font-semibold">
              Temizle
            </Button>
          )}
        </div>
      </Card>

      {/* History Table Card */}
      <Card className="glass-panel border-border/60 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase tracking-wider bg-secondary/10">
                  <th className="py-3.5 px-6">İlan / Pozisyon</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4">Risk Durumu</th>
                  <th className="py-3.5 px-4 text-center">Skor</th>
                  <th className="py-3.5 px-6 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex justify-center items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary animate-ping" />
                        <span className="text-xs text-muted-foreground font-medium">Kayıtlar aranıyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground">
                      Kriterlere uyan analiz kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => {
                    const RiskIcon = getRiskIcon(item.riskLevel);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className="hover:bg-secondary/15 transition-all cursor-pointer group"
                      >
                        <td className="py-4.5 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {item.jobTitle}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Building2 className="h-3 w-3" />
                              {item.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4.5 px-4 text-xs text-muted-foreground flex-shrink-0">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.analysisDate).toLocaleDateString('tr-TR')}
                          </span>
                        </td>
                        <td className="py-4.5 px-4">
                          <Badge variant="outline" className={`font-semibold px-2.5 py-0.5 border flex items-center gap-1 w-fit rounded-full text-[10px] ${
                            getRiskColor(item.riskLevel)
                          }`}>
                            <RiskIcon className="h-3 w-3" />
                            {item.riskLevel === 'high' ? 'Yüksek' : item.riskLevel === 'medium' ? 'Orta' : 'Düşük'}
                          </Badge>
                        </td>
                        <td className="py-4.5 px-4 text-center">
                          <span className={`text-sm font-bold ${
                            item.ghostScore >= 70 ? 'text-red-500' : item.ghostScore >= 35 ? 'text-amber-500' : 'text-green-500'
                          }`}>
                            %{item.ghostScore}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleToggleSave(item.id, e)}
                              className="h-8.5 w-8.5 text-muted-foreground hover:text-primary rounded-lg border border-transparent hover:border-border/30 hover:bg-secondary/40"
                            >
                              <Bookmark className={`h-4.5 w-4.5 ${item.isSaved ? 'fill-primary text-primary' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedId(item.id)}
                              className="h-8.5 w-8.5 text-muted-foreground hover:text-primary rounded-lg border border-transparent hover:border-border/30 hover:bg-secondary/40"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog Modal */}
      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-3xl glass-panel border-border rounded-3xl p-6 md:p-8">
          {selectedAnalysis ? (
            <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-1">
              <DialogHeader className="border-b border-border/40 pb-4">
                <div className="flex justify-between items-start gap-4 pr-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider mb-1">
                      İlan Detaylı Raporu
                    </span>
                    <DialogTitle className="text-xl font-bold">{selectedAnalysis.jobTitle}</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {selectedAnalysis.companyName} &bull; {selectedAnalysis.location}
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className={`font-bold px-3 py-1 border flex items-center gap-1 rounded-full text-xs ${
                    getRiskColor(selectedAnalysis.riskLevel)
                  }`}>
                    {selectedAnalysis.riskLevel === 'high' ? 'Yüksek Risk' : selectedAnalysis.riskLevel === 'medium' ? 'Orta Risk' : 'Düşük Risk'}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Main Info */}
              <div className="grid grid-cols-1 gap-6">
                <div className="glass-panel border-border/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-secondary/10">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Ghost Job Skoru</span>
                  <span className={`text-5xl font-black ${
                    selectedAnalysis.ghostScore >= 70 ? 'text-red-500' : selectedAnalysis.ghostScore >= 35 ? 'text-amber-500' : 'text-green-500'
                  }`}>
                    %{selectedAnalysis.ghostScore}
                  </span>
                  <span className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    İlanın pasif veya sahte olma riski ihtimali. Düşük risk oranı gerçek işe alımı simgeler.
                  </span>
                </div>
              </div>

              {/* Criteria Breakdown list */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold border-b border-border/40 pb-2">Kriter Değerlendirmeleri</h4>
                <div className="flex flex-col gap-5">
                  {Object.entries(selectedAnalysis.criteriaBreakdown).map(([key, value]: any) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{getCriterionLabel(key)}</span>
                        <span className={`font-bold ${
                          value.score >= 70 ? 'text-red-500' : value.score >= 35 ? 'text-amber-500' : 'text-green-500'
                        }`}>
                          %{value.score} risk
                        </span>
                      </div>
                      <Progress value={value.score} className="h-1.5 [&>div]:bg-gradient-premium bg-secondary/80 rounded-full" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-0.5">{value.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-2">
                <Button
                  variant="ghost"
                  onClick={(e) => handleToggleSave(selectedAnalysis.id, e)}
                  className="text-xs rounded-xl flex items-center gap-1.5 border border-border h-10 px-4"
                >
                  <Bookmark className={`h-4.5 w-4.5 ${selectedAnalysis.isSaved ? 'fill-primary text-primary' : ''}`} />
                  {selectedAnalysis.isSaved ? 'Kaydedildi' : 'Favorilere Ekle'}
                </Button>
                <Button
                  onClick={() => setSelectedId(null)}
                  className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl h-10 px-4 border border-border"
                >
                  Kapat
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground">Yükleniyor...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
