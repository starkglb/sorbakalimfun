import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { message: true },
    });

    return ok(reports.map(r => ({
      id: r.id,
      message_id: r.messageId,
      reporter_id: r.reporterId,
      reason: r.reason,
      status: r.status,
      created_at: r.createdAt.toISOString(),
      resolved_at: r.resolvedAt?.toISOString() ?? null,
      message: r.message ? {
        id: r.message.id,
        content: r.message.content,
      } : null,
    })));
  } catch (e) {
    console.error('Admin reports error:', e);
    return serverError();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const { id } = await request.json();

    await prisma.report.update({
      where: { id },
      data: { status: 'resolved', resolvedAt: new Date() },
    });

    return ok();
  } catch (e) {
    console.error('Admin resolve report error:', e);
    return serverError();
  }
}
