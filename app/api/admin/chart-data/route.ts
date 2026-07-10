import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const [messages, profiles] = await Promise.all([
      prisma.message.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      }),
      prisma.profile.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      }),
    ]);

    return ok({
      messages: messages.map(m => m.createdAt.toISOString()),
      profiles: profiles.map(p => p.createdAt.toISOString()),
    });
  } catch (e) {
    console.error('Admin chart data error:', e);
    return serverError();
  }
}
