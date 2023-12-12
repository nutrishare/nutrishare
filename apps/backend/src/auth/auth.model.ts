import { Elysia, t } from "elysia";

export const schemaDetail = {
  tags: ["Auth"],
};

const Register = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String(),
});

const Login = t.Object({
  login: t.String(),
  password: t.String(),
});

const Token = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

export const authModel = new Elysia().model({
  "auth.register": Register,
  "auth.login": Login,
  "auth.token": Token,
});
