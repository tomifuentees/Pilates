'use client';

import { useInstructors } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function InstructorsPage() {
  const { data, isLoading } = useInstructors();
  const instructors = data?.instructors || [];

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Instructoras</h1>
        <p className="text-sm text-muted-foreground">
          {instructors.length} instructoras registradas
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : instructors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay instructoras registradas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor: any) => (
            <Card key={instructor.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {instructor.firstName[0]}
                      {instructor.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {instructor.firstName} {instructor.lastName}
                    </CardTitle>
                    <CardDescription>{instructor.user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {instructor.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{instructor.bio}</p>
                )}

                {instructor.specialties && instructor.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {instructor.specialties.map((specialty: string) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  {instructor._count?.classInstances || 0} clases programadas
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}