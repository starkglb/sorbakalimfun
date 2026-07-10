'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const res = await fetch('/api/notifications', { credentials: 'include' });
    if (!res.ok) {
      toast.error(t('common.error'));
      return;
    }
    const data = await res.json();
    setNotifications((data as Notification[]) ?? []);
    setLoading(false);
  }, [user, t]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadNotifications();
  }, [user, authLoading, loadNotifications]);

  const markAllRead = async () => {
    if (!user) return;
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      credentials: 'include',
    });
    if (!res.ok) {
      toast.error(t('common.error'));
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success(t('common.success'));
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">{t('error.unauthorized')}</h1>
        <Button className="mt-6" asChild>
          <Link href="/login">{t('nav.login')}</Link>
        </Button>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} yeni</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-16 text-center">
          <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">{t('notifications.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`glass border-0 animate-slide-up ${!n.is_read ? 'ring-1 ring-primary/30' : ''}`}
            >
              <CardContent className="flex items-center gap-3 py-3">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${!n.is_read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{t('notifications.newMessage')}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
                {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
