import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const prisma = new PrismaClient();
export type * from "@prisma/client";

export const PrismaClientError = Prisma.PrismaClientKnownRequestError;
