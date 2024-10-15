/*
  Warnings:

  - You are about to drop the `advanced_quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `advanced_quiz_explanation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `advanced_quiz_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dummy_choice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "advanced_quiz" DROP CONSTRAINT "advanced_quiz_advanced_quiz_type_id_fkey";

-- DropForeignKey
ALTER TABLE "advanced_quiz" DROP CONSTRAINT "advanced_quiz_file_num_fkey";

-- DropForeignKey
ALTER TABLE "advanced_quiz_explanation" DROP CONSTRAINT "advanced_quiz_explanation_advanced_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "dummy_choice" DROP CONSTRAINT "dummy_choice_advanced_quiz_id_fkey";

-- DropTable
DROP TABLE "advanced_quiz";

-- DropTable
DROP TABLE "advanced_quiz_explanation";

-- DropTable
DROP TABLE "advanced_quiz_type";

-- DropTable
DROP TABLE "dummy_choice";
