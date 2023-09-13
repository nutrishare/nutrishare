import { Elysia, t } from "elysia";

const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/login",
    ({ body }) => {
      return body;
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  )
  .post("/register", ({ body }) => {
    return body;
  })
  .get("/me", () => "Me");

export default auth;
