import { Elysia } from "elysia";
import authMiddleware from "./auth.middleware";
import { userModel } from "../user/user.model";
import githubAuth from "./github.auth.controller";
import localAuth from "./local.auth.controller";
import googleAuth from "./google.auth.controller";
import { schemaDetail } from "./auth.model";

export default new Elysia({ prefix: "/auth" })
  .use(userModel)
  .use(localAuth)
  .use(githubAuth)
  .use(googleAuth)
  .use(authMiddleware)
  .get("/me", ({ user }) => user, {
    response: "user.user",
    detail: schemaDetail,
  });
