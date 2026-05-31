import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchMemberships(clientId?: string, status?: string) {
  const params = new URLSearchParams();
  if (clientId) params.set('clientId', clientId);
  if (status) params.set('status', status);

  const res = await fetch(`/api/memberships?${params}`);
  if (!res.ok) throw new Error('Error al cargar membresías');
  return res.json();
}

export function useMemberships(clientId?: string, status?: string) {
  return useQuery({
    queryKey: ['memberships', clientId, status],
    queryFn: () => fetchMemberships(clientId, status),
  });
}

async function createMembership(data: {
  clientId: string;
  type: 'UNLIMITED' | 'RESTRICTED' | 'PACKAGE';
  startDate: string;
  endDate: string;
  classesAllowed?: number;
  classesRemaining?: number;
}) {
  const res = await fetch('/api/memberships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear la membresía');
  }

  return res.json();
}

export function useCreateMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}

async function updateMembership(data: {
  membershipId: string;
  status?: string;
  endDate?: string;
}) {
  const res = await fetch('/api/memberships', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error al actualizar la membresía');
  return res.json();
}

export function useUpdateMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}

// Payments
async function fetchPayments(clientId?: string) {
  const params = new URLSearchParams();
  if (clientId) params.set('clientId', clientId);

  const res = await fetch(`/api/payments?${params}`);
  if (!res.ok) throw new Error('Error al cargar pagos');
  return res.json();
}

export function usePayments(clientId?: string) {
  return useQuery({
    queryKey: ['payments', clientId],
    queryFn: () => fetchPayments(clientId),
  });
}

async function createPayment(data: {
  clientId: string;
  amount: number;
  method: 'CASH' | 'TRANSFER';
  membershipId?: string;
}) {
  const res = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error al registrar el pago');
  return res.json();
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}