'use client';

import { useClients } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useClients();
  const clients = data?.clients || [];

  const filteredClients = clients.filter(
    (client: any) =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      client.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientas</h1>
          <p className="text-sm text-muted-foreground">
            {filteredClients.length} clientas registradas
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
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
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No se encontraron clientas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client: any) => (
            <Card key={client.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{client.user?.email}</div>
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {client.membership ? (
                      <Badge variant="success">Con membresía</Badge>
                    ) : (
                      <Badge variant="secondary">Sin membresía</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {client._count?.bookings || 0} clases
                    </span>
                  </div>
                </div>

                {client.membership && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Membresía:</span>
                      <span>{client.membership.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <span>{client.membership.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vence:</span>
                      <span>
                        {format(parseISO(client.membership.endDate), 'd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}