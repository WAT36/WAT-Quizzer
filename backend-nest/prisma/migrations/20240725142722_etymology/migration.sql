-- CreateTable
CREATE TABLE "word_etymology" (
    "id" SERIAL NOT NULL,
    "etymology_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "word_etymology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etymology" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "etymology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "word_etymology_etymology_id_word_id_key" ON "word_etymology"("etymology_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "etymology_name_key" ON "etymology"("name");

-- AddForeignKey
ALTER TABLE "word_etymology" ADD CONSTRAINT "word_etymology_etymology_id_fkey" FOREIGN KEY ("etymology_id") REFERENCES "etymology"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "word_etymology" ADD CONSTRAINT "word_etymology_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
