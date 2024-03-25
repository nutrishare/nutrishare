import Elysia, { t } from "elysia";
import authMiddleware from "../auth/auth.middleware";
import { prisma } from "@nutrishare/db";
import { manufacturerModel, schemaDetail } from "./manufacturer.model";
import { NotFoundError } from "../errors";
import manufacturerService from "./manufacturer.service";

export default new Elysia({ prefix: "/manufacturer" })
  .use(manufacturerModel)
  .use(manufacturerService)
  .use(authMiddleware)
  .error({ NotFoundError })
  .get(
    "/",
    async () => {
      return prisma.manufacturer.findMany();
    },
    {
      response: "manufacturer.manufacturerList",
      detail: schemaDetail,
    },
  )
  .get(
    "/:id",
    async ({ params: { id }, manufacturerService }) => {
      return manufacturerService.get(id);
    },
    {
      params: t.Object({ id: t.String() }),
      response: "manufacturer.manufacturer",
      detail: schemaDetail,
    },
  )
  .post(
    "/",
    async ({ set, body, user, manufacturerService }) => {
      const manufacturer = await manufacturerService.create(body, user);
      set.status = "Created";
      return manufacturer;
    },
    {
      body: "manufacturer.manufacturerCreate",
      response: { 201: "manufacturer.manufacturer" },
      detail: schemaDetail,
    },
  )
  .patch(
    "/:id",
    async ({ params: { id }, body, manufacturerService }) => {
      await manufacturerService.get(id);
      return manufacturerService.update(id, body);
    },
    {
      params: t.Object({ id: t.String() }),
      body: "manufacturer.manufacturerUpdate",
      response: "manufacturer.manufacturer",
      detail: schemaDetail,
    },
  )
  .delete(
    "/:id",
    async ({ set, params: { id }, manufacturerService }) => {
      await manufacturerService.get(id);
      await manufacturerService.delete(id);
      set.status = "No Content";
    },
    {
      params: t.Object({ id: t.String() }),
      response: { 204: t.Null() },
      detail: schemaDetail,
    },
  );
