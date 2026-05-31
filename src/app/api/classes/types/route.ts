import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const classTypes = await db.classType_.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ classTypes });
  } catch (error) {
    console.error('Error fetching class types:', error);
    return NextResponse.json(
      { error: 'Error al obtener tipos de clase' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, durationMins, color } = body;

    const classType = await db.classType_.create({
      data: {
        name,
        description,
        durationMins: durationMins || 50,
        color: color || '#8B5CF6',
      },
    });

    return NextResponse.json({ classType }, { status: 201 });
  } catch (error) {
    console.error('Error creating class type:', error);
    return NextResponse.json(
      { error: 'Error al crear tipo de clase' },
      { status: 500 }
    );
  }
}