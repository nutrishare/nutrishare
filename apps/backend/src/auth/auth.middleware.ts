import Elysia from "elysia";
import { prisma } from "@nutrishare/db";
import { UnauthorizedError } from "../errors";
import { TokenType } from "../plugins/jwt.plugin";
import authService from "./auth.service";

export default new Elysia()
  .use(authService)
  .error({
    UnauthorizedError,
  })
  .derive(async ({ headers, authService }) => {
    // biome-ignore lint: Valid Record access
    const accessToken = headers["authorization"]?.split(" ")[1];
    if (!accessToken) throw new UnauthorizedError();

    const jwtPayload = await authService.verifyToken(
      accessToken,
      TokenType.Access,
    );

    const { id } = jwtPayload;
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) throw new UnauthorizedError();

    return { user };
  });
