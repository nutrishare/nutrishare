import jwt from "@elysiajs/jwt";
import { t } from "elysia";
import appEnv from "../env";

const jwtSecret = appEnv.JWT_SECRET;

export enum TokenType {
  Access = "access",
  Refresh = "refresh",
}

export default jwt({
  name: "jwt",
  secret: jwtSecret,
  exp: "7d",
  schema: t.Object({
    id: t.String(),
    sub: t.String(),
    typ: t.Enum(TokenType),
  }),
});
