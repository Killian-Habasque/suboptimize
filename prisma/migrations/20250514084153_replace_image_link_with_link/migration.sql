/*
  Warnings:

  - You are about to drop the column `imageLink` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "imageLink",
ADD COLUMN     "link" TEXT;
