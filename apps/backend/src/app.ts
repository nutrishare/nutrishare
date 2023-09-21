import Elysia from "elysia";
import swagger from "./plugins/swagger.plugin";
// import auth from "./auth/auth.controller";
import jwt from "./plugins/jwt.plugin";

const app = new Elysia()
  .use(swagger)
  .use(jwt)
  .get("/foo", () => "bar");
// .group("/api", (app) => app.use(auth));

export default app;
