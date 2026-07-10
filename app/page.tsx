'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Shield, QrCode, Bell, Globe, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user, profile } = useAuth();
  const { t } = useI18n();

  const features = [
    { icon: MessageSquare, title: 'Anonim Mesajlar', desc: 'Herkesten dürüst, anonim mesajlar al. Kimlik asla açıklanmaz.' },
    { icon: Shield, title: 'Güvenli & Gizli', desc: 'IP ve cihaz bilgileri yalnızca spam önleme için saklanır.' },
    { icon: QrCode, title: 'QR Kod & Link', desc: 'Profil linkini ve QR kodunu paylaş, mesajları topla.' },
    { icon: Bell, title: 'Anlık Bildirimler', desc: 'Yeni mesaj geldiğinde anında haberdar ol.' },
    { icon: Globe, title: 'TR & EN', desc: 'Türkçe ve İngilizce dil desteği.' },
    { icon: Sparkles, title: 'Tamamen Ücretsiz', desc: 'Premium yok, abonelik yok. Her zaman ücretsiz.' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="flex flex-col items-center text-center animate-fade-in">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Tamamen ücretsiz · Premium yok
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Anonim mesajlarla <span className="gradient-text">gerçek düşünceleri</span> keşfet
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {t('site.description')}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {user ? (
            <Button size="lg" asChild>
              <Link href={profile?.username ? `/${profile.username}` : '/inbox'} className="flex items-center gap-2">
                {t('nav.profile')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/register">{t('nav.register')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">{t('nav.login')}</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Card
            key={feature.title}
            className="glass animate-slide-up border-0 p-6 transition-transform hover:scale-[1.02]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </Card>
        ))}
      </section>

      <section className="mt-20 text-center">
        <div className="glass-strong mx-auto max-w-2xl rounded-2xl p-10">
          <h2 className="text-2xl font-bold">Nasıl çalışır?</h2>
          <div className="mt-6 space-y-4 text-left">
            <Step number={1} text="Hesabını oluştur ve kullanıcı adını seç" />
            <Step number={2} text="Profil linkini sosyal medyada paylaş" />
            <Step number={3} text="Anonim mesajları gelen kutunda oku" />
            <Step number={4} text="Sabitle, sil veya ara — sen kontrol edersin" />
          </div>
          {!user && (
            <Button size="lg" className="mt-8" asChild>
              <Link href="/register">Hemen başla</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {number}
      </div>
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}
