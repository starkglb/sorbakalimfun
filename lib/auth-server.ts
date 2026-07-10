import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/jwt';
import type { Profile } from '@prisma/client';

export type AuthUser = {
  id: string;
  email: string;
  profile: Profile | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const payload = await getAuthPayload();
  if (!payload) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: payload.userId },
  });

  if (!profile) return null;

  return {
    id: payload.userId,
    email: payload.email,
    profile,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!user.profile?.isAdmin) throw new Error('Forbidden');
  return user;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
