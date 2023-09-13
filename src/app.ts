import Elysia from "elysia";
import swagger from "./plugins/swagger.plugin";
import auth from "./auth/auth.router";
import jsxPlugin from "./plugins/jsx.plugin";
import jwt from "./plugins/jwt.plugin";
import authMiddleware from "./auth/auth.middleware";
import { createServer as createViteServer } from "vite";

// const vite = await createViteServer({
//   server: { middlewareMode: true },
//   appType: "custom",
// });

const app = new Elysia()
  .use(jsxPlugin)
  .use(swagger)
  .group("/api", (app) => app.use(jwt).use(auth).use(authMiddleware))
  .get("/", () => "Hello, world!");

export default app;
