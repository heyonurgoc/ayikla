import Link from 'next/link';
import { Search } from 'lucide-react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-primary/20">
            <Search className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            AYIKLA
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          İş ilanının gerçekten işe alım için mi açıldığını öğren.
        </p>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-xl relative z-10 border-border/80">
        {children}
      </div>
    </div>
  );
}
