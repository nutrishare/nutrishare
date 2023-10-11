import { Elysia } from "elysia";
import { jwt } from "../plugins";
import { userModel } from "../user/user.model";
import { authModel } from "./auth.model";
import { randomUUID as uuidv4 } from "crypto";
import { UnauthorizedError, BadRequestError, ConflictError } from "../errors";
import { auth } from "../lucia";
import { PrismaClientError } from "@nutrishare/db";
import { LuciaError } from "lucia";

const schemaDetail = {
  tags: ["Auth"],
};

export default new Elysia({ prefix: "/local" })
  .use(jwt)
  .use(authModel)
  .use(userModel)
  .error({
    BadRequestError,
    ConflictError,
    UnauthorizedError,
  })
  .post(
    "/register",
    async ({ set, body: { username, email, password } }) => {
      if (username.length < 3 || username.length > 20) {
        throw new BadRequestError(
          "Username must be between 3 and 20 characters long",
        );
      }

      if (password.length < 8 || password.length > 128) {
        throw new BadRequestError(
          "Password must be between 8 and 128 characters long",
        );
      }

      const userId = uuidv4();
      try {
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
      } catch (e) {
        if (e instanceof PrismaClientError) {
          // Unique constraint violation
          if (e.code === "P2002") {
            throw new ConflictError("Username or email already exists");
          }
        }
        throw e;
      }
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
      try {
        const key = await auth.useKey("local", login.toLowerCase(), password);
        const user = await auth.getUser(key.userId);
        const accessToken = await jwt.sign({
          id: user.userId,
          sub: user.username,
        });

        set.status = "Created";
        return { accessToken };
      } catch (e) {
        if (e instanceof LuciaError) {
          if (
            e.message === "AUTH_INVALID_KEY_ID" ||
            e.message === "AUTH_INVALID_PASSWORD"
          ) {
            throw new UnauthorizedError("Invalid login or password");
          }
        }
        throw e;
      }
    },
    {
      body: "auth.login",
      response: { 201: "auth.token" },
      detail: schemaDetail,
    },
  )
  .onError(({ code, error, set }) => {
    if (code === "BadRequestError") {
      set.status = "Bad Request";
      return error.message;
    }

    if (code === "ConflictError") {
      set.status = "Conflict";
      return error.message;
    }

    if (code === "UnauthorizedError") {
      set.status = "Unauthorized";
      return error.message;
    }

    throw error;
  });
