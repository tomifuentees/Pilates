import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ClassInstance, Instructor, ClassType_ } from '@prisma/client';

interface ClassWithDetails extends ClassInstance {
  classType: ClassType_;
  instructor: Pick<Instructor, 'id' | 'firstName' | 'lastName'>;
  bookedCount: number;
  availableSpots: number;
  waitlistCount: number;
  isFull: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  classes: ClassWithDetails[];
}

interface ScheduleResponse {
  weekStart: string;
  weekEnd: string;
  days: DaySchedule[];
  classes: ClassWithDetails[];
}

async function fetchSchedule(
  date?: string,
  classTypeId?: string,
  instructorId?: string
): Promise<ScheduleResponse> {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (classTypeId) params.set('classTypeId', classTypeId);
  if (instructorId) params.set('instructorId', instructorId);

  const res = await fetch(`/api/classes/schedule?${params}`);
  if (!res.ok) throw new Error('Error al cargar el calendario');
  return res.json();
}

export function useSchedule(date?: string, classTypeId?: string, instructorId?: string) {
  return useQuery({
    queryKey: ['schedule', date, classTypeId, instructorId],
    queryFn: () => fetchSchedule(date, classTypeId, instructorId),
  });
}

async function createClassInstance(data: {
  classTypeId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  capacity: number;
}) {
  const res = await fetch('/api/classes/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear la clase');
  }
  return res.json();
}

export function useCreateClassInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

async function fetchClassTypes() {
  const res = await fetch('/api/classes/types');
  if (!res.ok) throw new Error('Error al cargar tipos de clase');
  return res.json();
}

export function useClassTypes() {
  return useQuery({
    queryKey: ['classTypes'],
    queryFn: fetchClassTypes,
  });
}

async function createClassType(data: {
  name: string;
  description?: string;
  durationMins?: number;
  color?: string;
}) {
  const res = await fetch('/api/classes/types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tipo de clase');
  return res.json();
}

export function useCreateClassType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classTypes'] });
    },
  });
}