-- CreateTable
CREATE TABLE "antonym" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "antonym_word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "antonym_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "antonym_word_id_antonym_word_id_key" ON "antonym"("word_id", "antonym_word_id");

-- AddForeignKey
ALTER TABLE "antonym" ADD CONSTRAINT "antonym_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antonym" ADD CONSTRAINT "antonym_antonym_word_id_fkey" FOREIGN KEY ("antonym_word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
