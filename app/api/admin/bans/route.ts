import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const [ipBans, deviceBans] = await Promise.all([
      prisma.ipBan.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.deviceBan.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return ok({
      ipBans: ipBans.map(b => ({
        id: b.id,
        ip_address: b.ipAddress,
        reason: b.reason,
        created_at: b.createdAt.toISOString(),
        expires_at: b.expiresAt?.toISOString() ?? null,
      })),
      deviceBans: deviceBans.map(b => ({
        id: b.id,
        device_fingerprint: b.deviceFingerprint,
        reason: b.reason,
        created_at: b.createdAt.toISOString(),
        expires_at: b.expiresAt?.toISOString() ?? null,
      })),
    });
  } catch (e) {
    console.error('Admin bans error:', e);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const { type, value, reason } = await request.json();
    if (!type || !value) return ok({ error: 'Type and value required' });

    if (type === 'ip') {
      await prisma.ipBan.create({ data: { ipAddress: value, reason } });
    } else if (type === 'device') {
      await prisma.deviceBan.create({ data: { deviceFingerprint: value, reason } });
    }

    return ok();
  } catch (e) {
    console.error('Admin add ban error:', e);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!type || !id) return ok({ error: 'Type and id required' });

    if (type === 'ip') {
      await prisma.ipBan.delete({ where: { id } });
    } else if (type === 'device') {
      await prisma.deviceBan.delete({ where: { id } });
    }

    return ok();
  } catch (e) {
    console.error('Admin delete ban error:', e);
    return serverError();
  }
}
