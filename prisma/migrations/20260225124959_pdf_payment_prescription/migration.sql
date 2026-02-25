/*
  Warnings:

  - You are about to drop the column `striperEventId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeEventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payments_striperEventId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "striperEventId",
ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "stripeEventId" TEXT;

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "pdfUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");
