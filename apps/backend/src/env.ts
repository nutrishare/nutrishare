import { Type, Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const SpaceSeparatedArray = Type.Transform(Type.String())
  .Decode((value) => value.split(" "))
  .Encode((value) => value.join(" "));

const Env = Type.Object({
  JWT_SECRET: Type.String(),
  NODE_ENV: Type.Optional(Type.Union([Type.Literal("PRODUCTION")])),
  CORS_ALLOWED_ORIGINS: Type.Optional(SpaceSeparatedArray),
  FRONTEND_AUTH_SUCCESS_CALLBACK_URL: Type.String(),
  GITHUB_CLIENT_ID: Type.String(),
  GITHUB_CLIENT_SECRET: Type.String(),
  GITHUB_CALLBACK_REDIRECT_URL: Type.String(),
  GOOGLE_CLIENT_ID: Type.String(),
  GOOGLE_CLIENT_SECRET: Type.String(),
  GOOGLE_CALLBACK_REDIRECT_URL: Type.String(),
});

type Env = Static<typeof Env>;

const envErrors = [...Value.Errors(Env, Bun.env)];

for (const envError of envErrors) {
  console.error(
    `${envError.message} ${envError.path} but got ${envError.value}`,
  );
  throw new Error("Invalid env, check above errors!");
}

export default Bun.env as Env;
