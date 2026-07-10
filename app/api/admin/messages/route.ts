import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { recipient: { select: { username: true } } },
    });

    return ok(messages.map(m => ({
      id: m.id,
      recipient_id: m.recipientId,
      recipient_username: m.recipient.username,
      content: m.content,
      is_pinned: m.isPinned,
      created_at: m.createdAt.toISOString(),
    })));
  } catch (e) {
    console.error('Admin messages error:', e);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return ok({ error: 'Id required' });

    await prisma.message.delete({ where: { id } });
    return ok();
  } catch (e) {
    console.error('Admin delete message error:', e);
    return serverError();
  }
}
