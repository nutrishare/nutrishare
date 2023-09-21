import Elysia from "elysia";
import jwt from "../plugins/jwt.plugin";
import { prisma } from "@nutrishare/db";

class UnauthorizedError extends Error {}

const authMiddleware = new Elysia()
  .use(jwt)
  .addError({
    UnauthorizedError,
  })
  .derive(async ({ jwt, headers, set }) => {
    // biome-ignore lint: Valid Record access
    const accessToken = headers["authorization"]?.split(" ")[1];
    if (!accessToken) {
      set.status = 401;
      throw new UnauthorizedError();
    }

    const result = await jwt.verify(accessToken);
    if (!result) {
      set.status = 401;
      throw new UnauthorizedError();
    }

    const { id } = result;
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      set.status = 401;
      throw new UnauthorizedError();
    }

    return { user };
  });
export default authMiddleware;
