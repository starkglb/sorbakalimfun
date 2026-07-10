'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { SocialLinks } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Upload, Save } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [socials, setSocials] = useState<SocialLinks>({});
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setBio(profile.bio ?? '');
      setAvatarUrl(profile.avatar_url ?? '');
      setCoverUrl(profile.cover_url ?? '');
      setSocials(profile.social_links ?? {});
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded bg-muted" />
          <div className="h-40 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t('error.unauthorized')}</h1>
        <Button className="mt-6" asChild>
          <Link href="/login">{t('nav.login')}</Link>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl || null,
          cover_url: coverUrl || null,
          social_links: socials,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('common.error'));
      await refreshProfile();
      toast.success(t('settings.saved'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File, type: 'avatar' | 'cover') => {
    if (!user) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? t('common.error'));
    if (type === 'avatar') setAvatarUrl(data.url);
    else setCoverUrl(data.url);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const signInRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: user.email!, password: currentPassword }),
      });
      if (!signInRes.ok) throw new Error(t('error.invalidCredentials'));
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('common.error'));
      toast.success(t('settings.saved'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t('settings.title')}</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
          <TabsTrigger value="account">{t('settings.account')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>{t('settings.profile')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.avatar')}</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt="Avatar" /> : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, 'avatar').catch((err) => toast.error(err.message));
                        }}
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span><Upload className="mr-2 h-4 w-4" /> Upload</span>
                      </Button>
                    </label>
                    <Input
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Image URL"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('settings.cover')}</Label>
                <div className="flex gap-2">
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, 'cover').catch((err) => toast.error(err.message));
                      }}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span><Upload className="mr-2 h-4 w-4" /> Upload</span>
                    </Button>
                  </label>
                  <Input
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Cover image URL"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">{t('settings.displayName')}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('settings.bio')}</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={200}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">{bio.length}/200</p>
              </div>

              <div className="space-y-3">
                <Label>{t('settings.socialLinks')}</Label>
                {(['twitter', 'instagram', 'github', 'youtube', 'website'] as const).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-20 text-sm capitalize text-muted-foreground">{key}</span>
                    <Input
                      value={socials[key] ?? ''}
                      onChange={(e) => setSocials((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`https://${key}.com/...`}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t('settings.save')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>{t('settings.account')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.username')}</Label>
                <Input value={profile.username} disabled />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.login.email')}</Label>
                <Input value={user.email ?? ''} disabled />
              </div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <h3 className="font-semibold text-destructive">{t('settings.dangerZone')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t('settings.deleteAccount')}</p>
                <Button
                  variant="destructive"
                  className="mt-3"
                  onClick={async () => {
                    if (confirm('Are you sure? This cannot be undone.')) {
                      await signOut();
                      toast.success('Account deletion requested');
                    }
                  }}
                >
                  {t('settings.deleteAccount')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>{t('settings.changePassword')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={changingPassword} className="w-full">
                  {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('settings.save')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
