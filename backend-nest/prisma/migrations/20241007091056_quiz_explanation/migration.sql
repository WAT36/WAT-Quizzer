-- CreateTable
CREATE TABLE "quiz_explanation" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "quiz_explanation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_explanation_quiz_id_key" ON "quiz_explanation"("quiz_id");

-- AddForeignKey
ALTER TABLE "quiz_explanation" ADD CONSTRAINT "quiz_explanation_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
