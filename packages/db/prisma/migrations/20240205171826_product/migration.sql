-- CreateEnum
CREATE TYPE "BarcodeType" AS ENUM ('EAN_8', 'EAN_13', 'UPC_A', 'UPC_E');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "barcode" TEXT,
    "barcodeType" "BarcodeType",
    "weight" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE INDEX "Product_barcode_idx" ON "Product"("barcode");
