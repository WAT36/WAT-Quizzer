-- CreateTable
CREATE TABLE "word_source" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "word_source_word_id_source_id_key" ON "word_source"("word_id", "source_id");

-- AddForeignKey
ALTER TABLE "word_source" ADD CONSTRAINT "word_source_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_source" ADD CONSTRAINT "word_source_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
