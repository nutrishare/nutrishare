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
    async ({ params: { id }, productService }) => {
      return productService.get(id);
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
      const product = await productService.create(body, user);
      set.status = "Created";
      return product;
    },
    {
      body: "product.productCreate",
      response: { 201: "product.product" },
      detail: schemaDetail,
    },
  )
  .patch(
    "/:id",
    async ({ params: { id }, body, productService }) => {
      await productService.get(id);
      return productService.update(id, body);
    },
    {
      params: t.Object({ id: t.String() }),
      body: "product.productUpdate",
      response: "product.product",
      detail: schemaDetail,
    },
  )
  .delete(
    "/:id",
    async ({ set, params: { id }, productService }) => {
      await productService.get(id);
      await productService.delete(id);
      set.status = "No Content";
    },
    {
      params: t.Object({ id: t.String() }),
      response: { 204: t.Null() },
      detail: schemaDetail,
    },
  );
