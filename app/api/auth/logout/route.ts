import { clearAuthCookie } from '@/lib/jwt';
import { ok } from '@/lib/api-response';

export async function POST() {
  await clearAuthCookie();
  return ok();
}
