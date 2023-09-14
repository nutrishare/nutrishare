import { Elysia, t } from "elysia";
import AuthService from "./auth.service";
import jwt from "../plugins/jwt.plugin";
import authMiddleware from "./auth.middleware";

const auth = new Elysia({ prefix: "/auth" })
  .use(jwt)
  .decorate("getAuthService", () => new AuthService())
  .post(
    "/register",
    async ({ body, getAuthService }) => {
      const authService = getAuthService();
      return authService.register(body);
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String(),
        password: t.String(),
      }),
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
      body: t.Object({
        login: t.String(),
        password: t.String(),
      }),
    },
  )
  .use(authMiddleware)
  .get("/me", async () => "a");

export default auth;
