import { resetUserPassword, prisma } from './db';

async function main() {
  const email = 'noel.regis04@gmail.com';
  const newPassword = '123456';
  try {
    const user = await resetUserPassword(email, newPassword);
    console.log('Password reset successful for:', user.email);
  } catch (err) {
    console.error('Password reset failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 