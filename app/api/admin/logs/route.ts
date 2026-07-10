import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return ok(logs.map(l => ({
      id: l.id,
      actor_id: l.actorId,
      action: l.action,
      target_type: l.targetType,
      target_id: l.targetId,
      metadata: l.metadata,
      ip_address: l.ipAddress,
      created_at: l.createdAt.toISOString(),
    })));
  } catch (e) {
    console.error('Admin logs error:', e);
    return serverError();
  }
}
