import { Elysia } from "elysia";
import AuthService from "./auth.service";
import jwt from "../plugins/jwt.plugin";
import authMiddleware from "./auth.middleware";
import { userModel } from "../user/user.model";
import { authModel } from "./auth.model";

export default new Elysia({ prefix: "/auth" })
  .use(jwt)
  .decorate("getAuthService", () => new AuthService())
  .use(authModel)
  .use(userModel)
  .post(
    "/register",
    async ({ body, getAuthService }) => {
      const authService = getAuthService();
      return await authService.register(body);
    },
    {
      body: "auth.register",
      response: "user.user",
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
    },
  )
  .use(authMiddleware)
  .get("/me", ({ user }) => user, {
    response: "user.user",
  });
