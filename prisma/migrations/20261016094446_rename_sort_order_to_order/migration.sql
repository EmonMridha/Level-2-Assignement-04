/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `property_images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "property_images" DROP COLUMN "sortOrder",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
