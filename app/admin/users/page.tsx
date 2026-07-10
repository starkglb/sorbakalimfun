'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { Profile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Ban, CheckCircle, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`, { credentials: 'include' });
      const data = await res.json();
      setUsers((data as Profile[]) ?? []);
    } catch {
      toast.error(t('common.error'));
    }
    setLoading(false);
  }, [search, t]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleBan = async (user: Profile) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, is_banned: !user.is_banned }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_banned: !u.is_banned } : u)));
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.users')}</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('common.search')}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="text-muted-foreground">{t('common.loading')}</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">{t('error.notFound')}</p>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="glass border-0">
              <CardContent className="flex items-center gap-3 py-3">
                <Avatar className="h-10 w-10">
                  {user.avatar_url ? <AvatarImage src={user.avatar_url} alt={user.username} /> : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/${user.username}`} className="font-medium hover:underline truncate">
                      {user.display_name ?? user.username}
                    </Link>
                    {user.is_admin && <Badge variant="secondary">Admin</Badge>}
                    {user.is_banned && <Badge variant="destructive">Banned</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
                <Button
                  variant={user.is_banned ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={() => toggleBan(user)}
                >
                  {user.is_banned ? (
                    <><CheckCircle className="mr-2 h-4 w-4" /> {t('admin.unbanUser')}</>
                  ) : (
                    <><Ban className="mr-2 h-4 w-4" /> {t('admin.banUser')}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
