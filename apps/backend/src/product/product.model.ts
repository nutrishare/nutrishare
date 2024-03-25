import Elysia, { t } from "elysia";
import { Nullable } from "../types";

export const schemaDetail = {
  tags: ["Product"],
};

// FIXME: This is displayed as a list of empty strings
const Barcode = t.Enum({
  EAN_8: "EAN_8",
  EAN_13: "EAN_13",
  UPC_A: "UPC_A",
  UPC_E: "UPC_E",
});

const Product = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  authorId: t.String(),

  name: t.String(),
  // FIXME: Use an optional property instead of Nullable
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

export const ProductUpdate = t.Partial(ProductCreate);

const SearchParams = t.Partial(
  t.Object({
    search: t.String(),
    barcode: t.String(),
    barcodeType: Barcode,
  }),
);

export const productModel = new Elysia().model({
  "product.product": Product,
  "product.productList": ProductList,
  "product.productCreate": ProductCreate,
  "product.productUpdate": ProductUpdate,
  "product.searchParams": SearchParams,
});
