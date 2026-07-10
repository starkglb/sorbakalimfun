import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, getClientIp } from '@/lib/auth-server';
import { ok, badRequest, forbidden, notFound, tooManyRequests, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return badRequest('Giriş yapmalısınız');

    const messages = await prisma.message.findMany({
      where: {
        recipientId: user.profile.id,
        isDeletedByRecipient: false,
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    return ok(messages.map(m => ({
      id: m.id,
      recipient_id: m.recipientId,
      content: m.content,
      is_pinned: m.isPinned,
      is_read: m.isRead,
      is_deleted_by_recipient: m.isDeletedByRecipient,
      sender_ip: m.senderIp,
      sender_user_agent: m.senderUserAgent,
      sender_device: m.senderDevice,
      created_at: m.createdAt.toISOString(),
    })));
  } catch (e) {
    console.error('Get messages error:', e);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recipientUsername, content, deviceFingerprint } = await request.json();
    if (!recipientUsername || !content) {
      return badRequest('Alıcı ve mesaj içeriği gerekli');
    }

    const ip = getClientIp(request);

    const ipBan = await prisma.ipBan.findUnique({ where: { ipAddress: ip } });
    if (ipBan) return forbidden('IP adresiniz banlanmış');

    if (deviceFingerprint) {
      const deviceBan = await prisma.deviceBan.findUnique({ where: { deviceFingerprint } });
      if (deviceBan) return forbidden('Cihazınız banlanmış');
    }

    const settings = await prisma.siteSettings.findFirst();
    if (settings?.allowAnonymousMessages === false) {
      return forbidden('Anonim mesajlar şu anda kapalı');
    }

    const maxLength = settings?.messageMaxLength ?? 500;
    if (content.length > maxLength) {
      return badRequest(`Mesaj en fazla ${maxLength} karakter olabilir`);
    }

    const rateLimit = settings?.rateLimitPerHour ?? 10;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await prisma.message.count({
      where: { senderIp: ip, createdAt: { gte: oneHourAgo } },
    });
    if (recentCount >= rateLimit) {
      return tooManyRequests('Saatlik mesaj limitiniz doldu');
    }

    const recipient = await prisma.profile.findUnique({
      where: { username: recipientUsername.toLowerCase().trim() },
    });
    if (!recipient) return notFound('Alıcı bulunamadı');
    if (recipient.isBanned) return forbidden('Bu kullanıcı banlanmış');

    const message = await prisma.message.create({
      data: {
        recipientId: recipient.id,
        content,
        senderIp: ip,
        senderUserAgent: request.headers.get('user-agent'),
        senderDevice: deviceFingerprint ?? null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: recipient.userId,
        type: 'new_message',
        messageId: message.id,
      },
    });

    return ok({ id: message.id });
  } catch (e) {
    console.error('Send message error:', e);
    return serverError();
  }
}
