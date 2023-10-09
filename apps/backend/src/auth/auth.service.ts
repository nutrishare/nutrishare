import { prisma, type User } from "@nutrishare/db";
import { hashPassword, verifyPassword } from "./util";

type RegisterParams = {
  username: string;
  email: string;
  password: string;
};

type LoginParams = {
  login: string;
  password: string;
};

export default class AuthService {
  async register({ username, email, password }: RegisterParams): Promise<User> {
    if (await this.usernameExists(username)) {
      throw new Error("Username already exists");
    }
    if (await this.emailExists(email)) {
      throw new Error("Email already exists");
    }

    const hash = await hashPassword(password);
    return prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });
  }

  async login({ login, password }: LoginParams): Promise<User> {
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: login }, { email: login }] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!(await verifyPassword(password, user.password))) {
      throw new Error("Invalid password");
    }

    return user;
  }

  private async usernameExists(username: string): Promise<boolean> {
    return (await prisma.user.findUnique({ where: { username } })) !== null;
  }

  private async emailExists(email: string): Promise<boolean> {
    return (await prisma.user.findUnique({ where: { email } })) !== null;
  }
}
