import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

let prisma: PrismaClient;

declare module globalThis {
  export var prismaClient: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Otherwise, a new client will be created on every reload
  globalThis.prismaClient = globalThis.prismaClient || new PrismaClient();
  prisma = globalThis.prismaClient;
}

export default prisma;
