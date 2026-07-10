'use client';

import { useI18n } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="glass border-0">
        <CardContent className="prose dark:prose-invert pt-6">
          <h1 className="text-2xl font-bold">{t('footer.about')}</h1>
          <p className="text-muted-foreground">{t('site.description')}</p>
          <p className="mt-4">
            SorBakalım, insanların anonim olarak dürüst mesajlar alabileceği ücretsiz bir platformdur.
            Profilini oluştur, linkini paylaş ve herkesten geri bildirim al.
          </p>
          <p className="mt-4">
            Platform tamamen ücretsizdir. Premium üyelik, abonelik veya gizli ücret yoktur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
