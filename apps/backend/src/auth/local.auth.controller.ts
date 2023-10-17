import { Elysia } from "elysia";
import { userModel } from "../user/user.model";
import { authModel } from "./auth.model";
import authService from "./auth.service";
import { schemaDetail } from "./auth.model";

export default new Elysia({ prefix: "/local" })
  .use(authModel)
  .use(userModel)
  .use(authService)
  .post(
    "/register",
    async ({ set, body: { username, email, password }, authService }) => {
      authService.validateUsername(username);
      authService.validatePassword(password);

      const user = await authService.createLocalUser(username, email, password);
      set.status = "Created";
      return {
        id: user.userId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
    async ({ set, body: { login, password }, authService }) => {
      const user = await authService.authenticateLocalUser(login, password);
      const accessToken = await authService.signToken(user);
      set.status = "Created";
      return { accessToken };
    },
    {
      body: "auth.login",
      response: { 201: "auth.token" },
      detail: schemaDetail,
    },
  );
