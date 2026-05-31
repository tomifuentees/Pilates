import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const clients = await db.client.findMany({
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        membership: {
          select: {
            id: true,
            type: true,
            status: true,
            endDate: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { lastName: 'asc' },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Error al obtener clientas' },
      { status: 500 }
    );
  }
}