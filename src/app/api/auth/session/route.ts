import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    const session = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    );

    const user = await db.user.findUnique({
      where: { id: session.userId },
      include: { client: true },
    });

    if (!user) {
      // Clear invalid session cookie
      const response = NextResponse.json({ user: null });
      response.cookies.set('session', '', { maxAge: 0 });
      return response;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientName: user.client
          ? `${user.client.firstName} ${user.client.lastName}`
          : null,
        clientId: user.client?.id || null,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}