'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SponsorBanner } from '@/components/sponsor-banner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Pin, PinOff, Trash2, Search, Inbox as InboxIcon, Clock, Instagram } from 'lucide-react';
import { ShareableImage } from '@/components/shareable-image';
import Link from 'next/link';

export default function InboxPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');

  const loadMessages = useCallback(async () => {
    if (!user) return;
    const res = await fetch('/api/messages', { credentials: 'include' });
    if (!res.ok) {
      toast.error(t('common.error'));
      return;
    }
    const data = await res.json();
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  }, [user, t]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadMessages();
  }, [user, authLoading, loadMessages]);

  const togglePin = async (id: string, current: boolean) => {
    const res = await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ is_pinned: !current }),
    });
    if (!res.ok) {
      toast.error(t('common.error'));
      return;
    }
    setMessages((prev) =>
      prev
        .map((m) => (m.id === id ? { ...m, is_pinned: !current } : m))
        .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    );
    toast.success(t('common.success'));
  };

  const deleteMessage = async (id: string) => {
    const res = await fetch(`/api/messages/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      toast.error(t('common.error'));
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success(t('common.success'));
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <InboxIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">{t('error.unauthorized')}</h1>
        <p className="mt-2 text-muted-foreground">{t('auth.login.subtitle')}</p>
        <Button className="mt-6" asChild>
          <Link href="/login">{t('nav.login')}</Link>
        </Button>
      </div>
    );
  }

  const filtered = messages
    .filter((m) => (filter === 'pinned' ? m.is_pinned : true))
    .filter((m) => (search ? m.content.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('inbox.title')}</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('inbox.all')}
          </Button>
          <Button
            variant={filter === 'pinned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pinned')}
          >
            {t('inbox.pinned')}
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('inbox.search')}
          className="pl-10"
        />
      </div>

      {/* Sponsor banner above message list */}
      <SponsorBanner variant="compact" />

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <InboxIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">{t('inbox.empty')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('inbox.emptyDesc')}</p>
          {profile && (
            <Button className="mt-6" asChild>
              <Link href={`/${profile.username}`}>{t('nav.profile')}</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <Card
              key={msg.id}
              className={`glass border-0 animate-slide-up ${msg.is_pinned ? 'ring-1 ring-primary/40' : ''}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {msg.is_pinned && (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <Pin className="h-3 w-3" />
                        {t('inbox.pinned')}
                      </span>
                    )}
                    <p className="whitespace-pre-wrap break-words text-foreground">{msg.content}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePin(msg.id, msg.is_pinned)}
                      aria-label={msg.is_pinned ? t('inbox.unpin') : t('inbox.pin')}
                    >
                      {msg.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                    </Button>
                    <ShareableImage
                      type="message"
                      data={{
                        content: msg.content,
                        username: profile?.username ?? '',
                        displayName: profile?.display_name ?? undefined,
                        avatarUrl: profile?.avatar_url ?? null,
                      }}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Instagram'da paylaş">
                          <Instagram className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={t('inbox.delete')}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('inbox.confirmDelete')}</AlertDialogTitle>
                          <AlertDialogDescription>{msg.content.slice(0, 100)}...</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMessage(msg.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('common.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
