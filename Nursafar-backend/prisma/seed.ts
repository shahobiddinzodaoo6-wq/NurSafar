import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const existing = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (existing) {
    console.log('Admin already exists, skipping seed.');
    return;
  }

  const hashed = await bcrypt.hash('AdminSuperSecret!', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'NurSafar Admin',
      email: 'admin@nursafar.tj',
      phone: '+992000000000',
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log(`Admin created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
