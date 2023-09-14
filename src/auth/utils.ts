export const hashPassword = async (password: string): Promise<string> => {
  return Bun.password.hash(password, "argon2id");
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return Bun.password.verify(password, hash);
};
