import { User, prisma } from "@nutrishare/db";
import Elysia from "elysia";
import { ManufacturerCreate } from "./manufacturer.model";
import { type Static } from "@sinclair/typebox";

export default new Elysia().derive(async () => ({
  manufacturerService: {
    createManufacturer: async (
      data: Static<typeof ManufacturerCreate>,
      user: User,
    ) => {
      return prisma.manufacturer.create({
        data: { ...data, authorId: user.id },
      });
    },
  },
}));
