import { prisma } from "@nutrishare/db";
import appEnv from ".././env";

export const hashPassword = async (password: string): Promise<string> => {
  return Bun.password.hash(password, "argon2id");
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return Bun.password.verify(password, hash);
};

export const invalidateTokenFamily = async (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: { user: { id: userId }, expired: false },
    data: { expired: true },
  });
};

// TODO: Frontend address should be configurable
// via a query param to the initial authorization request
export const getSuccessCallbackUrl = (
  accessToken: string,
  refreshToken: string,
): string =>
  `${appEnv.FRONTEND_AUTH_SUCCESS_CALLBACK_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
