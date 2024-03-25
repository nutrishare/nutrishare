import { User, prisma } from "@nutrishare/db";
import { type Static } from "@sinclair/typebox";
import Elysia from "elysia";
import { ProductCreate } from "./product.model";

export default new Elysia().derive(async () => ({
  productService: {
    createProduct: async (data: Static<typeof ProductCreate>, user: User) => {
      return prisma.product.create({
        data: { ...data, authorId: user.id },
      });
    },
  },
}));
