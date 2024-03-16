import Elysia from "elysia";
import { cors, swagger } from "./plugins";
import auth from "./auth/auth.controller";
import product from "./product/product.controller";

const app = new Elysia()
  .use(swagger)
  .use(cors)
  .group("/api", (app) =>
    app
      .use(auth)
      .use(product)
      .onError(({ code, error, set }) => {
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

        if (code === "NotFoundError") {
          set.status = "Not Found";
          return error.message;
        }

        throw error;
      }),
  );

export default app;
