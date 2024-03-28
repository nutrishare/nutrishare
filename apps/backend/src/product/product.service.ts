import { User, prisma } from "@nutrishare/db";
import { type Static } from "@sinclair/typebox";
import Elysia from "elysia";
import { ProductCreate, ProductUpdate } from "./product.model";
import { NotFoundError } from "../errors";

export default new Elysia()
  .error({ NotFoundError })
  .derive({ as: "scoped" }, async () => ({
    productService: {
      async get(id: string) {
        const product = await prisma.product.findFirst({
          where: { id },
        });
        if (!product) throw new NotFoundError("Product", id);
        return product;
      },
      async create(data: Static<typeof ProductCreate>, user: User) {
        return prisma.product.create({
          data: { ...data, authorId: user.id },
        });
      },
      async update(id: string, data: Static<typeof ProductUpdate>) {
        return prisma.product.update({
          where: { id: id },
          data,
        });
      },
      async delete(id: string) {
        return prisma.product.delete({ where: { id } });
      },
    },
  }));
