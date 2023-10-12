import Elysia from "elysia";
import { jwt } from "../plugins";
import { prisma } from "@nutrishare/db";
import { UnauthorizedError } from "../errors";

export default new Elysia()
  .use(jwt)
  .error({
    UnauthorizedError,
  })
  .derive(async ({ jwt, headers }) => {
    // biome-ignore lint: Valid Record access
    const accessToken = headers["authorization"]?.split(" ")[1];
    if (!accessToken) throw new UnauthorizedError();

    const jwtPayload = await jwt.verify(accessToken);
    if (!jwtPayload) throw new UnauthorizedError();

    const { id } = jwtPayload;
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) throw new UnauthorizedError();

    return { user };
  });
