import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Estudio de Pilates</h1>
        <p className="text-sm text-muted-foreground mt-1">Sistema de gestión</p>
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