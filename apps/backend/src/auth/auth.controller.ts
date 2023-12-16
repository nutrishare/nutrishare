import { Elysia } from "elysia";
import authMiddleware from "./auth.middleware";
import { userModel } from "../user/user.model";
import githubAuth from "./github.auth.controller";
import localAuth from "./local.auth.controller";
import googleAuth from "./google.auth.controller";
import { schemaDetail } from "./auth.model";
import { UnauthorizedError } from "../errors";
import { prisma } from "@nutrishare/db";
import authService from "./auth.service";

export default new Elysia({ prefix: "/auth" })
  .use(userModel)
  .use(authService)
  .use(localAuth)
  .use(githubAuth)
  .use(googleAuth)
  .post(
    "/refresh",
    async ({ body: { refreshToken: providedRefreshToken }, authService }) => {
      const refreshToken = await authService.verifyRefreshToken(
        providedRefreshToken,
      );
      const userId = refreshToken.id;

      const expiredToken = await prisma.refreshToken.findFirst({
        where: { refreshToken: providedRefreshToken, expired: true },
      });
      // If the used refresh token is expired, invalidate all valid refresh tokens for this user
      if (expiredToken) {
        await prisma.refreshToken.updateMany({
          where: { user: { id: userId }, expired: false },
          data: { expired: true },
        });
        throw new UnauthorizedError();
      }

      const user = await prisma.user.findFirstOrThrow({
        where: { id: userId },
      });
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
  .use(authMiddleware)
  .get("/me", ({ user }) => user, {
    response: "user.user",
    detail: schemaDetail,
  });
