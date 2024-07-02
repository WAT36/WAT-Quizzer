/*
  Warnings:

  - You are about to drop the `idiom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `idiom_mean` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "idiom" DROP CONSTRAINT "idiom_word_id_fkey";

-- DropForeignKey
ALTER TABLE "idiom_mean" DROP CONSTRAINT "idiom_mean_idiom_id_fkey";

-- DropForeignKey
ALTER TABLE "idiom_mean" DROP CONSTRAINT "idiom_mean_partsofspeech_id_fkey";

-- DropTable
DROP TABLE "idiom";

-- DropTable
DROP TABLE "idiom_mean";
