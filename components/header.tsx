'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n/i18n-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Inbox, Settings, Bell, LogOut, User, Shield, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() ?? '??';

  const navLinks = user ? (
    <>
      <NavLink href="/inbox" active={pathname === '/inbox'} icon={Inbox} label={t('nav.inbox')} />
      <NavLink href="/notifications" active={pathname === '/notifications'} icon={Bell} label={t('nav.notifications')} />
      {profile?.is_admin && (
        <NavLink href="/admin" active={pathname?.startsWith('/admin') ?? false} icon={Shield} label={t('nav.admin')} />
      )}
    </>
  ) : null;

  return (
    <header className="sticky top-0 z-50 w-full">
     <div className="glass-strong border-b">
  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
    <Link href="/" className="flex items-center">
      <img
        src="https://sorbakalim.fun/logo.png"
        alt="SorBakalım"
        className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain"
        draggable={false}
      />
    </Link>

    {/* Sağ taraf */}
  </div>
</div>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.username ?? ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.display_name ?? profile?.username}</p>
                    <p className="truncate text-xs text-muted-foreground">@{profile?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={profile?.username ? `/${profile.username}` : '/inbox'} className="flex items-center gap-2">
                      <User className="h-4 w-4" /> {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> {t('nav.settings')}
                    </Link>
                  </DropdownMenuItem>
                  {profile?.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> {t('nav.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" /> {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {(!user || true) && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
                  <nav className="mt-4 flex flex-col gap-1 px-4">
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Link href="/inbox" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                            <Inbox className="h-5 w-5" /> {t('nav.inbox')}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/notifications" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                            <Bell className="h-5 w-5" /> {t('nav.notifications')}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                            <Settings className="h-5 w-5" /> {t('nav.settings')}
                          </Link>
                        </SheetClose>
                        {profile?.is_admin && (
                          <SheetClose asChild>
                            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                              <Shield className="h-5 w-5" /> {t('nav.admin')}
                            </Link>
                          </SheetClose>
                        )}
                        <SheetClose asChild>
                          <Link href={profile?.username ? `/${profile.username}` : '/inbox'} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                            <User className="h-5 w-5" /> {t('nav.profile')}
                          </Link>
                        </SheetClose>
                        <button
                          onClick={() => { signOut(); setMobileOpen(false); }}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-destructive hover:bg-accent"
                        >
                          <LogOut className="h-5 w-5" /> {t('nav.logout')}
                        </button>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link href="/login" className="rounded-lg px-3 py-2 hover:bg-accent">{t('nav.login')}</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/register" className="rounded-lg px-3 py-2 hover:bg-accent">{t('nav.register')}</Link>
                        </SheetClose>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  icon: Icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
