const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clear all transaction descriptions
  await prisma.transaction.updateMany({ data: { description: null } });
  // Existing user seed logic
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
  console.log('All transaction notes cleared.');
}

main().finally(() => prisma.$disconnect()); 