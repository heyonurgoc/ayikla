import Link from 'next/link';
import { ShieldCheck, EyeOff, Sparkles, ArrowRight, Activity, Search, ShieldAlert } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border/50 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-primary/20">
            <Search className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            AYIKLA
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-gradient-premium hover:opacity-90 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/10"
          >
            Kayıt Ol
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-6 text-center max-w-5xl mx-auto py-12 md:py-24 gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-wide uppercase">
          <Sparkles className="h-3 w-3" />
          Yapay Zekâ Destekli İlan Analizi
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          İş ilanının gerçekten işe alım için mi açıldığını <span className="text-gradient">öğren.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          AYIKLA, LinkedIn ilanlarının başvuru oranı, yayında kalma süresi, şirket büyüme hızı ve İK aktivitesini tarayarak hayalet ilan (ghost job) riski taşımayan gerçek fırsatları filtreler.
        </p>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-semibold text-primary tracking-wide">
          ✨ Şimdi ve sonsuza kadar ücretsiz
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 bg-gradient-premium text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            Hemen Ücretsiz Analiz Et
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border font-semibold text-base px-8 py-4 rounded-2xl hover:bg-secondary/80 transition-all"
          >
            Dashboard'a Git
          </Link>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="glass-panel p-8 rounded-3xl card-hover relative overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
              <EyeOff className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ghost Job Tespiti</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pozisyonun sadece özgeçmiş havuzu toplamak için mi açıldığını yoksa gerçekten işe alım yapılıp yapılmadığını saniyeler içinde raporlar.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl card-hover relative overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Risk Analizi</h3>
            <p className="text-muted-foreground leading-relaxed">
              İlanın yayında kalma süresi, şirket turnover oranları ve İK departmanının genel LinkedIn aktivitelerini analiz ederek risk seviyesini derecelendirir.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl card-hover relative overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Şirket Profili</h3>
            <p className="text-muted-foreground leading-relaxed">
              Şirketlerin ilan geçmişini inceleyerek hayalet ilan yayınlama eğilimlerini hesaplar ve transparan bir şirket karnesi sunar.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-muted-foreground border-t border-border/40">
        &copy; {new Date().getFullYear()} AYIKLA. Tüm Hakları Saklıdır. Yapay zekâ analizleri veri modelleri ve geçmiş ilan trendlerine dayanmaktadır.
      </footer>
    </div>
  );
}
