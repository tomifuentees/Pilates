'use client';

import { useState } from 'react';
import { useSchedule, useClassTypes, useInstructors, useCreateClassInstance } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [formData, setFormData] = useState({
    classTypeId: '',
    instructorId: '',
    capacity: 12,
    durationMins: 50,
  });

  const { data, isLoading } = useSchedule(format(selectedDate, 'yyyy-MM-dd'));
  const { data: classTypesData } = useClassTypes();
  const { data: instructorsData } = useInstructors();
  const createClassInstance = useCreateClassInstance();

  const weekDays = data?.days || [];
  const classTypes = classTypesData?.classTypes || [];
  const instructors = instructorsData?.instructors || [];

  const handlePrevWeek = () => setSelectedDate(addWeeks(selectedDate, -1));
  const handleNextWeek = () => setSelectedDate(addWeeks(selectedDate, 1));
  const handleToday = () => setSelectedDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const handleCreateSlotClick = (dayDate: string) => {
    setSelectedDay(dayDate);
    setCreateDialogOpen(true);
  };

  const handleCreateClass = async () => {
    if (!formData.classTypeId || !formData.instructorId || !selectedDay) return;

    const startTime = new Date(`${selectedDay}T${selectedTime}`);
    const endTime = new Date(startTime.getTime() + formData.durationMins * 60000);

    try {
      await createClassInstance.mutateAsync({
        classTypeId: formData.classTypeId,
        instructorId: formData.instructorId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        capacity: formData.capacity,
      });
      setCreateDialogOpen(false);
      setFormData({ classTypeId: '', instructorId: '', capacity: 12, durationMins: 50 });
    } catch (error: any) {
      alert(error.message || 'Error al crear la clase');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Horarios</h1>
          <p className="text-sm text-muted-foreground">Gestiona el calendario de clases</p>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
              <span className="sr-only">Anterior</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {format(selectedDate, 'MMMM yyyy', { locale: es })}
              </span>
              <Button variant="ghost" size="sm" onClick={handleToday}>
                Hoy
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <span className="sr-only">Siguiente</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Week Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day: any) => (
                <div
                  key={day.date}
                  className={`text-center py-2 border-r last:border-r-0 ${
                    day.isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="text-xs text-muted-foreground uppercase">
                    {day.dayName.slice(0, 2)}
                  </div>
                  <div className={`text-lg ${day.isToday ? 'text-primary font-semibold' : ''}`}>
                    {day.dayNumber}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 min-h-[400px]">
              {weekDays.map((day: any) => (
                <div
                  key={day.date}
                  className={`border-r last:border-r-0 p-2 ${
                    day.isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mb-2 text-xs"
                    onClick={() => handleCreateSlotClick(day.date)}
                  >
                    + Agregar
                  </Button>

                  <div className="space-y-1">
                    {day.classes.map((cls: any) => (
                      <div
                        key={cls.id}
                        className="p-2 rounded-md bg-muted text-xs"
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${CLASS_COLORS[cls.classType.name] || 'bg-gray-500'}`}
                          />
                          <span className="font-medium">
                            {format(parseISO(cls.startTime), 'HH:mm')}
                          </span>
                        </div>
                        <div className="font-medium truncate">{cls.classType.name}</div>
                        <div className="text-muted-foreground truncate">
                          {cls.instructor.firstName}
                        </div>
                        <Badge
                          variant={cls.isFull ? 'secondary' : 'outline'}
                          className="mt-1 text-[10px] px-1"
                        >
                          {cls.bookedCount}/{cls.capacity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Class Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Clase</DialogTitle>
            <DialogDescription>
              {selectedDay && format(parseISO(selectedDay), "EEEE d 'de' MMMM", { locale: es })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Clase</Label>
              <Select
                value={formData.classTypeId}
                onValueChange={(value) => setFormData({ ...formData, classTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {classTypes.map((ct: any) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Instructora</Label>
              <Select
                value={formData.instructorId}
                onValueChange={(value) => setFormData({ ...formData, instructorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar instructora" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((inst: any) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.firstName} {inst.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Capacidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateClass}
              disabled={!formData.classTypeId || !formData.instructorId || createClassInstance.isPending}
            >
              {createClassInstance.isPending ? 'Creando...' : 'Crear Clase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}