import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return ok(null);

    return ok({
      id: settings.id,
      site_name: settings.siteName,
      site_description: settings.siteDescription,
      primary_color: settings.primaryColor,
      allow_anonymous_messages: settings.allowAnonymousMessages,
      maintenance_mode: settings.maintenanceMode,
      message_max_length: settings.messageMaxLength,
      rate_limit_per_hour: settings.rateLimitPerHour,
    });
  } catch (e) {
    console.error('Admin get settings error:', e);
    return serverError();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin().catch(() => null);
    if (!user) return unauthorized();
    if (!user.profile?.isAdmin) return forbidden();

    const body = await request.json();
    const { site_name, site_description, maintenance_mode, allow_anonymous_messages, message_max_length, rate_limit_per_hour } = body;

    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return ok({ error: 'Settings not found' });

    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        siteName: site_name,
        siteDescription: site_description,
        maintenanceMode: maintenance_mode,
        allowAnonymousMessages: allow_anonymous_messages,
        messageMaxLength: message_max_length,
        rateLimitPerHour: rate_limit_per_hour,
      },
    });

    return ok();
  } catch (e) {
    console.error('Admin update settings error:', e);
    return serverError();
  }
}
