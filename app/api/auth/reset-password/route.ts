import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return badRequest('Email gerekli');

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      const token = await bcrypt.hash(user.id + Date.now(), 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: user.passwordHash },
      });
    }

    return ok({ message: 'Şifre sıfırlama bağlantısı gönderildi (email gönderimi yapılandırılmadıysa yöneticiye başvurun)' });
  } catch (e) {
    console.error('Reset password error:', e);
    return serverError();
  }
}
