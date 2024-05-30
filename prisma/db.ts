import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const client = new PrismaClient()
  client.$executeRaw`SET timezone = 'UTC+7'`;

  return client;
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma


if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma