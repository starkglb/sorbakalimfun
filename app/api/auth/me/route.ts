import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/jwt';
import { ok, unauthorized } from '@/lib/api-response';

export async function GET() {
  const payload = await getAuthPayload();
  if (!payload) return unauthorized();

  const profile = await prisma.profile.findUnique({
    where: { userId: payload.userId },
  });

  if (!profile) return unauthorized();

  return ok({
    id: payload.userId,
    email: payload.email,
    profile: {
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
    },
  });
}
