import { User, prisma } from "@nutrishare/db";
import Elysia from "elysia";
import { ManufacturerCreate, ManufacturerUpdate } from "./manufacturer.model";
import { type Static } from "@sinclair/typebox";
import { NotFoundError } from "../errors";

export default new Elysia().error({ NotFoundError }).derive(async () => ({
  manufacturerService: {
    async get(id: string) {
      const manufacturer = await prisma.manufacturer.findFirst({
        where: { id },
      });
      if (!manufacturer) throw new NotFoundError("Manufacturer", id);
      return manufacturer;
    },
    async create(data: Static<typeof ManufacturerCreate>, user: User) {
      return prisma.manufacturer.create({
        data: { ...data, authorId: user.id },
      });
    },
    async update(id: string, data: Static<typeof ManufacturerUpdate>) {
      return prisma.manufacturer.update({
        where: { id: id },
        data,
      });
    },
    async delete(id: string) {
      return prisma.manufacturer.delete({ where: { id } });
    },
  },
}));
