import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      where.status = status;
    }

    const memberships = await db.membership.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { endDate: 'desc' },
    });

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Error al obtener membresías' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, type, startDate, endDate, classesAllowed, classesRemaining } = body;

    // Check if client already has an active membership
    const existing = await db.membership.findFirst({
      where: {
        clientId,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'El cliente ya tiene una membresía activa' },
        { status: 400 }
      );
    }

    const membership = await db.membership.create({
      data: {
        clientId,
        type,
        status: 'ACTIVE',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        classesAllowed: type === 'RESTRICTED' ? classesAllowed : null,
        classesRemaining: type === 'PACKAGE' ? classesRemaining : null,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ membership }, { status: 201 });
  } catch (error) {
    console.error('Error creating membership:', error);
    return NextResponse.json(
      { error: 'Error al crear membresía' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { membershipId, status, endDate } = body;

    const updateData: Record<string, unknown> = {};

    if (status) updateData.status = status;
    if (endDate) updateData.endDate = new Date(endDate);

    const membership = await db.membership.update({
      where: { id: membershipId },
      data: updateData,
    });

    return NextResponse.json({ membership });
  } catch (error) {
    console.error('Error updating membership:', error);
    return NextResponse.json(
      { error: 'Error al actualizar membresía' },
      { status: 500 }
    );
  }
}