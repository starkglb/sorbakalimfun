import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthPayload, setAuthCookie, signToken } from '@/lib/jwt';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password || password.length < 6) {
      return badRequest('Şifre en az 6 karakter olmalı');
    }

    const payload = await getAuthPayload();
    if (!payload) return unauthorized();

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { passwordHash },
    });

    const token = signToken({ userId: payload.userId, email: payload.email });
    await setAuthCookie(token);

    return ok();
  } catch (e) {
    console.error('Update password error:', e);
    return serverError();
  }
}
