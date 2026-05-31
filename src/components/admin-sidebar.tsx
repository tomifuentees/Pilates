'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogoutButton } from './logout-button';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/schedule', label: 'Horarios', icon: '📅' },
  { href: '/admin/clients', label: 'Clientas', icon: '👥' },
  { href: '/admin/memberships', label: 'Membresías', icon: '💳' },
  { href: '/admin/payments', label: 'Pagos', icon: '💰' },
  { href: '/admin/instructors', label: 'Instructoras', icon: '🧘‍♀️' },
  { href: '/admin/class-types', label: 'Tipos de Clase', icon: '🏷️' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r hidden lg:block">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="font-semibold text-lg">Pilates Studio</h2>
          <p className="text-xs text-muted-foreground">Panel de Admin</p>
        </div>

        <Separator />

        <nav className="flex-1 p-2 space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                pathname === item.href
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-3">
          <LogoutButton />
          <div className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b lg:pl-64">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Panel de Administración</span>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}