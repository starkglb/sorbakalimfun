'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import type { IpBan, DeviceBan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Trash2, Plus, Clock } from 'lucide-react';

export default function AdminBansPage() {
  const { t } = useI18n();
  const [ipBans, setIpBans] = useState<IpBan[]>([]);
  const [deviceBans, setDeviceBans] = useState<DeviceBan[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIp, setNewIp] = useState('');
  const [newIpReason, setNewIpReason] = useState('');
  const [newDevice, setNewDevice] = useState('');
  const [newDeviceReason, setNewDeviceReason] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bans', { credentials: 'include' });
      const data = await res.json();
      setIpBans((data.ipBans as IpBan[]) ?? []);
      setDeviceBans((data.deviceBans as DeviceBan[]) ?? []);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addIpBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    try {
      const res = await fetch('/api/admin/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ip', value: newIp.trim(), reason: newIpReason || null }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setNewIp('');
      setNewIpReason('');
      toast.success(t('common.success'));
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const addDeviceBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.trim()) return;
    try {
      const res = await fetch('/api/admin/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'device', value: newDevice.trim(), reason: newDeviceReason || null }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setNewDevice('');
      setNewDeviceReason('');
      toast.success(t('common.success'));
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const deleteIpBan = async (id: string) => {
    await fetch(`/api/admin/bans?type=ip&id=${id}`, { method: 'DELETE', credentials: 'include' });
    setIpBans((prev) => prev.filter((b) => b.id !== id));
    toast.success(t('common.success'));
  };

  const deleteDeviceBan = async (id: string) => {
    await fetch(`/api/admin/bans?type=device&id=${id}`, { method: 'DELETE', credentials: 'include' });
    setDeviceBans((prev) => prev.filter((b) => b.id !== id));
    toast.success(t('common.success'));
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t('admin.bans')}</h2>
      <Tabs defaultValue="ip">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ip">IP Bans</TabsTrigger>
          <TabsTrigger value="device">Device Bans</TabsTrigger>
        </TabsList>

        <TabsContent value="ip" className="space-y-4">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="text-base">{t('admin.addIpBan')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addIpBan} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="192.168.1.1" required />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="ipReason">{t('common.reason')}</Label>
                  <Input id="ipReason" value={newIpReason} onChange={(e) => setNewIpReason(e.target.value)} placeholder="Spam" />
                </div>
                <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add</Button>
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : ipBans.length === 0 ? (
            <p className="text-muted-foreground">{t('error.notFound')}</p>
          ) : (
            <div className="space-y-2">
              {ipBans.map((ban) => (
                <Card key={ban.id} className="glass border-0">
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-mono text-sm font-medium">{ban.ip_address}</p>
                      {ban.reason && <p className="text-xs text-muted-foreground">{ban.reason}</p>}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(ban.created_at).toLocaleString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteIpBan(ban.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="device" className="space-y-4">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="text-base">{t('admin.addDeviceBan')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addDeviceBan} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="device">Device Fingerprint</Label>
                  <Input id="device" value={newDevice} onChange={(e) => setNewDevice(e.target.value)} placeholder="abc123..." required />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="deviceReason">{t('common.reason')}</Label>
                  <Input id="deviceReason" value={newDeviceReason} onChange={(e) => setNewDeviceReason(e.target.value)} placeholder="Abuse" />
                </div>
                <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add</Button>
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : deviceBans.length === 0 ? (
            <p className="text-muted-foreground">{t('error.notFound')}</p>
          ) : (
            <div className="space-y-2">
              {deviceBans.map((ban) => (
                <Card key={ban.id} className="glass border-0">
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-mono text-sm font-medium">{ban.device_fingerprint}</p>
                      {ban.reason && <p className="text-xs text-muted-foreground">{ban.reason}</p>}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(ban.created_at).toLocaleString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteDeviceBan(ban.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
