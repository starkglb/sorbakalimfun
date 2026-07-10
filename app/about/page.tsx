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
Amacımız; insanların kendilerini daha rahat ifade edebileceği, arkadaşlarıyla daha samimi ve eğlenceli etkileşimler kurabileceği güvenli bir ortam oluşturmaktır. SorBakalım sayesinde kullanıcılar kendi profil bağlantılarını oluşturabilir, çevrelerinden anonim sorular alabilir ve gelen mesajları kolayca yönetebilir.

Platformumuz, kullanıcı deneyimini ön planda tutarak sade, hızlı ve modern bir yapı ile geliştirilmiştir. Gizlilik, güvenlik ve kolay kullanım bizim için en önemli öncelikler arasındadır.

SorBakalım olarak insanların birbirini daha iyi tanımasını, farklı düşüncelerin paylaşılmasını ve dijital dünyada daha özgün iletişim kurulmasını hedefliyoruz.
          </p>
          <p className="mt-4">
Sor, keşfet, paylaş. Çünkü her sorunun bir cevabı vardır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
