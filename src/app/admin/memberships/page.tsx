'use client';

import { useState } from 'react';
import { useMemberships, useCreateMembership, useClients } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, parseISO, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MembershipsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'UNLIMITED' as 'UNLIMITED' | 'RESTRICTED' | 'PACKAGE',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    classesAllowed: 8,
    classesRemaining: 10,
  });

  const { data: membershipData, isLoading } = useMemberships();
  const { data: clientsData } = useClients();
  const createMembership = useCreateMembership();

  const memberships = membershipData?.memberships || [];
  const clients = clientsData?.clients || [];

  const filteredMemberships = memberships.filter((m: any) =>
    `${m.client.firstName} ${m.client.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateMembership = async () => {
    if (!formData.clientId || !formData.type) return;

    const endDate = addMonths(new Date(formData.startDate), 1);

    try {
      await createMembership.mutateAsync({
        clientId: formData.clientId,
        type: formData.type,
        startDate: formData.startDate,
        endDate: endDate.toISOString(),
        classesAllowed: formData.type === 'RESTRICTED' ? formData.classesAllowed : undefined,
        classesRemaining: formData.type === 'PACKAGE' ? formData.classesRemaining : undefined,
      });
      setCreateDialogOpen(false);
    } catch (error: any) {
      alert(error.message || 'Error al crear la membresía');
    }
  };

  const getMembershipBadge = (type: string, status: string) => {
    if (status !== 'ACTIVE') return <Badge variant="secondary">{status}</Badge>;
    switch (type) {
      case 'UNLIMITED':
        return <Badge variant="success">Ilimitada</Badge>;
      case 'RESTRICTED':
        return <Badge variant="warning">Restringida</Badge>;
      case 'PACKAGE':
        return <Badge variant="default">Paquete</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Membresías</h1>
          <p className="text-sm text-muted-foreground">
            {filteredMemberships.length} membresías registradas
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>+ Nueva Membresía</Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Buscar clienta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMemberships.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No se encontraron membresías</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMemberships.map((membership: any) => (
            <Card key={membership.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {membership.client.firstName} {membership.client.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {membership.client.email}
                    </div>
                  </div>
                  {getMembershipBadge(membership.type, membership.status)}
                </div>

                <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo</span>
                    <p className="font-medium">
                      {membership.type === 'UNLIMITED'
                        ? 'Ilimitada'
                        : membership.type === 'RESTRICTED'
                        ? `${membership.classesAllowed} clases/mes`
                        : `${membership.classesRemaining} clases`}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Inicio</span>
                    <p className="font-medium">
                      {format(parseISO(membership.startDate), 'd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fin</span>
                    <p className="font-medium">
                      {format(parseISO(membership.endDate), 'd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Membership Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Membresía</DialogTitle>
            <DialogDescription>Selecciona la clienta y el tipo de membresía</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Clienta</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar clienta" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Membresía</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'UNLIMITED' | 'RESTRICTED' | 'PACKAGE') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNLIMITED">Ilimitada (1 mes)</SelectItem>
                  <SelectItem value="RESTRICTED">Restringida (X clases/mes)</SelectItem>
                  <SelectItem value="PACKAGE">Paquete (X clases)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'RESTRICTED' && (
              <div className="space-y-2">
                <Label>Clases por Mes</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.classesAllowed}
                  onChange={(e) =>
                    setFormData({ ...formData, classesAllowed: parseInt(e.target.value) })
                  }
                />
              </div>
            )}

            {formData.type === 'PACKAGE' && (
              <div className="space-y-2">
                <Label>Clases en el Paquete</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.classesRemaining}
                  onChange={(e) =>
                    setFormData({ ...formData, classesRemaining: parseInt(e.target.value) })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Fecha de Inicio</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateMembership}
              disabled={!formData.clientId || createMembership.isPending}
            >
              {createMembership.isPending ? 'Creando...' : 'Crear Membresía'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}