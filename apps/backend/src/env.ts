import { Type, Static, TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const SpaceSeparatedArray = (defaultValue: string) =>
  Type.Transform(Type.String({ default: defaultValue }))
    .Decode((value) => value.split(" "))
    .Encode((value) => value.join(" "));

const Env = Type.Object({
  JWT_SECRET: Type.String(),
  NODE_ENV: Type.Optional(Type.Union([Type.Literal("PRODUCTION")])),
  CORS_ALLOWED_ORIGINS: Type.Optional(SpaceSeparatedArray("*")),
  FRONTEND_AUTH_SUCCESS_CALLBACK_URL: Type.String(),
  GITHUB_CLIENT_ID: Type.String(),
  GITHUB_CLIENT_SECRET: Type.String(),
  GITHUB_CALLBACK_REDIRECT_URL: Type.String(),
  GOOGLE_CLIENT_ID: Type.String(),
  GOOGLE_CLIENT_SECRET: Type.String(),
  GOOGLE_CALLBACK_REDIRECT_URL: Type.String(),
});

const RequiredEnv = Type.Object({
  JWT_SECRET: Type.String(),
});

const check = <T extends TSchema>(
  schema: T,
  value: unknown,
): value is Static<T> => {
  if (Value.Check(schema, value)) {
    return true;
  }
  for (const error of Value.Errors(schema, value)) {
    console.error(`${error.message} ${error.path} but got ${error.value}`);
  }
  return false;
};

if (!check(RequiredEnv, Bun.env)) {
  throw new Error("Invalid env, check above errors!");
}

const converted = Value.Cast(Env, Bun.env);

if (!check(Env, converted)) {
  throw new Error("Invalid env, check above errors!");
}

export default converted;
