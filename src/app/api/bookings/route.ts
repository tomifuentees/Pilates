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

    const bookings = await db.booking.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        classInstance: {
          include: {
            classType: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { classInstance: { startTime: 'asc' } },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, classInstanceId } = body;

    // Check if class exists and has capacity
    const classInstance = await db.classInstance.findUnique({
      where: { id: classInstanceId },
      include: {
        bookings: {
          where: { status: 'CONFIRMED' },
        },
      },
    });

    if (!classInstance) {
      return NextResponse.json(
        { error: 'Clase no encontrada' },
        { status: 404 }
      );
    }

    if (classInstance.bookings.length >= classInstance.capacity) {
      return NextResponse.json(
        { error: 'La clase está llena' },
        { status: 400 }
      );
    }

    // Check if client already has a booking for this class
    const existingBooking = await db.booking.findFirst({
      where: {
        clientId,
        classInstanceId,
        status: { in: ['CONFIRMED', 'WAITLISTED'] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Ya tienes una reserva para esta clase' },
        { status: 400 }
      );
    }

    // Check if client has active membership
    const membership = await db.membership.findFirst({
      where: {
        clientId,
        status: 'ACTIVE',
        endDate: { gte: classInstance.startTime },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'No tienes una membresía activa para esta fecha' },
        { status: 400 }
      );
    }

    // Check if membership has remaining classes (for RESTRICTED/PACKAGE types)
    if (membership.type !== 'UNLIMITED' && membership.classesRemaining !== null && membership.classesRemaining <= 0) {
      return NextResponse.json(
        { error: 'No te quedan clases disponibles en tu membresía' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        clientId,
        classInstanceId,
        status: 'CONFIRMED',
        membershipId: membership.id,
      },
      include: {
        classInstance: {
          include: {
            classType: true,
            instructor: true,
          },
        },
      },
    });

    // Decrement classes remaining for RESTRICTED/PACKAGE
    if (membership.type !== 'UNLIMITED' && membership.classesRemaining !== null) {
      await db.membership.update({
        where: { id: membership.id },
        data: { classesRemaining: membership.classesRemaining - 1 },
      });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'ID de reserva requerido' },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        classInstance: true,
        membership: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Check cancellation policy (24 hours)
    const hoursUntilClass =
      (booking.classInstance.startTime.getTime() - Date.now()) / (1000 * 60 * 60);

    let classCredited = false;
    if (hoursUntilClass > 24 && booking.membership && booking.membership.classesRemaining !== null) {
      // Refund the class to membership
      await db.membership.update({
        where: { id: booking.membership.id },
        data: { classesRemaining: booking.membership.classesRemaining + 1 },
      });
      classCredited = true;
    }

    // Update booking status
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Check waitlist for this class
    const waitlistEntry = await db.waitlist.findFirst({
      where: { classInstanceId: booking.classInstanceId },
      orderBy: { position: 'asc' },
    });

    if (waitlistEntry) {
      // Notify waitlist client (in real app, send email/SMS)
      // For now, just return that there's someone on waitlist
    }

    return NextResponse.json({
      message: classCredited
        ? 'Reserva cancelada. La clase ha sido acreditada a tu membresía.'
        : 'Reserva cancelada.',
      classCredited,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Error al cancelar la reserva' },
      { status: 500 }
    );
  }
}