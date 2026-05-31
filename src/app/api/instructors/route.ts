import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const instructors = await db.instructor.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            classInstances: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json({ instructors });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Error al obtener instructoras' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, firstName, lastName, phone, bio, specialties } = body;

    const instructor = await db.instructor.create({
      data: {
        userId,
        firstName,
        lastName,
        phone,
        bio,
        specialties,
      },
    });

    return NextResponse.json({ instructor }, { status: 201 });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Error al crear instructora' },
      { status: 500 }
    );
  }
}