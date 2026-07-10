'use client';

import { useI18n } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="glass border-0">
        <CardContent className="prose dark:prose-invert pt-6">
          <h1 className="text-2xl font-bold">{t('footer.contact')}</h1>
          <p className="text-muted-foreground">
            Soruların veya geri bildirimlerin varsa, bize <strong>iletisim@sorbakalim.fun</strong> adresinden ulaşabilirsin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
