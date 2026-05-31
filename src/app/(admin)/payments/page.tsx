'use client';

import { useState } from 'react';
import { usePayments, useCreatePayment, useClients } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PaymentsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    method: 'CASH' as 'CASH' | 'TRANSFER',
  });

  const { data: paymentsData, isLoading } = usePayments();
  const { data: clientsData } = useClients();
  const createPayment = useCreatePayment();

  const payments = paymentsData?.payments || [];
  const clients = clientsData?.clients || [];

  const handleCreatePayment = async () => {
    if (!formData.clientId || !formData.amount) return;

    try {
      await createPayment.mutateAsync({
        clientId: formData.clientId,
        amount: parseFloat(formData.amount),
        method: formData.method,
      });
      setCreateDialogOpen(false);
      setFormData({ clientId: '', amount: '', method: 'CASH' });
    } catch (error: any) {
      alert(error.message || 'Error al registrar el pago');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pagos</h1>
          <p className="text-sm text-muted-foreground">
            {payments.length} pagos registrados
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>+ Registrar Pago</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay pagos registrados</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Clienta
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Método
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                    Importe
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="border-b last:border-b-0">
                    <td className="p-3">
                      <div className="font-medium">
                        {payment.client.firstName} {payment.client.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.client.email}
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      {payment.paidAt
                        ? format(parseISO(payment.paidAt), 'd MMM yyyy', { locale: es })
                        : '-'}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {payment.method === 'CASH' ? 'Efectivo' : 'Transferencia'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-medium">
                      €{Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      <Badge
                        variant={payment.status === 'COMPLETED' ? 'success' : 'secondary'}
                      >
                        {payment.status === 'COMPLETED' ? 'Completado' : payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Create Payment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>Registra un pago de membresía</DialogDescription>
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
              <Label>Importe (€)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <Select
                value={formData.method}
                onValueChange={(value: 'CASH' | 'TRANSFER') =>
                  setFormData({ ...formData, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                  <SelectItem value="TRANSFER">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePayment}
              disabled={!formData.clientId || !formData.amount || createPayment.isPending}
            >
              {createPayment.isPending ? 'Registrando...' : 'Registrar Pago'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}