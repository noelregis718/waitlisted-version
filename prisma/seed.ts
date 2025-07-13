import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'noelregis718@gmail.com';
  const password = await bcrypt.hash('dummy', 10);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await prisma.user.create({
      data: {
        email,
        password,
        firstName: 'Noel',
        lastName: 'Regis',
        companyName: 'TestCo',
      },
    });
    console.log('User created');
  } else {
    console.log('User already exists');
  }
}

main().finally(() => prisma.$disconnect()); 