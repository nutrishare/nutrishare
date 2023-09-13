import { type User } from "@prisma/client";

type LoginParams = {
  username: string;
  password: string;
};

export default class AuthService {
  login({ username, password }: LoginParams): User {
    return body;
  }

  register({ username, email, password }): User {
    return "Register";
  }

  me() {
    return "Me";
  }
}
