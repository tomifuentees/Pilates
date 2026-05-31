'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.invalidateQueries({ queryKey: ['session'] });
    router.push('/login');
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  );
}