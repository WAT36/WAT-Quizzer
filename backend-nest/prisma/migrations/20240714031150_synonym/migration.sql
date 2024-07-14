/*
  Warnings:

  - You are about to drop the `word_similarity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `word_similarity_group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "word_similarity";

-- DropTable
DROP TABLE "word_similarity_group";

-- CreateTable
CREATE TABLE "synonym" (
    "id" SERIAL NOT NULL,
    "synonym_group_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "synonym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synonym_group" (
    "id" SERIAL NOT NULL,
    "synonym_group_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "synonym_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "synonym_synonym_group_id_word_id_key" ON "synonym"("synonym_group_id", "word_id");
