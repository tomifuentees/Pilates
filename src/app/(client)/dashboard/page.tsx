import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mi Dashboard</h1>
          <p className="text-muted-foreground">Bienvenida a tu espacio personal</p>
        </div>
        <Link href="/book">
          <Button>Reservar Clase</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Clase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">No hay clases reservadas</div>
            <p className="text-xs text-muted-foreground">
              Reserva tu primera clase para comenzar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membresía</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Sin membresía activa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 horas de práctica
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Lo que puedes hacer ahora</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/book" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                📅 Reservar una clase
              </Button>
            </Link>
            <Link href="/my-classes" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                📋 Ver mis clases
              </Button>
            </Link>
            <Link href="/membership" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                💳 Ver mi membresía
              </Button>
            </Link>
            <Link href="/profile" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                👤 Mi perfil
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horarios de Hoy</CardTitle>
            <CardDescription>Clases disponibles hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay clases programadas para hoy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}