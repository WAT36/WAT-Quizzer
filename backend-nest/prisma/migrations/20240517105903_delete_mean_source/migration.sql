/*
  Warnings:

  - You are about to drop the `mean_source` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mean_source" DROP CONSTRAINT "mean_source_mean_id_fkey";

-- DropForeignKey
ALTER TABLE "mean_source" DROP CONSTRAINT "mean_source_source_id_fkey";

-- DropTable
DROP TABLE "mean_source";
