import Elysia from "elysia";
import { cors, swagger } from "./plugins";
import auth from "./auth/auth.controller";

const app = new Elysia()
  .use(swagger)
  .use(cors)
  .group("/api", (app) =>
    app.use(auth).onError(({ code, error, set }) => {
      if (code === "BadRequestError") {
        set.status = "Bad Request";
        return error.message;
      }

      if (code === "ConflictError") {
        set.status = "Conflict";
        return error.message;
      }

      if (code === "UnauthorizedError") {
        set.status = "Unauthorized";
        return error.message;
      }

      throw error;
    }),
  );

export default app;
