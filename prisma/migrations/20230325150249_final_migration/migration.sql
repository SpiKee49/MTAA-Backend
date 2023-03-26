/*
  Warnings:

  - You are about to drop the column `userId` on the `Album` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_userId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "photo" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profilePic" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_followedAlbums" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_followedAlbums_AB_unique" ON "_followedAlbums"("A", "B");

-- CreateIndex
CREATE INDEX "_followedAlbums_B_index" ON "_followedAlbums"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Album_title_key" ON "Album"("title");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_followedAlbums" ADD CONSTRAINT "_followedAlbums_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_followedAlbums" ADD CONSTRAINT "_followedAlbums_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
