'use client';

import { useI18n } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="glass border-0">
        <CardContent className="prose dark:prose-invert pt-6">
          <h1 className="text-2xl font-bold">{t('footer.privacy')}</h1>
          <h2 className="mt-4 text-lg font-semibold">Anonimlik</h2>
          <p className="text-muted-foreground">
            Mesaj gönderen kişinin kimliği asla alıcıya açıklanmaz. Gönderen e-posta veya hesap bilgileri
            mesajla birlikte saklanmaz.
          </p>
          <h2 className="mt-4 text-lg font-semibold">Veri Saklama</h2>
          <p className="text-muted-foreground">
            IP adresi, cihaz ve tarayıcı bilgileri yalnızca spam önleme ve kötüye kullanım tespiti için
            saklanır. Bu bilgiler alıcıya gösterilmez.
          </p>
          <h2 className="mt-4 text-lg font-semibold">Hesap Verileri</h2>
          <p className="text-muted-foreground">
            Profil bilgilerin, gelen mesajların ve ayarların yalnızca senin tarafından erişilebilir.
            Gelen kutundaki mesajlar yalnızca senin görebileceğin şekildedir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
