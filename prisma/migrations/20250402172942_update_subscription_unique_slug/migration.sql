/*
  Warnings:

  - A unique constraint covering the columns `[slug,userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_slug_userId_key" ON "Subscription"("slug", "userId");
