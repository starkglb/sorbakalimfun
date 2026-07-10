'use client';

import { useI18n } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="glass border-0">
        <CardContent className="prose dark:prose-invert pt-6">
          <h1 className="text-2xl font-bold">{t('footer.terms')}</h1>
          <p className="text-muted-foreground">
            SorBakalım'ı kullanarak, anonim mesaj gönderirken saygılı olmayı kabul edersin.
            Taciz, tehdit veya yasa dışı içerik göndermek yasaktır.
          </p>
          <h2 className="mt-4 text-lg font-semibold">Kullanım Kuralları</h2>
          <ul className="text-muted-foreground">
            <li>Spam göndermek yasaktır</li>
            <li>Taciz veya nefret söylemi yasaktır</li>
            <li>Yasa dışı içerik yasaktır</li>
            <li>Diğer kullanıcıların gizliliğini ihlal etmek yasaktır</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Kuralları ihlal eden kullanıcılar IP veya cihaz bazında yasaklanabilir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
