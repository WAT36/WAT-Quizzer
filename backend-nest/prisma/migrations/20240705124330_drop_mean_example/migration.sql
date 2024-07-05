/*
  Warnings:

  - You are about to drop the `mean_example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mean_example" DROP CONSTRAINT "mean_example_example_sentense_id_fkey";

-- DropForeignKey
ALTER TABLE "mean_example" DROP CONSTRAINT "mean_example_mean_id_fkey";

-- DropTable
DROP TABLE "mean_example";
