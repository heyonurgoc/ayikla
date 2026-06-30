import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYIKLA - LinkedIn Hayalet İlan (Ghost Job) Analiz Platformu",
  description: "İş ilanının gerçekten işe alım için mi açıldığını öğren. Yapay zekâ destekli LinkedIn ilan analiz aracı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const accent = localStorage.getItem('ayikla_accent_color') || 'mono';
            document.documentElement.setAttribute('data-accent', accent);
            const glass = localStorage.getItem('ayikla_glass_effect');
            if (glass === 'false') document.documentElement.setAttribute('data-glass-disabled', 'true');
          } catch (e) {}
        ` }} />
      </head>
      <body className={`${inter.variable} font-sans min-h-full bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

