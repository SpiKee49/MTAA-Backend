/*
  Warnings:

  - You are about to drop the `_likedBy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_likedBy" DROP CONSTRAINT "_likedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_likedBy" DROP CONSTRAINT "_likedBy_B_fkey";

-- DropTable
DROP TABLE "_likedBy";

-- CreateTable
CREATE TABLE "_likes" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_likes_AB_unique" ON "_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_likes_B_index" ON "_likes"("B");

-- AddForeignKey
ALTER TABLE "_likes" ADD CONSTRAINT "_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likes" ADD CONSTRAINT "_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
