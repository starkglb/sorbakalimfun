import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-server';
import { ok, unauthorized, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return unauthorized();

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return ok(notifications.map(n => ({
      id: n.id,
      user_id: n.userId,
      type: n.type,
      message_id: n.messageId,
      is_read: n.isRead,
      created_at: n.createdAt.toISOString(),
    })));
  } catch (e) {
    console.error('Get notifications error:', e);
    return serverError();
  }
}

export async function PATCH() {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return unauthorized();

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    return ok();
  } catch (e) {
    console.error('Mark notifications error:', e);
    return serverError();
  }
}
