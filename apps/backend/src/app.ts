import Elysia from "elysia";
import { cors, jwt, swagger } from "./plugins";
// import auth from "./auth/auth.controller";

const app = new Elysia()
  .use(swagger)
  .use(cors)
  .use(jwt)
  .get("/foo", () => "bar");
// .group("/api", (app) => app.use(auth));

export default app;
