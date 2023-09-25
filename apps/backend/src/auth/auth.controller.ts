import { Elysia } from "elysia";
import AuthService from "./auth.service";
import { jwt } from "../plugins";
import authMiddleware from "./auth.middleware";
import { userModel } from "../user/user.model";
import { authModel } from "./auth.model";
import githubAuth from "./github.auth.controller";

const schemaDetail = {
  tags: ["Auth"],
};

// TODO: Add password auth (use lucia)
const passwordAuth = new Elysia({ prefix: "/auth" })
  .use(jwt)
  .decorate("getAuthService", () => new AuthService())
  .use(authModel)
  .use(userModel)
  .post(
    "/register",
    async ({ body, getAuthService, set }) => {
      const authService = getAuthService();
      const user = await authService.register(body);
      if (user) set.status = 201;
      return user;
    },
    {
      body: "auth.register",
      response: { 201: "user.user" },
      detail: schemaDetail,
    },
  )
  .post(
    "/login",
    async ({ body, getAuthService, jwt }) => {
      const authService = getAuthService();
      const user = await authService.login(body);
      const accessToken = await jwt.sign({ id: user.id, sub: user.username });
      return { accessToken };
    },
    {
      body: "auth.login",
      response: "auth.token",
      detail: schemaDetail,
    },
  )
  .use(authMiddleware)
  .get("/me", ({ user }) => user, {
    response: "user.user",
    detail: schemaDetail,
  })
  .onError(({ code, error, set }) => {
    if (code === "UnauthorizedError") {
      set.status = "Unauthorized";
      return "youre unauthorized";
    }
    throw error;
  });

export default new Elysia({ prefix: "/auth" })
  .use(userModel)
  .use(githubAuth)
  .use(authMiddleware)
  .get("/me", ({ user }) => user, {
    response: "user.user",
    detail: schemaDetail,
  });
