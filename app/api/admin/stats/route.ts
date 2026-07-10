import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const [userCount, messageCount, pendingReports, ipBans, deviceBans] = await Promise.all([
      prisma.profile.count(),
      prisma.message.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.ipBan.count(),
      prisma.deviceBan.count(),
    ]);

    return ok({
      users: userCount,
      messages: messageCount,
      pendingReports,
      ipBans,
      deviceBans,
    });
  } catch (e) {
    console.error('Admin stats error:', e);
    return serverError();
  }
}
