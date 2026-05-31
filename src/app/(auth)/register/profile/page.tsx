'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientProfileSchema, type ClientProfileInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfileSetupPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('userId');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientProfileInput>({
    resolver: zodResolver(clientProfileSchema),
  });

  const onSubmit = async (data: ClientProfileInput) => {
    if (!userId) {
      setError('Usuario no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/clients/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Error al guardar perfil');
        return;
      }

      // In production, would also create session here
      router.push('/dashboard');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Completa tu Perfil</CardTitle>
        <CardDescription>
          Cuéntanos un poco más sobre ti para personalizar tu experiencia
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth', { valueAsDate: true })}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Contacto de Emergencia</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nombre</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Juan García"
                  {...register('emergencyContactName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  placeholder="+34 600 000 000"
                  {...register('emergencyContactPhone')}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="emergencyContactRelation">Relación</Label>
              <Input
                id="emergencyContactRelation"
                placeholder="Cónyuge, Padre, Hermano..."
                {...register('emergencyContactRelation')}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Información Médica</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Esta información es confidencial y solo será usada para adaptar las clases a tus
              necesidades.
            </p>

            <div className="space-y-4">
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
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}