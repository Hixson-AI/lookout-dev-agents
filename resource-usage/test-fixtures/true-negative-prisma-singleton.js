// EXPECT: no findings (singleton with explicit closePrisma())
import { PrismaClient } from '@prisma/client';
let prisma = null;
export async function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
    await prisma.$connect();
  }
  return prisma;
}
export async function closePrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}
