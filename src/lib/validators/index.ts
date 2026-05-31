import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().min(9, 'Teléfono inválido'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const clientProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(9),
  dateOfBirth: z.date().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  injuries: z.string().optional(),
  medicalNotes: z.string().optional(),
  physicalLimitations: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
});

export const membershipSchema = z.object({
  clientId: z.string().cuid(),
  type: z.enum(['UNLIMITED', 'RESTRICTED', 'PACKAGE']),
  startDate: z.date(),
  endDate: z.date(),
  classesAllowed: z.number().int().positive().optional(),
  classesRemaining: z.number().int().positive().optional(),
});

export const classInstanceSchema = z.object({
  classTypeId: z.string().cuid(),
  instructorId: z.string().cuid(),
  startTime: z.date(),
  endTime: z.date(),
  capacity: z.number().int().positive().min(1).default(12),
});

export const bookingSchema = z.object({
  classInstanceId: z.string().cuid(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
export type MembershipInput = z.infer<typeof membershipSchema>;
export type ClassInstanceInput = z.infer<typeof classInstanceSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;