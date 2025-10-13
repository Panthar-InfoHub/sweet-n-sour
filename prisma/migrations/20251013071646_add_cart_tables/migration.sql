/*
  Warnings:

  - You are about to drop the column `paymentFailureReason` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `webhookEvent` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `webhookReceived` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `webhookReceivedAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "paymentFailureReason",
DROP COLUMN "webhookEvent",
DROP COLUMN "webhookReceived",
DROP COLUMN "webhookReceivedAt";

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_key" ON "cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_sessionId_key" ON "cart"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_cartId_productId_weight_key" ON "cart_item"("cartId", "productId", "weight");

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
