import Elysia, { t } from "elysia";
import authMiddleware from "../auth/auth.middleware";
import { productModel, schemaDetail } from "./product.model";
import { prisma } from "@nutrishare/db";
import { NotFoundError } from "../errors";
import productService from "./product.service";

export default new Elysia({ prefix: "/product" })
  .use(productModel)
  .use(productService)
  .use(authMiddleware)
  .error({ NotFoundError })
  .get(
    "/",
    async () => {
      return prisma.product.findMany();
    },
    {
      response: "product.productList",
      detail: schemaDetail,
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const product = await prisma.product.findFirst({ where: { id } });
      if (!product) throw new NotFoundError("Product", id);
      return product;
    },
    {
      params: t.Object({ id: t.String() }),
      response: "product.product",
      detail: schemaDetail,
    },
  )
  .post(
    "/",
    async ({ set, body, user, productService }) => {
      const product = await productService.createProduct(body, user);
      set.status = "Created";
      return product;
    },
    {
      body: "product.productCreate",
      response: { 201: "product.product" },
      detail: schemaDetail,
    },
  );
