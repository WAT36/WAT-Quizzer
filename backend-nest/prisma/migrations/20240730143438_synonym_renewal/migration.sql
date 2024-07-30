-- CreateTable
CREATE TABLE "synonym" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "synonym_word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "synonym_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "synonym_word_id_synonym_word_id_key" ON "synonym"("word_id", "synonym_word_id");

-- AddForeignKey
ALTER TABLE "synonym" ADD CONSTRAINT "synonym_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "synonym" ADD CONSTRAINT "synonym_synonym_word_id_fkey" FOREIGN KEY ("synonym_word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
