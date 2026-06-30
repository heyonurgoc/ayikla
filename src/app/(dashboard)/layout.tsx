'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { services } from '@/services';
import { User, Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Sparkles,
  History,
  Building2,
  CreditCard,
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  Coffee,
  Briefcase
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/analiz-gecmisi?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await services.getAuth().getCurrentUser();
        if (!currentUser) {
          router.push('/login');
        } else {
          setUser(currentUser);
          
          // Fetch notifications
          const notifs = await services.getUser().getNotifications();
          setNotifications(notifs);
          setUnreadNotifCount(notifs.filter((n) => !n.read).length);
        }
      } catch (err) {
        toast.error('Oturum bilgileri doğrulanamadı.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await services.getAuth().logout();
      toast.success('Başarıyla çıkış yapıldı.');
      router.push('/login');
    } catch (err) {
      toast.error('Çıkış yapılırken bir hata oluştu.');
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await services.getUser().markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadNotifCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analiz Yap', href: '/analiz-yap', icon: Sparkles, badge: 'AI' },
    { name: 'Analiz Geçmişi', href: '/analiz-gecmisi', icon: History },
    { name: 'Kahve Ismarla', href: '/kahve-ismarla', icon: Coffee },
    { name: 'Profil', href: '/profil', icon: UserIcon },
    { name: 'Ayarlar', href: '/ayarlar', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-premium flex items-center justify-center animate-pulse shadow-lg shadow-primary/20">
            <Search className="h-6 w-6 text-white animate-spin" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background/50">
      {/* 1. Desktop Sidebar (Sticky/Fixed) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-card/45 backdrop-blur-md sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-border/60 flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/ayikla_black.png"
              alt="AYIKLA"
              width={100}
              height={36}
              className="dark:hidden block object-contain"
              priority
            />
            <Image
              src="/ayikla_white.png"
              alt="AYIKLA"
              width={100}
              height={36}
              className="dark:block hidden object-contain"
              priority
            />
          </Link>
          <span className="text-[10px] bg-primary/15 text-primary border border-primary/20 font-bold px-1.5 py-0.5 rounded-none uppercase">
            BETA
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-premium text-white shadow-md shadow-primary/15'
                    : 'text-muted-foreground hover:bg-secondary/65 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  {item.name}
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Quick Info */}
        <div className="p-4 border-t border-border/60 bg-secondary/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 border border-primary/20 flex-shrink-0">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.fullName}</p>
              <span className="text-[10px] font-medium text-muted-foreground truncate block">{user?.email}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-lg flex-shrink-0 cursor-pointer"
            title="Çıkış Yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm">
          <div className="w-64 bg-card border-r border-border flex flex-col h-full animate-in slide-in-from-left duration-200">
            {/* Mobile Sidebar Header */}
            <div className="h-16 px-6 border-b border-border flex justify-between items-center">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/ayikla_black.png"
                  alt="AYIKLA"
                  width={100}
                  height={36}
                  className="dark:hidden block object-contain"
                  priority
                />
                <Image
                  src="/ayikla_white.png"
                  alt="AYIKLA"
                  width={100}
                  height={36}
                  className="dark:block hidden object-contain"
                  priority
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-premium text-white shadow-md shadow-primary/10'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-border flex items-center gap-3 bg-secondary/30">
              <Avatar className="h-9 w-9 border border-primary/20">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user?.fullName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-red-500 h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-45 h-16 border-b border-border/60 bg-card/45 backdrop-blur-md px-4 md:px-8 flex justify-between items-center">
          {/* Left: Mobile Toggle & Page Title Indicator */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 bg-secondary/30 max-w-xs md:w-64 relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="İlan veya şirket ara..."
                  className="w-full bg-transparent pl-8 border-none text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                />
              </div>
            </form>
          </div>

          {/* Right: Actions (Notifications, Theme Toggle, Avatar) */}
          <div className="flex items-center gap-3">
            {/* Kahve Ismarla Button */}
            <Button
              onClick={() => router.push('/kahve-ismarla')}
              className="hidden md:flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-gradient-premium hover:opacity-95 text-white border-none shadow-sm shadow-primary/10 transition-all"
            >
              <Coffee className="h-4 w-4" />
              Kahve Ismarla
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </Button>

          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
