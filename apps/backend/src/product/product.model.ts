import Elysia, { t } from "elysia";
import { Nullable } from "../types";

export const schemaDetail = {
  tags: ["Product"],
};

const Barcode = t.Union([
  t.Literal("EAN_8"),
  t.Literal("EAN_13"),
  t.Literal("UPC_A"),
  t.Literal("UPC_E"),
]);

const Product = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  authorId: t.String(),

  name: t.String(),
  description: Nullable(t.String()),
  barcode: Nullable(t.String()),
  barcodeType: Nullable(Barcode),
  manufacturerId: t.String(),

  weight: Nullable(t.Number()),
  calories: Nullable(t.Number()),
  fat: Nullable(t.Number()),
  protein: Nullable(t.Number()),
  carbs: Nullable(t.Number()),
});

const ProductList = t.Array(Product);

export const ProductCreate = t.Omit(Product, [
  "id",
  "createdAt",
  "updatedAt",
  "authorId",
]);

export const productModel = new Elysia().model({
  "product.product": Product,
  "product.productList": ProductList,
  "product.productCreate": ProductCreate,
});
