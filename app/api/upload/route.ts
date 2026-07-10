import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getAuthUser } from '@/lib/auth-server';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user?.profile) return unauthorized();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) return badRequest('Dosya gerekli');
    if (!type || !['avatar', 'cover'].includes(type)) {
      return badRequest('Geçersiz dosya tipi');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return badRequest('Sadece JPEG, PNG, WebP, GIF desteklenir');
    }

    if (file.size > 5 * 1024 * 1024) {
      return badRequest('Dosya boyutu 5MB\'i geçemez');
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${user.profile.id}/${type}-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const userDir = join(uploadDir, user.profile.id);
    await mkdir(userDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadDir, fileName), Buffer.from(bytes));

    const publicUrl = `/uploads/${fileName}`;

    return ok({ url: publicUrl });
  } catch (e) {
    console.error('Upload error:', e);
    return serverError();
  }
}
