import { Elysia } from "elysia";
import AuthService from "./auth.service";
import { jwt } from "../plugins";
import { userModel } from "../user/user.model";
import { authModel } from "./auth.model";
import { randomUUID as uuidv4 } from "crypto";
import { UnauthorizedError } from "../errors";
import { auth } from "../lucia";

const schemaDetail = {
  tags: ["Auth"],
};

export default new Elysia({ prefix: "/local" })
  .use(jwt)
  .use(authModel)
  .use(userModel)
  .decorate("authService", new AuthService())
  .error({
    UnauthorizedError,
  })
  .post(
    "/register",
    async ({ set, body: { username, email, password } }) => {
      const userId = uuidv4();
      // TODO: Handle errors: https://lucia-auth.com/guidebook/sign-in-with-username-and-password/express/#error-handling
      // TODO: Validate password lenght, username, email, etc.
      await auth.createUser({
        userId,
        key: {
          providerId: "local",
          providerUserId: username.toLowerCase(),
          password,
        },
        attributes: {
          username,
          email,
        },
      });
      // NOTE: We create an additional key so the user can use their email to log in
      auth.createKey({
        userId: userId,
        providerId: "local",
        providerUserId: email.toLowerCase(),
        password,
      });
      const createdUser = await auth.getUser(userId);

      set.status = "Created";
      return {
        id: createdUser.userId,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
        username,
        email,
      };
    },
    {
      body: "auth.register",
      response: { 201: "user.user" },
      detail: schemaDetail,
    },
  )
  .post(
    "/login",
    async ({ set, body: { login, password }, jwt }) => {
      // TODO: Handle errors
      const key = await auth.useKey("local", login.toLowerCase(), password);
      const user = await auth.getUser(key.userId);
      const accessToken = await jwt.sign({
        id: user.userId,
        sub: user.username,
      });

      set.status = "Created";
      return { accessToken };
    },
    {
      body: "auth.login",
      response: { 201: "auth.token" },
      detail: schemaDetail,
    },
  )
  .onError(({ code, error, set }) => {
    if (code === "UnauthorizedError") {
      set.status = "Unauthorized";
      return error.message;
    }
    throw error;
  });
