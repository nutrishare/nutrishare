import Elysia, { t } from "elysia";

const User = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  username: t.String(),
  email: t.String(),
  password: t.String(), // TODO: Don't return password
});

export const userModel = new Elysia().model({
  "user.user": User,
});
