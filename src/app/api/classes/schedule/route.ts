import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { startOfWeek, endOfWeek, parseISO, addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const classTypeId = searchParams.get('classTypeId');
    const instructorId = searchParams.get('instructorId');

    // Default to current week if no date provided
    const targetDate = dateParam ? parseISO(dateParam) : new Date();
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

    const where: Record<string, unknown> = {
      startTime: {
        gte: weekStart,
        lte: weekEnd,
      },
    };

    if (classTypeId) {
      where.classTypeId = classTypeId;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    const classes = await db.classInstance.findMany({
      where,
      include: {
        classType: true,
        instructor: true,
        bookings: {
          where: { status: 'CONFIRMED' },
        },
        _count: {
          select: { waitlist: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    // Transform to include availability
    const classesWithAvailability = classes.map((cls) => ({
      id: cls.id,
      classType: cls.classType,
      instructor: {
        id: cls.instructor.id,
        firstName: cls.instructor.firstName,
        lastName: cls.instructor.lastName,
      },
      startTime: cls.startTime.toISOString(),
      endTime: cls.endTime.toISOString(),
      capacity: cls.capacity,
      bookedCount: cls.bookings.length,
      availableSpots: cls.capacity - cls.bookings.length,
      waitlistCount: cls._count.waitlist,
      isFull: cls.bookings.length >= cls.capacity,
    }));

    // Group by day for calendar view
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return {
        date: format(day, 'yyyy-MM-dd'),
        dayName: format(day, 'EEEE', { locale: es }),
        dayNumber: format(day, 'd'),
        isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
        classes: classesWithAvailability.filter(
          (cls) => format(parseISO(cls.startTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ),
      };
    });

    return NextResponse.json({
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      days: weekDays,
      classes: classesWithAvailability,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Error al obtener el calendario' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classTypeId, instructorId, startTime, endTime, capacity } = body;

    const classInstance = await db.classInstance.create({
      data: {
        classTypeId,
        instructorId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: capacity || 12,
      },
      include: {
        classType: true,
        instructor: true,
      },
    });

    return NextResponse.json({ classInstance }, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Error al crear la clase' },
      { status: 500 }
    );
  }
}