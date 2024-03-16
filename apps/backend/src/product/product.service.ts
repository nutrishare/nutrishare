import { Product, User, prisma } from "@nutrishare/db";
import Elysia from "elysia";

type ProductCreate = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "authorId"
>;

export default new Elysia().derive(async () => ({
  productService: {
    createProduct: async (data: ProductCreate, user: User) => {
      return prisma.product.create({
        data: { ...data, authorId: user.id },
      });
    },
  },
}));
