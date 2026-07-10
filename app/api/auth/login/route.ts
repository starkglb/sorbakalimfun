import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/jwt';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return badRequest('Email ve şifre gerekli');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return unauthorized('Email veya şifre hatalı');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return unauthorized('Email veya şifre hatalı');
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    if (profile?.isBanned) {
      return badRequest('Hesabınız banlanmış');
    }

    const token = signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return ok({ userId: user.id });
  } catch (e) {
    console.error('Login error:', e);
    return serverError();
  }
}
