import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const CLASS_TYPE_DATA = [
  { name: 'REFORMER', description: 'Clase en reformer con resistencia de resortes', durationMins: 50, color: '#8B5CF6' },
  { name: 'MAT', description: 'Clásica clase en colchoneta', durationMins: 50, color: '#10B981' },
  { name: 'TOWER', description: 'Trabajo con el aparataje vertical Tower', durationMins: 50, color: '#F59E0B' },
  { name: 'CHAIR', description: 'Ejercicios en Wunda Chair', durationMins: 50, color: '#EF4444' },
  { name: 'BARREL', description: 'Clase con barril y ladder', durationMins: 50, color: '#EC4899' },
  { name: 'PRIVATE', description: 'Clase individual personalizada', durationMins: 55, color: '#6366F1' },
];

async function seed() {
  console.log('Starting seed...');

  // Create admin user if not exists
  const adminEmail = 'admin@pilates.com';
  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    const admin = await db.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });

    // Create admin profile
    await db.client.create({
      data: {
        userId: admin.id,
        firstName: 'Admin',
        lastName: 'Principal',
        phone: '+34 600 000 000',
      },
    });

    console.log('Admin user created:', adminEmail);

    // Create instructor users
    const instructors = [
      { email: 'maria@pilates.com', firstName: 'María', lastName: 'García', specialties: ['REFORMER', 'MAT', 'PRIVATE'] },
      { email: 'laura@pilates.com', firstName: 'Laura', lastName: 'Martínez', specialties: ['TOWER', 'CHAIR'] },
      { email: 'sofia@pilates.com', firstName: 'Sofía', lastName: 'López', specialties: ['BARREL', 'MAT'] },
    ];

    for (const inst of instructors) {
      const instPasswordHash = await bcrypt.hash('instructor123', 12);
      const user = await db.user.create({
        data: {
          email: inst.email,
          passwordHash: instPasswordHash,
          role: 'INSTRUCTOR',
        },
      });

      await db.instructor.create({
        data: {
          userId: user.id,
          firstName: inst.firstName,
          lastName: inst.lastName,
          phone: '+34 600 000 001',
          bio: `Instructora de Pilates certificada con experiencia en ${inst.specialties.join(', ')}`,
          specialties: inst.specialties,
        },
      });

      console.log('Instructor created:', inst.email);
    }

    // Create class types
    for (const ct of CLASS_TYPE_DATA) {
      await db.classType_.create({
        data: ct,
      });
    }
    console.log('Class types created');

    // Create a test client
    const testClientPasswordHash = await bcrypt.hash('client123', 12);
    const testClient = await db.user.create({
      data: {
        email: 'cliente@ejemplo.com',
        passwordHash: testClientPasswordHash,
        role: 'CLIENT',
      },
    });

    const client = await db.client.create({
      data: {
        userId: testClient.id,
        firstName: 'Ana',
        lastName: 'Rodríguez',
        phone: '+34 600 000 002',
        dateOfBirth: new Date('1990-05-15'),
        injuries: 'Ninguna',
        emergencyContactName: 'Carlos Rodríguez',
        emergencyContactPhone: '+34 600 000 003',
        emergencyContactRelation: 'Cónyuge',
      },
    });

    console.log('Test client created: cliente@ejemplo.com');

    // Create an active membership for the test client
    await db.membership.create({
      data: {
        clientId: client.id,
        type: 'UNLIMITED',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    console.log('Membership created for test client');

    console.log('Seed completed successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@pilates.com / admin123');
    console.log('Instructor: maria@pilates.com / instructor123');
    console.log('Client: cliente@ejemplo.com / client123');
  } else {
    console.log('Seed already completed, skipping...');
  }
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });