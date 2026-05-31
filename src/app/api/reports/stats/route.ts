import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export async function GET() {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Classes today
    const classesToday = await db.classInstance.count({
      where: {
        startTime: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    // Bookings today
    const bookingsToday = await db.booking.count({
      where: {
        status: 'CONFIRMED',
        classInstance: {
          startTime: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
      },
    });

    // Active clients (with bookings in last 30 days)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const activeClients = await db.client.findMany({
      where: {
        bookings: {
          some: {
            bookedAt: { gte: thirtyDaysAgo },
          },
        },
      },
    });

    // Revenue this month
    const paymentsThisMonth = await db.payment.aggregate({
      where: {
        status: 'COMPLETED',
        paidAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Calculate occupation rate (average attendance)
    const weekClasses = await db.classInstance.findMany({
      where: {
        startTime: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        bookings: { where: { status: 'CONFIRMED' } },
      },
    });

    let totalCapacity = 0;
    let totalBookings = 0;

    for (const cls of weekClasses) {
      totalCapacity += cls.capacity;
      totalBookings += cls.bookings.length;
    }

    const occupationRate = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;

    return NextResponse.json({
      classesToday,
      bookingsToday,
      activeClients: activeClients.length,
      revenueThisMonth: Number(paymentsThisMonth._sum.amount || 0),
      transactionsThisMonth: paymentsThisMonth._count || 0,
      occupationRate,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}