import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SponsorBanner } from '@/components/sponsor-banner';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sorbakalim.fun'),
  title: {
    default: 'SorBakalım — Anonim Mesajlaşma Platformu',
    template: '%s | SorBakalım',
  },
  description:
    'SorBakalım ücretsiz bir anonim mesajlaşma platformudur. Profilini oluştur, linkini paylaş ve herkesten dürüst mesajlar al.',
  keywords: ['anonim mesaj', 'soru sor', 'mesajlaşma', 'anonymous message', 'sorbakalim'],
  authors: [{ name: 'SorBakalım' }],
  openGraph: {
    title: 'SorBakalım — Anonim Mesajlaşma Platformu',
    description: 'Profilini oluştur, linkini paylaş ve herkesten anonim mesajlar al.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'SorBakalım',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SorBakalım',
    description: 'Anonim mesajlaşma platformu',
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col bg-mesh">
              <Header />
              <SponsorBanner />
              <main className="flex-1">{children}</main>
              <SponsorBanner />
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
