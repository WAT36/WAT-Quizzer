/*
  Warnings:

  - You are about to drop the column `file_num` on the `quiz_category` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_num` on the `quiz_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quiz_id,category]` on the table `quiz_category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "quiz_category" DROP CONSTRAINT "quiz_category_file_num_quiz_num_fkey";

-- DropIndex
DROP INDEX "quiz_category_file_num_quiz_num_category_key";

-- AlterTable
ALTER TABLE "quiz_category" DROP COLUMN "file_num",
DROP COLUMN "quiz_num",
ALTER COLUMN "quiz_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "quiz_category_quiz_id_category_key" ON "quiz_category"("quiz_id", "category");

-- AddForeignKey
ALTER TABLE "quiz_category" ADD CONSTRAINT "quiz_category_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
