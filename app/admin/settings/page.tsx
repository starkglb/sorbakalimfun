'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { SiteSettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' });
        const data = await res.json();
        setSettings(data as SiteSettings | null);
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: settings.site_name,
          site_description: settings.site_description,
          maintenance_mode: settings.maintenance_mode,
          allow_anonymous_messages: settings.allow_anonymous_messages,
          message_max_length: settings.message_max_length,
          rate_limit_per_hour: settings.rate_limit_per_hour,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error(t('common.error'));
      toast.success(t('settings.saved'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.settings')}</h2>
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>{t('admin.settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">{t('admin.siteName')}</Label>
            <Input
              id="siteName"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDesc">{t('admin.siteDescription')}</Label>
            <Textarea
              id="siteDesc"
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label>{t('admin.maintenanceMode')}</Label>
              <p className="text-xs text-muted-foreground">Siteyi bakım moduna al</p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(v) => setSettings({ ...settings, maintenance_mode: v })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label>{t('admin.allowAnonymous')}</Label>
              <p className="text-xs text-muted-foreground">Anonim mesaj gönderimine izin ver</p>
            </div>
            <Switch
              checked={settings.allow_anonymous_messages}
              onCheckedChange={(v) => setSettings({ ...settings, allow_anonymous_messages: v })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxLen">{t('admin.messageMaxLength')}</Label>
              <Input
                id="maxLen"
                type="number"
                value={settings.message_max_length}
                onChange={(e) => setSettings({ ...settings, message_max_length: parseInt(e.target.value) || 500 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rateLimit">{t('admin.rateLimit')}</Label>
              <Input
                id="rateLimit"
                type="number"
                value={settings.rate_limit_per_hour}
                onChange={(e) => setSettings({ ...settings, rate_limit_per_hour: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t('settings.save')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
