import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and client in transaction
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: 'CLIENT',
        client: {
          create: {
            firstName,
            lastName,
            phone,
          },
        },
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}