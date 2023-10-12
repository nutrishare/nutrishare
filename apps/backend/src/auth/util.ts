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

// TODO: Frontend address should be configurable
// via a query param to the initial authorization request
export const getSuccessCallbackUrl = (accessToken: string): string =>
  `${appEnv.FRONTEND_AUTH_SUCCESS_CALLBACK_URL}?accessToken=${accessToken}`;
