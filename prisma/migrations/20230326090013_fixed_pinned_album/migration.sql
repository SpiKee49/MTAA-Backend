/*
  Warnings:

  - You are about to drop the column `pinnedById` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pinnedById_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pinnedById",
ADD COLUMN     "pinnedAlbumId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pinnedAlbumId_fkey" FOREIGN KEY ("pinnedAlbumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
