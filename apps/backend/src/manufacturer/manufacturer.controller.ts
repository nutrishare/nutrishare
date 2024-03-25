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
    async ({ params: { id } }) => {
      const manufacturer = await prisma.manufacturer.findFirst({
        where: { id },
      });
      if (!manufacturer) throw new NotFoundError("Manufacturer", id);
      return manufacturer;
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
      const manufacturer = await manufacturerService.createManufacturer(
        body,
        user,
      );
      set.status = "Created";
      return manufacturer;
    },
    {
      body: "manufacturer.manufacturerCreate",
      response: { 201: "manufacturer.manufacturer" },
      detail: schemaDetail,
    },
  );
