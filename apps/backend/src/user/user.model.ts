import Elysia, { t } from "elysia";

const User = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  username: t.String(),
  email: t.Union([t.String(), t.Null()]),
});

export const userModel = new Elysia().model({
  "user.user": User,
});
