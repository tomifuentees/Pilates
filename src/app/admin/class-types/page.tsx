'use client';

import { useClassTypes, useCreateClassType } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { CLASS_TYPES } from '@/lib/constants';

const DEFAULT_CLASS_COLORS: Record<string, string> = {
  REFORMER: '#8B5CF6',
  MAT: '#10B981',
  TOWER: '#F59E0B',
  CHAIR: '#EF4444',
  BARREL: '#EC4899',
  PRIVATE: '#6366F1',
};

export default function ClassTypesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMins: 50,
    color: '#8B5CF6',
  });

  const { data, isLoading } = useClassTypes();
  const createClassType = useCreateClassType();

  const classTypes = data?.classTypes || [];

  const handleCreateClassType = async () => {
    if (!formData.name) return;

    try {
      await createClassType.mutateAsync({
        name: formData.name as any,
        description: formData.description || undefined,
        durationMins: formData.durationMins,
        color: formData.color,
      });
      setCreateDialogOpen(false);
      setFormData({ name: '', description: '', durationMins: 50, color: '#8B5CF6' });
    } catch (error: any) {
      alert(error.message || 'Error al crear el tipo de clase');
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      '#8B5CF6': 'bg-violet-500',
      '#10B981': 'bg-emerald-500',
      '#F59E0B': 'bg-amber-500',
      '#EF4444': 'bg-red-500',
      '#EC4899': 'bg-pink-500',
      '#6366F1': 'bg-indigo-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tipos de Clase</h1>
          <p className="text-sm text-muted-foreground">
            {classTypes.length} tipos de clase configurados
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>+ Nuevo Tipo</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : classTypes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay tipos de clase configurados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classTypes.map((classType: any) => (
            <Card key={classType.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-12 rounded-full ${getColorClass(classType.color)}`} />
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base">{classType.name}</CardTitle>
                    {classType.description && (
                      <p className="text-sm text-muted-foreground">{classType.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{classType.durationMins} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Class Type Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Tipo de Clase</DialogTitle>
            <DialogDescription>Configura un nuevo tipo de clase</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Select
                value={formData.name}
                onValueChange={(value) => {
                  const classType = CLASS_TYPES.find((ct) => ct.value === value);
                  setFormData({
                    ...formData,
                    name: value,
                    color: classType?.color || formData.color,
                    durationMins: classType?.duration || formData.durationMins,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_TYPES.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value}>
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                placeholder="Descripción opcional..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duración (minutos)</Label>
                <Input
                  type="number"
                  min={15}
                  step={5}
                  value={formData.durationMins}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMins: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {Object.entries(DEFAULT_CLASS_COLORS).map(([name, color]) => (
                    <button
                      key={name}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-foreground' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateClassType}
              disabled={!formData.name || createClassType.isPending}
            >
              {createClassType.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}