import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/jwt';
import { ok, badRequest, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();
    if (!email || !password || !username) {
      return badRequest('Email, şifre ve kullanıcı adı gerekli');
    }
    if (password.length < 6) {
      return badRequest('Şifre en az 6 karakter olmalı');
    }

    const normalizedUsername = username.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.profile.findUnique({
      where: { username: normalizedUsername },
    });
    if (existing) {
      return badRequest('Bu kullanıcı adı zaten alınmış');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return badRequest('Bu email zaten kayıtlı');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        profile: {
          create: {
            username: normalizedUsername,
            displayName: normalizedUsername,
          },
        },
      },
    });

    const token = signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return ok({ userId: user.id });
  } catch (e) {
    console.error('Register error:', e);
    return serverError();
  }
}
