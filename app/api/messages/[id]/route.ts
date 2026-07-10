import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-server';
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/api-response';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return unauthorized();

    const { id } = params;
    const { is_pinned } = await request.json();

    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) return notFound('Mesaj bulunamadı');
    if (message.recipientId !== user.profile.id) return badRequest('Bu mesajı düzenleme yetkiniz yok');

    const updated = await prisma.message.update({
      where: { id },
      data: { isPinned: is_pinned },
    });

    return ok({ is_pinned: updated.isPinned });
  } catch (e) {
    console.error('Patch message error:', e);
    return serverError();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return unauthorized();

    const { id } = params;
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) return notFound('Mesaj bulunamadı');
    if (message.recipientId !== user.profile.id) return badRequest('Bu mesajı silme yetkiniz yok');

    await prisma.message.update({
      where: { id },
      data: { isDeletedByRecipient: true },
    });

    return ok();
  } catch (e) {
    console.error('Delete message error:', e);
    return serverError();
  }
}
