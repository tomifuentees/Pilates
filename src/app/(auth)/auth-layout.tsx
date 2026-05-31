'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

async function getSession() {
  const res = await fetch('/api/auth/session');
  if (!res.ok) return null;
  return res.json();
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
  });

  useEffect(() => {
    if (data?.user) {
      // Already logged in, redirect
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [data, router]);

  // Show loading spinner while checking session
  if (data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Estudio de Pilates</h1>
        <p className="text-sm text-muted-foreground mt-1">Tu espacio de bienestar</p>
      </div>

      {children}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}