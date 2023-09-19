import Elysia from "elysia";
import swagger from "./plugins/swagger.plugin";
import auth from "./auth/auth.controller";
// import jsxPlugin from "./plugins/jsx.plugin";
import jwt from "./plugins/jwt.plugin";
// import { createServer as createViteServer } from "vite";

// const vite = await createViteServer({
//   server: { middlewareMode: true },
//   appType: "custom",
// });

const app = new Elysia()
  // .use(jsxPlugin)
  .use(swagger)
  .use(jwt)
  .group("/api", (app) => app.use(auth));

export default app;
