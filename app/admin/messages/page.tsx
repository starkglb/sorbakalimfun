'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { Message } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Clock } from 'lucide-react';

type AdminMessage = Message & { recipient_username: string };

export default function AdminMessagesPage() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages', { credentials: 'include' });
      const data = await res.json();
      setMessages((data as AdminMessage[]) ?? []);
    } catch {
      toast.error(t('common.error'));
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!data.success) throw new Error();
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.messages')}</h2>
      {loading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : messages.length === 0 ? (
        <p className="text-muted-foreground">{t('error.notFound')}</p>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <Card key={msg.id} className="glass border-0">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">@{msg.recipient_username}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMessage(msg.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
