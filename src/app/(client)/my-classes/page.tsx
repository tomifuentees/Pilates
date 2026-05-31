'use client';

import { useState } from 'react';
import { useBookings, useCancelBooking } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO, isPast } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MyClassesPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock client ID - in production from session
  const clientId = 'mock-client-id';

  const { data, isLoading } = useBookings(clientId);
  const cancelBooking = useCancelBooking();

  const bookings = data?.bookings || [];

  const upcomingBookings = bookings.filter(
    (b: any) => !isPast(parseISO(b.classInstance.startTime)) && b.status === 'CONFIRMED'
  );

  const pastBookings = bookings.filter(
    (b: any) => isPast(parseISO(b.classInstance.startTime)) || b.status !== 'CONFIRMED'
  );

  const handleCancelClick = (booking: any) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      await cancelBooking.mutateAsync(selectedBooking.id);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      alert(error.message || 'Error al cancelar la reserva');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmada</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary">Cancelada</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline">Completada</Badge>;
      case 'NO_SHOW':
        return <Badge variant="destructive">No asistida</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis Clases</h1>
          <p className="text-sm text-muted-foreground">Tu historial de clases y reservas</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="upcoming" className="flex-1">
              Próximas ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              Pasadas ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3 mt-4">
            {isLoading ? (
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tienes clases próximas</p>
                  <Button variant="link" asChild className="mt-2">
                    <a href="/book">Reservar una clase</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-semibold">{booking.classInstance.classType.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(
                            parseISO(booking.classInstance.startTime),
                            "EEEE d 'de' MMMM 'a las' HH:mm",
                            { locale: es }
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.classInstance.instructor.firstName}{' '}
                          {booking.classInstance.instructor.lastName}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(booking.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-3 mt-4">
            {isLoading ? (
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tienes clases pasadas</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking: any) => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-semibold">{booking.classInstance.classType.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(
                            parseISO(booking.classInstance.startTime),
                            "EEEE d 'de' MMMM 'a las' HH:mm",
                            { locale: es }
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.classInstance.instructor.firstName}{' '}
                          {booking.classInstance.instructor.lastName}
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              ¿Estás segura de que quieres cancelar esta clase?
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="py-4">
              <p className="font-medium">{selectedBooking.classInstance.classType.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(
                  parseISO(selectedBooking.classInstance.startTime),
                  "EEEE d 'de' MMMM 'a las' HH:mm",
                  { locale: es }
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Si cancelas con más de 24 horas de antelación, la clase será acreditada a tu
                membresía.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}