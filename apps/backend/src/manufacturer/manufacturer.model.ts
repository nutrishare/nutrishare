import Elysia, { t } from "elysia";

export const schemaDetail = {
  tags: ["Manufacturer"],
};

const Manufacturer = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  authorId: t.String(),

  name: t.String(),
});

const ManufacturerList = t.Array(Manufacturer);

export const ManufacturerCreate = t.Omit(Manufacturer, [
  "id",
  "createdAt",
  "updatedAt",
  "authorId",
]);

export const ManufacturerUpdate = t.Partial(ManufacturerCreate);

export const manufacturerModel = new Elysia().model({
  "manufacturer.manufacturer": Manufacturer,
  "manufacturer.manufacturerList": ManufacturerList,
  "manufacturer.manufacturerCreate": ManufacturerCreate,
  "manufacturer.manufacturerUpdate": ManufacturerUpdate,
});
