import { ClassType, MembershipType, BookingStatus, MembershipStatus } from '@prisma/client';

export const CLASS_TYPES: { value: ClassType; label: string; duration: number; color: string }[] = [
  { value: 'REFORMER', label: 'Reformer', duration: 50, color: '#8B5CF6' },
  { value: 'MAT', label: 'Mat Pilates', duration: 50, color: '#10B981' },
  { value: 'TOWER', label: 'Tower', duration: 50, color: '#F59E0B' },
  { value: 'CHAIR', label: 'Wunda Chair', duration: 50, color: '#EF4444' },
  { value: 'BARREL', label: 'Barrel', duration: 50, color: '#EC4899' },
  { value: 'PRIVATE', label: 'Clase Privada', duration: 55, color: '#6366F1' },
];

export const MEMBERSHIP_TYPES: { value: MembershipType; label: string; description: string }[] = [
  {
    value: 'UNLIMITED',
    label: 'Mensual Ilimitada',
    description: 'Acceso ilimitado a todas las clases durante el mes',
  },
  {
    value: 'RESTRICTED',
    label: 'Mensual Restringida',
    description: 'X clases al mes de tu elección',
  },
  {
    value: 'PACKAGE',
    label: 'Paquete de Clases',
    description: 'X clases válidas por Y días',
  },
];

export const CANCELLATION_HOURS_CUTOFF = 24;

export const CLASS_COLORS: Record<ClassType, string> = {
  REFORMER: '#8B5CF6',
  MAT: '#10B981',
  TOWER: '#F59E0B',
  CHAIR: '#EF4444',
  BARREL: '#EC4899',
  PRIVATE: '#6366F1',
};

export { ClassType, MembershipType, BookingStatus, MembershipStatus };