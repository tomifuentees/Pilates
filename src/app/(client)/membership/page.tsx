'use client';

import { useMemberships } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MembershipPage() {
  // Mock client ID - in production from session
  const clientId = 'mock-client-id';

  const { data: membershipData, isLoading } = useMemberships(clientId, 'ACTIVE');
  const memberships = membershipData?.memberships || [];
  const activeMembership = memberships[0];

  const getMembershipTypeName = (type: string) => {
    switch (type) {
      case 'UNLIMITED':
        return 'Membresía Ilimitada';
      case 'RESTRICTED':
        return 'Membresía Restringida';
      case 'PACKAGE':
        return 'Paquete de Clases';
      default:
        return type;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(parseISO(endDate), new Date());
    if (days < 0) return 'Expirada';
    if (days === 0) return 'Expira hoy';
    if (days === 1) return '1 día restante';
    return `${days} días restantes`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mi Membresía</h1>
          <p className="text-sm text-muted-foreground">Información de tu membresía actual</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ) : activeMembership ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{getMembershipTypeName(activeMembership.type)}</CardTitle>
                    <CardDescription>Tu membresía activa</CardDescription>
                  </div>
                  <Badge variant="success">Activa</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                    <p className="font-medium">
                      {format(parseISO(activeMembership.startDate), 'd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de fin</p>
                    <p className="font-medium">
                      {format(parseISO(activeMembership.endDate), 'd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>

                <Separator />

                {activeMembership.type === 'UNLIMITED' && (
                  <div className="flex items-center justify-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold">∞</p>
                      <p className="text-sm text-muted-foreground">Clases ilimitadas</p>
                    </div>
                  </div>
                )}

                {activeMembership.type === 'RESTRICTED' && (
                  <div className="flex items-center justify-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{activeMembership.classesAllowed}</p>
                      <p className="text-sm text-muted-foreground">Clases por mes</p>
                    </div>
                  </div>
                )}

                {activeMembership.type === 'PACKAGE' && (
                  <div className="flex items-center justify-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{activeMembership.classesRemaining}</p>
                      <p className="text-sm text-muted-foreground">Clases restantes</p>
                    </div>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  {getDaysRemaining(activeMembership.endDate)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿Qué incluye?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Acceso a todas las clases de tu tipo de membresía
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Reserva online 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Recordatorios por email
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cancelación gratuita hasta 24h antes
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-lg font-medium">Sin membresía activa</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Adquiere una membresía para comenzar a reservar clases
              </p>
              <Button>Ver Planes</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}