'use client';

import { useBookings, useMemberships } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

function formatClassDate(dateStr: string) {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';
  return format(date, "EEEE d 'de' MMMM", { locale: es });
}

export default function ClientDashboardPage() {
  // Mock client ID - in production this would come from session
  const clientId = 'mock-client-id';

  const { data: bookingsData, isLoading: bookingsLoading } = useBookings(clientId, 'CONFIRMED');
  const { data: membershipData, isLoading: membershipLoading } = useMemberships(clientId, 'ACTIVE');

  const upcomingBookings = bookingsData?.bookings?.filter(
    (b: { classInstance: { startTime: string } }) =>
      parseISO(b.classInstance.startTime) > new Date()
  ) || [];

  const nextBooking = upcomingBookings[0];
  const membership = membershipData?.memberships?.[0];

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mi Dashboard</h1>
          <p className="text-sm text-muted-foreground">Bienvenida a tu espacio personal</p>
        </div>
        <Link href="/book">
          <Button size="sm">Reservar Clase</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {/* Next Class Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próxima Clase
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : nextBooking ? (
              <div className="space-y-1">
                <div className="text-xl font-semibold">
                  {nextBooking.classInstance.classType.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatClassDate(nextBooking.classInstance.startTime)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(parseISO(nextBooking.classInstance.startTime), 'HH:mm')} ·{' '}
                  {nextBooking.classInstance.instructor.firstName}{' '}
                  {nextBooking.classInstance.instructor.lastName}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg font-medium text-muted-foreground">
                  No hay clases reservadas
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <Link href="/book" className="text-primary hover:underline">
                    Reserva tu primera clase
                  </Link>{' '}
                  para comenzar
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Membership Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membresía
            </CardTitle>
          </CardHeader>
          <CardContent>
            {membershipLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : membership ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {membership.type === 'UNLIMITED'
                      ? 'Ilimitada'
                      : membership.type === 'RESTRICTED'
                      ? `${membership.classesAllowed} clases/mes`
                      : `${membership.classesRemaining} clases restantes`}
                  </span>
                  <Badge
                    variant={membership.status === 'ACTIVE' ? 'success' : 'secondary'}
                    className="text-xs"
                  >
                    {membership.status === 'ACTIVE' ? 'Activa' : membership.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vence: {format(parseISO(membership.endDate), 'd MMM yyyy', { locale: es })}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-lg font-medium text-muted-foreground">
                  Sin membresía activa
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <Link href="/admin/memberships" className="text-primary hover:underline">
                    Adquiere una membresía
                  </Link>{' '}
                  para reservar clases
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Link href="/book">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <span className="text-lg">📅</span>
                <span className="text-xs">Reservar</span>
              </Button>
            </Link>
            <Link href="/my-classes">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <span className="text-lg">📋</span>
                <span className="text-xs">Mis Clases</span>
              </Button>
            </Link>
            <Link href="/membership">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <span className="text-lg">💳</span>
                <span className="text-xs">Membresía</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <span className="text-lg">👤</span>
                <span className="text-xs">Perfil</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}