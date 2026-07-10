'use client';

import { useI18n } from '@/lib/i18n/i18n-context';

export function SponsorBanner({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const { t } = useI18n();

  return (
    <div className="w-full px-4 py-3" role="complementary" aria-label={t('sponsor.advertisement')}>
      <div className="mx-auto max-w-5xl">
        <div className="glass relative overflow-hidden rounded-xl border border-dashed border-primary/30 px-4 py-2">
          <span className="absolute left-2 top-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {t('sponsor.advertisement')}
          </span>
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 ${
                variant === 'compact' ? 'h-[100px] w-full max-w-[320px]' : 'h-[90px] w-full max-w-[970px]'
              }`}
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  {t('sponsor.title')} · 970×90 / 320×100
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Banner placeholder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
