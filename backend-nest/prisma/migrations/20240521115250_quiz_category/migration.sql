-- CreateTable
CREATE TABLE "quiz_category" (
    "id" SERIAL NOT NULL,
    "file_num" INTEGER NOT NULL,
    "quiz_num" INTEGER NOT NULL,
    "category" VARCHAR(256),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_category_file_num_quiz_num_category_key" ON "quiz_category"("file_num", "quiz_num", "category");

-- AddForeignKey
ALTER TABLE "quiz_category" ADD CONSTRAINT "quiz_category_file_num_quiz_num_fkey" FOREIGN KEY ("file_num", "quiz_num") REFERENCES "quiz"("file_num", "quiz_num") ON DELETE RESTRICT ON UPDATE CASCADE;
