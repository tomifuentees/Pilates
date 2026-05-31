'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientProfileSchema, type ClientProfileInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientProfileInput>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      firstName: 'María',
      lastName: 'García',
      phone: '+34 600 000 000',
      emergencyContactName: 'Juan García',
      emergencyContactPhone: '+34 600 000 001',
      emergencyContactRelation: 'Cónyuge',
    },
  });

  const onSubmit = async (data: ClientProfileInput) => {
    setIsSaving(true);
    // In production, call API to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos Personales</CardTitle>
            <CardDescription>Tu información básica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" {...register('phone')} />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth', { valueAsDate: true })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contacto de Emergencia</CardTitle>
            <CardDescription>
              Persona a contactar en caso de emergencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nombre</Label>
                <Input id="emergencyContactName" {...register('emergencyContactName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                <Input id="emergencyContactPhone" type="tel" {...register('emergencyContactPhone')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">Relación</Label>
              <Input
                id="emergencyContactRelation"
                placeholder="Cónyuge, Padre, Hermano..."
                {...register('emergencyContactRelation')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información Médica</CardTitle>
            <CardDescription>
              Esta información es confidencial y ayuda a nuestras instructoras a adaptar las clases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="injuries">Lesiones Actuales o Pasadas</Label>
              <Input
                id="injuries"
                placeholder="Ej: Hernia discal L4-L5 (2019)"
                {...register('injuries')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalLimitations">Limitaciones Físicas</Label>
              <Input
                id="physicalLimitations"
                placeholder="Ej: Molestias en rodilla derecha"
                {...register('physicalLimitations')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalNotes">Notas Médicas Adicionales</Label>
              <Input
                id="medicalNotes"
                placeholder="Cualquier otra información relevante..."
                {...register('medicalNotes')}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </div>
  );
}