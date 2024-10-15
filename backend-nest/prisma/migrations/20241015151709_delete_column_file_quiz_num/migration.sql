/*
  Warnings:

  - You are about to drop the column `file_num` on the `answer_log` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_format_id` on the `answer_log` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_num` on the `answer_log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "answer_log" DROP COLUMN "file_num",
DROP COLUMN "quiz_format_id",
DROP COLUMN "quiz_num";

-- AlterTable
ALTER TABLE "quiz_category" ADD COLUMN     "quiz_id" INTEGER NOT NULL DEFAULT 0;
