-- CreateTable
CREATE TABLE "word_example" (
    "example_sentense_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_example_pkey" PRIMARY KEY ("example_sentense_id","word_id")
);

-- AddForeignKey
ALTER TABLE "word_example" ADD CONSTRAINT "word_example_example_sentense_id_fkey" FOREIGN KEY ("example_sentense_id") REFERENCES "example"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "word_example" ADD CONSTRAINT "word_example_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
