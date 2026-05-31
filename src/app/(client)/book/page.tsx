'use client';

import { useState } from 'react';
import { useSchedule, useClassTypes, useInstructors, useCreateBooking, useJoinWaitlist } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addWeeks, parseISO, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const CLASS_COLORS: Record<string, string> = {
  REFORMER: 'bg-violet-500',
  MAT: 'bg-emerald-500',
  TOWER: 'bg-amber-500',
  CHAIR: 'bg-red-500',
  BARREL: 'bg-pink-500',
  PRIVATE: 'bg-indigo-500',
};

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [classTypeFilter, setClassTypeFilter] = useState<string>('');
  const [instructorFilter, setInstructorFilter] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const { data, isLoading } = useSchedule(
    format(selectedDate, 'yyyy-MM-dd'),
    classTypeFilter || undefined,
    instructorFilter || undefined
  );
  const { data: classTypesData } = useClassTypes();
  const { data: instructorsData } = useInstructors();

  const createBooking = useCreateBooking();
  const joinWaitlist = useJoinWaitlist();

  const weekDays = data?.days || [];
  const classTypes = classTypesData?.classTypes || [];
  const instructors = instructorsData?.instructors || [];

  const handlePrevWeek = () => setSelectedDate(addWeeks(selectedDate, -1));
  const handleNextWeek = () => setSelectedDate(addWeeks(selectedDate, 1));
  const handleToday = () => setSelectedDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const handleBookClass = async () => {
    if (!selectedClass) return;

    // Mock client ID - in production from session
    const clientId = 'mock-client-id';

    try {
      if (selectedClass.isFull) {
        await joinWaitlist.mutateAsync({
          clientId,
          classInstanceId: selectedClass.id,
        });
      } else {
        await createBooking.mutateAsync({
          clientId,
          classInstanceId: selectedClass.id,
        });
      }
      setBookingDialogOpen(false);
      setSelectedClass(null);
    } catch (error: any) {
      alert(error.message || 'Error al procesar la reserva');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="p-4 space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reservar Clase</h1>
            <Button variant="ghost" size="sm" onClick={handleToday}>
              Hoy
            </Button>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
              <span className="sr-only">Anterior</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <span className="font-medium">
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <span className="sr-only">Siguiente</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={classTypeFilter} onValueChange={setClassTypeFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Tipo de clase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {classTypes.map((ct: any) => (
                  <SelectItem key={ct.id} value={ct.id}>
                    {ct.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={instructorFilter} onValueChange={setInstructorFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Instructora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {instructors.map((inst: any) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.firstName} {inst.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day: any) => (
              <div key={day.date} className="min-h-[400px]">
                {/* Day Header */}
                <div
                  className={`text-center py-2 border-b ${
                    day.isToday ? 'bg-primary/5 font-semibold' : ''
                  }`}
                >
                  <div className="text-xs text-muted-foreground uppercase">
                    {day.dayName.slice(0, 2)}
                  </div>
                  <div className={`text-lg ${day.isToday ? 'text-primary font-semibold' : ''}`}>
                    {day.dayNumber}
                  </div>
                </div>

                {/* Classes */}
                <div className="space-y-1 pt-2">
                  {day.classes.map((cls: any) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls);
                        setBookingDialogOpen(true);
                      }}
                      className={`w-full text-left p-2 rounded-md text-xs transition-colors ${
                        cls.isFull
                          ? 'bg-muted hover:bg-muted/80'
                          : 'bg-primary/5 hover:bg-primary/10'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${CLASS_COLORS[cls.classType.name] || 'bg-gray-500'}`}
                        />
                        <span className="font-medium truncate">
                          {format(parseISO(cls.startTime), 'HH:mm')}
                        </span>
                      </div>
                      <div className="font-medium truncate mt-1">
                        {cls.classType.name}
                      </div>
                      <div className="text-muted-foreground truncate">
                        {cls.instructor.firstName}
                      </div>
                      <Badge
                        variant={cls.isFull ? 'secondary' : 'success'}
                        className="mt-1 text-[10px] px-1"
                      >
                        {cls.isFull
                          ? `Lista espera (${cls.waitlistCount})`
                          : `${cls.availableSpots} plazas`}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          {selectedClass && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedClass.classType.name}</DialogTitle>
                <DialogDescription>
                  {format(parseISO(selectedClass.startTime), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Instructora</span>
                  <span className="font-medium">
                    {selectedClass.instructor.firstName} {selectedClass.instructor.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duración</span>
                  <span className="font-medium">{selectedClass.classType.durationMins} minutos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plazas</span>
                  <span className="font-medium">
                    {selectedClass.isFull
                      ? `Completa (${selectedClass.waitlistCount} en espera)`
                      : `${selectedClass.availableSpots} de ${selectedClass.capacity} disponibles`}
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleBookClass}
                  disabled={createBooking.isPending || joinWaitlist.isPending}
                >
                  {createBooking.isPending || joinWaitlist.isPending
                    ? 'Procesando...'
                    : selectedClass.isFull
                    ? 'Unirse a Lista de Espera'
                    : 'Reservar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}