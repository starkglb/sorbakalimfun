'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Flag, Ban } from 'lucide-react';

type Stats = {
  totalUsers: number;
  totalMessages: number;
  pendingReports: number;
  activeBans: number;
};

export default function AdminDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalMessages: 0, pendingReports: 0, activeBans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'include' });
        const data = await res.json();
        setStats({
          totalUsers: data.users ?? 0,
          totalMessages: data.messages ?? 0,
          pendingReports: data.pendingReports ?? 0,
          activeBans: (data.ipBans ?? 0) + (data.deviceBans ?? 0),
        });
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: t('admin.totalUsers'), value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: t('admin.totalMessages'), value: stats.totalMessages, icon: MessageSquare, color: 'text-green-500' },
    { label: t('admin.totalReports'), value: stats.pendingReports, icon: Flag, color: 'text-orange-500' },
    { label: t('admin.totalBans'), value: stats.activeBans, icon: Ban, color: 'text-red-500' },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.dashboard')}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? '...' : card.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
