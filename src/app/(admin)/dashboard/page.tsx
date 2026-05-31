import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona tu estudio de pilates</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 reservas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€0</div>
            <p className="text-xs text-muted-foreground">
              0 transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Promedio de hoy
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Gestión</CardTitle>
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
            <CardTitle>Reportes</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}