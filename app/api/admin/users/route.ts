import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const profiles = await prisma.profile.findMany({
      where: search
        ? {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { displayName: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return ok(profiles.map(p => ({
      id: p.id,
      username: p.username,
      display_name: p.displayName,
      bio: p.bio,
      avatar_url: p.avatarUrl,
      is_admin: p.isAdmin,
      is_banned: p.isBanned,
      created_at: p.createdAt.toISOString(),
    })));
  } catch (e) {
    console.error('Admin users error:', e);
    return serverError();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const { userId, is_banned } = await request.json();

    await prisma.profile.update({
      where: { id: userId },
      data: { isBanned: is_banned },
    });

    return ok();
  } catch (e) {
    console.error('Admin toggle ban error:', e);
    return serverError();
  }
}
