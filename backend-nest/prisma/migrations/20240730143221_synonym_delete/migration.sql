/*
  Warnings:

  - You are about to drop the `synonym` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `synonym_group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "synonym" DROP CONSTRAINT "synonym_synonym_group_id_fkey";

-- DropForeignKey
ALTER TABLE "synonym" DROP CONSTRAINT "synonym_word_id_fkey";

-- DropTable
DROP TABLE "synonym";

-- DropTable
DROP TABLE "synonym_group";
