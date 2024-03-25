import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import appEnv from "../env";

export enum TokenType {
  Access = "access",
  Refresh = "refresh",
}

export default new Elysia()
  .use(
    jwt({
      name: "accessJwt",
      secret: appEnv.JWT_SECRET,
      exp: appEnv.JWT_ACCESS_EXPIRATION,
      typ: TokenType.Access,
      schema: t.Object({
        id: t.String(),
        sub: t.String(),
        typ: t.Enum(TokenType),
      }),
    }),
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: appEnv.JWT_SECRET,
      exp: appEnv.JWT_REFRESH_EXPIRATION,
      typ: TokenType.Refresh,
      schema: t.Object({
        id: t.String(),
        sub: t.String(),
        typ: t.Enum(TokenType),
      }),
    }),
  );
