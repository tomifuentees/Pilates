'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: '🏠' },
  { href: '/book', label: 'Reservar', icon: '📅' },
  { href: '/my-classes', label: 'Mis Clases', icon: '📋' },
  { href: '/membership', label: 'Membresía', icon: '💳' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
];

export function ClientNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs transition-colors',
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function ClientHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <h1 className="font-semibold">{title}</h1>
      </div>
    </header>
  );
}