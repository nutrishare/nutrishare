import cors from "@elysiajs/cors";
import appEnv from "../env";

export default cors({
  origin: appEnv.CORS_ALLOWED_ORIGINS ?? true,
});
