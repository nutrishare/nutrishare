import jwt from "@elysiajs/jwt";
import { t } from "elysia";

// TODO: Handle env variables better
// biome-ignore lint: Temporary unwrap
const jwtSecret = Bun.env["JWT_SECRET"]!;

export default jwt({
  name: "jwt",
  secret: jwtSecret,
  exp: "7d",
  schema: t.Object({
    id: t.String(),
    sub: t.String(),
  }),
});
