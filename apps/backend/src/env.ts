import { Type, Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Env = Type.Object({
  JWT_SECRET: Type.String(),
  NODE_ENV: Type.Optional(Type.Union([Type.Literal("PRODUCTION")])),
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
