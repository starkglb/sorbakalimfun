import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, notFound, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    if (!username) return notFound('Kullanıcı adı gerekli');

    const profile = await prisma.profile.findUnique({
      where: { username: username.toLowerCase().trim() },
    });
    if (!profile) return notFound('Kullanıcı bulunamadı');

    const messageCount = await prisma.message.count({
      where: { recipientId: profile.id, isDeletedByRecipient: false },
    });

    return ok({
      id: profile.id,
      username: profile.username,
      display_name: profile.displayName,
      bio: profile.bio,
      avatar_url: profile.avatarUrl,
      cover_url: profile.coverUrl,
      social_links: profile.socialLinks,
      is_admin: profile.isAdmin,
      is_banned: profile.isBanned,
      created_at: profile.createdAt.toISOString(),
      updated_at: profile.updatedAt.toISOString(),
      message_count: messageCount,
    });
  } catch (e) {
    console.error('Get profile error:', e);
    return serverError();
  }
}
