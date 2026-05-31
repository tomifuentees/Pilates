import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clientProfileSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, ...profileData } = body;

    // Validate with Zod
    const validated = clientProfileSchema.parse(profileData);

    // Update client profile
    const client = await db.client.update({
      where: { userId },
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        dateOfBirth: validated.dateOfBirth,
        avatarUrl: validated.avatarUrl || null,
        injuries: validated.injuries || null,
        medicalNotes: validated.medicalNotes || null,
        physicalLimitations: validated.physicalLimitations || null,
        emergencyContactName: validated.emergencyContactName || null,
        emergencyContactPhone: validated.emergencyContactPhone || null,
        emergencyContactRelation: validated.emergencyContactRelation || null,
      },
    });

    return NextResponse.json({ client }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}