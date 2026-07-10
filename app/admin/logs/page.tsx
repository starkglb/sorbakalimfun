'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { ActivityLog } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

export default function AdminLogsPage() {
  const { t } = useI18n();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/logs', { credentials: 'include' });
        const data = await res.json();
        setLogs((data as ActivityLog[]) ?? []);
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.logs')}</h2>
      {loading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : logs.length === 0 ? (
        <p className="text-muted-foreground">{t('error.notFound')}</p>
      ) : (
        <ScrollArea className="h-[600px] rounded-xl">
          <div className="space-y-1 pr-4">
            {logs.map((log) => (
              <Card key={log.id} className="glass border-0">
                <CardContent className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.action}</p>
                      {log.target_type && (
                        <p className="text-xs text-muted-foreground">
                          {log.target_type}: {log.target_id?.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
