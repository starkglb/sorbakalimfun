'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18n-context';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              <span className="text-sm font-bold">S</span>
            </div>
            <span className="font-bold">
              Sor<span className="gradient-text">Bakalım</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">{t('footer.about')}</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">{t('footer.contact')}</Link>
          </nav>
        </div>
        <div className="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">
          © {year} SorBakalım. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
