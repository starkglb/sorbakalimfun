'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { SponsorBanner } from '@/components/sponsor-banner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Send, QrCode, Copy, Link2, Twitter, Instagram, Github, Youtube, Globe, Share2 } from 'lucide-react';
import { getDeviceFingerprint } from '@/lib/device';
import { ShareableImage } from '@/components/shareable-image';
import Link from 'next/link';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { t } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch(`/api/profile?username=${encodeURIComponent(username.toLowerCase())}`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data as Profile | null);
      }
      setLoading(false);
    }
    loadProfile();
  }, [username]);

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : '';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!message.trim()) {
      toast.error(t('message.empty'));
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipientUsername: profile.username,
          content: message.trim(),
          deviceFingerprint: getDeviceFingerprint(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          toast.error(t('message.rateLimited'));
        } else if (response.status === 403) {
          toast.error(data.error === 'IP banned' ? 'IP adresiniz yasaklı' : data.error);
        } else {
          toast.error(data.error ?? t('common.error'));
        }
        return;
      }

      toast.success(t('message.sent'));
      setMessage('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success(t('profile.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-xl bg-muted" />
          <div className="h-20 w-20 rounded-full bg-muted" />
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-24 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t('error.notFound')}</h1>
        <p className="mt-2 text-muted-foreground">@{username} kullanıcısı bulunamadı</p>
        <Button className="mt-6" asChild>
          <Link href="/">{t('common.back')}</Link>
        </Button>
      </div>
    );
  }

  const socials = profile.social_links ?? {};
  const socialIcons: { key: keyof typeof socials; icon: typeof Twitter; label: string }[] = [
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
    { key: 'instagram', icon: Instagram, label: 'Instagram' },
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'youtube', icon: Youtube, label: 'YouTube' },
    { key: 'website', icon: Globe, label: 'Website' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-accent sm:h-48">
        {profile.cover_url && (
          <img
            src={profile.cover_url}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Avatar */}
      <div className="-mt-12 flex items-end justify-between sm:-mt-16">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg sm:h-32 sm:w-32">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-2xl text-primary">
            {profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex gap-2 pb-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t('profile.qr')}>
                <QrCode className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t('profile.qr')}</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center p-4">
                <div className="rounded-xl bg-white p-4">
                  <QRCodeSVG value={profileUrl} size={200} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={handleCopy} aria-label={t('profile.copyLink')}>
            {copied ? <Copy className="h-5 w-5 text-success" /> : <Link2 className="h-5 w-5" />}
          </Button>
          <ShareableImage
            type="story"
            data={{
              username: profile.username,
              displayName: profile.display_name ?? undefined,
              bio: profile.bio,
              avatarUrl: profile.avatar_url,
              profileUrl: profileUrl,
            }}
            trigger={
              <Button variant="outline" size="icon" aria-label="Instagram hikaye paylaş">
                <Share2 className="h-5 w-5" />
              </Button>
            }
          />
        </div>
      </div>

      {/* Profile info */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{profile.display_name ?? profile.username}</h1>
        <p className="text-muted-foreground">@{profile.username}</p>
        {profile.bio && <p className="mt-3 text-foreground/90">{profile.bio}</p>}
      </div>

      {/* Social links */}
      {Object.values(socials).some((v) => v) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {socialIcons.map(({ key, icon: Icon, label }) =>
            socials[key] ? (
              <a
                key={key}
                href={socials[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg glass px-3 py-1.5 text-sm hover:scale-105 transition-transform"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ) : null
          )}
        </div>
      )}

      {/* Sponsor banner below bio */}
      <SponsorBanner variant="compact" />

      {/* Message form */}
      <Card className="glass mt-4 border-0">
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold">{t('profile.sendMessage')}</h2>
          <form onSubmit={handleSend} className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('profile.placeholder')}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{message.length}/500</span>
              <Button type="submit" disabled={sending || !message.trim()}>
                {sending ? '...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t('profile.submit')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
