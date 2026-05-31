import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchClients() {
  const res = await fetch('/api/clients');
  if (!res.ok) throw new Error('Error al cargar clientas');
  return res.json();
}

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
}

async function fetchInstructors() {
  const res = await fetch('/api/instructors');
  if (!res.ok) throw new Error('Error al cargar instructoras');
  return res.json();
}

export function useInstructors() {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: fetchInstructors,
  });
}

async function createInstructor(data: {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
}) {
  const res = await fetch('/api/instructors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error al crear instructora');
  return res.json();
}

export function useCreateInstructor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
}

// Dashboard stats
async function fetchDashboardStats() {
  const res = await fetch('/api/reports/stats');
  if (!res.ok) throw new Error('Error al cargar estadísticas');
  return res.json();
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 60000, // Refresh every minute
  });
}