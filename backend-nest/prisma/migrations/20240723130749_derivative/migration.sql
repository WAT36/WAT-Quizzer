-- CreateTable
CREATE TABLE "derivative" (
    "id" SERIAL NOT NULL,
    "derivative_group_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "derivative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "derivative_group" (
    "id" SERIAL NOT NULL,
    "derivative_group_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "derivative_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "derivative_word_id_key" ON "derivative"("word_id");

-- AddForeignKey
ALTER TABLE "derivative" ADD CONSTRAINT "derivative_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "derivative" ADD CONSTRAINT "derivative_derivative_group_id_fkey" FOREIGN KEY ("derivative_group_id") REFERENCES "derivative_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
