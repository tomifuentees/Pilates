import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classInstanceId = searchParams.get('classInstanceId');

    if (!classInstanceId) {
      return NextResponse.json(
        { error: 'ID de clase requerido' },
        { status: 400 }
      );
    }

    const waitlist = await db.waitlist.findMany({
      where: { classInstanceId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ waitlist });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { error: 'Error al obtener lista de espera' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, classInstanceId } = body;

    // Check if already on waitlist
    const existing = await db.waitlist.findFirst({
      where: { clientId, classInstanceId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya estás en la lista de espera para esta clase' },
        { status: 400 }
      );
    }

    // Get next position
    const lastPosition = await db.waitlist.findFirst({
      where: { classInstanceId },
      orderBy: { position: 'desc' },
    });

    const position = (lastPosition?.position ?? 0) + 1;

    const waitlistEntry = await db.waitlist.create({
      data: {
        clientId,
        classInstanceId,
        position,
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

    return NextResponse.json({ waitlistEntry }, { status: 201 });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { error: 'Error al unirse a lista de espera' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const waitlistId = searchParams.get('waitlistId');

    if (!waitlistId) {
      return NextResponse.json(
        { error: 'ID de entrada de espera requerido' },
        { status: 400 }
      );
    }

    await db.waitlist.delete({
      where: { id: waitlistId },
    });

    return NextResponse.json({ message: 'Eliminado de lista de espera' });
  } catch (error) {
    console.error('Error leaving waitlist:', error);
    return NextResponse.json(
      { error: 'Error al salir de lista de espera' },
      { status: 500 }
    );
  }
}