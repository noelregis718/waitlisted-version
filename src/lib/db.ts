import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function createUser(email: string, password: string, firstName?: string, lastName?: string, companyName?: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      companyName,
    },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      accounts: true,
    },
  })
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function createProfile(userId: string, profileData: {
  phoneNumber?: string
  monthlyIncome?: number
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}) {
  return prisma.profile.create({
    data: {
      userId,
      ...profileData,
    },
  })
}

export async function createAccount(userId: string, type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'BUSINESS') {
  const accountNumber = generateAccountNumber()
  
  return prisma.account.create({
    data: {
      userId,
      type,
      accountNumber,
    },
  })
}

function generateAccountNumber() {
  // Generate a random 10-digit account number
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

// Utility: Reset a user's password by email
export async function resetUserPassword(email: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}

export { prisma } 