/*
  Warnings:

  - You are about to drop the column `proiverAccountId` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerAccountId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_proiverAccountId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "proiverAccountId",
ADD COLUMN     "providerAccountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerAccountId_key" ON "Account"("providerAccountId");
