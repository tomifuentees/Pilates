'use client';

import { useDashboardStats } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const metrics = [
    {
      title: 'Clases Hoy',
      value: stats?.classesToday || 0,
      subtext: `${stats?.bookingsToday || 0} reservas confirmadas`,
      href: '/admin/schedule',
    },
    {
      title: 'Clientas Activas',
      value: stats?.activeClients || 0,
      subtext: 'Últimos 30 días',
      href: '/admin/clients',
    },
    {
      title: 'Ingresos del Mes',
      value: `€${(stats?.revenueThisMonth || 0).toLocaleString()}`,
      subtext: `${stats?.transactionsThisMonth || 0} transacciones`,
      href: '/admin/payments',
    },
    {
      title: 'Ocupación',
      value: `${stats?.occupationRate || 0}%`,
      subtext: 'Promedio de hoy',
      href: '/admin/reports',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panel de Administración</h1>
        <p className="text-sm text-muted-foreground">Gestiona tu estudio de pilates</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : metrics.map((metric) => (
              <Link key={metric.title} href={metric.href}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">{metric.subtext}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gestión</CardTitle>
            <CardDescription>Herramientas de administración</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/admin/schedule" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                📅 Gestionar Horarios
              </Button>
            </Link>
            <Link href="/admin/clients" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                👥 Clientas
              </Button>
            </Link>
            <Link href="/admin/memberships" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                💳 Membresías
              </Button>
            </Link>
            <Link href="/admin/payments" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                💰 Pagos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuración</CardTitle>
            <CardDescription>Tipos de clase e instructoras</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/admin/class-types" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                🏷️ Tipos de Clase
              </Button>
            </Link>
            <Link href="/admin/instructors" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                🧘‍♀️ Instructoras
              </Button>
            </Link>
            <Link href="/admin/waitlist" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                📋 Listas de Espera
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reportes</CardTitle>
            <CardDescription>Estadísticas del estudio</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/admin/reports/attendance" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                📊 Asistencia
              </Button>
            </Link>
            <Link href="/admin/reports/revenue" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                💵 Ingresos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}