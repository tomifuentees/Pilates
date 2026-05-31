import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking, ClassInstance } from '@prisma/client';

interface BookingWithDetails extends Booking {
  classInstance: ClassInstance & {
    classType: { id: string; name: string };
    instructor: { id: string; firstName: string; lastName: string };
  };
}

async function fetchBookings(clientId?: string, status?: string) {
  const params = new URLSearchParams();
  if (clientId) params.set('clientId', clientId);
  if (status) params.set('status', status);

  const res = await fetch(`/api/bookings?${params}`);
  if (!res.ok) throw new Error('Error al cargar reservas');
  return res.json();
}

export function useBookings(clientId?: string, status?: string) {
  return useQuery({
    queryKey: ['bookings', clientId, status],
    queryFn: () => fetchBookings(clientId, status),
  });
}

async function createBooking(data: { clientId: string; classInstanceId: string }) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear la reserva');
  }

  return res.json();
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

async function cancelBooking(bookingId: string) {
  const res = await fetch(`/api/bookings?bookingId=${bookingId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al cancelar la reserva');
  }

  return res.json();
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Waitlist hooks
async function joinWaitlist(data: { clientId: string; classInstanceId: string }) {
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al unirse a lista de espera');
  }

  return res.json();
}

export function useJoinWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

async function leaveWaitlist(waitlistId: string) {
  const res = await fetch(`/api/waitlist?waitlistId=${waitlistId}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Error al salir de lista de espera');
  return res.json();
}

export function useLeaveWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}