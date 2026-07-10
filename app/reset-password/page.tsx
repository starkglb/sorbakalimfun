'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, MailCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('common.error'));
      setSent(true);
      toast.success(t('common.success'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <Card className="glass border-0 text-center">
          <CardContent className="pt-8">
            <MailCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">{t('auth.verify.title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('auth.verify.subtitle')}</p>
            <Link href="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
              {t('nav.login')}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card className="glass animate-scale-in border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.reset.title')}</CardTitle>
          <CardDescription>{t('auth.reset.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.reset.submit')}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              {t('common.back')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
