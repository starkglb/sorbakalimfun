import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-server';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import type { SocialLinks } from '@/lib/types';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return unauthorized();

    const body = await request.json();
    const { display_name, bio, avatar_url, cover_url, social_links } = body;

    const data: Record<string, unknown> = {};
    if (display_name !== undefined) data.displayName = display_name;
    if (bio !== undefined) data.bio = bio;
    if (avatar_url !== undefined) data.avatarUrl = avatar_url;
    if (cover_url !== undefined) data.coverUrl = cover_url;
    if (social_links !== undefined) data.socialLinks = social_links as SocialLinks;

    const updated = await prisma.profile.update({
      where: { id: user.profile.id },
      data,
    });

    return ok({
      id: updated.id,
      username: updated.username,
      display_name: updated.displayName,
      bio: updated.bio,
      avatar_url: updated.avatarUrl,
      cover_url: updated.coverUrl,
      social_links: updated.socialLinks,
      is_admin: updated.isAdmin,
      is_banned: updated.isBanned,
      created_at: updated.createdAt.toISOString(),
      updated_at: updated.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error('Update profile error:', e);
    return serverError();
  }
}
