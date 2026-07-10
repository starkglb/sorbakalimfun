'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Card } from '@/components/ui/card';
import { Loader2, LayoutDashboard, Users, MessageSquare, Flag, Ban, BarChart3, ScrollText, Settings } from 'lucide-react';

const adminNav = [
  { href: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard },
  { href: '/admin/users', labelKey: 'admin.users', icon: Users },
  { href: '/admin/messages', labelKey: 'admin.messages', icon: MessageSquare },
  { href: '/admin/reports', labelKey: 'admin.reports', icon: Flag },
  { href: '/admin/bans', labelKey: 'admin.bans', icon: Ban },
  { href: '/admin/stats', labelKey: 'admin.stats', icon: BarChart3 },
  { href: '/admin/logs', labelKey: 'admin.logs', icon: ScrollText },
  { href: '/admin/settings', labelKey: 'admin.settings', icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!profile || !profile.is_admin)) {
      router.push('/');
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t('admin.title')}</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="md:w-56 md:flex-shrink-0">
          <Card className="glass sticky top-20 border-0 p-2">
            {adminNav.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.labelKey as never)}
                </Link>
              );
            })}
          </Card>
        </nav>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
