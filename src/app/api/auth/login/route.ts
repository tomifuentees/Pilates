import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user with client
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { client: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionData = {
      userId: user.id,
      role: user.role,
      email: user.email,
      clientId: user.client?.id || null,
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientName: user.client
          ? `${user.client.firstName} ${user.client.lastName}`
          : null,
      },
    });

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}