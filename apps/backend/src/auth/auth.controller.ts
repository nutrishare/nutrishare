import { Elysia } from "elysia";
import authMiddleware from "./auth.middleware";
import { userModel } from "../user/user.model";
import githubAuth from "./github.auth.controller";
import localAuth from "./local.auth.controller";
import googleAuth from "./google.auth.controller";
import { schemaDetail } from "./auth.model";
import { TokenType } from "../plugins/jwt.plugin";
import { UnauthorizedError } from "../errors";
import { prisma } from "@nutrishare/db";
import authService from "./auth.service";

export default new Elysia({ prefix: "/auth" })
  .use(userModel)
  .use(authService)
  .use(localAuth)
  .use(githubAuth)
  .use(googleAuth)
  .use(authMiddleware)
  .post(
    "/refresh",
    async ({ body: { refreshToken }, user, authService }) => {
      await authService.verifyToken(refreshToken, TokenType.Refresh);

      const expiredToken = await prisma.refreshToken.findFirst({
        where: { refreshToken, expired: true },
      });
      // If the used refresh token is expired, invalidate all valid refresh tokens for this user
      if (expiredToken) {
        await prisma.refreshToken.updateMany({
          where: { userId: user.id, expired: false },
          data: { expired: true },
        });
        throw new UnauthorizedError();
      }

      return authService.signTokenPair({
        userId: user.id,
        username: user.username,
      });
    },
    {
      body: "auth.refresh",
      response: { 201: "auth.token" },
      detail: schemaDetail,
    },
  )
  .get("/me", ({ user }) => user, {
    response: "user.user",
    detail: schemaDetail,
  });
