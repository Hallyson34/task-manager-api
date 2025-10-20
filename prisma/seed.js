const { PrismaClient, RoleType } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const {
  SEED_ADMIN_NAME = 'Admin',
  SEED_ADMIN_EMAIL = 'admin@admin.com',
  SEED_ADMIN_PASSWORD = 'taskadmin.123',
} = process.env;

async function main() {
  console.log('🌱 Seeding started...');

  await prisma.roles.upsert({
    where: { name: RoleType.ADMIN },
    update: {},
    create: { name: RoleType.ADMIN },
  });

  await prisma.roles.upsert({
    where: { name: RoleType.BASIC_USER },
    update: {},
    create: { name: RoleType.BASIC_USER },
  });

  console.log('✅ Roles upserted: ADMIN, BASIC_USER');

  const exists = await prisma.user.findUnique({
    where: { email: SEED_ADMIN_EMAIL },
  });

  if (!exists) {
    const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

    await prisma.user.create({
      data: {
        name: SEED_ADMIN_NAME,
        email: SEED_ADMIN_EMAIL,
        password: hashedPassword,
        roles: {
          connect: [{ name: RoleType.ADMIN }],
        },
      },
      include: { roles: true },
    });

    console.log('👤 Admin created:');
  } else {
    console.log('ℹ️ Admin already exists, skipping creation.');
  }
  console.log('🌱 Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
