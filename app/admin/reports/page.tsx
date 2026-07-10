'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, Clock } from 'lucide-react';

export default function AdminReportsPage() {
  const { t } = useI18n();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reports', { credentials: 'include' });
      const data = await res.json();
      setReports((data as Report[]) ?? []);
    } catch {
      toast.error(t('common.error'));
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const resolve = async (id: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'resolved', resolved_at: new Date().toISOString() } : r)));
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.reports')}</h2>
      {loading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : reports.length === 0 ? (
        <p className="text-muted-foreground">{t('error.notFound')}</p>
      ) : (
        <div className="space-y-2">
          {reports.map((report) => (
            <Card key={report.id} className="glass border-0">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{report.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Message ID: {report.message_id}</p>
                  </div>
                  {report.status === 'pending' && (
                    <Button variant="outline" size="sm" onClick={() => resolve(report.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      {t('admin.resolveReport')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
